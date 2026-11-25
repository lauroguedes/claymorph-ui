// Draws the social card of every page and the app icons with the real clay engine, and with `?save`
// stores them in public/ through the dev server. Run `npm run dev` and open /og.html?save.
import "@ui-sdk/core/web.css"
import "claymorph-ui/clay.css"
import type { RGB } from "../clay/color"
import { getClayEngine, type ClayShape } from "../clay/engine"
import { ClayElement, define } from "../clay/element"
import type { ClaySurface, SurfaceOptions } from "../clay/surface"
import { SITE } from "../site/content"
import { route, routes } from "../site/shell"

type Scene = (color: (name: string) => RGB) => ClayShape[]

/** A clay surface that draws whatever scene it's given. */
class OgClay extends ClayElement {
  protected readonly requires = ""
  scene: Scene = () => []

  get surface(): ClaySurface | undefined {
    return this.surfaces[0]
  }

  protected surfaceFor(): Array<[HTMLElement, SurfaceOptions]> {
    return [[this, { swell: false, pad: 48, shapes: () => this.scene((name) => this.surfaces[0]!.color(name)) }]]
  }
}

define("og-clay", OgClay)

const WIDTH = 1200
const HEIGHT = 630
const ACCENTS = ["--clay-teal", "--clay-lilac", "--clay-sky", "--clay-peach", "--clay-mint", "--clay-rose", "--clay-butter"]

const settle = () => new Promise((resolve) => setTimeout(resolve, 30))

/** A card's accent, from its name: a new page doesn't recolour the cards of the pages after it. */
function accentOf(key: string) {
  if (key === "home") return ACCENTS[0]!
  let hash = 0
  for (const char of key) hash = (hash * 31 + char.charCodeAt(0)) >>> 0
  return ACCENTS[hash % ACCENTS.length]!
}

/** Draws a scene on the clay surface right away, frames or not, and returns its canvas and pad. */
async function clay(el: OgClay, width: number, height: number, scene: Scene) {
  el.style.width = `${width}px`
  el.style.height = `${height}px`
  el.scene = scene
  await settle()
  const surface = el.surface!
  surface.visible = true
  surface.invalidate()
  // The engine draws on animation frames, which a hidden tab doesn't get: draw now instead.
  const engine = getClayEngine() as unknown as { frame(now: number): void }
  engine.frame(performance.now())
  engine.frame(performance.now() + 16)
  return { canvas: surface.canvas, pad: surface.pad }
}

/**
 * The brand mark at rest, `size` px across, with its top-left at x, y. Large, the bead sits on the
 * blob as its own piece: melted parts share one bevel, so a bead that small would come to a point.
 */
function mark(color: (name: string) => RGB, x: number, y: number, size: number, melted = true): ClayShape[] {
  const s = size / 32
  return [
    { x: x + (14 - 11.5) * s, y: y + (17.5 - 11.5) * s, w: 23 * s, h: 23 * s, radius: 11.5 * s, color: color("--clay-teal"), height: 1, lift: 0.9 },
    {
      x: x + ((melted ? 26.2 : 24.6) - 4.6) * s,
      y: y + ((melted ? 6 : 7.6) - 4.6) * s,
      w: 9.2 * s,
      h: 9.2 * s,
      radius: 4.6 * s,
      color: color("--clay-lilac"),
      height: 1,
      lift: 0.9,
      melt: melted ? 3 * s : 0,
      blend: 4,
    },
  ]
}

/** A small interface of clay parts on the right of the card, its main part in the page's accent. */
const art =
  (accent: string): Scene =>
  (color) => [
    ...mark(color, 80, 62, 60),
    { x: 706, y: 118, w: 420, h: 372, radius: 46, color: color("--clay-slate"), height: 0.85, bevel: 24, lift: 1.8 },
    { x: 1058, y: 74, w: 100, h: 100, radius: 50, color: color("--clay-peach"), height: 1, lift: 1.4 },
    { x: 752, y: 168, w: 226, h: 70, radius: 35, color: color(accent), height: 1, lift: 1.2 },
    { x: 990, y: 175, w: 56, h: 56, radius: 28, color: color("--clay-lilac"), height: 1, lift: 1.2, melt: 16, blend: 5 },
    { x: 752, y: 286, w: 330, h: 26, radius: 13, color: color("--clay-slate"), height: -0.9, bevel: 10 },
    { x: 752, y: 286, w: 214, h: 26, radius: 13, color: color(accent), height: 0.5, bevel: 10 },
    { x: 942, y: 275, w: 48, h: 48, radius: 24, color: color("--clay-knob"), height: 1, lift: 1 },
    { x: 752, y: 362, w: 112, h: 60, radius: 30, color: color("--clay-lilac"), height: 0.85, lift: 0.8 },
    { x: 811, y: 367, w: 50, h: 50, radius: 25, color: color("--clay-knob"), height: 1, lift: 0.9 },
    { x: 1012, y: 360, w: 54, h: 54, radius: 27, color: color("--clay-mint"), height: 1, lift: 1 },
    { x: 1060, y: 418, w: 34, h: 34, radius: 17, color: color("--clay-butter"), height: 1, lift: 1, melt: 14, blend: 5 },
  ]

/** Breaks text into lines no wider than `max`, at most `lines`, the last ending in an ellipsis if cut. */
function wrap(ctx: CanvasRenderingContext2D, text: string, max: number, lines: number) {
  const words = text.split(/\s+/)
  const out: string[] = []
  let line = ""
  for (const word of words) {
    const next = line ? `${line} ${word}` : word
    if (ctx.measureText(next).width <= max) line = next
    else {
      out.push(line)
      line = word
    }
  }
  if (line) out.push(line)
  if (out.length <= lines) return out
  const kept = out.slice(0, lines)
  let last = kept[lines - 1]!
  while (ctx.measureText(`${last}…`).width > max && last.includes(" ")) last = last.slice(0, last.lastIndexOf(" "))
  kept[lines - 1] = `${last}…`
  return kept
}

function card(clayCanvas: HTMLCanvasElement, pad: number, text: { eyebrow: string; heading: string; description: string }) {
  const canvas = document.createElement("canvas")
  canvas.width = WIDTH
  canvas.height = HEIGHT
  const ctx = canvas.getContext("2d")!
  ctx.fillStyle = "#151a22"
  ctx.fillRect(0, 0, WIDTH, HEIGHT)
  for (const [x, y, r, rgba] of [
    [980, 120, 640, "rgba(143, 211, 214, 0.12)"],
    [160, 700, 620, "rgba(196, 168, 240, 0.1)"],
  ] as const) {
    const glow = ctx.createRadialGradient(x, y, 0, x, y, r)
    glow.addColorStop(0, rgba)
    glow.addColorStop(1, "rgba(0, 0, 0, 0)")
    ctx.fillStyle = glow
    ctx.fillRect(0, 0, WIDTH, HEIGHT)
  }
  ctx.drawImage(clayCanvas, -pad, -pad, WIDTH + pad * 2, HEIGHT + pad * 2)

  ctx.textBaseline = "alphabetic"
  ctx.fillStyle = "#eef2f6"
  ctx.font = '800 36px Nunito'
  ctx.fillText(SITE.name, 156, 106)

  ctx.fillStyle = "#8fd3d6"
  ctx.font = '700 21px "JetBrains Mono"'
  ctx.letterSpacing = "2px"
  ctx.fillText(text.eyebrow.toUpperCase(), 80, 238)
  ctx.letterSpacing = "0px"

  let size = 72
  let lines: string[] = []
  for (; size >= 48; size -= 6) {
    ctx.font = `900 ${size}px Nunito`
    lines = wrap(ctx, text.heading, 600, 3)
    if (lines.length <= (size >= 60 ? 2 : 3) && !lines.at(-1)!.endsWith("…")) break
  }
  ctx.fillStyle = "#ffffff"
  let y = 238 + size * 1.15
  for (const line of lines) {
    ctx.fillText(line, 78, y)
    y += size * 1.08
  }

  ctx.fillStyle = "#b4c0cd"
  ctx.font = '600 26px Nunito'
  y += 8
  for (const line of wrap(ctx, text.description, 570, lines.length <= 2 ? 3 : 2)) {
    ctx.fillText(line, 80, y)
    y += 38
  }

  ctx.fillStyle = "#7f8ea0"
  ctx.font = '700 22px Nunito'
  ctx.fillText(new URL(SITE.url).host, 80, 586)
  return canvas
}

function icon(clayCanvas: HTMLCanvasElement, pad: number, size: number, art: number) {
  const canvas = document.createElement("canvas")
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext("2d")!
  ctx.fillStyle = "#161b23"
  ctx.fillRect(0, 0, size, size)
  ctx.drawImage(clayCanvas, -pad, -pad, art + pad * 2, art + pad * 2)
  return canvas
}

const blob = (canvas: HTMLCanvasElement, type: string) =>
  new Promise<Blob>((resolve) => canvas.toBlob((b) => resolve(b!), type, 0.9))

async function save(path: string, canvas: HTMLCanvasElement, type: string) {
  await fetch(`/__og/${path}`, { method: "POST", body: await blob(canvas, type) })
}

async function main() {
  const status = document.querySelector("#status")!
  const out = document.querySelector("#out")!
  const saving = new URLSearchParams(location.search).has("save")
  await Promise.all([
    document.fonts.load('800 36px Nunito'),
    document.fonts.load('900 72px Nunito'),
    document.fonts.load('600 26px Nunito'),
    document.fonts.load('700 22px Nunito'),
    document.fonts.load('700 21px "JetBrains Mono"'),
  ])
  await customElements.whenDefined("og-clay")
  await settle()
  const el = document.querySelector<OgClay>("og-clay")!

  const cards = [
    ...new Map(
      routes().map((path) => {
        const view = route(path)
        return [view.og, { key: view.og, ...view.card, description: view.description }]
      })
    ).values(),
    {
      key: "showcase",
      eyebrow: "Showcase",
      heading: "Clay Tunes",
      description: `A music app built only from ${SITE.name} components: navigation, player, charts, settings and more.`,
    },
  ]
  for (const [index, item] of cards.entries()) {
    const { canvas, pad } = await clay(el, WIDTH, HEIGHT, art(accentOf(item.key)))
    const image = card(canvas, pad, item)
    out.append(image)
    if (saving) await save(`og/${item.key}.jpg`, image, "image/jpeg")
    status.textContent = `${index + 1} of ${cards.length} cards`
  }

  for (const [name, size] of [["apple-touch-icon", 180], ["icon-192", 192], ["icon-512", 512]] as const) {
    const markSize = Math.round(size * 0.62)
    const offset = (size - markSize) / 2
    const { canvas, pad } = await clay(el, size, size, (color) => mark(color, offset, offset + size * 0.02, markSize, false))
    const image = icon(canvas, pad, size, size)
    out.append(image)
    if (saving) await save(`${name}.png`, image, "image/png")
  }
  status.textContent = saving ? `Saved ${cards.length} cards and 3 icons to public/` : `Drew ${cards.length} cards. Add ?save to store them.`
  document.documentElement.dataset.done = "true"
}

void main()
