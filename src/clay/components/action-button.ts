import { mix, type RGB } from "../color"
import { SPRINGS } from "../config"
import type { ClayShape } from "../engine"
import { ClayElement, NEUTRAL } from "../element"
import { Spring } from "../spring"
import type { SurfaceOptions } from "../surface"

type ActionState = "idle" | "pending" | "success" | "error"

const ICONS = {
  arrow: '<svg data-icon="idle" viewBox="0 0 24 24"><path d="M5 12h13M13 6l6 6-6 6"/></svg>',
  spinner: '<svg data-icon="pending" viewBox="0 0 24 24"><path d="M12 3a9 9 0 1 0 9 9"/></svg>',
  check: '<svg data-icon="success" viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7"/></svg>',
  cross: '<svg data-icon="error" viewBox="0 0 24 24"><path d="M7 7l10 10M17 7L7 17"/></svg>',
}

const GAP = 6

/**
 * Roll: an async action. Its bead sits apart from the body, melts into it while the
 * action runs, and turns into a check when it lands.
 */
class ClayActionButton extends ClayElement {
  static observedAttributes = ["color", "size"]
  protected readonly requires = "button"
  /** Runs when the button is pressed. Its promise decides success or error. */
  action: (() => unknown) | null = null
  private state: ActionState = "idle"
  private merge = new Spring(0)
  private pulse = new Spring(0)
  private shake = new Spring(0)
  private bead: RGB | null = null
  private reset = 0
  private status: HTMLElement | null = null
  private onAction = (event: Event) => {
    if (this.state === "pending" || !this.action) return
    const run = this.run(this.action)
    ;(event as CustomEvent<{ waitUntil(p: Promise<unknown>): void }>).detail.waitUntil(run)
  }

  get actionState() {
    return this.state
  }

  protected setup() {
    const button = this.querySelector("button")!
    const label = button.textContent?.trim() ?? ""
    const text = (state: ActionState, value: string) => {
      const span = document.createElement("span")
      span.dataset.label = state
      span.textContent = value
      return span
    }
    const visible = document.createElement("span")
    visible.className = "clay-action-label"
    visible.setAttribute("aria-hidden", "true")
    visible.append(
      text("idle", label),
      text("pending", this.getAttribute("pending-label") ?? "Working…"),
      text("success", this.getAttribute("success-label") ?? "Done"),
      text("error", this.getAttribute("error-label") ?? "Try again")
    )
    const name = document.createElement("span")
    name.className = "clay-sr"
    name.textContent = label
    const bead = document.createElement("span")
    bead.className = "clay-bead"
    bead.setAttribute("aria-hidden", "true")
    bead.innerHTML = Object.values(ICONS).join("")
    button.replaceChildren(visible, name, bead)

    this.status = document.createElement("span")
    this.status.className = "clay-sr"
    this.status.setAttribute("role", "status")
    this.append(this.status)

    const wrapper = this.querySelector("ui-button")!
    wrapper.setAttribute("pending-announcement", this.getAttribute("pending-label") ?? "Working")
    wrapper.addEventListener("action", this.onAction)
    this.setState("idle")
  }

  protected teardown() {
    clearTimeout(this.reset)
    this.querySelector("ui-button")?.removeEventListener("action", this.onAction)
  }

  private async run(action: () => unknown) {
    clearTimeout(this.reset)
    this.setState("pending")
    try {
      await action()
      this.setState("success")
      this.announce(this.getAttribute("success-label") ?? "Done")
      this.pulse.v = 9
    } catch {
      this.setState("error")
      this.announce(this.getAttribute("error-label") ?? "Try again")
      this.shake.v = 160
    }
    const after = Number(this.getAttribute("reset-after") ?? (this.state === "error" ? 1600 : 2400))
    if (after > 0) this.reset = window.setTimeout(() => this.setState("idle"), after)
  }

  private announce(message: string) {
    if (this.status) this.status.textContent = message
  }

  private setState(state: ActionState) {
    this.state = state
    this.dataset.state = state
    this.dispatchEvent(new CustomEvent("statechange", { detail: { state } }))
    this.invalidate()
    this.surfaces[0]?.wake()
  }

  protected surfaceFor(): Array<[HTMLElement, SurfaceOptions]> {
    return [[this, { step: (dt, still) => this.step(dt, still), shapes: () => this.shapes() }]]
  }

  private step(dt: number, still: boolean) {
    const surface = this.surfaces[0]!
    const held = this.state === "pending" || this.state === "success" || surface.press.target > 0
    this.merge.target = held ? 1 : 0
    let moving = this.merge.step(dt, SPRINGS.morph, still)
    moving = this.pulse.step(dt, { omega: 14, zeta: 0.35 }, still) || moving
    moving = this.shake.step(dt, { omega: 30, zeta: 0.25 }, still) || moving
    const body = surface.color("--clay-color", NEUTRAL)
    const goal =
      this.state === "success"
        ? surface.color("--clay-success")
        : this.state === "error"
          ? surface.color("--clay-danger")
          : mix(body, [0.08, 0.12, 0.18], 0.16)
    this.bead = this.bead ? mix(this.bead, goal, still ? 1 : 1 - Math.exp(-dt * 12)) : goal
    if (Math.abs(this.bead[0] - goal[0]) + Math.abs(this.bead[1] - goal[1]) > 0.003) moving = true
    return moving
  }

  private shapes(): ClayShape[] {
    const surface = this.surfaces[0]!
    const { width: w, height: h } = surface
    const m = this.merge.x
    const press = surface.press.x
    const shift = this.shake.x * 0.02
    const right = w - h - GAP + (h * 0.5 + GAP) * m
    const size = h * (1 + this.pulse.x * 0.12) - press * 3
    return [
      {
        x: shift,
        y: 0,
        w: right,
        h,
        radius: h / 2,
        color: surface.color("--clay-color", NEUTRAL),
        height: 1 - press * 0.35,
        lift: 1 - press * 0.5,
      },
      {
        x: w - h / 2 - size / 2 + shift,
        y: h / 2 - size / 2,
        w: size,
        h: size,
        radius: size / 2,
        color: this.bead ?? NEUTRAL,
        height: 1,
        melt: 3 + 20 * m,
        lift: 1,
      },
    ]
  }
}

export { ClayActionButton, type ActionState }
