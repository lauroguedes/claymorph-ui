import type { Attachment } from "./attach"
import type { RGB } from "./color"
import { SPRINGS } from "./config"
import type { ClayShape } from "./engine"
import { NEUTRAL } from "./element"
import { clamp, deeper, watch } from "./shared"
import { Spring } from "./spring"
import { offsetWithin, type ClaySurface, type SurfaceOptions } from "./surface"

/**
 * A well pressed into a list's clay that slides to the highlighted item, stretching as it travels,
 * like Slide's bead. It replaces the item's own highlight while the clay is drawn.
 */
class Highlight {
  private readonly x = new Spring(0)
  private readonly y = new Spring(0)
  private readonly w = new Spring(0)
  private readonly h = new Spring(0)
  private readonly shown = new Spring(0)
  private readonly list: HTMLElement
  private readonly items: string

  constructor(list: HTMLElement, items: string) {
    this.list = list
    this.items = items
  }

  /** Calls back whenever the highlighted item changes. Returns a function that stops. */
  watch(changed: () => void) {
    return watch(this.list, ["data-highlighted"], changed)
  }

  measure() {
    const item = this.list.querySelector<HTMLElement>(`:is(${this.items})[data-highlighted]`)
    if (!item || !item.getClientRects().length) {
      this.shown.target = 0
      return
    }
    const box = offsetWithin(item, this.list)
    const springs = [this.x, this.y, this.w, this.h] as const
    const values = [box.x, box.y, box.w, box.h]
    // Appearing, it starts where the pointer is instead of sliding in from the last item.
    const jump = this.shown.x < 0.05
    springs.forEach((spring, i) => (jump ? spring.set(values[i]!) : (spring.target = values[i]!)))
    this.shown.target = 1
  }

  step(dt: number, still: boolean) {
    return [
      ...[this.x, this.y, this.w, this.h].map((spring) => spring.step(dt, SPRINGS.travel, still)),
      this.shown.step(dt, { omega: 20, zeta: 0.85 }, still),
    ].some(Boolean)
  }

  shape(color: RGB, presence = 1): ClayShape | null {
    const a = clamp(this.shown.x, 0, 1) * presence
    if (a < 0.01) return null
    const stretch = clamp(Math.abs(this.y.v) * 0.0006, 0, 0.2)
    const h = this.h.x * (1 + stretch)
    const w = this.w.x * (1 - stretch * 0.25)
    // It fades in and out whole and eases in a little deeper: a well that only got shallower would keep
    // its rim to the end and then pop away.
    return {
      x: this.x.x + (this.w.x - w) / 2,
      y: this.y.x - (h - this.h.x) / 2,
      w,
      h,
      radius: Math.min(h / 2, 13),
      color: deeper(color, 0.07),
      height: -0.55 * (0.6 + 0.4 * a),
      bevel: 8,
      opacity: a,
    }
  }
}

/** Adds a list's sliding highlight to its popup's clay, once the popup is all the way out. */
function withHighlight(
  base: SurfaceOptions,
  highlight: Highlight | null,
  surface: () => ClaySurface | undefined,
  attachment: Attachment | null
): SurfaceOptions {
  if (!highlight) return base
  return {
    ...base,
    measure: () => {
      base.measure?.()
      highlight.measure()
    },
    step: (dt, still) => [base.step?.(dt, still) ?? false, highlight.step(dt, still)].some(Boolean),
    shapes: () => {
      const shapes = base.shapes()
      const presence = attachment ? clamp((attachment.emerge.x - 0.85) / 0.15, 0, 1) : 1
      const well = surface() && highlight.shape(surface()!.color("--clay-popup", NEUTRAL), presence)
      return well ? [...shapes, well] : shapes
    },
  }
}

export { Highlight, withHighlight }
