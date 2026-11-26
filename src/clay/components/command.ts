import { ClayElement, NEUTRAL } from "../element"
import { Follow } from "../follow"
import { Highlight, withHighlight } from "../highlight"
import type { Box } from "../shared"
import type { ClaySurface, SurfaceOptions } from "../surface"
import { Field } from "./field"

/** Room around the slab for its shadow. */
const PAD = 36

/**
 * Summon: the search and list of a command palette. The search is carved like Type's field, and a well
 * slides between the commands as the highlight moves. On its own it's a clay slab that swells and
 * shrinks on a spring as typing narrows the list. In a dialog, the dialog is the slab: with `attached`
 * on `<clay-dialog>`, the palette flies out of its button and follows the list the same way.
 */
class ClayCommand extends ClayElement {
  protected readonly requires = "ui-command-input input"
  private field: Field | null = null
  private highlight: Highlight | null = null
  private follow: Follow | null = null
  private reach = PAD
  private cleanup: Array<() => void> = []

  /** What wears the search field's clay: the box around the input and its icon, if there is one. */
  private get fieldBox() {
    const box = this.querySelector("ui-command-input")?.parentElement
    return box && box.localName !== "ui-command" ? box : null
  }

  private get list() {
    return this.querySelector<HTMLElement>("ui-command-list")
  }

  /** In a dialog, the dialog draws the slab. */
  private get inDialog() {
    return !!this.closest("ui-dialog-content, [data-slot='dialog-content']")
  }

  /** The surface the slab and the well are drawn on. */
  private get panel(): ClaySurface | undefined {
    return this.surfaces[this.field ? 1 : 0]
  }

  protected setup() {
    const input = this.querySelector<HTMLInputElement>("ui-command-input input")!
    const box = this.fieldBox
    if (box) {
      this.field = new Field(box, input, () => this.surfaces[0])
      this.cleanup.push(this.field.connect())
    }
    this.highlight = new Highlight(this, "[data-slot='command-item']", () => this.list)
    this.cleanup.push(this.highlight.watch(() => this.panel?.invalidate()))
    // Scrolling moves the well, and typing narrows the list the slab follows.
    const changed = () => this.panel?.invalidate()
    const list = this.list
    list?.addEventListener("scroll", changed, { passive: true })
    input.addEventListener("input", changed)
    this.cleanup.push(() => {
      list?.removeEventListener("scroll", changed)
      input.removeEventListener("input", changed)
    })
    if (!this.inDialog) this.follow = new Follow(this)
  }

  protected teardown() {
    for (const fn of this.cleanup) fn()
    this.cleanup = []
    this.follow?.release()
    this.follow = null
    this.field = null
    this.highlight = null
  }

  /** On its own: a slab drawn to the command's box on springs, which cuts the command to it meanwhile. */
  private slab(): SurfaceOptions {
    const follow = this.follow!
    return {
      swell: false,
      pad: () => this.reach,
      measure: () => {
        follow.measure(true)
        const b: Box = follow.box()
        const over = Math.max(0, -b.x, -b.y, b.x + b.w - this.offsetWidth, b.y + b.h - this.offsetHeight)
        // In steps, so the canvas isn't resized on every frame as the slab swells.
        this.reach = Math.ceil((over + PAD) / 16) * 16
      },
      step: (dt, still) => {
        const moving = follow.step(dt, still)
        if (moving) this.panel!.stale = true
        return moving
      },
      shapes: () => [
        { ...follow.box(), radius: 26, color: this.panel!.color("--clay-popup", NEUTRAL), height: 0.85, bevel: 20, lift: 1.6 },
      ],
    }
  }

  protected surfaceFor(): Array<[HTMLElement, SurfaceOptions]> {
    const surfaces: Array<[HTMLElement, SurfaceOptions]> = []
    const box = this.fieldBox
    if (this.field && box) surfaces.push([box, this.field.surfaceOptions()])
    const base: SurfaceOptions = this.follow ? this.slab() : { swell: false, pad: 12, shapes: () => [] }
    surfaces.push([this, withHighlight(base, this.highlight, () => this.panel, null)])
    return surfaces
  }
}

export { ClayCommand }
