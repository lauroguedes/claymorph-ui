import { smooth } from "./attach"
import { mix, type RGB } from "./color"
import type { ClayShape, Padding } from "./engine"
import { Follow } from "./follow"
import { clamp, lerp, watch, type Box } from "./shared"
import { Spring, type SpringConfig } from "./spring"
import { offsetWithin, type ClaySurface, type SurfaceOptions } from "./surface"

interface FlightOptions {
  /** The button the popup flies out of and back into. */
  trigger: () => HTMLElement | null
  /** The button's clay as it's drawn now, from its measured box: its corners and how high it stands. */
  triggerShape: (box: Box) => { radius: number; height: number }
  triggerColor: () => RGB
  color: () => RGB
  radius: number
  bevel: number
  lift: number
  /** The clay has flown back into the button. */
  onLand?: () => void
  /**
   * The bead is joined to the button by its neck, or has let go. Both sides of the neck must look
   * alike meanwhile, so nothing should dim or blur the button, like a dialog's backdrop.
   */
  onJoin?: (joined: boolean) => void
}

/** Leaving its button, the clay is a bead this big next to the button's height. */
const BEAD = 0.7

/** How far along its way the bead starts to swell, and, closing, how small it shrinks before it flies back. */
const SWELL_AT = 0.35
const RETURN_AT = 0.4

/** How far out of the button the bead is pulled before it flies off, and, back, how close it gets before it's drawn in. */
const LAUNCH_AT = 0.85
const DRAW_IN_AT = 0.12

/** Pulled out, the bead wobbles on its neck; drawn back in, it eases all the way. */
const PULL: SpringConfig = { omega: 15, zeta: 0.55 }
const PULL_BACK: SpringConfig = { omega: 16, zeta: 1 }

/** Out, it flies with almost no overshoot and swells with a wobble; back, both ease all the way. */
const FLY: SpringConfig = { omega: 11, zeta: 0.85 }
const GROW: SpringConfig = { omega: 12, zeta: 0.62 }
const BACK: SpringConfig = { omega: 14, zeta: 1 }

/** Closing aims a little past the button, so the bead lands at a steady pace instead of creeping in. */
const PAST = -0.06

/** Room around the popup for its shadow, once it has settled. */
const PAD = 40

/** How fast the bead stretches along its path, per px/s. */
const STRETCH = 0.00022

/** How long the bead's tail of droplets gets, per px/s it flies at, up to this many beads long. */
const TAIL = 0.026
const MAX_TAIL = 1.25

/** How far the bead melts into the button and its droplets into it, in px, while it's small. */
const NECK = 18
const DRIP = 16

/** Until the bead is this far on its way, it's still joined to the button: both draw the neck. */
const JOINED = 0.3

/** Swelling, the slab wobbles wide and tall from the spring's own speed, like the logo's blob. */
const WOBBLE = 0.022
const MAX_WOBBLE = 0.09

interface Drop {
  x: number
  y: number
  /** Diameter. */
  d: number
}

/** Where a line from a box's middle along (ux, uy) leaves it, a little inside its edge; its middle without one. */
function exit(t: Box, ux: number, uy: number) {
  const hx = t.w / 2
  const hy = t.h / 2
  if (!ux && !uy) return { x: t.x + hx, y: t.y + hy }
  const reach = Math.min(ux ? hx / Math.abs(ux) : Infinity, uy ? hy / Math.abs(uy) : Infinity)
  const inside = Math.min(hx, hy) * 0.35
  return { x: t.x + hx + ux * (reach - inside), y: t.y + hy + uy * (reach - inside) }
}

const round = ({ x, y, d }: Drop): Box => ({ x: x - d / 2, y: y - d / 2, w: d, h: d })

/**
 * A popup that flies out of a button away from it, like a dialog in the middle of the page, and moves
 * like the logo: the button's own clay swells and a bead is pulled out of it on a neck that stretches
 * and lets go. The bead flies off dripping a tail of droplets that run back into it as it slows, and
 * swells into the popup, wobbling wide and tall. Its contents fade in once it's nearly full size.
 * Closing runs it all back: it shrinks to a bead, flies home with its tail behind, and is drawn back
 * into the button's clay, which bounces. While they're joined, the button draws its side of the neck
 * in its own clay and the popup draws the bead, which flies over everything from the top layer; the
 * popup's canvas reaches as far as the button only while it flies.
 */
class Flight {
  readonly fly = new Spring(0)
  readonly grow = new Spring(0)
  /** The bead drawn out of the button on its neck, before it flies. */
  readonly pull = new Spring(0)
  private open = false
  private landed = true
  private trigger: Box | null = null
  private size = { w: 0, h: 0 }
  /** Room for the canvas on each side: only toward the button reaches far, and only while it flies. */
  private reach: Padding = { left: PAD, top: PAD, right: PAD, bottom: PAD }
  private lastGrow = ""
  private joined = false
  /** How far the contents have faded in: opening, never back, though the clay wobbles under them. */
  private shown = 0
  private readonly content: HTMLElement
  private readonly options: FlightOptions
  private readonly surface: () => ClaySurface | undefined
  /** Once it has landed, the popup's box on springs, so it swells and shrinks as its contents change. */
  private readonly follow: Follow

  constructor(content: HTMLElement, options: FlightOptions, surface: () => ClaySurface | undefined) {
    this.content = content
    this.options = options
    this.surface = surface
    this.follow = new Follow(content)
  }

  /** Whether any of the popup's clay is out of the button. */
  get out() {
    return !this.landed
  }

  /** Follows the popup opening and closing. Returns a function that stops. */
  connect() {
    const content = this.content
    const sync = () => {
      const open = content.hasAttribute("data-open") && !content.hasAttribute("data-ending-style")
      const surface = this.surface()
      if (open && !this.open && this.landed && surface) {
        // The canvas still holds the popup as it last looked; wipe it before the first frame paints it.
        surface.ctx.clearRect(0, 0, surface.canvas.width, surface.canvas.height)
        surface.key = ""
        surface.visible = true
        // Its contents wait for the clay. Only with a surface: without WebGL2 they show as they are.
        this.paint()
      }
      if (open) this.landed = false
      this.open = open
      surface?.invalidate()
    }
    const stop = watch(content, ["data-open", "data-ending-style"], sync)
    sync()
    return () => {
      stop()
      this.follow.release()
      content.style.removeProperty("--clay-grow")
      if (this.joined) this.options.onJoin?.(false)
      this.joined = false
    }
  }

  surfaceOptions(): SurfaceOptions {
    return {
      swell: false,
      calm: true,
      pad: () => this.reach,
      measure: () => this.measure(),
      step: (dt, still) => this.step(dt, still),
      shapes: () => this.shapes(),
    }
  }

  private step(dt: number, still: boolean) {
    // Out: it's pulled out of the button, flies once it's out, and swells once it's on its way. Back:
    // it shrinks, flies home once it's small, and is drawn back in once it's there.
    if (this.open) {
      this.pull.target = 1
      if (this.pull.x > LAUNCH_AT || still) this.fly.target = 1
      if (this.fly.x > SWELL_AT || still) this.grow.target = 1
    } else {
      this.grow.target = PAST
      if (this.grow.x < RETURN_AT || still) this.fly.target = PAST
      if (this.fly.x < DRAW_IN_AT || still) this.pull.target = PAST
    }
    // Hidden before it landed: don't leave the bead hanging where the popup was.
    if (!this.open && !this.landed && !this.content.getClientRects().length) {
      for (const spring of [this.pull, this.fly, this.grow]) spring.set(PAST)
    }
    const moving = [
      this.pull.step(dt, this.open ? PULL : PULL_BACK, still),
      this.fly.step(dt, this.open ? FLY : BACK, still),
      this.grow.step(dt, this.open ? GROW : BACK, still),
      this.follow.step(dt, still),
    ].some(Boolean)
    if (!this.open && !this.landed && this.pull.x <= 0.02 && this.fly.x <= 0.02 && this.grow.x <= 0.05) {
      this.landed = true
      // Its contents were last cut as it closed; uncut, they open whole next time.
      this.follow.release()
      this.options.onLand?.()
    }
    const joined = !this.landed && !!this.trigger && this.fly.x < JOINED
    if (joined !== this.joined) {
      this.joined = joined
      this.options.onJoin?.(joined)
    }
    this.paint()
    // The canvas reaches back to the button while the clay flies: measure it every frame meanwhile.
    if (moving) this.surface()!.stale = true
    return moving
  }

  /** Lets the popup's contents fade in as the clay swells, from `--clay-grow`. */
  private paint() {
    const now = clamp(this.grow.x, 0, 1)
    this.shown = this.open ? Math.max(this.shown, now) : now
    const grow = this.shown.toFixed(3)
    if (grow === this.lastGrow) return
    this.lastGrow = grow
    this.content.style.setProperty("--clay-grow", grow)
  }

  private measure() {
    const content = this.content
    // Closed and hidden: keep the last boxes so the bead can fly home.
    if (content.getBoundingClientRect().width === 0) return
    this.size = { w: content.offsetWidth, h: content.offsetHeight }
    // A button off screen, as when ⌘K opens a palette, is no place to fly from: it swells in place.
    const trigger = this.options.trigger()
    const t = trigger?.getBoundingClientRect()
    const shown = !!t && t.width > 0 && t.bottom > 0 && t.right > 0 && t.top < innerHeight && t.left < innerWidth
    this.trigger = shown ? offsetWithin(trigger!, content) : null
    const { w, h } = this.size
    const settled = this.pull.x >= 0.999 && this.fly.x >= 0.999 && this.grow.x >= 0.999
    // Landed, it follows its contents on a spring, as a palette's list narrows; on its way, at once.
    this.follow.measure(this.open && settled)
    const boxes = [this.place()?.box, this.follow.box(), settled ? null : this.trigger].filter((box): box is Box => !!box)
    // In steps, so the canvas isn't resized on every frame of the flight.
    const side = (over: (b: Box) => number) => Math.ceil((Math.max(0, ...boxes.map(over)) + PAD) / 32) * 32
    this.reach = {
      left: side((b) => -b.x),
      top: side((b) => -b.y),
      right: side((b) => b.x + b.w - w),
      bottom: side((b) => b.y + b.h - h),
    }
  }

  /**
   * Where the clay is right now, in the popup's coordinates: the bead or slab, the droplets dripping
   * behind it, and how far it has swollen.
   */
  private place() {
    // Where it lands: its own box, which swells and shrinks on a spring once it's there.
    const full = this.follow.box()
    const { w: W, h: H } = full
    if (!W || !H) return null
    const to = { x: full.x + W / 2, y: full.y + H / 2 }
    // Without a button on screen, it swells out of a bead in its own middle.
    const t = this.trigger ?? { x: to.x - 22, y: to.y - 22, w: 44, h: 44 }
    const dx = to.x - (t.x + t.w / 2)
    const dy = to.y - (t.y + t.h / 2)
    const length = Math.hypot(dx, dy) || 1
    const ux = dx / length
    const uy = dy / length
    // It leaves through the button's edge that faces the popup, and comes home the same way.
    const from = exit(t, ux, uy)
    const pull = clamp(this.pull.x, 0, 1.2)
    const f = clamp(this.fly.x, 0, 1.1)
    const g = Math.max(this.grow.x, 0)
    const grown = clamp(g, 0, 1)
    const bead = Math.min(t.h, 56) * BEAD
    // Pulled out about its own size before it flies: there it hangs on its neck.
    const out = { x: from.x + ux * bead * 0.95, y: from.y + uy * bead * 0.95 }
    const along = (k: number) => ({ x: lerp(out.x, to.x, k), y: lerp(out.y, to.y, k) })

    // It swells out of the button's edge as it's pulled, instead of fading in, and shrinks back into it.
    const size = bead * smooth(0, 0.7, pull)
    let w = lerp(size, W, g)
    let h = lerp(size, H, g)
    // In flight it stretches along its path, the less the bigger it is.
    const stretch = clamp(Math.abs(this.fly.v) * length * STRETCH, 0, 0.32) * (1 - grown)
    w *= 1 + stretch * (Math.abs(ux) - Math.abs(uy) * 0.5)
    h *= 1 + stretch * (Math.abs(uy) - Math.abs(ux) * 0.5)
    // Swelling, it wobbles wide and tall from the spring's own speed.
    const wobble = clamp(this.grow.v * WOBBLE, -MAX_WOBBLE, MAX_WOBBLE) * smooth(0.2, 1, grown)
    w *= 1 + wobble
    h *= 1 - wobble
    const at = f > 0 ? along(f) : { x: lerp(from.x, out.x, pull), y: lerp(from.y, out.y, pull) }
    const box = { x: at.x - w / 2, y: at.y - h / 2, w, h }

    // In flight, droplets drip off behind it in a tail as long as it's fast, and slowing down, they
    // run back into it, as the logo's bead melts into its blob. They're gone by the time it swells.
    // Near either end of its path the neck takes over, so the tail runs in before it gets there.
    const speed = Math.abs(this.fly.v) * length
    const tail = Math.min(speed * TAIL, bead * MAX_TAIL) * (1 - smooth(0.2, 0.6, grown)) * smooth(0, 0.15, f)
    // Behind it, whichever way it flies: toward the button on the way out, toward the popup on the way back.
    const heading = this.fly.v < 0 ? -1 : 1
    const back = (k: number) => ({ x: at.x - ux * heading * tail * k, y: at.y - uy * heading * tail * k })
    const drops = tail > 1 ? [{ ...back(0.62), d: bead * 0.56 }, { ...back(1.15), d: bead * 0.34 }] : []
    return {
      box,
      drops,
      grown,
      bead,
    }
  }

  /**
   * The clay as solid parts, in the popup's coordinates: the bead or slab, and its droplets, each
   * melted into what comes before it, the button first while they're joined.
   */
  private parts() {
    const place = this.place()
    if (!place || this.landed) return null
    const { box, drops, grown, bead } = place
    const triggerColor = this.options.triggerColor()
    const color = mix(triggerColor, this.options.color(), smooth(0.15, 0.85, grown))
    const small = 1 - grown
    const edge = Math.min(box.w, box.h) / 2
    return {
      // Close to the button it's still one body with it, which the button draws its side of.
      joined: !!this.trigger && this.fly.x < JOINED,
      body: {
        ...box,
        radius: Math.min(lerp(edge, this.options.radius, smooth(0.3, 1, grown)), edge),
        color,
        height: 0.85,
        bevel: lerp(bead * 0.4, this.options.bevel, grown),
        lift: lerp(0.9, this.options.lift, grown),
        melt: NECK * small + 0.01,
        blend: 6,
      } as ClayShape,
      drops: drops.map(
        (drop): ClayShape => ({ ...round(drop), radius: drop.d / 2, color, height: 0.85, bevel: drop.d * 0.4, lift: 0.9, melt: DRIP * small + 0.01, blend: 6 })
      ),
    }
  }

  /**
   * The popup's side: the bead or slab and its droplets. Joined to the button, the button is a ghost
   * the bead melts into, so its neck flows out of the real button, which shows through.
   */
  private shapes(): ClayShape[] {
    const parts = this.parts()
    if (!parts || parts.body.w < 0.5) return []
    const { joined, body, drops } = parts
    if (!joined) return [{ ...body, melt: 0 }, ...drops]
    const t = this.trigger!
    return [
      { ...t, ...this.options.triggerShape(t), color: this.options.triggerColor(), ghost: true },
      body,
      ...drops,
    ]
  }

  /**
   * The button's side of the joint, in its own coordinates: the bead and droplets as ghosts melted into
   * the button's clay. The button draws the neck in its own clay, so the bead is pulled out of it, not
   * laid on top of it.
   */
  joint(host: HTMLElement): ClayShape[] {
    const t = this.trigger
    const parts = this.parts()
    if (!t || !parts?.joined) return []
    // The button can be squashed unevenly, as right after the press that opened it.
    const sx = t.w / (host.offsetWidth || t.w) || 1
    const sy = t.h / (host.offsetHeight || t.h) || 1
    const local = (s: ClayShape): ClayShape => ({ ...s, x: (s.x - t.x) / sx, y: (s.y - t.y) / sy, w: s.w / sx, h: s.h / sy })
    return [parts.body, ...parts.drops].map((s) => ({ ...local(s), lift: 0, ghost: true }))
  }
}

export { Flight, type FlightOptions }
