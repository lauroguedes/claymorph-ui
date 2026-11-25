import type { ClayShape } from "../engine"
import { ClayElement, NEUTRAL } from "../element"
import { deeper } from "../shared"
import type { SurfaceOptions } from "../surface"

const LIFT: Record<string, number> = { "1": 0.7, "2": 1.1, "3": 1.6 }

/** Hold: a soft slab that holds content. `interactive` makes it swell like a button. */
class ClayCard extends ClayElement {
  static observedAttributes = ["color", "elevation", "radius", "interactive"]
  protected readonly requires = ""

  attributeChangedCallback(name: string, old: string | null, value: string | null) {
    if (name === "radius") {
      if (value === null) this.style.removeProperty("--clay-radius")
      else this.style.setProperty("--clay-radius", `${Number(value)}px`)
    }
    super.attributeChangedCallback(name, old, value)
  }

  protected surfaceFor(): Array<[HTMLElement, SurfaceOptions]> {
    return [[this, { swell: this.hasAttribute("interactive"), pad: 40, shapes: () => this.shapes() }]]
  }

  private shapes(): ClayShape[] {
    const surface = this.surfaces[0]!
    const { width: w, height: h } = surface
    const lift = LIFT[this.getAttribute("elevation") ?? "2"] ?? 1.1
    return [
      {
        x: 0,
        y: 0,
        w,
        h,
        radius: Number(this.getAttribute("radius") ?? 28),
        color: surface.color("--clay-color", NEUTRAL),
        height: 0.9 - surface.press.x * 0.3,
        bevel: 22,
        lift: lift + surface.hover.x * 0.3,
      },
    ]
  }
}

/** Stamp: a small pressed label. */
class ClayBadge extends ClayElement {
  protected readonly requires = ""

  protected surfaceFor(): Array<[HTMLElement, SurfaceOptions]> {
    return [[this, { swell: false, pad: 14, shapes: () => this.shapes() }]]
  }

  private shapes(): ClayShape[] {
    const surface = this.surfaces[0]!
    const { width: w, height: h } = surface
    return [
      {
        x: 0,
        y: 0,
        w,
        h,
        radius: h / 2,
        color: surface.color("--clay-color", NEUTRAL),
        height: 0.9,
        lift: 0.35,
      },
    ]
  }
}

const STATUS: Record<string, string> = {
  online: "--clay-success",
  away: "--clay-butter",
  busy: "--clay-danger",
  offline: "--clay-slate",
}

/** Frame: an avatar set in a clay ring, with an optional status bead melted onto it. */
class ClayAvatar extends ClayElement {
  static observedAttributes = ["color", "size", "status"]
  protected readonly requires = "ui-avatar"

  protected surfaceFor(): Array<[HTMLElement, SurfaceOptions]> {
    return [[this, { swell: false, pad: 18, shapes: () => this.shapes() }]]
  }

  private shapes(): ClayShape[] {
    const surface = this.surfaces[0]!
    const { width: w, height: h } = surface
    const ring = Math.max(3, Math.round(w * 0.07))
    const color = surface.color("--clay-color", NEUTRAL)
    const shapes: ClayShape[] = [{ x: 0, y: 0, w, h, radius: w / 2, color, height: 0.9, lift: 0.6 }]
    const status = STATUS[this.getAttribute("status") ?? ""]
    if (status) {
      const d = Math.max(10, w * 0.26)
      shapes.push({
        x: w * 0.854 - d / 2,
        y: h * 0.854 - d / 2,
        w: d,
        h: d,
        radius: d / 2,
        color: surface.color(status),
        height: 1,
        melt: 5,
        lift: 0.6,
      })
    }
    shapes.push({
      x: ring,
      y: ring,
      w: w - ring * 2,
      h: h - ring * 2,
      radius: (w - ring * 2) / 2,
      color: deeper(color, 0.2),
      height: -0.9,
    })
    return shapes
  }
}

export { ClayAvatar, ClayBadge, ClayCard }
