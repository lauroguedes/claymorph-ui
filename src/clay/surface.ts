import { resolveColor, type RGB } from "./color"
import { CLAY, SPRINGS } from "./config"
import { getClayEngine, type ClayFrame, type ClayShape, type ClayView, type Padding } from "./engine"
import { Spring } from "./spring"

interface SurfaceOptions {
  /**
   * Room around the host for shadows, in CSS px: the same on every side, or each side its own, as for
   * clay that reaches far one way. A function is asked again whenever the surface is dirty.
   */
  pad?: number | (() => number | Padding)
  /** Hover swell and press squash on the host itself. */
  swell?: boolean
  /** Starts calm: no swell, squash or light leaning toward the pointer. */
  calm?: boolean
  /** Where hover and presses are read; defaults to the host. */
  pressTarget?: HTMLElement
  /** The clay element whose `--clay-color` this surface wears; defaults to the host. */
  owner?: HTMLElement
  /** Re-reads geometry the shapes depend on. Runs whenever the surface is dirty. */
  measure?: () => void
  /** Advances the component's own springs. Returns true while anything moves. */
  step?: (dt: number, still: boolean) => boolean
  shapes: () => ClayShape[]
}

const isDisabled = (el: HTMLElement) =>
  el.matches("[data-disabled], [aria-disabled='true']") ||
  !!el.querySelector(":disabled, [aria-disabled='true'], [data-disabled]")

class ClaySurface implements ClayView {
  readonly host: HTMLElement
  readonly canvas = document.createElement("canvas")
  readonly ctx: CanvasRenderingContext2D
  /** The room on every side, or the most room on any side when they differ. */
  pad: number
  padding: Padding
  readonly hover = new Spring(0)
  readonly press = new Spring(0)
  width = 0
  height = 0
  visible = true
  dirty = true
  /**
   * Measure again on the next frame, without waking the engine. For a surface that follows another
   * element's box while that element moves: `dirty` is spent by the frame's draw before the next measure.
   */
  stale = false
  key = ""
  pointer: { x: number; y: number } | null = null
  private options: SurfaceOptions
  private colors = new Map<string, RGB>()
  private cleanup: Array<() => void> = []
  private ready = false
  private lastSx = ""
  private lastSy = ""
  private placed = false
  private calmed = false

  constructor(host: HTMLElement, options: SurfaceOptions) {
    this.host = host
    this.options = options
    this.pad = typeof options.pad === "number" ? options.pad : 28
    this.padding = { left: this.pad, top: this.pad, right: this.pad, bottom: this.pad }
    this.calmed = options.calm ?? false
    this.ctx = this.canvas.getContext("2d")!
    this.canvas.className = "clay-canvas"
    this.canvas.setAttribute("aria-hidden", "true")
    this.canvas.dataset.clayCanvas = ""
  }

  static attach(host: HTMLElement, options: SurfaceOptions) {
    const engine = getClayEngine()
    if (!engine) return null
    const surface = new ClaySurface(host, options)
    surface.connect()
    engine.add(surface)
    return surface
  }

  private connect() {
    const { host } = this
    host.setAttribute("data-clay-host", "")
    host.prepend(this.canvas)

    const resize = new ResizeObserver(() => this.invalidate())
    resize.observe(host)
    const visibility = new IntersectionObserver(
      ([entry]) => {
        this.visible = entry!.isIntersecting
        if (this.visible) this.invalidate()
      },
      { rootMargin: "120px" }
    )
    visibility.observe(host)
    this.cleanup.push(() => resize.disconnect(), () => visibility.disconnect())

    const target = this.options.pressTarget ?? host
    const on = <K extends keyof HTMLElementEventMap>(
      type: K,
      handler: (event: HTMLElementEventMap[K]) => void
    ) => {
      target.addEventListener(type, handler)
      this.cleanup.push(() => target.removeEventListener(type, handler))
    }
    on("pointerenter", () => this.setHover(true))
    // The pointer stays where it left, so the light leaning toward it eases back with the hover.
    on("pointerleave", () => {
      this.setHover(false)
      this.setPress(false)
    })
    on("pointermove", (event) => {
      const box = host.getBoundingClientRect()
      const sx = box.width / (host.offsetWidth || 1)
      const sy = box.height / (host.offsetHeight || 1)
      this.pointer = { x: (event.clientX - box.left) / sx, y: (event.clientY - box.top) / sy }
      this.wake()
    })
    on("pointerdown", (event) => {
      if (event.button === 0) this.setPress(true)
    })
    on("pointerup", () => this.setPress(false))
    on("pointercancel", () => this.setPress(false))
    on("keydown", (event) => {
      if (!event.repeat && (event.key === " " || event.key === "Enter")) this.setPress(true)
    })
    on("keyup", () => this.setPress(false))
    on("focusout", () => this.setPress(false))
  }

  destroy() {
    getClayEngine()?.remove(this)
    for (const fn of this.cleanup) fn()
    this.canvas.remove()
    this.host.removeAttribute("data-clay-ready")
    this.host.removeAttribute("data-clay-host")
  }

  private setHover(on: boolean) {
    this.hover.target = on && !this.calmed && !isDisabled(this.host) ? 1 : 0
    this.wake()
  }

  private setPress(on: boolean) {
    this.press.target = on && !this.calmed && !isDisabled(this.host) ? 1 : 0
    this.wake()
  }

  /**
   * Holds the surface still: no swell, squash or light leaning toward the pointer. A trigger stays calm
   * while its popup is melted onto it, so the joint between them doesn't shift as the pointer moves.
   */
  calm(on: boolean) {
    if (on === this.calmed) return
    this.calmed = on
    if (on) {
      this.hover.target = 0
      this.press.target = 0
    }
    this.wake()
  }

  /** A little squash and spring back, as when something tucks back into it. */
  bounce(strength = 1) {
    this.press.v += 7 * strength
    this.wake()
  }

  invalidate() {
    this.dirty = true
    this.wake()
  }

  wake() {
    getClayEngine()?.wake()
  }

  /**
   * The resolved colour of a CSS custom property, cached until the surface is dirty. `--clay-color`
   * comes from the owner, so a clay card around a part can't recolour it; the rest from the host.
   */
  color(property: string, fallback?: RGB): RGB {
    let value = this.colors.get(property)
    if (!value) {
      const source = property === "--clay-color" ? (this.options.owner ?? this.host) : this.host
      value = resolveColor(getComputedStyle(source).getPropertyValue(property), fallback)
      this.colors.set(property, value)
    }
    return value
  }

  /**
   * The canvas needs a positioned host. Decided on the first frame, once ui-sdk has styled its parts:
   * a popup or dialog in the top layer would turn `relative` into `absolute` and leave the viewport.
   */
  private place() {
    this.placed = true
    const { host } = this
    if (host.matches("[popover], [data-slot$='-content'], [data-slot='toast'], [data-slot='toast-region']")) return
    if (getComputedStyle(host).position !== "static") return
    host.style.position = "relative"
    this.cleanup.push(() => host.style.removeProperty("position"))
  }

  tick(dt: number, still: boolean) {
    if (!this.placed) this.place()
    // A closed popup or an empty toast stack: WebGL2 is running and draws it on its first visible frame,
    // so its CSS clay must not flash up for the frame it shows on.
    if (!this.ready && (!this.host.offsetWidth || !this.host.offsetHeight)) this.drawn()
    if (this.dirty || this.stale) {
      this.stale = false
      this.width = this.host.offsetWidth
      this.height = this.host.offsetHeight
      this.colors.clear()
      this.options.measure?.()
      const pad = typeof this.options.pad === "function" ? this.options.pad() : this.padding
      const p = typeof pad === "number" ? { left: pad, top: pad, right: pad, bottom: pad } : pad
      this.padding = p
      this.pad = Math.max(p.left, p.top, p.right, p.bottom)
      const style = this.canvas.style
      style.left = `${-p.left}px`
      style.top = `${-p.top}px`
      style.width = `${this.width + p.left + p.right}px`
      style.height = `${this.height + p.top + p.bottom}px`
    }
    let moving = this.hover.step(dt, SPRINGS.hover, still)
    moving = this.press.step(dt, SPRINGS.press, still) || moving
    moving = (this.options.step?.(dt, still) ?? false) || moving
    if (this.options.swell !== false) this.applySquash()
    return moving
  }

  private applySquash() {
    const swell = 1 + this.hover.x * CLAY.hoverSwell
    const squash = this.press.x * CLAY.pressSquash
    const sx = (swell * (1 + squash * 0.8)).toFixed(4)
    const sy = (swell * (1 - squash)).toFixed(4)
    if (sx !== this.lastSx) this.host.style.setProperty("--clay-sx", (this.lastSx = sx))
    if (sy !== this.lastSy) this.host.style.setProperty("--clay-sy", (this.lastSy = sy))
  }

  frame(): ClayFrame {
    // Calm, it's lit like the popup melted onto it, so the two sides of the joint match.
    const lean = this.pointer && !this.calmed ? CLAY.pointerLean * this.hover.x : 0
    let lx = CLAY.lightX
    let ly = CLAY.lightY
    if (this.pointer && lean > 0) {
      const dx = this.pointer.x / Math.max(this.width, 1) - 0.5
      const dy = this.pointer.y / Math.max(this.height, 1) - 0.5
      lx += Math.round(dx * 2 * lean * 100) / 100
      ly += Math.round(dy * 2 * lean * 100) / 100
    }
    return {
      shapes: this.options.shapes(),
      pointer: this.pointer && this.hover.x > 0.01 ? { ...this.pointer, strength: this.hover.x } : null,
      glow: this.calmed ? 0 : this.press.x * CLAY.glow,
      light: [lx, ly, CLAY.lightZ],
    }
  }

  drawn() {
    if (this.ready) return
    this.ready = true
    this.host.setAttribute("data-clay-ready", "")
  }

  lost() {
    this.ready = false
    this.host.removeAttribute("data-clay-ready")
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
    this.dirty = true
  }
}

/** The offset of an element inside a host, in untransformed layout px. */
function offsetWithin(el: HTMLElement, host: HTMLElement) {
  const a = el.getBoundingClientRect()
  const b = host.getBoundingClientRect()
  const sx = b.width / (host.offsetWidth || 1) || 1
  const sy = b.height / (host.offsetHeight || 1) || 1
  return { x: (a.left - b.left) / sx, y: (a.top - b.top) / sy, w: a.width / sx, h: a.height / sy }
}

export { ClaySurface, offsetWithin, type SurfaceOptions }
