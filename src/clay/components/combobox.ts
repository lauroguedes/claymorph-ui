import { Attachment, BLEND, fuseOf, hug } from "../attach"
import { SPRINGS } from "../config"
import type { ClayShape } from "../engine"
import { ClayElement, NEUTRAL } from "../element"
import { Highlight, withHighlight } from "../highlight"
import { clamp, slab, watch, type Box } from "../shared"
import { Spring } from "../spring"
import { offsetWithin, type ClaySurface, type SurfaceOptions } from "../surface"
import { fieldRim, fieldWell, userInvalid } from "./forms"

const fieldRadius = (h: number) => Math.min(h / 2, 20)

/** An icon button in the field, like the chevron: a clay bead rises out of the well under it on hover. */
interface Knob {
  button: HTMLElement
  box: Box | null
  hover: Spring
  press: Spring
}

let fields = 0

/**
 * Sift: a combobox carved like Type's field, whose list pours out under it and narrows as you type.
 * With `attached`, the list squeezes out of the field's rim and stays melted onto it, swelling and
 * shrinking on a spring as matches come and go, and the field's well gives as it tucks back in.
 */
class ClayCombobox extends ClayElement {
  static observedAttributes = ["color", "attached", "fuse"]
  protected readonly requires = "ui-combobox-input input"
  private focused = new Spring(0)
  private pulse = new Spring(0)
  private invalid = false
  private knobs: Knob[] = []
  private attachment: Attachment | null = null
  private highlight: Highlight | null = null
  private refit: () => void = () => {}
  private cleanup: Array<() => void> = []

  attributeChangedCallback(name: string, old: string | null, value: string | null) {
    super.attributeChangedCallback(name, old, value)
    if (name === "fuse") this.refit()
  }

  private get input() {
    return this.querySelector<HTMLInputElement>("ui-combobox-input input")!
  }

  /** What wears the field's clay: the box that holds the input and its buttons. */
  private get field() {
    return this.querySelector("ui-combobox-input")!.parentElement!
  }

  private get content() {
    return this.querySelector<HTMLElement>("ui-combobox-content")
  }

  private get list() {
    return this.querySelector<HTMLElement>("ui-combobox-list")
  }

  protected setup() {
    const input = this.input
    const check = () => {
      const invalid = userInvalid(input)
      if (invalid === this.invalid) return
      this.invalid = invalid
      this.toggleAttribute("data-invalid", invalid)
      this.surfaces[0]?.invalidate()
    }
    const handlers: Array<[string, () => void]> = [
      ["focus", () => ((this.focused.target = 1), this.surfaces[0]?.wake())],
      ["blur", () => ((this.focused.target = 0), check(), this.surfaces[0]?.wake())],
      ["input", () => ((this.pulse.v += 5), check(), this.surfaces[0]?.wake())],
      ["invalid", check],
    ]
    for (const [type, handler] of handlers) {
      input.addEventListener(type, handler)
      this.cleanup.push(() => input.removeEventListener(type, handler))
    }
    this.cleanup.push(watch(input, ["aria-invalid", "disabled"], check))
    if (document.activeElement === input) this.focused.set(1)
    this.watchKnobs()

    const content = this.content
    if (!content) return
    // The list lines up with the whole field, buttons and all, not just the input inside it.
    const field = this.field
    if (!content.hasAttribute("anchor")) {
      field.id ||= `clay-combobox-field-${++fields}`
      content.setAttribute("anchor", `#${field.id}`)
    }
    this.highlight = new Highlight(content, "[data-slot='combobox-item']", () => this.list)
    this.cleanup.push(this.highlight.watch(() => this.surfaces[1]?.invalidate()))
    const scrolled = () => this.surfaces[1]?.invalidate()
    const list = this.list
    list?.addEventListener("scroll", scrolled, { passive: true })
    this.cleanup.push(() => list?.removeEventListener("scroll", scrolled))
    if (!this.hasAttribute("attached")) return
    this.refit = hug(content, () => fuseOf(this))
    this.attachment = new Attachment(
      content,
      {
        trigger: () => this.field,
        triggerRadius: (box) => fieldRadius(box.h),
        triggerColor: () => (this.surfaces[0] ? this.rim().color : NEUTRAL),
        color: () => this.surfaces[1]?.color("--clay-popup", NEUTRAL) ?? NEUTRAL,
        radius: 22,
        bevel: 16,
        lift: 1.3,
        fuse: () => fuseOf(this),
        resize: true,
        calm: (on) => this.surfaces[0]?.calm(on),
        onTuck: () => {
          this.pulse.v += 4
          this.surfaces[0]?.wake()
        },
      },
      () => this.surfaces[1]
    )
    this.cleanup.push(this.attachment.connect())
  }

  /** The field's icon buttons swell up out of the well under the pointer and squash as they're pressed. */
  private watchKnobs() {
    const buttons = this.field.querySelectorAll<HTMLElement>(":is(ui-combobox-trigger, ui-combobox-clear) > button")
    this.knobs = [...buttons].map((button) => ({ button, box: null, hover: new Spring(0), press: new Spring(0) }))
    for (const knob of this.knobs) {
      const set = (hover: number, press: number) => {
        knob.hover.target = hover
        knob.press.target = press
        // Measured again: the clear button comes and goes, and shifts what's beside it.
        this.surfaces[0]?.invalidate()
      }
      const handlers: Array<[string, (event: PointerEvent) => void]> = [
        ["pointerenter", (event) => event.pointerType !== "touch" && set(1, 0)],
        ["pointerleave", () => set(0, 0)],
        ["pointerdown", () => set(1, 1)],
        ["pointerup", (event) => set(event.pointerType === "touch" ? 0 : 1, 0)],
        ["pointercancel", () => set(0, 0)],
      ]
      for (const [type, handler] of handlers) {
        knob.button.addEventListener(type, handler as EventListener)
        this.cleanup.push(() => knob.button.removeEventListener(type, handler as EventListener))
      }
    }
  }

  protected teardown() {
    for (const fn of this.cleanup) fn()
    this.cleanup = []
    this.knobs = []
    this.attachment = null
    this.highlight = null
  }

  private rim(): ClayShape {
    const surface = this.surfaces[0]!
    const rim = fieldRim(surface, fieldRadius(surface.height), clamp(this.focused.x, 0, 1), this.invalid)
    // The halo rings the whole melted body, list and all, and the field's canvas would cut it off
    // beside the list: while the list is out, the rim's colour alone shows the focus.
    const out = this.attachment ? clamp(this.attachment.emerge.x, 0, 1) : 0
    return { ...rim, glow: (rim.glow ?? 0) * (1 - out) }
  }

  /** Beads of the field's own clay, small enough to sit inside the well, that rise as the pointer comes. */
  private knobShapes(surface: ClaySurface): ClayShape[] {
    const body = surface.color("--clay-surface", NEUTRAL)
    const shapes: ClayShape[] = []
    for (const { box, hover, press } of this.knobs) {
      const up = clamp(hover.x, 0, 1.3)
      if (!box || up < 0.01) continue
      const shown = Math.min(up, 1)
      const squash = clamp(press.x, 0, 1)
      // The well is 10px shorter than the field: leave the bead a few px of it all round.
      const d = Math.min(box.w, box.h, surface.height - 16) * (0.84 + 0.08 * up)
      const w = d * (1 + squash * 0.12)
      const h = d * (1 - squash * 0.14)
      shapes.push({
        x: box.x + (box.w - w) / 2,
        y: box.y + (box.h - h) / 2,
        w,
        h,
        radius: h / 2,
        color: body,
        height: (0.8 - squash * 0.35) * shown,
        lift: (0.55 - squash * 0.35) * shown,
        bevel: h / 2,
        opacity: shown,
      })
    }
    return shapes
  }

  protected surfaceFor(): Array<[HTMLElement, SurfaceOptions]> {
    const field = this.field
    const content = this.content
    const surfaces: Array<[HTMLElement, SurfaceOptions]> = [
      [
        field,
        {
          swell: false,
          measure: () => {
            for (const knob of this.knobs) knob.box = knob.button.getClientRects().length ? offsetWithin(knob.button, field) : null
          },
          step: (dt, still) =>
            [
              this.focused.step(dt, SPRINGS.settle, still),
              this.pulse.step(dt, { omega: 22, zeta: 0.3 }, still),
              ...this.knobs.flatMap((knob) => [knob.hover.step(dt, SPRINGS.hover, still), knob.press.step(dt, SPRINGS.press, still)]),
            ].some(Boolean),
          shapes: () => {
            const surface = this.surfaces[0]!
            const radius = fieldRadius(surface.height)
            const focus = clamp(this.focused.x, 0, 1)
            return [
              { ...this.rim(), blend: this.attachment ? BLEND : undefined },
              ...(this.attachment?.joint(field) ?? []),
              fieldWell(surface, radius, focus, this.pulse.x),
              ...this.knobShapes(surface),
            ]
          },
        },
      ],
    ]
    if (content) {
      const base: SurfaceOptions = this.attachment?.surfaceOptions() ?? {
        swell: false,
        pad: 36,
        shapes: () => [slab(this.surfaces[1]!, "--clay-popup", 22, 16, 1.4)],
      }
      surfaces.push([content, withHighlight(base, this.highlight, () => this.surfaces[1], this.attachment)])
    }
    return surfaces
  }
}

export { ClayCombobox }
