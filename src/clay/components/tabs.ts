import { SPRINGS } from "../config"
import type { ClayShape } from "../engine"
import { ClayElement, NEUTRAL } from "../element"
import { clamp, deeper, watch } from "../shared"
import { Spring } from "../spring"
import { offsetWithin, type SurfaceOptions } from "../surface"

/** Shift: tabs whose selection is a clay bead that rolls to the chosen view. */
class ClayTabs extends ClayElement {
  protected readonly requires = "ui-tabs-list ui-tabs-tab"
  private x = new Spring(0)
  private y = new Spring(0)
  private w = new Spring(0)
  private h = new Spring(0)
  private placed = false
  private selected = false
  private stop: (() => void) | null = null

  private get list() {
    return this.querySelector<HTMLElement>("ui-tabs-list")!
  }

  protected setup() {
    this.stop = watch(this.list, ["data-selected", "data-orientation"], () => this.invalidate())
  }

  protected teardown() {
    this.stop?.()
  }

  protected surfaceFor(): Array<[HTMLElement, SurfaceOptions]> {
    return [
      [
        this.list,
        {
          swell: false,
          pad: 26,
          measure: () => this.measure(),
          step: (dt, still) =>
            [this.x, this.y, this.w, this.h].map((spring) => spring.step(dt, SPRINGS.travel, still)).some(Boolean),
          shapes: () => this.shapes(),
        },
      ],
    ]
  }

  private measure() {
    const tab = this.list.querySelector<HTMLElement>("[data-slot='tabs-tab'][data-selected]")
    this.selected = !!tab
    if (!tab) return
    const box = offsetWithin(tab, this.list)
    this.x.target = box.x
    this.y.target = box.y
    this.w.target = box.w
    this.h.target = box.h
    if (!this.placed) {
      for (const spring of [this.x, this.y, this.w, this.h]) spring.set(spring.target)
      this.placed = true
    }
  }

  private shapes(): ClayShape[] {
    const surface = this.surfaces[0]!
    const { width: w, height: h } = surface
    const vertical = this.list.getAttribute("data-orientation") === "vertical"
    const body = surface.color("--clay-surface", NEUTRAL)
    const radius = vertical ? 24 : h / 2
    const shapes: ClayShape[] = [
      { x: 0, y: 0, w, h, radius, color: body, height: 0.9, lift: 0.55, bevel: 16 },
      { x: 5, y: 5, w: w - 10, h: h - 10, radius: radius - 5, color: deeper(body, 0.07), height: -0.8, bevel: 12 },
    ]
    if (!this.selected) return shapes
    const speed = vertical ? this.y.v : this.x.v
    const stretch = clamp(Math.abs(speed) * 0.0009, 0, 0.22)
    const bw = this.w.x * (vertical ? 1 - stretch * 0.3 : 1 + stretch)
    const bh = this.h.x * (vertical ? 1 + stretch : 1 - stretch * 0.45)
    shapes.push({
      x: this.x.x + (this.w.x - bw) / 2,
      y: this.y.x + (this.h.x - bh) / 2,
      w: bw,
      h: bh,
      radius: Math.min(bw, bh) / 2,
      color: surface.color("--clay-color", NEUTRAL),
      height: 1,
      lift: 0.5,
    })
    return shapes
  }
}

export { ClayTabs }
