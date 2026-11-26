import { SPRINGS } from "../config"
import type { ClayShape } from "../engine"
import { NEUTRAL } from "../element"
import { clamp, watch, type Box } from "../shared"
import { Spring } from "../spring"
import { offsetWithin, type ClaySurface, type SurfaceOptions } from "../surface"
import { fieldRim, fieldWell, userInvalid } from "./forms"

const fieldRadius = (h: number) => Math.min(h / 2, 20)

/** An icon button in the field, like a chevron: a clay bead rises out of the well under it on hover. */
interface Knob {
  button: HTMLElement
  box: Box | null
  hover: Spring
  press: Spring
}

interface FieldOptions {
  /** Icon buttons inside the field, which raise a bead out of the well under the pointer. */
  buttons?: string
  /** How much of the rim's focus halo shows, from 0 to 1, as when a list melted onto it hides it. */
  halo?: () => number
  /** Shapes melted into the rim, in the field's coordinates, like an attached list's joint. */
  joint?: (host: HTMLElement) => ClayShape[]
  /** How far colour runs across the rim into what's melted onto it, in px. */
  blend?: () => number | undefined
  /** The input became valid or invalid. */
  onInvalid?: (invalid: boolean) => void
}

/**
 * Type's carved field, on any box that holds an input: a rim that glows while the input has focus and
 * turns red while it's invalid, and a well that gives a little with each keystroke. Icon buttons in it
 * raise a bead of the field's clay out of the well under the pointer, and squash it as they're pressed.
 */
class Field {
  readonly box: HTMLElement
  private readonly input: HTMLInputElement
  private readonly surface: () => ClaySurface | undefined
  private readonly options: FieldOptions
  private readonly focused = new Spring(0)
  private readonly pulse = new Spring(0)
  private invalid = false
  private knobs: Knob[] = []

  constructor(box: HTMLElement, input: HTMLInputElement, surface: () => ClaySurface | undefined, options: FieldOptions = {}) {
    this.box = box
    this.input = input
    this.surface = surface
    this.options = options
  }

  /** Follows the input's focus, typing and validity. Returns a function that stops. */
  connect() {
    const input = this.input
    const cleanup: Array<() => void> = []
    const check = () => {
      const invalid = userInvalid(input)
      if (invalid === this.invalid) return
      this.invalid = invalid
      this.options.onInvalid?.(invalid)
      this.surface()?.invalidate()
    }
    const handlers: Array<[string, () => void]> = [
      ["focus", () => ((this.focused.target = 1), this.surface()?.wake())],
      ["blur", () => ((this.focused.target = 0), check(), this.surface()?.wake())],
      ["input", () => (this.give(5), check())],
      ["invalid", check],
    ]
    for (const [type, handler] of handlers) {
      input.addEventListener(type, handler)
      cleanup.push(() => input.removeEventListener(type, handler))
    }
    cleanup.push(watch(input, ["aria-invalid", "disabled"], check))
    if (document.activeElement === input) this.focused.set(1)
    cleanup.push(this.watchKnobs())
    return () => {
      for (const fn of cleanup) fn()
      this.knobs = []
    }
  }

  /** The well gives a little, as with a keystroke or when an attached list tucks back in. */
  give(strength = 4) {
    this.pulse.v += strength
    this.surface()?.wake()
  }

  private watchKnobs() {
    const buttons = this.options.buttons ? this.box.querySelectorAll<HTMLElement>(this.options.buttons) : []
    this.knobs = [...buttons].map((button) => ({ button, box: null, hover: new Spring(0), press: new Spring(0) }))
    const cleanup: Array<() => void> = []
    for (const knob of this.knobs) {
      const set = (hover: number, press: number) => {
        knob.hover.target = hover
        knob.press.target = press
        // Measured again: a clear button comes and goes, and shifts what's beside it.
        this.surface()?.invalidate()
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
        cleanup.push(() => knob.button.removeEventListener(type, handler as EventListener))
      }
    }
    return () => cleanup.forEach((fn) => fn())
  }

  /** The rim as it's drawn now. */
  rim(): ClayShape {
    const surface = this.surface()!
    const rim = fieldRim(surface, fieldRadius(surface.height), clamp(this.focused.x, 0, 1), this.invalid)
    return { ...rim, glow: (rim.glow ?? 0) * (this.options.halo?.() ?? 1) }
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

  surfaceOptions(): SurfaceOptions {
    const box = this.box
    return {
      swell: false,
      measure: () => {
        for (const knob of this.knobs) knob.box = knob.button.getClientRects().length ? offsetWithin(knob.button, box) : null
      },
      step: (dt, still) =>
        [
          this.focused.step(dt, SPRINGS.settle, still),
          this.pulse.step(dt, { omega: 22, zeta: 0.3 }, still),
          ...this.knobs.flatMap((knob) => [knob.hover.step(dt, SPRINGS.hover, still), knob.press.step(dt, SPRINGS.press, still)]),
        ].some(Boolean),
      shapes: () => {
        const surface = this.surface()!
        return [
          { ...this.rim(), blend: this.options.blend?.() },
          ...(this.options.joint?.(box) ?? []),
          fieldWell(surface, fieldRadius(surface.height), clamp(this.focused.x, 0, 1), this.pulse.x),
          ...this.knobShapes(surface),
        ]
      },
    }
  }
}

export { Field, fieldRadius, type FieldOptions }
