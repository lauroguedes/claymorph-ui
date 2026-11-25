import { Attachment, BLEND, fuseOf, hug } from "../attach"
import { luminance, resolveColor } from "../color"
import { ClayElement, NEUTRAL } from "../element"
import { Highlight, withHighlight } from "../highlight"
import { pressable, slab, watch, type Box } from "../shared"
import { offsetWithin, type SurfaceOptions } from "../surface"

const reducedMotion = () => typeof matchMedia === "function" && matchMedia("(prefers-reduced-motion: reduce)").matches

/** A soft edge three times wider than the text: sliding it across wipes the text in from the left. */
const WIPE_IN = "linear-gradient(90deg, #000 45%, transparent 55%)"
const WIPE_OUT = "linear-gradient(90deg, transparent 45%, #000 55%)"

function wipe(el: HTMLElement, mask: string, blur: [string, string], opacity: [number, number]) {
  el.style.setProperty("mask-image", mask)
  el.style.setProperty("-webkit-mask-image", mask)
  el.style.setProperty("mask-size", "300% 100%")
  el.style.setProperty("-webkit-mask-size", "300% 100%")
  const animation = el.animate(
    [
      { maskPosition: "100% 0", webkitMaskPosition: "100% 0", filter: `blur(${blur[0]})`, opacity: opacity[0] },
      { maskPosition: "0% 0", webkitMaskPosition: "0% 0", filter: `blur(${blur[1]})`, opacity: opacity[1] },
    ] as Keyframe[],
    { duration: 520, easing: "cubic-bezier(0.22, 1, 0.36, 1)" }
  )
  animation.finished
    .catch(() => undefined)
    .finally(() => {
      for (const name of ["mask-image", "-webkit-mask-image", "mask-size", "-webkit-mask-size"]) el.style.removeProperty(name)
    })
  return animation
}

const pillRadius = (box: Box) => box.h / 2

/** Puts a copy of the select's text exactly over the real one, to hold or blur away. */
function ghostOf(value: HTMLElement, text: string) {
  const button = (value.offsetParent as HTMLElement | null) ?? value.closest("button")
  if (!button) return null
  const ghost = document.createElement("span")
  ghost.className = "clay-select-ghost"
  ghost.setAttribute("aria-hidden", "true")
  ghost.textContent = text
  // Exact to the subpixel, and undoing the trigger's swell, so it sits right on the real text.
  const { x, y } = offsetWithin(value, button)
  ghost.style.left = `${x}px`
  ghost.style.top = `${y}px`
  button.append(ghost)
  return ghost
}

/**
 * Pour: a select whose list pours out of its clay trigger, with a well that slides to the option under
 * the pointer. The chosen value is revealed with a blur once the list has gone. With `attached`, the
 * list squeezes out of the trigger like Roll's bead, stays melted onto it, and the trigger bounces as
 * the list tucks back in, which is when the new value shows.
 */
class ClaySelect extends ClayElement {
  static observedAttributes = ["color", "attached", "fuse"]
  protected readonly requires = "ui-select-trigger button"
  private observer: MutationObserver | null = null
  private attachment: Attachment | null = null
  private highlight: Highlight | null = null
  private release: () => void = () => {}
  private refit: () => void = () => {}
  private cleanup: Array<() => void> = []

  attributeChangedCallback(name: string, old: string | null, value: string | null) {
    super.attributeChangedCallback(name, old, value)
    if (name === "fuse") this.refit()
  }

  private get list() {
    return this.querySelector<HTMLElement>("ui-select-content")
  }

  protected setup() {
    this.querySelectorAll<HTMLElement>("ui-select-item").forEach((item, index) =>
      item.style.setProperty("--clay-i", String(index))
    )
    const list = this.list
    if (list) {
      this.highlight = new Highlight(list, "[data-slot='select-item']")
      this.cleanup.push(this.highlight.watch(() => this.surfaces[1]?.invalidate()))
    }
    if (list && this.hasAttribute("attached")) {
      this.refit = hug(list, () => fuseOf(this))
      this.attachment = new Attachment(
        list,
        {
          trigger: () => this.querySelector("ui-select-trigger button"),
          triggerRadius: (box) => Math.min(box.h / 2, 18),
          triggerColor: () => this.surfaces[0]?.color("--clay-color", NEUTRAL) ?? NEUTRAL,
          color: () => this.surfaces[1]?.color("--clay-popup", NEUTRAL) ?? NEUTRAL,
          radius: 22,
          bevel: 16,
          lift: 1.3,
          fuse: () => fuseOf(this),
          calm: (on) => this.surfaces[0]?.calm(on),
          onTuck: () => {
            this.surfaces[0]?.bounce()
            this.release()
          },
        },
        () => this.surfaces[1]
      )
      this.cleanup.push(this.attachment.connect())
    }
    if (list) {
      // The new value shows once the list has finished closing, or earlier, on an attached list's bounce.
      const closed = () => !list.hasAttribute("data-open") && !list.hasAttribute("data-ending-style")
      this.cleanup.push(watch(list, ["data-open", "data-ending-style", "hidden"], () => closed() && this.release()))
    }
    this.watchValue()
  }

  /**
   * The chosen value waits while the list is out: the old text stays, held by a copy, until the list
   * is gone, then the new one is revealed with a blur.
   */
  private watchValue() {
    const value = this.querySelector<HTMLElement>("ui-select-value")
    if (!value) return
    const text = () => value.textContent?.trim() ?? ""
    // Out means open or still closing: ui-sdk starts closing in the same moment it changes the value.
    const shown = () => {
      const list = this.list
      return !!list && (list.hasAttribute("data-open") || list.hasAttribute("data-ending-style") || list.getClientRects().length > 0)
    }
    const out = () => (this.attachment && this.surfaces[1] ? this.attachment.out : shown())
    let previous = text()
    let pending = false
    let running: (() => void) | null = null
    let held: { old: string; ghost: HTMLElement | null } | null = null
    const unhold = () => {
      held?.ghost?.remove()
      value.style.removeProperty("opacity")
      held = null
    }
    this.release = () => {
      if (!held) return
      const { old } = held
      unhold()
      running = this.reveal(value, old)
    }
    this.observer = new MutationObserver(() => {
      if (pending || text() === previous) return
      pending = true
      // Before the browser paints the new text: hold the old one while the list is out, or reveal now.
      if (previous && out() && !held) {
        held = { old: previous, ghost: ghostOf(value, previous) }
        value.style.opacity = "0"
      } else if (previous && !held) {
        running = this.reveal(value, previous)
      }
      // ui-sdk can swap the text in more than one step: once it settles, drop what changed nothing.
      setTimeout(() => {
        pending = false
        const next = text()
        if (!next || next === previous) {
          running?.()
          if (held?.old === next) unhold()
        }
        running = null
        previous = next
      })
    })
    this.observer.observe(value, { childList: true, characterData: true, subtree: true })
    this.cleanup.push(unhold)
  }

  protected teardown() {
    this.observer?.disconnect()
    for (const fn of this.cleanup) fn()
    this.cleanup = []
    this.attachment = null
    this.highlight = null
  }

  /**
   * The new value is wiped in from the left out of a blur while the old one blurs away in its place.
   * Returns a function that stops it.
   */
  private reveal(value: HTMLElement, old: string) {
    if (reducedMotion() || typeof value.animate !== "function") return null
    const ghost = ghostOf(value, old)
    if (!ghost) return null
    const out = wipe(ghost, WIPE_OUT, ["0px", "6px"], [1, 0])
    out.finished.catch(() => undefined).finally(() => ghost.remove())
    const into = wipe(value, WIPE_IN, ["6px", "0px"], [0.2, 1])
    return () => {
      out.cancel()
      into.cancel()
      ghost.remove()
    }
  }

  protected surfaceFor(): Array<[HTMLElement, SurfaceOptions]> {
    const trigger = this.querySelector<HTMLElement>("ui-select-trigger button")!
    const list = this.list
    const surfaces: Array<[HTMLElement, SurfaceOptions]> = [
      [
        trigger,
        {
          shapes: () => [
            {
              ...pressable(this.surfaces[0]!, Math.min(this.surfaces[0]!.height / 2, 18)),
              blend: this.attachment ? BLEND : undefined,
            },
            ...(this.attachment?.joint(trigger) ?? []),
          ],
        },
      ],
    ]
    if (list) {
      const base: SurfaceOptions = this.attachment?.surfaceOptions() ?? {
        swell: false,
        pad: 36,
        shapes: () => [slab(this.surfaces[1]!, "--clay-popup", 22, 16, 1.4)],
      }
      surfaces.push([list, withHighlight(base, this.highlight, () => this.surfaces[1], this.attachment)])
    }
    return surfaces
  }
}

/**
 * Pop: a tooltip that pops out as a small clay tag. With `attached`, the tag squeezes out of its button
 * like Roll's bead, stays melted onto it while it's open, and tucks back in.
 */
class ClayTooltip extends ClayElement {
  static observedAttributes = ["color", "attached", "fuse"]
  protected readonly requires = "ui-tooltip-content"
  private attachment: Attachment | null = null
  private stop: (() => void) | null = null
  private refit: () => void = () => {}

  private get attached() {
    return this.hasAttribute("attached")
  }

  attributeChangedCallback(name: string, old: string | null, value: string | null) {
    super.attributeChangedCallback(name, old, value)
    if (name === "fuse") this.refit()
  }

  private get content() {
    return this.querySelector<HTMLElement>("ui-tooltip-content")!
  }

  /** The clay element the trigger button sits in, whose colour the tag takes when it has none. */
  private get body() {
    const button = this.querySelector<HTMLElement>("[data-slot='tooltip-trigger'], ui-tooltip-trigger > *")
    // Found by its class, not its canvas: it starts after this tooltip, so it may not have one yet.
    for (let el = button?.parentElement; el && el !== this; el = el.parentElement) {
      if (el instanceof ClayElement) return el
    }
    return button?.closest<HTMLElement>("[data-clay-host]") ?? button
  }

  private bodyColor() {
    const body = this.body
    return resolveColor(body ? getComputedStyle(body).getPropertyValue("--clay-color") : "", NEUTRAL)
  }

  protected updateTone() {
    if (!this.attached || this.hasAttribute("color")) return super.updateTone()
    const l = luminance(this.bodyColor())
    this.dataset.tone = 1.05 / (l + 0.05) > (l + 0.05) / (0.022 + 0.05) ? "dark" : "light"
  }

  protected setup() {
    if (!this.attached) return
    const content = this.content
    this.refit = hug(content, () => fuseOf(this))
    // The tag's own text fades in and out without taking the clay drawn under it along.
    for (const node of [...content.childNodes]) {
      if (node.nodeType !== Node.TEXT_NODE || !node.textContent?.trim()) continue
      const span = document.createElement("span")
      span.className = "clay-tip-text"
      node.replaceWith(span)
      span.append(node)
    }
    this.attachment = new Attachment(
      content,
      {
        trigger: () => this.body,
        triggerRadius: (box) => (this.body?.getAttribute("shape") === "rounded" ? Math.min(box.h * 0.34, 18) : pillRadius(box)),
        triggerColor: () => this.bodyColor(),
        color: () => (this.hasAttribute("color") ? (this.surfaces[0]?.color("--clay-color", NEUTRAL) ?? NEUTRAL) : this.bodyColor()),
        radius: 13,
        bevel: 9,
        lift: 0.5,
        fuse: () => fuseOf(this),
        calm: (on) => {
          const body = this.body
          if (body instanceof ClayElement) body.calm(on)
        },
        onTuck: () => {
          const body = this.body
          if (body instanceof ClayElement) body.bounce(0.8)
        },
      },
      () => this.surfaces[0]
    )
    const stop = this.attachment.connect()
    const body = this.body
    const attachment = this.attachment
    const joint = () => (body ? attachment.joint(body) : [])
    if (body instanceof ClayElement) body.joints.add(joint)
    this.stop = () => {
      stop()
      if (body instanceof ClayElement) body.joints.delete(joint)
    }
  }

  protected teardown() {
    this.stop?.()
    this.attachment = null
  }

  protected surfaceFor(): Array<[HTMLElement, SurfaceOptions]> {
    const content = this.content
    return [
      [
        content,
        this.attachment?.surfaceOptions() ?? {
          swell: false,
          pad: 18,
          shapes: () => [slab(this.surfaces[0]!, "--clay-color", 12, 8, 0.6)],
        },
      ],
    ]
  }
}

export { ClaySelect, ClayTooltip }
