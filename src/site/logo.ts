import { mix } from "../clay/color"
import type { ClayShape } from "../clay/engine"
import { ClayElement, define, NEUTRAL } from "../clay/element"
import type { SurfaceOptions } from "../clay/surface"

/**
 * The brand mark: a clay blob with a bead resting against it. Point at the logo and the bead melts
 * into the blob, which swells and wobbles as it takes it in; let go and the bead springs back out.
 */
class ClayLogo extends ClayElement {
  protected readonly requires = ""

  protected surfaceFor(): Array<[HTMLElement, SurfaceOptions]> {
    return [[this, { swell: false, pad: 14, pressTarget: this.closest<HTMLElement>("a") ?? this, shapes: () => this.shapes() }]]
  }

  private shapes(): ClayShape[] {
    const surface = this.surfaces[0]!
    const scale = surface.width / 32
    // The hover spring overshoots, so the merge does too: the bead dips in and settles.
    const merge = surface.hover.x
    const press = surface.press.x
    // Taking the bead in squashes the blob along its way, from the spring's own speed.
    const wobble = Math.max(-0.12, Math.min(0.12, surface.hover.v * 0.012))
    const r = (11.5 + merge * 1.4) * scale
    const w = r * 2 * (1 + wobble + press * 0.06)
    const h = r * 2 * (1 - wobble - press * 0.1)
    const cx = 14 * scale
    const cy = 17.5 * scale + press * 1.2
    const taken = Math.min(Math.max(merge, 0), 1)
    const br = (4.6 - merge * 1.6) * scale
    const bx = (26.2 - merge * 7) * scale
    const by = (6 + merge * 5.4) * scale
    const teal = surface.color("--clay-teal", NEUTRAL)
    return [
      {
        x: cx - w / 2,
        y: cy - h / 2 + (r * 2 - h) / 2,
        w,
        h,
        radius: h / 2,
        color: teal,
        height: 1 - press * 0.3,
        lift: 0.7,
      },
      {
        x: bx - br,
        y: by - br,
        w: br * 2,
        h: br * 2,
        radius: br,
        // It takes the blob's colour as it melts in, so the blob stays teal instead of washing out.
        color: mix(surface.color("--clay-lilac", NEUTRAL), teal, taken),
        height: 1,
        lift: 0.7,
        bevel: br * 0.65,
        melt: (3 + merge * 5) * scale,
        blend: 4,
      },
    ]
  }
}

define("clay-logo", ClayLogo)

export { ClayLogo }
