import { mix } from "../color"
import { SPRINGS } from "../config"
import type { ClayShape } from "../engine"
import { ClayElement, NEUTRAL } from "../element"
import { clamp, deeper, watch } from "../shared"
import { Spring } from "../spring"
import { offsetWithin, type ClaySurface, type SurfaceOptions } from "../surface"

/** Slide: a segmented control whose selection is a clay bead rolling along a groove. */
class ClaySegmented extends ClayElement {
  protected readonly requires = "ui-segmented-control"
  private x = new Spring(0)
  private w = new Spring(0)
  private placed = false
  private stop: (() => void) | null = null

  protected setup() {
    const control = this.querySelector("ui-segmented-control")!
    this.stop = watch(control, ["data-checked"], () => this.invalidate())
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
          measure: () => this.measure(),
          step: (dt, still) => [this.x.step(dt, SPRINGS.travel, still), this.w.step(dt, SPRINGS.travel, still)].some(Boolean),
          shapes: () => this.shapes(),
        },
      ],
    ]
  }

  private item: { x: number; y: number; w: number; h: number } | null = null

  private measure() {
    const checked = this.querySelector<HTMLElement>("ui-segmented-control-item[data-checked]")
    this.item = checked ? offsetWithin(checked, this) : null
    if (!this.item) return
    this.x.target = this.item.x
    this.w.target = this.item.w
    if (!this.placed) {
      this.x.set(this.item.x)
      this.w.set(this.item.w)
      this.placed = true
    }
  }

  private shapes(): ClayShape[] {
    const surface = this.surfaces[0]!
    const { width: w, height: h } = surface
    const body = surface.color("--clay-surface", NEUTRAL)
    const shapes: ClayShape[] = [
      { x: 0, y: 0, w, h, radius: h / 2, color: body, height: 0.9, lift: 0.55 },
      { x: 4, y: 4, w: w - 8, h: h - 8, radius: (h - 8) / 2, color: deeper(body, 0.07), height: -0.8 },
    ]
    if (this.item) {
      const stretch = clamp(Math.abs(this.x.v) * 0.0009, 0, 0.22)
      const bw = this.w.x * (1 + stretch)
      const bh = this.item.h * (1 - stretch * 0.45)
      shapes.push({
        x: this.x.x - (bw - this.w.x) / 2,
        y: this.item.y + (this.item.h - bh) / 2,
        w: bw,
        h: bh,
        radius: bh / 2,
        color: surface.color("--clay-color", NEUTRAL),
        height: 1,
        lift: 0.5,
      })
    }
    return shapes
  }
}

/** Flip: a switch whose knob rolls across a groove that fills with colour. */
class ClaySwitch extends ClayElement {
  protected readonly requires = "ui-switch"
  private knob = new Spring(0)
  private fill = new Spring(0)
  private placed = false
  private stop: (() => void) | null = null

  protected setup() {
    const control = this.querySelector("ui-switch")!
    this.stop = watch(control, ["data-checked"], () => this.invalidate())
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
          measure: () => {
            const on = this.querySelector("ui-switch")!.hasAttribute("data-checked") ? 1 : 0
            this.knob.target = this.fill.target = on
            if (!this.placed) {
              this.knob.set(on)
              this.fill.set(on)
              this.placed = true
            }
          },
          step: (dt, still) =>
            [this.knob.step(dt, { omega: 15, zeta: 0.5 }, still), this.fill.step(dt, SPRINGS.settle, still)].some(Boolean),
          shapes: () => this.shapes(this.surfaces[0]!),
        },
      ],
    ]
  }

  private shapes(surface: ClaySurface): ClayShape[] {
    const { width: w, height: h } = surface
    const body = surface.color("--clay-surface", NEUTRAL)
    const accent = surface.color("--clay-color")
    const d = h - 10
    const travel = w - 10 - d
    const cx = 5 + d / 2 + travel * this.knob.x
    const stretch = clamp(Math.abs(this.knob.v) * 0.05, 0, 0.35) + surface.press.x * 0.22
    const kw = d * (1 + stretch)
    const kh = d * (1 - stretch * 0.25)
    return [
      { x: 0, y: 0, w, h, radius: h / 2, color: body, height: 0.85, lift: 0.5 },
      {
        x: 3,
        y: 3,
        w: w - 6,
        h: h - 6,
        radius: (h - 6) / 2,
        color: mix(deeper(body, 0.09), accent, clamp(this.fill.x, 0, 1)),
        height: -0.85,
      },
      {
        x: clamp(cx - kw / 2, 4, w - 4 - kw),
        y: h / 2 - kh / 2,
        w: kw,
        h: kh,
        radius: kh / 2,
        color: surface.color("--clay-knob"),
        height: 1,
        lift: 0.7,
      },
    ]
  }
}

/** Tick: a checkbox whose dent pushes up into a filled bump when checked. */
class ClayCheckbox extends ClayElement {
  protected readonly requires = "ui-checkbox"
  private fill = new Spring(0)
  private placed = false
  private stop: (() => void) | null = null

  protected setup() {
    const control = this.querySelector("ui-checkbox")!
    this.stop = watch(control, ["data-checked", "data-indeterminate"], () => this.invalidate())
  }

  protected teardown() {
    this.stop?.()
  }

  protected surfaceFor(): Array<[HTMLElement, SurfaceOptions]> {
    return [
      [
        this,
        {
          pad: 18,
          measure: () => {
            const box = this.querySelector("ui-checkbox")!
            const on = box.matches("[data-checked], [data-indeterminate]") ? 1 : 0
            this.fill.target = on
            if (!this.placed) {
              this.fill.set(on)
              this.placed = true
            }
          },
          step: (dt, still) => this.fill.step(dt, { omega: 16, zeta: 0.42 }, still),
          shapes: () => this.shapes(this.surfaces[0]!),
        },
      ],
    ]
  }

  private shapes(surface: ClaySurface): ClayShape[] {
    const { width: w, height: h } = surface
    const body = surface.color("--clay-surface", NEUTRAL)
    const f = this.fill.x
    return [
      { x: 0, y: 0, w, h, radius: 9, color: body, height: 0.8, lift: 0.45 },
      {
        x: 4,
        y: 4,
        w: w - 8,
        h: h - 8,
        radius: 6,
        color: mix(deeper(body, 0.1), surface.color("--clay-color"), clamp(f, 0, 1)),
        height: -0.85 + 1.75 * f - surface.press.x * 0.3,
        lift: clamp(f, 0, 1) * 0.35,
      },
    ]
  }
}

/** Stretch: a slider whose clay ball stretches with speed and drags a filled groove behind it. */
class ClaySlider extends ClayElement {
  protected readonly requires = "ui-slider-thumb"
  private x = new Spring(0)
  private grab = new Spring(0)
  private placed = false
  private track = { x: 0, y: 0, w: 0, h: 0 }
  private stop: (() => void) | null = null

  protected setup() {
    const slider = this.querySelector("ui-slider")!
    this.stop = watch(slider, ["style", "data-dragging"], () => this.invalidate())
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
          pressTarget: this.querySelector<HTMLElement>("ui-slider-control") ?? this,
          measure: () => this.measure(),
          step: (dt, still) =>
            [this.x.step(dt, { omega: 24, zeta: 0.62 }, still), this.grab.step(dt, SPRINGS.press, still)].some(Boolean),
          shapes: () => this.shapes(this.surfaces[0]!),
        },
      ],
    ]
  }

  private measure() {
    this.track = offsetWithin(this.querySelector("ui-slider-track")!, this)
    const thumb = offsetWithin(this.querySelector("ui-slider-thumb")!, this)
    this.x.target = thumb.x + thumb.w / 2
    this.grab.target = this.querySelector("ui-slider")!.hasAttribute("data-dragging") ? 1 : 0
    if (!this.placed) {
      this.x.set(this.x.target)
      this.placed = true
    }
  }

  private shapes(surface: ClaySurface): ClayShape[] {
    const t = this.track
    const body = surface.color("--clay-surface", NEUTRAL)
    const grab = Math.max(this.grab.x, surface.press.x)
    const d = 26 * (1 + grab * 0.12)
    const stretch = clamp(Math.abs(this.x.v) * 0.0012, 0, 0.3)
    const bw = d * (1 + stretch)
    const bh = d * (1 - stretch * 0.3)
    const cy = t.y + t.h / 2
    return [
      { x: t.x - 7, y: t.y - 7, w: t.w + 14, h: t.h + 14, radius: (t.h + 14) / 2, color: body, height: 0.8, lift: 0.5 },
      { x: t.x, y: t.y, w: t.w, h: t.h, radius: t.h / 2, color: deeper(body, 0.09), height: -0.9 },
      {
        x: t.x + 1,
        y: t.y + 1,
        w: Math.max(this.x.x - t.x, t.h),
        h: t.h - 2,
        radius: (t.h - 2) / 2,
        color: surface.color("--clay-color"),
        height: 0.7,
      },
      {
        x: this.x.x - bw / 2,
        y: cy - bh / 2,
        w: bw,
        h: bh,
        radius: bh / 2,
        color: surface.color("--clay-knob"),
        height: 1,
        lift: 0.8 + grab * 0.4,
      },
    ]
  }
}

export { ClayCheckbox, ClaySegmented, ClaySlider, ClaySwitch }
