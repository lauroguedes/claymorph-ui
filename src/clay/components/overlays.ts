import { Attachment, BACK, BLEND, faceOf, fuseOf, GLUE, GRIP, hug, OUT, PAST, poke, seed, smooth } from "../attach"
import { SPRINGS } from "../config"
import type { ClayShape, Padding } from "../engine"
import { ClayElement, NEUTRAL } from "../element"
import { Flight } from "../flight"
import { Follow } from "../follow"
import { Highlight, withHighlight } from "../highlight"
import { clamp, lerpBox, pressable, slab, type Box } from "../shared"
import { Spring } from "../spring"
import type { ClaySurface, SurfaceOptions } from "../surface"

/**
 * A trigger drawn as a clay button, and a popup drawn as a clay slab that grows out of it. With
 * `attached`, the popup squeezes out of the button like Roll's bead and stays melted onto it, or, for
 * a dialog away from its button, flies out of it as a bead and swells into place.
 */
abstract class ClayPopupElement extends ClayElement {
  static observedAttributes = ["color", "size", "icon", "attached", "fuse"]
  protected abstract readonly trigger: string
  protected abstract readonly content: string
  protected popupRadius = 22
  protected popupBevel = 16
  protected popupLift = 1.4
  /** Dialogs sit in the middle of the page, away from their trigger: attached, they fly out of it instead. */
  protected attachable = true
  /** Items a sliding highlight follows, for menus. */
  protected items = ""
  /** Its slab follows its contents' size on a spring, as a palette's list narrows, instead of jumping. */
  protected follows = false
  private attachment: Attachment | null = null
  private flight: Flight | null = null
  private follow: Follow | null = null
  private highlight: Highlight | null = null
  private refit: () => void = () => {}
  private cleanup: Array<() => void> = []

  attributeChangedCallback(name: string, old: string | null, value: string | null) {
    super.attributeChangedCallback(name, old, value)
    if (name === "fuse") this.refit()
  }

  private get triggerButton() {
    return this.querySelector<HTMLElement>(`${this.trigger} :is(button, a)`)
  }

  protected setup() {
    this.querySelectorAll<HTMLElement>(`${this.content} :is(ui-menu-item, ui-menu-checkbox-item, ui-menu-radio-item)`).forEach(
      (item, index) => item.style.setProperty("--clay-i", String(index))
    )
    const content = this.querySelector<HTMLElement>(this.content)
    const button = this.triggerButton
    if (content && this.items) {
      this.highlight = new Highlight(content, this.items)
      this.cleanup.push(this.highlight.watch(() => this.surfaces[1]?.invalidate()))
    }
    // Attached, a dialog's flight follows its contents itself.
    if (content && this.follows && !this.hasAttribute("attached")) this.follow = new Follow(content)
    if (!content || !button || !this.hasAttribute("attached")) return
    if (!this.attachable) {
      this.flight = new Flight(
        content,
        {
          trigger: () => this.triggerButton,
          // As pressable() draws it, so both sides of the neck shade it the same.
          triggerShape: (box) => ({ radius: box.h / 2, height: 1 - (this.surfaces[0]?.press.x ?? 0) * 0.4 }),
          triggerColor: () => this.surfaces[0]?.color("--clay-color", NEUTRAL) ?? NEUTRAL,
          color: () => this.surfaces[1]?.color("--clay-popup", NEUTRAL) ?? NEUTRAL,
          radius: this.popupRadius,
          bevel: this.popupBevel,
          lift: this.popupLift,
          onLand: () => this.surfaces[0]?.bounce(),
          onJoin: (joined) => this.toggleAttribute("data-clay-held", joined),
        },
        () => this.surfaces[1]
      )
      this.cleanup.push(this.flight.connect())
      return
    }
    this.refit = hug(content, () => fuseOf(this))
    this.attachment = new Attachment(
      content,
      {
        trigger: () => this.triggerButton,
        triggerRadius: (box) => box.h / 2,
        triggerColor: () => this.surfaces[0]?.color("--clay-color", NEUTRAL) ?? NEUTRAL,
        color: () => this.surfaces[1]?.color("--clay-popup", NEUTRAL) ?? NEUTRAL,
        radius: this.popupRadius,
        bevel: this.popupBevel,
        lift: this.popupLift,
        fuse: () => fuseOf(this),
        calm: (on) => this.surfaces[0]?.calm(on),
        onTuck: () => this.surfaces[0]?.bounce(),
      },
      () => this.surfaces[1]
    )
    this.cleanup.push(this.attachment.connect())
  }

  protected teardown() {
    for (const fn of this.cleanup) fn()
    this.cleanup = []
    this.attachment = null
    this.flight = null
    this.follow?.release()
    this.follow = null
    this.highlight = null
  }

  /** A slab drawn to the popup's size on a spring, with room for it while it's bigger than the popup. */
  private followed(at: number): SurfaceOptions {
    const follow = this.follow!
    const surface = () => this.surfaces[at]!
    const room = 40
    let reach: Padding = { left: room, top: room, right: room, bottom: room }
    return {
      swell: false,
      pad: () => reach,
      measure: () => {
        follow.measure(true)
        const { host } = surface()
        const box = follow.box()
        // It's anchored at its top-left corner, so only the right and bottom reach past the popup.
        const past = (over: number) => room + Math.ceil(Math.max(0, over) / 16) * 16
        reach = { left: room, top: room, right: past(box.w - host.offsetWidth), bottom: past(box.h - host.offsetHeight) }
      },
      step: (dt, still) => {
        const moving = follow.step(dt, still)
        if (moving) surface().stale = true
        return moving
      },
      shapes: () => [
        {
          ...follow.box(),
          radius: this.popupRadius,
          color: surface().color("--clay-popup", NEUTRAL),
          height: 0.85,
          bevel: this.popupBevel,
          lift: this.popupLift,
        },
      ],
    }
  }

  protected surfaceFor(): Array<[HTMLElement, SurfaceOptions]> {
    const surfaces: Array<[HTMLElement, SurfaceOptions]> = []
    const trigger = this.triggerButton
    const content = this.querySelector<HTMLElement>(this.content)
    let index = 0
    if (trigger) {
      const at = index++
      surfaces.push([
        trigger,
        {
          shapes: () => [
            { ...pressable(this.surfaces[at]!), blend: this.attachment ? BLEND : undefined },
            ...(this.attachment?.joint(trigger) ?? []),
            ...(this.flight?.joint(trigger) ?? []),
          ],
        },
      ])
    }
    if (content) {
      const at = index++
      const base = (at === 1 && (this.attachment?.surfaceOptions() ?? this.flight?.surfaceOptions())) ||
        (this.follow ? this.followed(at) : null) || {
          swell: false,
          pad: 40,
          shapes: () => [slab(this.surfaces[at]!, "--clay-popup", this.popupRadius, this.popupBevel, this.popupLift)],
        }
      surfaces.push([content, withHighlight(base, this.highlight, () => this.surfaces[at], this.attachment)])
    }
    return surfaces
  }
}

/** Spill: a menu of actions that spills out of its clay button. */
class ClayMenu extends ClayPopupElement {
  protected readonly requires = "ui-menu-trigger"
  protected items = "[data-slot='menu-item'], [data-slot='menu-checkbox-item'], [data-slot='menu-radio-item']"
  protected readonly trigger = "ui-menu-trigger"
  protected readonly content = "ui-menu-content"
  protected popupRadius = 20
}

/** Unfold: a small clay card that unfolds from its button. */
class ClayPopover extends ClayPopupElement {
  protected readonly requires = "ui-popover-trigger"
  protected readonly trigger = "ui-popover-trigger"
  protected readonly content = "ui-popover-content"
  protected popupRadius = 26
  protected popupBevel = 20
}

/**
 * Lift: a dialog lifted out of the page as a thick clay slab. With `attached`, it flies out of its
 * button as a bead and swells into place, and flies back in when it closes.
 */
class ClayDialog extends ClayPopupElement {
  protected readonly requires = "ui-dialog-content"
  protected attachable = false
  protected follows = true
  protected readonly trigger = "ui-dialog-trigger"
  protected readonly content = "ui-dialog-content"
  protected popupRadius = 32
  protected popupBevel = 26
  protected popupLift = 2.4
}

/** A toast that glides to its new place when the ones around it come and go, instead of jumping. */
interface Sliding {
  /** How far the toast still sits from its layout box after the list moved, in px. */
  shift: Spring
  /** Where its layout box was, from the top of the viewport. */
  top: number | null
  lastShift: string
}

interface Landing extends Sliding {
  surface: ClaySurface
  land: Spring
  leaving: boolean
}

interface Link extends Sliding {
  /** 0 tucked into its anchor, 1 out in its own place. */
  emerge: Spring
  anchor: HTMLElement | null
  box: Box | null
  leaving: boolean
}

const TOAST_COLOR: Record<string, string> = {
  success: "--clay-success",
  error: "--clay-danger",
  warning: "--clay-butter",
}

const MAX_LINKED = 8

const toastColor = (toast: HTMLElement) => TOAST_COLOR[toast.getAttribute("data-type") ?? ""] ?? "--clay-popup"

/**
 * Drop: toasts that drop in as clay slabs, squash as they land and lift back off the same way.
 * With `attached`, the stack is one body: each toast pulls out of the one before it and stays melted
 * onto it, and leaving runs the same path back.
 */
class ClayToastRegion extends ClayElement {
  static observedAttributes = ["attached"]
  protected readonly requires = "ui-toast-region"
  private loose = new Map<HTMLElement, Landing>()
  private links = new Map<HTMLElement, Link>()
  private stack: ClaySurface | null = null
  private observer: MutationObserver | null = null

  private get attached() {
    return this.hasAttribute("attached")
  }

  private get region() {
    return this.querySelector<HTMLElement>("ui-toast-region")!
  }

  attributeChangedCallback(name: string, old: string | null, value: string | null) {
    super.attributeChangedCallback(name, old, value)
    if (name === "attached" && this.observer && (old === null) !== (value === null)) this.rebuild()
  }

  protected setup() {
    this.observer = new MutationObserver(() => this.sync())
    this.observer.observe(this, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["data-type", "data-ending-style"],
    })
    this.sync()
  }

  protected teardown() {
    this.observer?.disconnect()
    this.observer = null
    this.reset()
  }

  protected surfaceFor(): Array<[HTMLElement, SurfaceOptions]> {
    return []
  }

  private reset() {
    for (const surface of [...this.surfaces]) this.detach(surface)
    for (const toast of this.links.keys()) {
      toast.style.removeProperty("transform")
      toast.style.removeProperty("--clay-from")
      toast.style.removeProperty("--clay-to")
    }
    this.loose.clear()
    this.links.clear()
    this.stack = null
  }

  private rebuild() {
    this.reset()
    this.sync()
  }

  private sync() {
    const toasts = [...this.querySelectorAll<HTMLElement>("ui-toast")]
    if (this.attached) this.syncStack(toasts)
    else this.syncLoose(toasts)
    // The list has just changed, before the browser paints it: put every toast back where it was, to
    // glide from there, so none of them jumps for a frame.
    const items: Array<[HTMLElement, Sliding]> = this.attached ? [...this.links] : [...this.loose]
    for (const [toast, item] of items) {
      if (!toast.isConnected) continue
      this.follow(toast, item)
      this.slide(toast, item, 0, false)
    }
  }

  /** Notes where a toast's layout box is now and, if the list moved it, keeps it where it was to glide. */
  private follow(toast: HTMLElement, item: Sliding) {
    const top = this.region.getBoundingClientRect().top + toast.offsetTop
    if (item.top !== null && Math.abs(top - item.top) > 0.5) {
      item.shift.x += item.top - top
      item.shift.target = 0
    }
    item.top = top
  }

  private slide(toast: HTMLElement, item: Sliding, dt: number, still: boolean) {
    const moving = item.shift.step(dt, SPRINGS.travel, still)
    const shift = Math.abs(item.shift.x) < 0.2 ? "" : `translateY(${item.shift.x.toFixed(1)}px)`
    if (shift !== item.lastShift) {
      item.lastShift = shift
      toast.style.transform = shift
    }
    return moving
  }

  private syncLoose(toasts: HTMLElement[]) {
    for (const [toast, landing] of this.loose) {
      if (!toast.isConnected) {
        this.detach(landing.surface)
        this.loose.delete(toast)
        continue
      }
      if (toast.hasAttribute("data-ending-style") && !landing.leaving) {
        landing.leaving = true
        landing.land.target = -0.75
        landing.land.v = 7
      }
      landing.surface.invalidate()
    }
    for (const toast of toasts) {
      if (this.loose.has(toast)) continue
      const land = new Spring(1)
      land.target = 0
      const landing = { land, shift: new Spring(0), top: null, lastShift: "", leaving: false } as Omit<Landing, "surface">
      const surface = this.attach(toast, {
        swell: false,
        pad: 34,
        measure: () => this.follow(toast, landing),
        step: (dt, still) =>
          [land.step(dt, { omega: 13, zeta: 0.32 }, still), this.slide(toast, landing, dt, still)].some(Boolean),
        shapes: () => this.landed(toast, landing as Landing),
      })
      if (!surface) return
      this.loose.set(toast, Object.assign(landing, { surface }))
    }
  }

  private landed(toast: HTMLElement, { surface, land }: Landing): ClayShape[] {
    const base = slab(surface, toastColor(toast), 22, 16, 1.3)
    const squash = land.x
    const w = base.w * (1 + squash * 0.07)
    const h = base.h * (1 - squash * 0.14)
    return [{ ...base, x: (base.w - w) / 2, y: base.h - h, w, h }]
  }

  private get towardEdge() {
    return this.region.getAttribute("data-side") === "top" ? -28 : 28
  }

  private syncStack(toasts: HTMLElement[]) {
    if (!this.stack) {
      this.stack = this.attach(this.region, {
        swell: false,
        // A toast held where it was while the stack shrinks sits outside the region: make room for it.
        pad: () => 60 + Math.ceil(Math.max(0, ...[...this.links.values()].map((link) => Math.abs(link.shift.x)))),
        measure: () => this.measureStack(),
        step: (dt, still) => this.stepStack(dt, still),
        shapes: () => this.stackShapes(),
      })
      if (!this.stack) return
    }
    for (const toast of this.links.keys()) if (!toast.isConnected) this.links.delete(toast)
    const staying = (toast: HTMLElement) => !toast.hasAttribute("data-ending-style")
    toasts.forEach((toast, index) => {
      if (this.links.has(toast)) return
      // The stack is on screen as soon as a toast arrives: don't wait frames for the visibility observer.
      this.stack!.visible = true
      const anchor = toasts.slice(index + 1).find(staying) ?? null
      const emerge = new Spring(0)
      emerge.target = 1
      this.links.set(toast, { emerge, shift: new Spring(0), anchor, box: null, top: null, leaving: false, lastShift: "" })
      toast.style.setProperty("--clay-from", `${this.toward(toast, anchor)}px`)
    })
    toasts.forEach((toast, index) => {
      const link = this.links.get(toast)
      if (!link || link.leaving || staying(toast)) return
      link.leaving = true
      link.emerge.target = PAST
      link.anchor = toasts.slice(index + 1).find(staying) ?? toasts.slice(0, index).reverse().find(staying) ?? null
      toast.style.setProperty("--clay-to", `${this.toward(toast, link.anchor)}px`)
    })
    this.stack.invalidate()
  }

  /** Which way, in px along the stack, the toast's text should travel to reach its anchor. */
  private toward(toast: HTMLElement, anchor: HTMLElement | null) {
    if (!anchor) return this.towardEdge
    const a = anchor.offsetTop + anchor.offsetHeight / 2
    const b = toast.offsetTop + toast.offsetHeight / 2
    return clamp(a - b, -28, 28)
  }

  private measureStack() {
    for (const [toast, link] of this.links) {
      link.box = { x: toast.offsetLeft, y: toast.offsetTop, w: toast.offsetWidth, h: toast.offsetHeight }
      this.follow(toast, link)
    }
  }

  private stepStack(dt: number, still: boolean) {
    let moving = false
    for (const [toast, link] of this.links) {
      if (link.emerge.step(dt, link.emerge.target > 0 ? OUT : BACK, still)) moving = true
      if (this.slide(toast, link, dt, still)) moving = true
    }
    return moving
  }

  private placed(link: Link): Box | null {
    return link.box ? { ...link.box, y: link.box.y + link.shift.x } : null
  }

  private stackShapes(): ClayShape[] {
    const surface = this.stack!
    const items = [...this.links]
      .map(([toast, link]) => ({ toast, link, own: this.placed(link) }))
      .filter((item): item is { toast: HTMLElement; link: Link; own: Box } => !!item.own)
      .sort((a, b) => a.own.y - b.own.y)
      .slice(0, MAX_LINKED)
    const towardTop = this.towardEdge < 0
    const shapes: ClayShape[] = []
    for (const { toast, link, own } of items) {
      const anchor = link.anchor ? this.links.get(link.anchor) : undefined
      const from = anchor && this.placed(anchor)
      const e = clamp(link.emerge.x, 0, 1.1)
      let box: Box
      let grip: number
      if (from) {
        // It squeezes out of a sliver inside the edge it shares with its neighbour, like an attached
        // popup out of its button, and melts on as it comes out, so nothing bulges before or after.
        const face = faceOf(from, own)
        box = lerpBox(seed(from, own, face), own, e)
        const out = poke(from, box, face)
        if (out <= 0) continue
        grip = smooth(0, GRIP, out)
      } else {
        box = lerpBox({ x: own.x + own.w * 0.3, y: towardTop ? own.y : own.y + own.h, w: own.w * 0.4, h: 0 }, own, e)
        grip = smooth(0, 0.3, e)
      }
      if (box.h < 1 || box.w < 1) continue
      shapes.push({
        ...box,
        radius: Math.min(22, box.h / 2),
        color: surface.color(toastColor(toast), NEUTRAL),
        height: 0.85,
        bevel: 16,
        lift: 1.3,
        melt: shapes.length ? Math.max((GLUE + (1 - Math.min(e, 1)) * 10) * grip, 0.01) : 0,
        blend: BLEND,
      })
    }
    return shapes
  }
}

export { ClayDialog, ClayMenu, ClayPopover, ClayToastRegion }
