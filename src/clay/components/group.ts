import { mix } from "../color"
import { SPRINGS } from "../config"
import type { ClayShape } from "../engine"
import { ClayElement, NEUTRAL } from "../element"
import { clamp, deeper, watch } from "../shared"
import { Spring } from "../spring"
import { offsetWithin, type SurfaceOptions } from "../surface"

const isOn = (button: Element) => button.getAttribute("aria-pressed") === "true"

/** Latch: a toggle whose body sinks into a coloured well while it's on, and pops back out. */
class ClayToggle extends ClayElement {
  static observedAttributes = ["color", "size", "shape"]
  protected readonly requires = "ui-toggle button"
  private latch = new Spring(0)
  private placed = false
  private stop: (() => void) | null = null

  protected setup() {
    const sync = () => {
      this.dataset.pressed = String(isOn(this.querySelector("ui-toggle button")!))
      this.invalidate()
    }
    this.stop = watch(this, ["aria-pressed"], sync)
    sync()
  }

  protected teardown() {
    this.stop?.()
  }

  protected surfaceFor(): Array<[HTMLElement, SurfaceOptions]> {
    return [
      [
        this,
        {
          measure: () => {
            const on = isOn(this.querySelector("ui-toggle button")!) ? 1 : 0
            this.latch.target = on
            if (!this.placed) {
              this.latch.set(on)
              this.placed = true
            }
          },
          step: (dt, still) => this.latch.step(dt, { omega: 17, zeta: 0.42 }, still),
          shapes: () => this.shapes(),
        },
      ],
    ]
  }

  private shapes(): ClayShape[] {
    const surface = this.surfaces[0]!
    const { width: w, height: h } = surface
    const press = surface.press.x
    const l = this.latch.x
    const on = clamp(l, 0, 1)
    const body = surface.color("--clay-surface", NEUTRAL)
    const accent = surface.color("--clay-color", NEUTRAL)
    const radius = this.getAttribute("shape") === "rounded" ? Math.min(h * 0.34, 18) : h / 2
    const inset = 4 + on * 1.5
    return [
      {
        x: 0,
        y: 0,
        w,
        h,
        radius,
        color: body,
        height: 1 - press * 0.35 - on * 0.15,
        lift: 1 + surface.hover.x * 0.3 - press * 0.5 - on * 0.45,
      },
      {
        x: inset,
        y: inset,
        w: w - inset * 2,
        h: h - inset * 2,
        radius: Math.max(radius - inset, 4),
        color: mix(mix(body, [1, 1, 1], 0.18), accent, on),
        height: 0.55 - l * 1.35 - press * 0.3,
      },
    ]
  }
}

interface Item {
  button: HTMLButtonElement
  box: { x: number; y: number; w: number; h: number }
  hover: Spring
  press: Spring
  on: Spring
  placed: boolean
}

/** Fuse: related buttons fused into one clay body. Each part gives on its own. */
class ClayButtonGroup extends ClayElement {
  static observedAttributes = ["color", "size"]
  protected readonly requires = "button"
  private items: Item[] = []
  private cleanup: Array<() => void> = []

  protected setup() {
    if (!this.hasAttribute("role")) this.setAttribute("role", "group")
    this.items = [...this.querySelectorAll("button")].slice(0, 16).map((button) => ({
      button,
      box: { x: 0, y: 0, w: 0, h: 0 },
      hover: new Spring(0),
      press: new Spring(0),
      on: new Spring(0),
      placed: false,
    }))
    for (const item of this.items) {
      const set = (spring: Spring, value: number) => {
        spring.target = value && !item.button.disabled ? 1 : 0
        this.surfaces[0]?.wake()
      }
      const handlers: Array<[string, (event: Event) => void]> = [
        ["pointerenter", () => set(item.hover, 1)],
        ["pointerleave", () => (set(item.hover, 0), set(item.press, 0))],
        ["pointerdown", (event) => (event as PointerEvent).button === 0 && set(item.press, 1)],
        ["pointerup", () => set(item.press, 0)],
        ["pointercancel", () => set(item.press, 0)],
        ["keydown", (event) => {
          const key = (event as KeyboardEvent).key
          if (!(event as KeyboardEvent).repeat && (key === " " || key === "Enter")) set(item.press, 1)
        }],
        ["keyup", () => set(item.press, 0)],
        ["blur", () => set(item.press, 0)],
      ]
      for (const [type, handler] of handlers) {
        item.button.addEventListener(type, handler)
        this.cleanup.push(() => item.button.removeEventListener(type, handler))
      }
    }
    this.cleanup.push(watch(this, ["aria-pressed", "disabled"], () => this.invalidate()))
  }

  protected teardown() {
    for (const fn of this.cleanup) fn()
    this.cleanup = []
  }

  protected surfaceFor(): Array<[HTMLElement, SurfaceOptions]> {
    return [
      [
        this,
        {
          swell: false,
          measure: () => {
            for (const item of this.items) {
              item.box = offsetWithin(item.button, this)
              item.on.target = isOn(item.button) ? 1 : 0
              if (!item.placed) {
                item.on.set(item.on.target)
                item.placed = true
              }
            }
          },
          step: (dt, still) =>
            this.items
              .flatMap((item) => [
                item.hover.step(dt, SPRINGS.hover, still),
                item.press.step(dt, SPRINGS.press, still),
                item.on.step(dt, { omega: 17, zeta: 0.45 }, still),
              ])
              .some(Boolean),
          shapes: () => this.shapes(),
        },
      ],
    ]
  }

  private shapes(): ClayShape[] {
    const surface = this.surfaces[0]!
    const color = surface.color("--clay-color", NEUTRAL)
    const sunk = deeper(color, 0.14)
    return this.items.map((item, index) => {
      const { x, y, w, h } = item.box
      const press = item.press.x
      const on = clamp(item.on.x, 0, 1)
      const give = press * 2.5 - item.hover.x * 1
      return {
        x: x + give,
        y: y + give * 0.6,
        w: w - give * 2,
        h: h - give * 1.2,
        radius: h / 2,
        color: mix(color, sunk, on),
        height: 1 + item.hover.x * 0.12 - press * 0.55 - item.on.x * 1.3,
        melt: index === 0 ? 0 : 16,
        lift: 1 + item.hover.x * 0.2 - press * 0.4,
      }
    })
  }
}

export { ClayButtonGroup, ClayToggle }
