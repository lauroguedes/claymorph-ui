import { luminance, resolveColor } from "./color"
import type { ClayShape } from "./engine"
import { ClaySurface, type SurfaceOptions } from "./surface"

const PRESETS = new Set([
  "neutral", "teal", "lilac", "sky", "peach", "mint", "butter", "rose", "slate", "ink",
])

const NEUTRAL: [number, number, number] = [0.86, 0.89, 0.92]

/** Luminance of --clay-text in the light theme, the ink that light clay carries. */
const INK = 0.022

const live = new Set<ClayElement>()
let themeWatch = false

function watchTheme() {
  if (themeWatch) return
  themeWatch = true
  const refresh = () => requestAnimationFrame(() => live.forEach((element) => element.refreshTone()))
  if (typeof matchMedia === "function") matchMedia("(prefers-color-scheme: dark)").addEventListener("change", refresh)
  new MutationObserver(refresh).observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-theme", "class", "style"],
  })
}

/**
 * A host that gives its ui-sdk children a clay body. Behaviour stays in the children;
 * the element only adds the material and the motion, and works without WebGL2.
 */
abstract class ClayElement extends HTMLElement {
  static observedAttributes = ["color"]
  protected surfaces: ClaySurface[] = []
  /** Shapes another element melts into this one's clay, like a tooltip growing out of it. */
  readonly joints = new Set<() => ClayShape[]>()

  /** Holds the clay still while something is melted onto it. */
  calm(on: boolean) {
    for (const surface of this.surfaces) surface.calm(on)
  }

  /** Squashes the clay and lets it spring back, as when something tucks back into it. */
  bounce(strength = 1) {
    this.surfaces[0]?.bounce(strength)
  }
  private started = false
  private waiting: MutationObserver | null = null

  /** A selector that must match inside the host before setup runs; empty for none. */
  protected abstract readonly requires: string
  /** Wires behaviour. Runs once per connection, with or without WebGL2. */
  protected setup(): void {}
  protected teardown(): void {}
  /** Surfaces to attach once setup ran. Each returns null without WebGL2. */
  protected abstract surfaceFor(): Array<[HTMLElement, SurfaceOptions]>

  connectedCallback() {
    queueMicrotask(() => this.start())
  }

  disconnectedCallback() {
    this.waiting?.disconnect()
    this.waiting = null
    if (!this.started) return
    this.started = false
    live.delete(this)
    this.teardown()
    for (const surface of this.surfaces) surface.destroy()
    this.surfaces = []
  }

  attributeChangedCallback(name: string, _old: string | null, value: string | null) {
    if (name === "color") {
      if (value === null) this.style.removeProperty("--clay-color")
      else this.style.setProperty("--clay-color", PRESETS.has(value) ? `var(--clay-${value})` : value)
      if (this.started) this.updateTone()
    }
    this.invalidate()
  }

  protected invalidate() {
    for (const surface of this.surfaces) surface.invalidate()
  }

  refreshTone() {
    this.updateTone()
  }

  /** Sets data-tone so text stays readable on whatever colour the clay is. */
  protected updateTone() {
    const css = getComputedStyle(this).getPropertyValue("--clay-color")
    if (!css.trim()) return
    const l = luminance(resolveColor(css))
    const onWhite = 1.05 / (l + 0.05)
    const onInk = (l + 0.05) / (INK + 0.05)
    this.dataset.tone = onWhite > onInk ? "dark" : "light"
  }

  private start() {
    if (!this.isConnected || this.started) return
    if (this.requires && !this.querySelector(this.requires)) {
      if (!this.waiting) {
        this.waiting = new MutationObserver(() => this.start())
        this.waiting.observe(this, { childList: true, subtree: true })
      }
      return
    }
    this.waiting?.disconnect()
    this.waiting = null
    this.started = true
    live.add(this)
    watchTheme()
    this.updateTone()
    this.setup()
    for (const [host, options] of this.surfaceFor()) this.attach(host, options)
  }

  /** Adds a surface after setup, for parts that come and go, like toasts. */
  protected attach(host: HTMLElement, options: SurfaceOptions) {
    const surface = ClaySurface.attach(host, { owner: this, ...options })
    if (surface) this.surfaces.push(surface)
    return surface
  }

  protected detach(surface: ClaySurface) {
    surface.destroy()
    this.surfaces = this.surfaces.filter((other) => other !== surface)
  }
}

function define(tag: string, element: CustomElementConstructor) {
  if (typeof customElements !== "undefined" && !customElements.get(tag)) customElements.define(tag, element)
}

export { ClayElement, define, NEUTRAL }
