import { SPRINGS } from "./config"
import type { Box } from "./shared"
import { Spring } from "./spring"
import { offsetWithin } from "./surface"

/**
 * Cuts an element's contents, all but its clay canvas, to a box in its own coordinates: clay drawn to
 * that box can lag behind the contents, as when it swells on a spring, and nothing shows outside it.
 */
class Clip {
  private readonly host: HTMLElement
  private readonly clipped = new Map<HTMLElement, string>()

  constructor(host: HTMLElement) {
    this.host = host
  }

  /** Cuts to the box, a little inside its edge, where the clay's bevel starts. */
  to(box: Box, edge = 6) {
    if (!this.host.getClientRects().length) return
    for (const child of this.host.children) {
      if (!(child instanceof HTMLElement) || child.classList.contains("clay-canvas") || !child.getClientRects().length) continue
      const c = offsetWithin(child, this.host)
      const inset = [box.y + edge - c.y, c.x + c.w - (box.x + box.w - edge), c.y + c.h - (box.y + box.h - edge), box.x + edge - c.x]
      const value = inset.some((v) => v > 0.5) ? `inset(${inset.map((v) => `${Math.max(v, 0).toFixed(1)}px`).join(" ")} round 12px)` : ""
      if ((this.clipped.get(child) ?? "") === value) continue
      child.style.clipPath = value
      if (value) this.clipped.set(child, value)
      else this.clipped.delete(child)
    }
  }

  clear() {
    for (const child of this.clipped.keys()) child.style.removeProperty("clip-path")
    this.clipped.clear()
  }
}

/**
 * An element's size on springs, so the clay drawn to it swells and shrinks as the element changes size
 * instead of jumping, anchored at its top-left corner, where a palette keeps its search as the list
 * under it narrows. Its contents are cut to the clay until it catches up. Only the size springs: the
 * element moving, as the page lays out around it, never drags its clay along behind it.
 */
class Follow {
  private readonly host: HTMLElement
  private readonly w = new Spring(0)
  private readonly h = new Spring(0)
  private placed = false
  private readonly clip: Clip

  constructor(host: HTMLElement) {
    this.host = host
    this.clip = new Clip(host)
  }

  /**
   * Reads the element's size: on a spring with `spring`, else at once, as while the clay comes out.
   * Hidden, it starts over: shown again, it takes its size at once instead of swelling from the last.
   */
  measure(spring: boolean) {
    const { offsetWidth: w, offsetHeight: h } = this.host
    if (!w || !h) {
      this.placed = false
      this.clip.clear()
      return
    }
    if (spring && this.placed) {
      this.w.target = w
      this.h.target = h
    } else {
      this.w.set(w)
      this.h.set(h)
    }
    this.placed = true
  }

  /** Advances the springs and cuts the contents to them. Returns true while they move. */
  step(dt: number, still: boolean) {
    const moving = [this.w.step(dt, SPRINGS.morph, still), this.h.step(dt, SPRINGS.morph, still)].some(Boolean)
    if (this.placed) this.clip.to(this.box())
    return moving
  }

  /** The box the clay is drawn to now, in the element's own coordinates. */
  box(): Box {
    return { x: 0, y: 0, w: this.w.x, h: this.h.x }
  }

  release() {
    this.clip.clear()
  }
}

export { Clip, Follow }
