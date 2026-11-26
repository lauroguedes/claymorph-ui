import { Attachment, BLEND, fuseOf, hug } from "../attach"
import { ClayElement, NEUTRAL } from "../element"
import { Highlight, withHighlight } from "../highlight"
import { clamp, slab } from "../shared"
import type { SurfaceOptions } from "../surface"
import { Field, fieldRadius } from "./field"

let fields = 0

/**
 * Sift: a combobox carved like Type's field, whose list pours out under it and narrows as you type.
 * With `attached`, the list squeezes out of the field's rim and stays melted onto it, swelling and
 * shrinking on a spring as matches come and go, and the field's well gives as it tucks back in.
 */
class ClayCombobox extends ClayElement {
  static observedAttributes = ["color", "attached", "fuse"]
  protected readonly requires = "ui-combobox-input input"
  private field: Field | null = null
  private attachment: Attachment | null = null
  private highlight: Highlight | null = null
  private refit: () => void = () => {}
  private cleanup: Array<() => void> = []

  attributeChangedCallback(name: string, old: string | null, value: string | null) {
    super.attributeChangedCallback(name, old, value)
    if (name === "fuse") this.refit()
  }

  /** What wears the field's clay: the box that holds the input and its buttons. */
  private get fieldBox() {
    return this.querySelector("ui-combobox-input")!.parentElement!
  }

  private get content() {
    return this.querySelector<HTMLElement>("ui-combobox-content")
  }

  private get list() {
    return this.querySelector<HTMLElement>("ui-combobox-list")
  }

  protected setup() {
    const input = this.querySelector<HTMLInputElement>("ui-combobox-input input")!
    this.field = new Field(this.fieldBox, input, () => this.surfaces[0], {
      buttons: ":is(ui-combobox-trigger, ui-combobox-clear) > button",
      // The halo rings the whole melted body, list and all, and the field's canvas would cut it off
      // beside the list: while the list is out, the rim's colour alone shows the focus.
      halo: () => 1 - (this.attachment ? clamp(this.attachment.emerge.x, 0, 1) : 0),
      joint: (host) => this.attachment?.joint(host) ?? [],
      blend: () => (this.attachment ? BLEND : undefined),
      onInvalid: (invalid) => this.toggleAttribute("data-invalid", invalid),
    })
    this.cleanup.push(this.field.connect())

    const content = this.content
    if (!content) return
    // The list lines up with the whole field, buttons and all, not just the input inside it.
    const box = this.fieldBox
    if (!content.hasAttribute("anchor")) {
      box.id ||= `clay-combobox-field-${++fields}`
      content.setAttribute("anchor", `#${box.id}`)
    }
    this.highlight = new Highlight(content, "[data-slot='combobox-item']", () => this.list)
    this.cleanup.push(this.highlight.watch(() => this.surfaces[1]?.invalidate()))
    const scrolled = () => this.surfaces[1]?.invalidate()
    const list = this.list
    list?.addEventListener("scroll", scrolled, { passive: true })
    this.cleanup.push(() => list?.removeEventListener("scroll", scrolled))
    if (!this.hasAttribute("attached")) return
    this.refit = hug(content, () => fuseOf(this))
    this.attachment = new Attachment(
      content,
      {
        trigger: () => this.fieldBox,
        triggerRadius: (box) => fieldRadius(box.h),
        triggerColor: () => (this.surfaces[0] && this.field ? this.field.rim().color : NEUTRAL),
        color: () => this.surfaces[1]?.color("--clay-popup", NEUTRAL) ?? NEUTRAL,
        radius: 22,
        bevel: 16,
        lift: 1.3,
        fuse: () => fuseOf(this),
        resize: true,
        calm: (on) => this.surfaces[0]?.calm(on),
        onTuck: () => this.field?.give(),
      },
      () => this.surfaces[1]
    )
    this.cleanup.push(this.attachment.connect())
  }

  protected teardown() {
    for (const fn of this.cleanup) fn()
    this.cleanup = []
    this.field = null
    this.attachment = null
    this.highlight = null
  }

  protected surfaceFor(): Array<[HTMLElement, SurfaceOptions]> {
    const content = this.content
    const surfaces: Array<[HTMLElement, SurfaceOptions]> = [[this.fieldBox, this.field!.surfaceOptions()]]
    if (content) {
      const base: SurfaceOptions = this.attachment?.surfaceOptions() ?? {
        swell: false,
        pad: 36,
        shapes: () => [slab(this.surfaces[1]!, "--clay-popup", 22, 16, 1.4)],
      }
      surfaces.push([content, withHighlight(base, this.highlight, () => this.surfaces[1], this.attachment)])
    }
    return surfaces
  }
}

export { ClayCombobox }
