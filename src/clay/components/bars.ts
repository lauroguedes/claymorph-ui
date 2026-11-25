import { SPRINGS } from "../config"
import type { ClayShape } from "../engine"
import { ClayElement, NEUTRAL } from "../element"
import { clamp, groove, watch } from "../shared"
import { Spring } from "../spring"
import { offsetWithin, type SurfaceOptions } from "../surface"

const number = (value: string | null, fallback: number) => {
  const parsed = value === null ? NaN : Number(value)
  return Number.isFinite(parsed) ? parsed : fallback
}

/** A groove that fills with a worm of clay, for progress and meters. */
abstract class ClayBar extends ClayElement {
  static observedAttributes = ["color", "orientation"]
  protected abstract readonly kind: "progress" | "meter"
  private fill = new Spring(0)
  private placed = false
  private time = 0
  private still = false
  private track = { x: 0, y: 0, w: 0, h: 0 }
  private stop: (() => void) | null = null

  private get root() {
    return this.querySelector<HTMLElement>(`ui-${this.kind}`)!
  }

  private get vertical() {
    return this.getAttribute("orientation") === "vertical"
  }

  private get indeterminate() {
    return this.root.hasAttribute("data-indeterminate")
  }

  /** The filled share, from the ARIA the ui-sdk part keeps up to date. */
  get fraction() {
    const root = this.root
    const min = number(root.getAttribute("aria-valuemin"), 0)
    const max = number(root.getAttribute("aria-valuemax"), 100)
    const now = number(root.getAttribute("aria-valuenow"), min)
    return max > min ? clamp((now - min) / (max - min), 0, 1) : 0
  }

  protected setup() {
    const sync = () => {
      this.style.setProperty("--clay-fill", `${(this.fraction * 100).toFixed(2)}%`)
      this.toggleAttribute("data-complete", !this.indeterminate && this.fraction >= 1)
      this.invalidate()
    }
    this.stop = watch(this.root, ["aria-valuenow", "aria-valuemax", "aria-valuemin", "data-indeterminate"], sync)
    sync()
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
          pad: 22,
          measure: () => {
            this.track = offsetWithin(this.querySelector(`ui-${this.kind}-track`)!, this)
            this.fill.target = this.fraction
            if (!this.placed) {
              this.fill.set(this.fraction)
              this.placed = true
            }
          },
          step: (dt, still) => {
            this.still = still
            const moving = this.fill.step(dt, SPRINGS.settle, still)
            if (!this.indeterminate || still) return moving
            this.time += dt
            return true
          },
          shapes: () => this.shapes(),
        },
      ],
    ]
  }

  private shapes(): ClayShape[] {
    const surface = this.surfaces[0]!
    const t = this.track
    const inset = Math.min(6, Math.max(t.w, t.h) / 4)
    const shapes = groove(surface, t, inset, Math.min(t.w, t.h) / 2 + inset)
    const thick = this.vertical ? t.w : t.h
    const length = this.vertical ? t.h : t.w
    const pad = 2
    let start = 0
    let span = clamp(this.fill.x, 0, 1.05) * length
    if (this.indeterminate) {
      const still = this.still
      span = still ? length : length * 0.36
      const travel = length - span
      start = still ? 0 : travel * (0.5 - 0.5 * Math.cos(this.time * 2.4))
    }
    if (span < 0.5) return shapes
    span = Math.max(span, thick - pad * 2)
    const color = surface.color("--clay-color", NEUTRAL)
    const r = (thick - pad * 2) / 2
    shapes.push(
      this.vertical
        ? { x: t.x + pad, y: t.y + t.h - start - span, w: t.w - pad * 2, h: span, radius: r, color, height: 0.75, lift: 0.15 }
        : { x: t.x + pad + start, y: t.y + pad, w: Math.min(span, t.w - pad * 2), h: t.h - pad * 2, radius: r, color, height: 0.75, lift: 0.15 }
    )
    return shapes
  }
}

/** Fill: a progress bar whose groove fills with clay. Without a value, a lump rolls back and forth. */
class ClayProgress extends ClayBar {
  protected readonly requires = "ui-progress-track"
  protected readonly kind = "progress" as const
}

/** Gauge: a meter, the same groove for a measured value, across or upright. */
class ClayMeter extends ClayBar {
  protected readonly requires = "ui-meter-track"
  protected readonly kind = "meter" as const
}

export { ClayMeter, ClayProgress }
