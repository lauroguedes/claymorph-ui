import { BLEND } from "../attach"
import type { ClayShape } from "../engine"
import { ClayElement, NEUTRAL } from "../element"
import type { SurfaceOptions } from "../surface"

/** Press: a button that swells under the pointer and squashes when pressed. */
class ClayButton extends ClayElement {
  static observedAttributes = ["color", "size", "shape"]
  protected readonly requires = "button, a"

  protected surfaceFor(): Array<[HTMLElement, SurfaceOptions]> {
    return [[this, { shapes: () => this.shapes() }]]
  }

  private shapes(): ClayShape[] {
    const surface = this.surfaces[0]!
    const { width: w, height: h } = surface
    const press = surface.press.x
    const rounded = this.getAttribute("shape") === "rounded"
    const joints = [...this.joints].flatMap((joint) => joint())
    return [
      {
        x: 0,
        y: 0,
        w,
        h,
        radius: rounded ? Math.min(h * 0.34, 18) : h / 2,
        color: surface.color("--clay-color", NEUTRAL),
        height: 1 - press * 0.4,
        lift: 1 + surface.hover.x * 0.3 - press * 0.55,
        blend: joints.length ? BLEND : undefined,
      },
      ...joints,
    ]
  }
}

export { ClayButton }
