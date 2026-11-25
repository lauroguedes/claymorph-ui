import { mix, type RGB } from "./color"
import type { ClayShape } from "./engine"
import { NEUTRAL } from "./element"
import type { ClaySurface } from "./surface"

interface Box {
  x: number
  y: number
  w: number
  h: number
}

const SHADE: RGB = [0.1, 0.14, 0.2]

const deeper = (color: RGB, amount = 0.1) => mix(color, SHADE, amount)

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value))

/** Calls back whenever one of the attributes changes anywhere under a root. */
function watch(root: Element, attributes: string[], callback: () => void) {
  const observer = new MutationObserver(callback)
  observer.observe(root, { attributes: true, attributeFilter: attributes, subtree: true })
  return () => observer.disconnect()
}

/** A flat-topped slab filling the surface: cards, popups, toasts. */
function slab(surface: ClaySurface, color: string, radius: number, bevel: number, lift: number): ClayShape {
  return {
    x: 0,
    y: 0,
    w: surface.width,
    h: surface.height,
    radius,
    color: surface.color(color, NEUTRAL),
    height: 0.85,
    bevel,
    lift,
  }
}

/** A button body that swells under the pointer and squashes when pressed. */
function pressable(surface: ClaySurface, radius = surface.height / 2, color = "--clay-color"): ClayShape {
  const press = surface.press.x
  return {
    x: 0,
    y: 0,
    w: surface.width,
    h: surface.height,
    radius,
    color: surface.color(color, NEUTRAL),
    height: 1 - press * 0.4,
    lift: 1 + surface.hover.x * 0.3 - press * 0.55,
  }
}

/** A groove: a raised rim with a well pressed into it, `inset` px inside. */
function groove(
  surface: ClaySurface,
  box: { x: number; y: number; w: number; h: number },
  inset: number,
  radius = (box.h + inset * 2) / 2
): ClayShape[] {
  const body = surface.color("--clay-surface", NEUTRAL)
  return [
    {
      x: box.x - inset,
      y: box.y - inset,
      w: box.w + inset * 2,
      h: box.h + inset * 2,
      radius,
      color: body,
      height: 0.8,
      lift: 0.5,
    },
    { x: box.x, y: box.y, w: box.w, h: box.h, radius: Math.max(radius - inset, 2), color: deeper(body, 0.09), height: -0.9 },
  ]
}

const lerp = (a: number, b: number, t: number) => a + (b - a) * t

const lerpBox = (a: Box, b: Box, t: number): Box => ({
  x: lerp(a.x, b.x, t),
  y: lerp(a.y, b.y, t),
  w: lerp(a.w, b.w, t),
  h: lerp(a.h, b.h, t),
})

export { clamp, deeper, groove, lerp, lerpBox, pressable, SHADE, slab, watch, type Box }
