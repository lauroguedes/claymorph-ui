import type { RGB } from "./color"
import type { ClayShape } from "./engine"
import { clamp, lerp, lerpBox, watch, type Box } from "./shared"
import { Spring } from "./spring"
import { offsetWithin, type ClaySurface, type SurfaceOptions } from "./surface"

interface AttachOptions {
  /** The element whose clay the popup grows out of. */
  trigger: () => HTMLElement | null
  /** The trigger's corner radius, from its measured box. */
  triggerRadius: (box: Box) => number
  triggerColor: () => RGB
  color: () => RGB
  radius: number
  bevel: number
  lift: number
  /** How far the popup melts into the trigger, from 0, a slight waist, to 1, one body. Asked every frame. */
  fuse?: () => number
  /** Holds the trigger's clay still while the popup is melted onto it. */
  calm?: (on: boolean) => void
  /** The popup has tucked back into the trigger. */
  onTuck?: () => void
}

/**
 * How far attached parts melt into each other, in px. Across the small gap they're placed at, it
 * bridges them into one body, deep enough that the edge of one flows into the other instead of
 * shading a line between them.
 */
const GLUE = 30

/** How far a part pokes out, in px, before it's fully melted on. */
const GRIP = GLUE * 0.67

/** How far colour runs across the joint, in px, so a button and a popup of different colours blend. */
const BLEND = 9

/** Opening overshoots a little, like Roll's bead; tucking back in eases all the way, so it can't flicker. */
const OUT = { omega: 13, zeta: 0.6 }
const BACK = { omega: 15, zeta: 1 }

/**
 * Closing aims a little past all the way in, so the popup slips into its trigger at a steady pace
 * instead of creeping up on the edge.
 */
const PAST = -0.08

/** How far the popup still pokes out, in px, when it counts as back inside and the trigger bounces. */
const TUCKED = 4

const smooth = (edge0: number, edge1: number, x: number) => {
  const t = clamp((x - edge0) / (edge1 - edge0), 0, 1)
  return t * t * (3 - 2 * t)
}

/** Which edge of the trigger a popup comes out of. */
interface Face {
  vertical: boolean
  /** 1 out of the bottom or right edge, -1 out of the top or left. */
  sign: 1 | -1
}

function faceOf(t: Box, popup: Box): Face {
  const dx = popup.x + popup.w / 2 - (t.x + t.w / 2)
  const dy = popup.y + popup.h / 2 - (t.y + t.h / 2)
  const vertical = Math.abs(dy) / Math.max(t.h + popup.h, 1) >= Math.abs(dx) / Math.max(t.w + popup.w, 1)
  return { vertical, sign: (vertical ? dy : dx) > 0 ? 1 : -1 }
}

/** How deep into the trigger the popup starts, in px: just enough to melt on, not enough to show through. */
const INSET = 6

/**
 * Where the popup starts: a thin sliver just inside the trigger's edge that faces it. It only ever
 * grows outward from there, so nothing of it shows through the button or climbs up beside it.
 */
function seed(t: Box, popup: Box, face = faceOf(t, popup)): Box {
  if (face.vertical) {
    const w = Math.min(t.w, popup.w) * 0.5
    const x = clamp(popup.x + popup.w / 2, t.x + w / 2, t.x + t.w - w / 2) - w / 2
    return { x, y: face.sign > 0 ? t.y + t.h - INSET : t.y, w, h: INSET }
  }
  const h = Math.min(t.h, popup.h) * 0.5
  const y = clamp(popup.y + popup.h / 2, t.y + h / 2, t.y + t.h - h / 2) - h / 2
  return { x: face.sign > 0 ? t.x + t.w - INSET : t.x, y, w: INSET, h }
}

/** How far a box pokes out past the trigger's facing edge, in px. */
function poke(t: Box, box: Box, face: Face) {
  if (face.vertical) return face.sign > 0 ? box.y + box.h - (t.y + t.h) : t.y - box.y
  return face.sign > 0 ? box.x + box.w - (t.x + t.w) : t.x - box.x
}

/**
 * A popup that grows out of its trigger like Roll's bead: it squeezes out of the button, stays melted
 * onto it while open, and slips back in as it closes, when the button gives a little bounce. It's drawn
 * on the popup, which sits in the top layer, with the trigger as a ghost so the real button shows
 * through; the trigger melts the popup into its own clay too, so the joint has no seam.
 */
class Attachment {
  readonly emerge = new Spring(0)
  private trigger: Box | null = null
  private size = { w: 0, h: 0 }
  private reach = 40
  private tucked = true
  private readonly content: HTMLElement
  private readonly options: AttachOptions
  private readonly surface: () => ClaySurface | undefined

  constructor(content: HTMLElement, options: AttachOptions, surface: () => ClaySurface | undefined) {
    this.content = content
    this.options = options
    this.surface = surface
  }

  /** Whether the popup's clay is out of the trigger at all. */
  get out() {
    return !this.tucked
  }

  /** Follows the popup opening and closing. Returns a function that stops. */
  connect() {
    const content = this.content
    const sync = () => {
      const open = content.hasAttribute("data-open") && !content.hasAttribute("data-ending-style")
      const surface = this.surface()
      if (open && this.emerge.target <= 0) {
        if (surface) {
          // The canvas still holds the popup as it last looked; wipe it before the first frame paints it.
          surface.ctx.clearRect(0, 0, surface.canvas.width, surface.canvas.height)
          surface.key = ""
          // An opening popup is on screen: don't wait frames for the visibility observer to say so.
          surface.visible = true
        }
        this.tucked = false
        this.options.calm?.(true)
      }
      this.emerge.target = open ? 1 : PAST
      surface?.invalidate()
    }
    const scroll = () => this.surface()?.invalidate()
    addEventListener("scroll", scroll, { passive: true, capture: true })
    const stop = watch(content, ["data-open", "data-ending-style", "data-side"], sync)
    sync()
    return () => {
      stop()
      removeEventListener("scroll", scroll, { capture: true })
      this.options.calm?.(false)
    }
  }

  surfaceOptions(): SurfaceOptions {
    return {
      swell: false,
      // Lit like the trigger, which is calm while they're melted together, so the joint matches.
      calm: true,
      pad: () => this.reach,
      measure: () => this.measure(),
      step: (dt, still) => {
        const back = this.emerge.target <= 0
        // Hidden before it tucked back in: the trigger mustn't go on drawing its side of the joint alone.
        if (back && !this.tucked && !this.content.getClientRects().length) this.emerge.set(PAST)
        const moving = this.emerge.step(dt, back ? BACK : OUT, still)
        if (back && !this.tucked && (this.place()?.poke ?? 0) <= TUCKED) {
          this.tucked = true
          this.options.calm?.(false)
          this.options.onTuck?.()
        }
        // The trigger can still be easing out of its hover swell, and ui-sdk places the popup a frame
        // after it opens: keep measuring both while it's open or moving.
        if (moving || this.content.hasAttribute("data-open")) this.surface()!.stale = true
        return moving
      },
      shapes: () => this.shapes(),
    }
  }

  private measure() {
    const content = this.content
    const trigger = this.options.trigger()
    // Closed and hidden: keep the last boxes so the popup can tuck back in.
    if (!trigger || content.getBoundingClientRect().width === 0) return
    const t = offsetWithin(trigger, content)
    const last = this.trigger
    this.trigger = t
    const w = content.offsetWidth
    const h = content.offsetHeight
    this.size = { w, h }
    this.reach = Math.ceil(Math.max(32, -t.x, -t.y, t.x + t.w - w, t.y + t.h - h) + 32)
    // The trigger draws its side of the joint before this runs; give it another frame to catch up.
    const moved = !last || [t.x - last.x, t.y - last.y, t.w - last.w, t.h - last.h].some((d) => Math.abs(d) > 0.02)
    if (moved) this.surface()?.wake()
  }

  /** Where the popup's clay is right now, straight from the spring, and how far it pokes out of the trigger. */
  private place() {
    const t = this.trigger
    if (!t || !this.size.w) return null
    const e = clamp(this.emerge.x, 0, 1.15)
    const full = { x: 0, y: 0, w: this.size.w, h: this.size.h }
    const face = faceOf(t, full)
    const box = lerpBox(seed(t, full, face), full, e)
    return { box, e, poke: poke(t, box, face) }
  }

  /**
   * The popup's clay, in the popup's coordinates. It wears its own colour all the way: the colour
   * blends across the joint, not over time. The trigger asks for it too, and keeps drawing it after
   * the popup itself is hidden.
   */
  private body() {
    const place = this.place()
    if (!place || place.poke <= 0) return null
    const { box, e, poke } = place
    // It melts on as it comes out, so nothing bulges out of the trigger before it does, or after it's back.
    const glue = GLUE * (1 + this.fuse)
    const melt = (glue + (1 - Math.min(e, 1)) * 10) * smooth(0, GRIP, poke)
    const shape: ClayShape = {
      ...box,
      radius: this.options.radius,
      color: this.options.color(),
      height: 0.85,
      bevel: this.options.bevel,
      lift: this.options.lift * Math.min(e, 1),
      melt: Math.max(melt, 0.01),
      blend: BLEND,
    }
    return { shape, poke }
  }

  private get fuse() {
    return clamp(this.options.fuse?.() ?? 0, 0, 1)
  }

  /**
   * Where the popup meets the trigger, a patch that flattens the clay: the trigger's edge and the
   * popup's would otherwise shade a crease across the joint however deep they melt.
   */
  private seam(t: Box, shape: ClayShape): ClayShape | null {
    // Not while the popup is a thin lip: flattening the middle of it would leave a flat plate.
    const strength = smooth(0.3, 1, this.emerge.x)
    if (strength < 0.01) return null
    const face = faceOf(t, shape)
    const [tl, tw, sl, sw] = face.vertical ? [t.x, t.w, shape.x, shape.w] : [t.y, t.h, shape.y, shape.h]
    const lo = Math.max(tl, sl)
    const span = Math.min(tl + tw, sl + sw) - lo
    // Short of the sides, so the silhouette keeps its rounded edge where the two meet.
    const inset = Math.min(16, span / 4)
    const edge = face.vertical ? (face.sign > 0 ? t.y + t.h : t.y) : face.sign > 0 ? t.x + t.w : t.x
    const near = face.vertical ? (face.sign > 0 ? shape.y : shape.y + shape.h) : face.sign > 0 ? shape.x : shape.x + shape.w
    // Into the trigger a little, and into the popup as deep as its edge is rounded, or what's left of
    // the edge still shades a line below the patch.
    const toward = face.sign > 0 ? [12, 24] : [24, 12]
    const from = Math.min(edge, near) - toward[0]!
    const depth = Math.abs(edge - near) + toward[0]! + toward[1]!
    const across = { at: lo + inset, size: Math.max(span - inset * 2, 0) }
    return {
      ...(face.vertical
        ? { x: across.at, y: from, w: across.size, h: depth }
        : { x: from, y: across.at, w: depth, h: across.size }),
      radius: 10,
      color: shape.color,
      height: 0,
      melt: 0.01,
      blend: 7,
      flatten: strength,
    }
  }

  private shapes(): ClayShape[] {
    const t = this.trigger
    const body = this.body()
    if (!t || !body) return []
    const seam = this.seam(t, body.shape)
    return [
      {
        ...t,
        radius: this.options.triggerRadius(t),
        color: this.options.triggerColor(),
        height: 1,
        ghost: true,
        blend: BLEND,
      },
      body.shape,
      ...(seam ? [seam] : []),
    ]
  }

  /**
   * The popup melted into the trigger's own clay, in the trigger's coordinates, so both draw the same
   * joint and the same colour blend with no seam. It's a ghost there: the popup draws itself, shadow
   * and all, from its own canvas, and a second copy under it would show at its edges.
   */
  joint(host: HTMLElement): ClayShape[] {
    const t = this.trigger
    const body = this.body()
    if (!t || !body) return []
    const { shape } = body
    // The trigger can be squashed unevenly, as right after the press that opened it.
    const sx = t.w / (host.offsetWidth || t.w) || 1
    const sy = t.h / (host.offsetHeight || t.h) || 1
    const local = (s: ClayShape): ClayShape => ({ ...s, x: (s.x - t.x) / sx, y: (s.y - t.y) / sy, w: s.w / sx, h: s.h / sy })
    const seam = this.seam(t, shape)
    return [{ ...local(shape), lift: 0, ghost: true }, ...(seam ? [local(seam)] : [])]
  }
}

/** A `fuse` attribute: a number from 0 to 1, and 0 when it's missing or isn't a number. */
function fuseOf(el: Element) {
  const value = parseFloat(el.getAttribute("fuse") ?? "")
  return Number.isFinite(value) ? clamp(value, 0, 1) : 0
}

/**
 * Keeps the popup close enough to its trigger to stay melted on, and closer as they fuse, unless the
 * page chose a gap. Returns a function that fits it again.
 */
function hug(content: HTMLElement, fuse: () => number = () => 0) {
  const own = !content.hasAttribute("side-offset")
  const fit = () => {
    if (own) content.setAttribute("side-offset", String(Math.round(lerp(4, 0, fuse()))))
  }
  fit()
  return fit
}

export { Attachment, BACK, BLEND, faceOf, fuseOf, GLUE, GRIP, hug, OUT, PAST, poke, seed, smooth, TUCKED, type AttachOptions }
