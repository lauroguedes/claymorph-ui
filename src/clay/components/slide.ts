import { mix } from "../color"
import type { ClayShape } from "../engine"
import { ClayElement, NEUTRAL } from "../element"
import { clamp, deeper, watch } from "../shared"
import { Spring } from "../spring"
import { offsetWithin, type SurfaceOptions } from "../surface"

type SlideState = "idle" | "pending" | "success" | "error"

const ICONS = [
  '<svg data-icon="idle" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7"/></svg>',
  '<svg data-icon="pending" viewBox="0 0 24 24"><path d="M12 3a9 9 0 1 0 9 9"/></svg>',
  '<svg data-icon="success" viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7"/></svg>',
  '<svg data-icon="error" viewBox="0 0 24 24"><path d="M7 7l10 10M17 7L7 17"/></svg>',
].join("")

type SliderElement = HTMLElement & { value: number | number[] }
type SliderEvent = CustomEvent<{ value: number | number[] }>

const single = (value: number | number[]) => (Array.isArray(value) ? value[0] ?? 0 : value)

/** Drag: slide a clay ball to the end to confirm. Let go early and it rolls back. */
class ClaySlideConfirm extends ClayElement {
  protected readonly requires = "ui-slider-thumb"
  /** Runs once the ball reaches the end. Its promise decides success or error. */
  action: (() => unknown) | null = null
  private state: SlideState = "idle"
  private x = new Spring(0)
  private grab = new Spring(0)
  private done = new Spring(0)
  private shake = new Spring(0)
  private placed = false
  private box = { x: 0, y: 0, w: 0, h: 0 }
  private status: HTMLElement | null = null
  private reset = 0
  private cleanup: Array<() => void> = []

  get actionState() {
    return this.state
  }

  private get slider() {
    return this.querySelector<SliderElement>("ui-slider")!
  }

  private get range() {
    const slider = this.slider
    return { min: Number(slider.getAttribute("min") ?? 0), max: Number(slider.getAttribute("max") ?? 100) }
  }

  private onChange = (event: Event) => {
    if (this.state !== "idle" && this.state !== "error") {
      event.preventDefault()
      return
    }
    if (this.state === "error") this.setState("idle")
    this.progress(single((event as SliderEvent).detail.value))
  }

  private onCommit = (event: Event) => {
    if (this.state !== "idle") return
    const value = single((event as SliderEvent).detail.value)
    const { min, max } = this.range
    const threshold = Number(this.getAttribute("threshold") ?? 0.9)
    if (this.action && value >= min + (max - min) * threshold) void this.run(this.action)
    else this.home()
  }

  protected setup() {
    const slider = this.slider
    const text = (state: SlideState, value: string) => {
      const span = document.createElement("span")
      span.dataset.label = state
      span.textContent = value
      return span
    }
    const label = document.createElement("span")
    label.className = "clay-slide-label"
    label.setAttribute("aria-hidden", "true")
    label.append(
      text("idle", slider.getAttribute("aria-label") ?? ""),
      text("pending", this.getAttribute("pending-label") ?? "Working…"),
      text("success", this.getAttribute("success-label") ?? "Done"),
      text("error", this.getAttribute("error-label") ?? "Try again")
    )
    this.querySelector("ui-slider-control")?.append(label)

    const icon = document.createElement("span")
    icon.className = "clay-slide-icon"
    icon.setAttribute("aria-hidden", "true")
    icon.innerHTML = ICONS
    this.querySelector("ui-slider-thumb")!.append(icon)

    this.status = document.createElement("span")
    this.status.className = "clay-sr"
    this.status.setAttribute("role", "status")
    this.append(this.status)

    slider.addEventListener("valuechange", this.onChange)
    slider.addEventListener("valuecommit", this.onCommit)
    this.cleanup.push(
      () => slider.removeEventListener("valuechange", this.onChange),
      () => slider.removeEventListener("valuecommit", this.onCommit),
      watch(slider, ["style", "data-dragging"], () => this.invalidate())
    )
    this.progress(single(slider.value ?? 0))
    this.setState("idle")
  }

  protected teardown() {
    clearTimeout(this.reset)
    for (const fn of this.cleanup) fn()
    this.cleanup = []
  }

  private progress(value: number) {
    const { min, max } = this.range
    this.style.setProperty("--clay-slide", clamp((value - min) / (max - min || 1), 0, 1).toFixed(3))
  }

  private home() {
    this.slider.value = this.range.min
    this.progress(this.range.min)
    this.invalidate()
  }

  private async run(action: () => unknown) {
    clearTimeout(this.reset)
    this.slider.value = this.range.max
    this.progress(this.range.max)
    this.setState("pending")
    this.slider.setAttribute("aria-busy", "true")
    try {
      await action()
      this.setState("success")
      this.announce(this.getAttribute("success-label") ?? "Done")
      this.done.v = 6
    } catch {
      this.setState("error")
      this.announce(this.getAttribute("error-label") ?? "Try again")
      this.shake.v = 160
      this.home()
    }
    this.slider.removeAttribute("aria-busy")
    const after = Number(this.getAttribute("reset-after") ?? (this.state === "error" ? 2400 : 0))
    if (after > 0) {
      this.reset = window.setTimeout(() => {
        this.setState("idle")
        this.home()
      }, after)
    }
  }

  private announce(message: string) {
    if (this.status) this.status.textContent = message
  }

  private setState(state: SlideState) {
    this.state = state
    this.dataset.state = state
    this.done.target = state === "success" ? 1 : 0
    this.dispatchEvent(new CustomEvent("statechange", { detail: { state } }))
    this.invalidate()
  }

  protected surfaceFor(): Array<[HTMLElement, SurfaceOptions]> {
    return [
      [
        this,
        {
          swell: false,
          pad: 26,
          pressTarget: this.querySelector<HTMLElement>("ui-slider-control") ?? this,
          measure: () => {
            this.box = offsetWithin(this.querySelector("ui-slider-control")!, this)
            const thumb = offsetWithin(this.querySelector("ui-slider-thumb")!, this)
            this.x.target = thumb.x + thumb.w / 2
            this.grab.target = this.slider.hasAttribute("data-dragging") ? 1 : 0
            if (!this.placed) {
              this.x.set(this.x.target)
              this.placed = true
            }
          },
          step: (dt, still) =>
            [
              this.x.step(dt, { omega: 20, zeta: 0.58 }, still),
              this.grab.step(dt, { omega: 16, zeta: 0.55 }, still),
              this.done.step(dt, { omega: 12, zeta: 0.45 }, still),
              this.shake.step(dt, { omega: 30, zeta: 0.25 }, still),
            ].some(Boolean),
          shapes: () => this.shapes(),
        },
      ],
    ]
  }

  private shapes(): ClayShape[] {
    const surface = this.surfaces[0]!
    const { x, y, w, h } = this.box
    const body = surface.color("--clay-surface", NEUTRAL)
    const accent = surface.color("--clay-color", NEUTRAL)
    const shift = this.shake.x * 0.02
    const grab = Math.max(this.grab.x, surface.press.x)
    const done = clamp(this.done.x, 0, 1.2)
    const d = (h - 12) * (1 + grab * 0.08 + Math.max(this.done.x - 1, 0) * 0.3)
    const stretch = clamp(Math.abs(this.x.v) * 0.001, 0, 0.3)
    const bw = d * (1 + stretch)
    const bh = d * (1 - stretch * 0.3)
    const cx = clamp(this.x.x + shift, x + 6 + bw / 2, x + w - 6 - bw / 2)
    const cy = y + h / 2
    return [
      { x: x + shift, y, w, h, radius: h / 2, color: body, height: 0.85, lift: 0.55 },
      { x: x + 4 + shift, y: y + 4, w: w - 8, h: h - 8, radius: (h - 8) / 2, color: deeper(body, 0.09), height: -0.85 },
      {
        x: x + 6 + shift,
        y: y + 6,
        w: Math.max(cx - x - 6 + bw / 2, h - 12),
        h: h - 12,
        radius: (h - 12) / 2,
        color: accent,
        height: 0.6 + done * 0.3,
        lift: 0.1,
      },
      {
        x: cx - bw / 2,
        y: cy - bh / 2,
        w: bw,
        h: bh,
        radius: bh / 2,
        color: mix(surface.color("--clay-knob"), accent, clamp(done, 0, 1) * 0.35),
        height: 1,
        lift: 0.8 + grab * 0.4,
      },
    ]
  }
}

export { ClaySlideConfirm, type SlideState }
