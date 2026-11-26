import { mix } from "../color"
import { SPRINGS } from "../config"
import type { ClayShape } from "../engine"
import { ClayElement, NEUTRAL } from "../element"
import { GLUE } from "../attach"
import { clamp, deeper, watch } from "../shared"
import { Spring } from "../spring"
import { offsetWithin, type ClaySurface, type SurfaceOptions } from "../surface"

const userInvalid = (field: Element) => {
  try {
    return field.matches(":user-invalid") || field.getAttribute("aria-invalid") === "true"
  } catch {
    return field.getAttribute("aria-invalid") === "true"
  }
}

/** The rim of a text field: it glows in the field's colour while focused, or red while invalid. */
function fieldRim(surface: ClaySurface, radius: number, focus: number, invalid: boolean): ClayShape {
  const { width: w, height: h } = surface
  const body = surface.color("--clay-surface", NEUTRAL)
  const glow = invalid
    ? mix(surface.color("--clay-danger", NEUTRAL), surface.color("--clay-danger-text", NEUTRAL), 0.3)
    : mix(surface.color("--clay-color", NEUTRAL), surface.color("--clay-ring", NEUTRAL), 0.45)
  return {
    x: 0,
    y: 0,
    w,
    h,
    radius,
    color: mix(body, glow, invalid ? 0.45 + focus * 0.4 : focus * 0.85),
    height: 0.8 + focus * 0.1,
    lift: 0.45 + focus * 0.15,
    bevel: Math.min(h / 2, 18),
    glow: focus * 0.55,
  }
}

/** The well carved into a text field, which gives a little with each keystroke. */
function fieldWell(surface: ClaySurface, radius: number, focus: number, give: number): ClayShape {
  const { width: w, height: h } = surface
  const body = surface.color("--clay-surface", NEUTRAL)
  return {
    x: 5,
    y: 5,
    w: w - 10,
    h: h - 10,
    radius: Math.max(radius - 5, 4),
    color: mix(deeper(body, 0.07), [1, 1, 1], focus * 0.1),
    height: -0.75 - focus * 0.25 - give * 0.04,
    bevel: Math.min((h - 10) / 2, 14),
  }
}

const LABEL = ":scope > :is(ui-field-label, [data-slot='field-label'])"
const HINT = ":scope > :is(ui-field-description, [data-slot='field-description'])"

const layout = (el: HTMLElement | null) =>
  el && el.offsetParent ? { x: el.offsetLeft, y: el.offsetTop, w: el.offsetWidth, h: el.offsetHeight } : null

/**
 * Type: a text field carved into the clay. Its rim glows while focused and the well gives a little as
 * you type. With `attached`, the label and hint are beads melted onto the rim.
 */
class ClayInput extends ClayElement {
  static observedAttributes = ["color", "size", "attached"]
  protected readonly requires = "input, textarea"
  private focused = new Spring(0)
  private pulse = new Spring(0)
  private out = new Spring(0)
  private invalid = false
  private label: { x: number; y: number; w: number; h: number } | null = null
  private hint: { x: number; y: number; w: number; h: number } | null = null
  private lastVars = ""
  private reach = 24
  private cleanup: Array<() => void> = []

  private get field() {
    return this.querySelector<HTMLInputElement | HTMLTextAreaElement>("input, textarea")!
  }

  private get attached() {
    return this.hasAttribute("attached")
  }

  protected setup() {
    const field = this.field
    const check = () => {
      const invalid = userInvalid(field)
      if (invalid !== this.invalid) {
        this.invalid = invalid
        this.toggleAttribute("data-invalid", invalid)
        this.invalidate()
      }
    }
    const handlers: Array<[string, () => void]> = [
      ["focus", () => ((this.focused.target = 1), this.surfaces[0]?.wake())],
      ["blur", () => ((this.focused.target = 0), check(), this.surfaces[0]?.wake())],
      ["input", () => ((this.pulse.v += 5), check(), this.surfaces[0]?.wake())],
      ["invalid", check],
    ]
    for (const [type, handler] of handlers) {
      field.addEventListener(type, handler)
      this.cleanup.push(() => field.removeEventListener(type, handler))
    }
    this.cleanup.push(watch(field, ["aria-invalid", "disabled"], () => (check(), this.invalidate())))
    if (document.activeElement === field) this.focused.set(1)
    this.out.target = 1
  }

  protected teardown() {
    for (const fn of this.cleanup) fn()
    this.cleanup = []
  }

  protected surfaceFor(): Array<[HTMLElement, SurfaceOptions]> {
    return [
      [
        this,
        {
          swell: false,
          pad: () => this.reach,
          measure: () => {
            this.label = this.attached ? layout(this.querySelector<HTMLElement>(LABEL)) : null
            this.hint = this.attached ? layout(this.querySelector<HTMLElement>(HINT)) : null
            const { offsetWidth: w, offsetHeight: h } = this
            this.reach = 24
            for (const box of [this.label, this.hint]) {
              if (box) this.reach = Math.max(this.reach, Math.ceil(Math.max(-box.y, -box.x, box.x + box.w - w, box.y + box.h - h)) + 28)
            }
          },
          step: (dt, still) => {
            const moving = [
              this.focused.step(dt, SPRINGS.settle, still),
              this.pulse.step(dt, { omega: 22, zeta: 0.3 }, still),
              this.out.step(dt, { omega: 11, zeta: 0.45 }, still),
            ].some(Boolean)
            const vars = `${this.focused.x.toFixed(3)}|${this.out.x.toFixed(3)}`
            if (vars !== this.lastVars) {
              this.lastVars = vars
              this.style.setProperty("--clay-pull", this.focused.x.toFixed(3))
              this.style.setProperty("--clay-out", this.out.x.toFixed(3))
            }
            return moving
          },
          shapes: () => this.shapes(),
        },
      ],
    ]
  }

  private shapes(): ClayShape[] {
    const surface = this.surfaces[0]!
    const body = surface.color("--clay-surface", NEUTRAL)
    const f = clamp(this.focused.x, 0, 1)
    const radius = this.field instanceof HTMLTextAreaElement ? 20 : Math.min(surface.height / 2, 20)
    const rim = fieldRim(surface, radius, f, this.invalid)
    const shapes: ClayShape[] = [rim]
    const out = clamp(this.out.x, 0, 1.2)
    for (const [box, dir, tint] of [
      [this.label, -1, 0.5],
      [this.hint, 1, 0.2],
    ] as const) {
      if (!box) continue
      const shift = dir * (f * 4 - (1 - out) * 18)
      const bead = { x: box.x, y: box.y + shift, w: box.w, h: box.h }
      const color = mix(body, rim.color, tint)
      shapes.push({ ...bead, radius: bead.h / 2, color, height: 0.8, melt: GLUE * 0.6, lift: 0.4 })
    }
    shapes.push(fieldWell(surface, radius, f, this.pulse.x))
    return shapes
  }
}

/** Pick: radios carved as dents in the clay. A bead hops into the one you choose. */
class ClayRadio extends ClayElement {
  protected readonly requires = "ui-radio"
  private boxes: Array<{ x: number; y: number; w: number; h: number }> = []
  private x = new Spring(0)
  private y = new Spring(0)
  private pop = new Spring(0)
  private placed = false
  private stop: (() => void) | null = null

  protected setup() {
    this.stop = watch(this, ["data-checked", "data-disabled"], () => this.invalidate())
  }

  protected teardown() {
    this.stop?.()
  }

  protected surfaceFor(): Array<[HTMLElement, SurfaceOptions]> {
    return [
      [
        this,
        {
          swell: false,
          pad: 18,
          measure: () => this.measure(),
          step: (dt, still) =>
            [
              this.x.step(dt, SPRINGS.travel, still),
              this.y.step(dt, SPRINGS.travel, still),
              this.pop.step(dt, { omega: 16, zeta: 0.4 }, still),
            ].some(Boolean),
          shapes: () => this.shapes(),
        },
      ],
    ]
  }

  private measure() {
    const radios = [...this.querySelectorAll<HTMLElement>("ui-radio")].slice(0, 7)
    this.boxes = radios.map((radio) => offsetWithin(radio, this))
    const index = radios.findIndex((radio) => radio.hasAttribute("data-checked"))
    const box = this.boxes[index]
    this.pop.target = box ? 1 : 0
    if (box) {
      this.x.target = box.x + box.w / 2
      this.y.target = box.y + box.h / 2
    }
    if (!this.placed) {
      this.x.set(this.x.target)
      this.y.set(this.y.target)
      this.pop.set(this.pop.target)
      this.placed = true
    }
  }

  private shapes(): ClayShape[] {
    const surface = this.surfaces[0]!
    const body = surface.color("--clay-surface", NEUTRAL)
    const shapes: ClayShape[] = []
    for (const box of this.boxes) {
      shapes.push(
        { x: box.x - 3, y: box.y - 3, w: box.w + 6, h: box.h + 6, radius: (box.h + 6) / 2, color: body, height: 0.85, lift: 0.4 },
        { x: box.x + 2, y: box.y + 2, w: box.w - 4, h: box.h - 4, radius: (box.h - 4) / 2, color: deeper(body, 0.1), height: -0.9 }
      )
    }
    const size = (this.boxes[0]?.w ?? 0) - 9
    const speed = Math.hypot(this.x.v, this.y.v)
    const shrink = clamp(speed * 0.0016, 0, 0.45)
    const d = size * clamp(this.pop.x, 0, 1.3) * (1 - shrink)
    if (d > 0.5) {
      shapes.push({
        x: this.x.x - d / 2,
        y: this.y.x - d / 2,
        w: d,
        h: d,
        radius: d / 2,
        color: surface.color("--clay-color", NEUTRAL),
        height: 1,
        lift: 0.35 + shrink,
      })
    }
    return shapes
  }
}

export { ClayInput, ClayRadio, fieldRim, fieldWell, userInvalid }
