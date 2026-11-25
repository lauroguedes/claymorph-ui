import { settle } from "@ui-sdk/core/testing"
import { createAgent } from "@ui-sdk/web/agent"
import { beforeEach, expect, test } from "vitest"
import "./index"
import { toast, type ClaySlideConfirm } from "./index"

const agent = createAgent()

const meter = (value: number) => `
  <ui-meter value="${value}" max="6"><ui-meter-label>Mon</ui-meter-label>
    <ui-meter-track><ui-meter-indicator></ui-meter-indicator></ui-meter-track>
  </ui-meter>`

beforeEach(() => {
  document.body.innerHTML = `
    <clay-toggle icon color="rose"><ui-toggle><button aria-label="Like">♥</button></ui-toggle></clay-toggle>
    <clay-button-group aria-label="Playback">
      <ui-button><button aria-label="Previous track">‹</button></ui-button>
      <ui-toggle><button aria-label="Play">▶</button></ui-toggle>
    </clay-button-group>
    <clay-tabs>
      <ui-tabs default-value="songs">
        <ui-tabs-list aria-label="Library">
          <ui-tabs-tab value="songs"><button type="button">Songs</button></ui-tabs-tab>
          <ui-tabs-tab value="albums"><button type="button">Albums</button></ui-tabs-tab>
        </ui-tabs-list>
        <ui-tabs-panel value="songs">Songs panel</ui-tabs-panel>
        <ui-tabs-panel value="albums">Albums panel</ui-tabs-panel>
      </ui-tabs>
    </clay-tabs>
    <clay-menu>
      <ui-menu>
        <ui-menu-trigger><button>Track options</button></ui-menu-trigger>
        <ui-menu-content><ui-menu-item value="rename">Rename</ui-menu-item></ui-menu-content>
      </ui-menu>
    </clay-menu>
    <ui-field>
      <ui-field-label>Email</ui-field-label>
      <clay-input><ui-input><input type="email" /></ui-input></clay-input>
    </ui-field>
    <ui-field>
      <ui-field-label>Audio quality</ui-field-label>
      <clay-radio>
        <ui-radio-group default-value="high">
          <label><ui-radio value="normal"><ui-radio-indicator></ui-radio-indicator></ui-radio>Normal</label>
          <label><ui-radio value="high"><ui-radio-indicator></ui-radio-indicator></ui-radio>High</label>
        </ui-radio-group>
      </clay-radio>
    </ui-field>
    <clay-progress>
      <ui-progress value="40"><ui-progress-label>Downloading</ui-progress-label>
        <ui-progress-track><ui-progress-indicator></ui-progress-indicator></ui-progress-track>
      </ui-progress>
    </clay-progress>
    <clay-meter orientation="vertical">${meter(3)}</clay-meter>
    <clay-slide-confirm success-label="Deleted" error-label="Failed">
      <ui-slider aria-label="Slide to delete history">
        <ui-slider-control><ui-slider-track>
          <ui-slider-indicator></ui-slider-indicator><ui-slider-thumb></ui-slider-thumb>
        </ui-slider-track></ui-slider-control>
      </ui-slider>
    </clay-slide-confirm>
    <clay-toast-region>
      <ui-toast-region>
        <template><ui-toast><ui-toast-title></ui-toast-title><ui-toast-action><button></button></ui-toast-action></ui-toast></template>
      </ui-toast-region>
    </clay-toast-region>`
})

const slide = () => document.querySelector<ClaySlideConfirm>("clay-slide-confirm")!
const commit = (value: number) =>
  slide().querySelector("ui-slider")!.dispatchEvent(new CustomEvent("valuecommit", { detail: { value } }))
const tick = () => new Promise((resolve) => setTimeout(resolve, 0))

test("an agent can find every new clay control by name", async () => {
  await settle()
  const components = agent.snapshot().filter((entry) => !entry.offPage && entry.component !== "more")
  for (const entry of components) {
    expect(entry.label, `${entry.component} ${entry.ref} has no name`).toBeTruthy()
  }
  const labels = components.map((entry) => entry.label)
  for (const label of ["Like", "Play", "Previous track", "Library", "Track options", "Email", "Audio quality", "Slide to delete history"]) {
    expect(labels, `${label} is missing from the snapshot`).toContain(label)
  }
  expect(document.querySelector("clay-button-group")!.getAttribute("role")).toBe("group")
})

test("an agent can latch a toggle, switch a tab and pick a radio", async () => {
  await settle()
  expect(document.querySelector("clay-toggle")!.getAttribute("data-pressed")).toBe("false")
  const result = await agent.act({
    steps: [
      { ref: "Like", action: "toggle" },
      { ref: "Library", action: "setValue", args: ["albums"] },
      { ref: "Audio quality", action: "setValue", args: ["normal"] },
    ],
  })
  expect(result.ok, result.error?.message).toBe(true)
  await settle()
  expect(document.querySelector("[aria-label=Like]")!.getAttribute("aria-pressed")).toBe("true")
  expect(document.querySelector("clay-toggle")!.getAttribute("data-pressed")).toBe("true")
  expect(document.querySelector("ui-tabs-panel[value=albums]")!.hasAttribute("hidden")).toBe(false)
  expect(document.querySelector("ui-radio[value=normal]")!.hasAttribute("data-checked")).toBe(true)
})

test("Type marks the field invalid from aria-invalid", async () => {
  await settle()
  const input = document.querySelector("clay-input input")!
  input.setAttribute("aria-invalid", "true")
  await tick()
  expect(document.querySelector("clay-input")!.hasAttribute("data-invalid")).toBe(true)
  input.removeAttribute("aria-invalid")
  await tick()
  expect(document.querySelector("clay-input")!.hasAttribute("data-invalid")).toBe(false)
})

test("Fill and Gauge follow the value the ui-sdk part reports", async () => {
  await settle()
  const progress = document.querySelector<HTMLElement>("clay-progress")!
  expect(progress.style.getPropertyValue("--clay-fill")).toBe("40.00%")
  const root = progress.querySelector<HTMLElement & { value: number }>("ui-progress")!
  root.value = 100
  await settle()
  await tick()
  expect(progress.style.getPropertyValue("--clay-fill")).toBe("100.00%")
  expect(progress.hasAttribute("data-complete")).toBe(true)
  expect(document.querySelector<HTMLElement>("clay-meter")!.style.getPropertyValue("--clay-fill")).toBe("50.00%")
})

test("Drag confirms past the threshold and rolls back before it", async () => {
  await settle()
  let finish!: () => void
  slide().action = () => new Promise<void>((resolve) => (finish = resolve))
  commit(40)
  expect(slide().actionState).toBe("idle")
  commit(95)
  await tick()
  expect(slide().actionState).toBe("pending")
  expect(slide().querySelector("ui-slider")!.getAttribute("aria-busy")).toBe("true")
  finish()
  await tick()
  await tick()
  expect(slide().actionState).toBe("success")
  expect(slide().querySelector("[role=status]")!.textContent).toBe("Deleted")
})

test("Drag shows the error state when its action rejects", async () => {
  await settle()
  slide().action = () => Promise.reject(new Error("offline"))
  commit(100)
  await tick()
  await tick()
  expect(slide().actionState).toBe("error")
  expect(slide().querySelector("[role=status]")!.textContent).toBe("Failed")
})

test("Drop renders toasts from the region's template", async () => {
  await settle()
  toast.success("Playlist saved", { action: { label: "Undo", onAction: () => {} } })
  await settle()
  const item = document.querySelector("ui-toast")!
  expect(item.getAttribute("data-type")).toBe("success")
  expect(item.querySelector("ui-toast-title")!.textContent).toBe("Playlist saved")
  expect(item.querySelector("ui-toast-action button")!.textContent).toBe("Undo")
  toast.dismiss()
})

test("an attached label and hint still name and describe their input", async () => {
  document.body.innerHTML = `
    <ui-field>
      <clay-input attached>
        <ui-field-label>Display name</ui-field-label>
        <ui-input><input value="Aryan" /></ui-input>
        <ui-field-description>Shown on mixes you share.</ui-field-description>
      </clay-input>
    </ui-field>`
  await settle()
  const labels = agent.snapshot().map((entry) => entry.label)
  expect(labels).toContain("Display name")
  const input = document.querySelector("input")!
  const hint = document.querySelector("ui-field-description")!
  expect(input.getAttribute("aria-describedby")).toContain(hint.id)
})

test("an attached tooltip hugs its button and keeps its text readable", async () => {
  document.body.innerHTML = `
    <clay-tooltip attached>
      <ui-tooltip>
        <clay-button icon><ui-tooltip-trigger><button aria-label="Shuffle">S</button></ui-tooltip-trigger></clay-button>
        <ui-tooltip-content>Shuffle the queue</ui-tooltip-content>
      </ui-tooltip>
    </clay-tooltip>`
  await settle()
  const content = document.querySelector("ui-tooltip-content")!
  expect(content.getAttribute("side-offset")).toBe("4")
  expect(content.querySelector(".clay-tip-text")!.textContent).toBe("Shuffle the queue")
  const tooltip = document.querySelector<HTMLElement & { open: boolean }>("ui-tooltip")!
  tooltip.open = true
  await settle()
  expect(content.hasAttribute("data-open")).toBe(true)
  expect(content.textContent!.trim()).toBe("Shuffle the queue")
})

test("attached select and menu still work and sit close to their trigger", async () => {
  document.body.innerHTML = `
    <clay-select attached>
      <ui-select default-value="week">
        <ui-select-label>Period</ui-select-label>
        <ui-select-trigger><button><ui-select-value></ui-select-value></button></ui-select-trigger>
        <ui-select-content>
          <ui-select-item value="week">This week</ui-select-item>
          <ui-select-item value="month">This month</ui-select-item>
        </ui-select-content>
      </ui-select>
    </clay-select>
    <clay-menu attached>
      <ui-menu>
        <ui-menu-trigger><button>Track options</button></ui-menu-trigger>
        <ui-menu-content><ui-menu-item value="share">Share</ui-menu-item></ui-menu-content>
      </ui-menu>
    </clay-menu>`
  await settle()
  expect(document.querySelector("ui-select-content")!.getAttribute("side-offset")).toBe("4")
  expect(document.querySelector("ui-menu-content")!.getAttribute("side-offset")).toBe("4")
  const result = await agent.act({ steps: [{ ref: "Period", action: "setValue", args: ["This month"] }] })
  expect(result.ok, result.error?.message).toBe(true)
  await settle()
  expect(document.querySelector("ui-select-value")!.textContent).toBe("This month")
})

test("an attached toast region still renders its toasts, and can switch modes", async () => {
  await settle()
  const region = document.querySelector("clay-toast-region")!
  region.setAttribute("attached", "")
  toast("Added to queue")
  await settle()
  expect(document.querySelector("ui-toast-title")!.textContent).toBe("Added to queue")
  region.removeAttribute("attached")
  toast.success("Saved")
  await settle()
  expect([...document.querySelectorAll("ui-toast")].map((item) => item.getAttribute("data-type"))).toContain("success")
  toast.dismiss()
})

test("a surface never repositions a popup or dialog part it draws on", async () => {
  const { ClaySurface } = await import("./surface")
  const plain = document.createElement("div")
  const dialog = document.createElement("div")
  dialog.dataset.slot = "dialog-content"
  document.body.append(plain, dialog)
  for (const host of [plain, dialog]) new ClaySurface(host, { shapes: () => [] }).tick(1 / 60, true)
  expect(plain.style.position).toBe("relative")
  expect(dialog.style.position).toBe("")
})

test("an attached popup squeezes out of its trigger's edge and is back in before the trigger bounces", async () => {
  const { Attachment, PAST, TUCKED } = await import("./attach")
  const content = document.createElement("div")
  const host = document.createElement("button")
  document.body.append(content, host)
  let bounces = 0
  const surface = { stale: false, wake() {}, invalidate() {} }
  const attachment = new Attachment(
    content,
    {
      trigger: () => host,
      triggerRadius: (box) => box.h / 2,
      triggerColor: () => [0.3, 0.6, 0.6],
      color: () => [0.4, 0.4, 0.5],
      radius: 22,
      bevel: 16,
      lift: 1.3,
      onTuck: () => bounces++,
    },
    () => surface as never
  )
  // Measured boxes, as the popup's surface would have them while open: the trigger sits above, 6px off.
  Object.assign(attachment as unknown as { trigger: object; size: object; tucked: boolean }, {
    trigger: { x: 0, y: -50, w: 120, h: 44 },
    size: { w: 200, h: 160 },
    tucked: false,
  })
  attachment.emerge.set(0.02)
  const [early] = attachment.joint(host)
  expect(early, "the trigger melts the popup into its own clay as soon as it pokes out").toBeTruthy()
  expect(early!.y, "it starts just inside the trigger's edge, never deep in it").toBeGreaterThanOrEqual(44 - 6 - 0.01)
  expect(early!.ghost, "the trigger leaves the popup to draw itself").toBe(true)
  expect(early!.color, "it wears its own colour from the start").toEqual([0.4, 0.4, 0.5])
  expect(early!.blend, "and blends into the trigger across a wide joint").toBeGreaterThan(5)

  attachment.emerge.set(1)
  attachment.emerge.target = PAST
  const { step } = attachment.surfaceOptions()
  let poked = Infinity
  for (let frame = 0; frame < 120 && !bounces; frame++) {
    step!(1 / 60, false)
    const [joint] = attachment.joint(host)
    poked = joint ? joint.y + joint.h - 44 : 0
  }
  expect(bounces, "closing, the trigger bounces once").toBe(1)
  expect(poked, "only once the popup is all but back inside").toBeLessThanOrEqual(TUCKED)
  expect(attachment.out).toBe(false)
  attachment.emerge.set(0)
  expect(attachment.joint(host), "with the popup tucked in, nothing is left on the trigger").toEqual([])
})

test("Pour keeps showing the old value while its list is open, and shows the new one once it closes", async () => {
  document.body.innerHTML = `
    <clay-select attached>
      <ui-select default-value="week">
        <ui-select-label>Period</ui-select-label>
        <ui-select-trigger><button><ui-select-value></ui-select-value></button></ui-select-trigger>
        <ui-select-content>
          <ui-select-item value="week">This week</ui-select-item>
          <ui-select-item value="month">This month</ui-select-item>
        </ui-select-content>
      </ui-select>
    </clay-select>`
  await settle()
  const select = document.querySelector<HTMLElement & { open: boolean; api: { setValue(v: string): void } }>("ui-select")!
  const value = document.querySelector<HTMLElement>("ui-select-value")!
  select.open = true
  await settle()
  select.api.setValue("month")
  await settle()
  await tick()
  expect(value.style.opacity, "the new value waits, hidden").toBe("0")
  expect(document.querySelector(".clay-select-ghost")!.textContent, "while the old one stays in its place").toBe("This week")
  select.open = false
  await settle()
  await tick()
  expect(value.style.opacity).toBe("")
  expect(value.textContent).toBe("This month")
  expect(document.querySelector(".clay-select-ghost")).toBeNull()
})

test("the sliding highlight fades out whole, keeping its depth, so it never shrinks to a rim and pops", async () => {
  const { Highlight } = await import("./highlight")
  const highlight = new Highlight(document.createElement("div"), "[data-slot='menu-item']")
  ;(highlight as unknown as { shown: { x: number } }).shown.x = 0.3
  const well = highlight.shape([0.5, 0.5, 0.5])!
  expect(well.opacity).toBeCloseTo(0.3)
  expect(well.height).toBeLessThan(-0.3)
})

test("an attached tooltip melts into the clay button around its trigger, though that button starts after it", async () => {
  document.body.innerHTML = `
    <clay-tooltip attached>
      <ui-tooltip>
        <clay-button icon><ui-tooltip-trigger><button aria-label="Shuffle">S</button></ui-tooltip-trigger></clay-button>
        <ui-tooltip-content>Shuffle the queue</ui-tooltip-content>
      </ui-tooltip>
    </clay-tooltip>`
  await settle()
  const button = document.querySelector("clay-button") as HTMLElement & { joints: Set<unknown> }
  expect(button.joints.size, "so the button draws its side of the joint").toBe(1)
})

test("fuse melts an attached popup deeper into its trigger and closes the gap, and the joint is always smooth", async () => {
  document.body.innerHTML = `
    <clay-tooltip attached>
      <ui-tooltip>
        <clay-button icon><ui-tooltip-trigger><button aria-label="Shuffle">S</button></ui-tooltip-trigger></clay-button>
        <ui-tooltip-content>Shuffle the queue</ui-tooltip-content>
      </ui-tooltip>
    </clay-tooltip>`
  await settle()
  const tooltip = document.querySelector("clay-tooltip")!
  const content = document.querySelector("ui-tooltip-content")!
  const attachment = (tooltip as unknown as { attachment: { emerge: { set(x: number): void }; shapes(): Array<{ melt?: number; flatten?: number }> } }).attachment
  Object.assign(attachment, { trigger: { x: 0, y: 40, w: 44, h: 44 }, size: { w: 120, h: 32 }, tucked: false })
  attachment.emerge.set(1)
  const shapes = () => attachment.shapes()
  expect(content.getAttribute("side-offset")).toBe("4")
  const loose = shapes()
  expect(loose.some((shape) => shape.flatten === 1), "the crease across the joint is smoothed away at any fuse").toBe(true)
  tooltip.setAttribute("fuse", "1")
  const fused = shapes()
  expect(fused[1]!.melt, "fused, it melts in twice as deep").toBeCloseTo(loose[1]!.melt! * 2)
  expect(content.getAttribute("side-offset"), "and it sits right on the button").toBe("0")
  tooltip.setAttribute("fuse", "nonsense")
  expect(shapes()[1]!.melt).toBeCloseTo(loose[1]!.melt!)
})

test("an attached select's joint is smoothed all the way at any fuse", async () => {
  document.body.innerHTML = `
    <clay-select attached>
      <ui-select default-value="week">
        <ui-select-label>Period</ui-select-label>
        <ui-select-trigger><button><ui-select-value></ui-select-value></button></ui-select-trigger>
        <ui-select-content>
          <ui-select-item value="week">This week</ui-select-item>
          <ui-select-item value="month">This month</ui-select-item>
        </ui-select-content>
      </ui-select>
    </clay-select>`
  await settle()
  const select = document.querySelector("clay-select")!
  const attachment = (select as unknown as { attachment: { emerge: { set(x: number): void }; shapes(): Array<{ flatten?: number }> } }).attachment
  Object.assign(attachment, { trigger: { x: 0, y: -50, w: 192, h: 46 }, size: { w: 192, h: 160 }, tucked: false })
  attachment.emerge.set(1)
  expect(attachment.shapes().some((shape) => shape.flatten === 1)).toBe(true)
  select.setAttribute("fuse", "0.5")
  expect(attachment.shapes().some((shape) => shape.flatten === 1)).toBe(true)
})

const genres = (attrs = "") => `
  <clay-combobox ${attrs}>
    <ui-combobox>
      <ui-combobox-label>Genre</ui-combobox-label>
      <div>
        <ui-combobox-input><input placeholder="Search genres" /></ui-combobox-input>
        <ui-combobox-trigger><button aria-label="Show genres"></button></ui-combobox-trigger>
      </div>
      <ui-combobox-content hidden>
        <ui-combobox-empty>No genres found.</ui-combobox-empty>
        <ui-combobox-list>
          <ui-combobox-item value="jazz">Jazz</ui-combobox-item>
          <ui-combobox-item value="samba">Samba</ui-combobox-item>
          <ui-combobox-item value="soul">Soul</ui-combobox-item>
        </ui-combobox-list>
      </ui-combobox-content>
    </ui-combobox>
  </clay-combobox>`

test("Sift still chooses by name, and its attached list lines up with the whole field and hugs it", async () => {
  document.body.innerHTML = genres("attached")
  await settle()
  const field = document.querySelector("ui-combobox-input")!.parentElement!
  const content = document.querySelector("ui-combobox-content")!
  expect(content.getAttribute("anchor"), "the list lines up with the field, buttons and all").toBe(`#${field.id}`)
  expect(content.getAttribute("side-offset")).toBe("4")
  document.querySelector("clay-combobox")!.setAttribute("fuse", "1")
  expect(content.getAttribute("side-offset"), "fused, it sits right on the field").toBe("0")
  const result = await agent.act({ steps: [{ ref: "Genre", action: "setValue", args: ["Samba"] }] })
  expect(result.ok, result.error?.message).toBe(true)
  await settle()
  expect(document.querySelector("input")!.value).toBe("Samba")
})

test("Sift keeps an anchor the page chose", async () => {
  document.body.innerHTML = genres().replace("<ui-combobox-content hidden>", `<ui-combobox-content hidden anchor="#elsewhere">`)
  await settle()
  expect(document.querySelector("ui-combobox-content")!.getAttribute("anchor")).toBe("#elsewhere")
})

test("a resizing popup follows its new size on a spring, and the edge it's attached by stays put", async () => {
  const { Attachment } = await import("./attach")
  type Box = { x: number; y: number; w: number; h: number }
  const content = document.createElement("div")
  const host = document.createElement("button")
  document.body.append(content, host)
  const surface = { stale: false, wake() {}, invalidate() {} }
  const attachment = new Attachment(
    content,
    {
      trigger: () => host,
      triggerRadius: (box) => box.h / 2,
      triggerColor: () => [0.3, 0.6, 0.6],
      color: () => [0.4, 0.4, 0.5],
      radius: 22,
      bevel: 16,
      lift: 1.3,
      resize: true,
    },
    () => surface as never
  )
  const inner = attachment as unknown as { trigger: Box; size: { w: number; h: number }; tucked: boolean; follow(t: Box, w: number, h: number): void; full(): Box }
  const { step } = attachment.surfaceOptions()
  const open = (t: Box, h: number) => {
    Object.assign(inner, { trigger: t, size: { w: 200, h }, tucked: false })
    attachment.emerge.set(0.2)
    attachment.emerge.target = 1
    inner.follow(t, 200, h)
    attachment.emerge.set(1)
  }
  const filter = (t: Box, h: number, check: (box: Box) => void) => {
    inner.trigger = t
    inner.size = { w: 200, h }
    inner.follow(t, 200, h)
    for (let frame = 0; frame < 90; frame++) {
      step!(1 / 60, false)
      check(inner.full())
    }
  }

  // Below the field: the list's top stays on the field as it shrinks from 300px to 100px.
  open({ x: 0, y: -50, w: 200, h: 46 }, 300)
  expect(inner.full(), "coming out, it takes its size at once").toEqual({ x: 0, y: 0, w: 200, h: 300 })
  inner.follow({ x: 0, y: -50, w: 200, h: 46 }, 200, 100)
  expect(inner.full().h, "all the way out, it doesn't jump to the new size").toBe(300)
  const heights: number[] = []
  filter({ x: 0, y: -50, w: 200, h: 46 }, 100, (box) => {
    expect(box.y).toBeCloseTo(0, 5)
    heights.push(box.h)
  })
  expect(heights.some((h) => h > 110 && h < 290), "it eases through the sizes in between").toBe(true)
  expect(inner.full().h).toBeCloseTo(100, 1)

  // Above the field: ui-sdk moves the shorter list down to keep its bottom on the field, and so does its clay.
  open({ x: 0, y: 304, w: 200, h: 46 }, 300)
  filter({ x: 0, y: 104, w: 200, h: 46 }, 100, (box) => expect(box.y + box.h).toBeCloseTo(100, 3))
  expect(inner.full().y).toBeCloseTo(0, 1)

  // Closing, it tucks in at the size it had, whatever its contents do meanwhile.
  attachment.emerge.target = -0.08
  inner.follow({ x: 0, y: 104, w: 200, h: 46 }, 200, 300)
  expect(inner.full().h).toBeCloseTo(100, 1)
})

test("the sliding highlight is cut to the part of a scrolling list that shows, and hides past it", async () => {
  const { Highlight } = await import("./highlight")
  const rect = (y: number, h: number) => ({ left: 0, top: y, right: 200, bottom: y + h, width: 200, height: h, x: 0, y }) as DOMRect
  const list = document.createElement("div")
  const viewport = document.createElement("div")
  const item = document.createElement("div")
  item.dataset.slot = "combobox-item"
  item.setAttribute("data-highlighted", "")
  viewport.append(item)
  list.append(viewport)
  list.getBoundingClientRect = () => rect(0, 300)
  Object.defineProperties(list, { offsetWidth: { value: 200 }, offsetHeight: { value: 300 } })
  viewport.getBoundingClientRect = () => rect(8, 200)
  item.getClientRects = () => [rect(0, 0)] as unknown as DOMRectList
  const highlight = new Highlight(list, "[data-slot='combobox-item']", () => viewport)
  const springs = highlight as unknown as { y: { target: number }; h: { target: number }; shown: { target: number } }

  item.getBoundingClientRect = () => rect(190, 38)
  highlight.measure()
  expect(springs.shown.target).toBe(1)
  expect(springs.y.target).toBe(190)
  expect(springs.h.target, "half scrolled out, the well covers only what shows").toBe(18)

  item.getBoundingClientRect = () => rect(204, 38)
  highlight.measure()
  expect(springs.shown.target, "scrolled out, it fades away").toBe(0)
})

test("an attached dialog is pulled out of its button on a neck, flies with a tail, swells into place, and is drawn back in", async () => {
  const { Flight } = await import("./flight")
  const content = document.createElement("div")
  const button = document.createElement("button")
  document.body.append(content, button)
  content.getClientRects = () => [{}] as unknown as DOMRectList
  let landings = 0
  const surface = { stale: false, key: "", visible: true, canvas: { width: 0, height: 0 }, ctx: { clearRect() {} }, wake() {}, invalidate() {} }
  const teal = [0.3, 0.6, 0.6]
  const flight = new Flight(
    content,
    {
      trigger: () => button,
      triggerShape: (box) => ({ radius: box.h / 2, height: 1 }),
      triggerColor: () => teal as [number, number, number],
      color: () => [0.9, 0.9, 0.9],
      radius: 32,
      bevel: 26,
      lift: 2.4,
      onLand: () => landings++,
    },
    () => surface as never
  )
  type Shape = { x: number; y: number; w: number; h: number; color: number[]; melt?: number; ghost?: boolean }
  const inner = flight as unknown as { size: object; trigger: object; shapes(): Shape[] }
  // The dialog is 400 by 240; its button sits 300px to the left of it and 500px below.
  Object.assign(inner, { size: { w: 400, h: 240 }, trigger: { x: -300, y: 500, w: 120, h: 44 } })
  content.setAttribute("data-open", "")
  const stop = flight.connect()
  const { step } = flight.surfaceOptions()
  const grown = () => parseFloat(content.style.getPropertyValue("--clay-grow"))
  const run = (frames: number, check: (shapes: Shape[]) => void = () => {}) => {
    for (let frame = 0; frame < frames; frame++) {
      step!(1 / 60, false)
      check(inner.shapes())
    }
  }
  const middle = (s: Shape) => ({ x: s.x + s.w / 2, y: s.y + s.h / 2 })

  // Pulled out, the bead hangs by a neck from the button's own clay: the button melts the bead into
  // its clay as a ghost, and the popup draws the bead melted into the button as a ghost, so the real
  // button shows through.
  const necked = (shapes: Shape[], joint: Shape[]) =>
    shapes.length === 2 &&
    shapes[0]!.ghost === true &&
    shapes[0]!.color === teal &&
    !shapes[1]!.ghost &&
    (shapes[1]!.melt ?? 0) > 1 &&
    joint.length === 1 &&
    joint[0]!.ghost === true &&
    (joint[0]!.melt ?? 0) > 1
  let pulled: number | null = null
  let tailed = false
  run(10, (shapes) => {
    if (pulled === null && necked(shapes, flight.joint(button) as Shape[])) pulled = flight.fly.x
  })
  expect(pulled, "pulled out, the bead hangs by a neck from the button's own clay").not.toBeNull()
  expect(pulled!, "before it flies off").toBeLessThan(0.01)
  expect(grown(), "the contents wait for the clay").toBe(0)

  const shown: number[] = []
  run(120, (shapes) => {
    shown.push(grown())
    if (flight.fly.x > 0.3 && flight.fly.x < 0.7 && shapes.length === 3) {
      const [bead, near, far] = shapes.map(middle)
      // Droplets drip off behind it, toward the button, melted on; the button has let go of it.
      if (near!.y > bead!.y && far!.y > near!.y && shapes.slice(1).every((s) => (s.melt ?? 0) > 1) && !flight.joint(button).length) tailed = true
    }
  })
  expect(tailed, "in flight, a tail of droplets drips off behind it").toBe(true)
  expect(shown.every((value, i) => i === 0 || value >= shown[i - 1]!), "the contents fade in and never back, though the clay wobbles").toBe(true)
  const shapes = inner.shapes()
  expect(shapes, "settled, it's the slab alone").toHaveLength(1)
  expect(shapes[0]).toMatchObject({ x: 0, y: 0, w: 400, h: 240 })
  expect(shapes[0]!.color.map((c) => +c.toFixed(3)), "in its own colour").toEqual([0.9, 0.9, 0.9])
  expect(grown()).toBe(1)

  content.removeAttribute("data-open")
  await Promise.resolve()
  let drawnIn = false
  let trailing = false
  run(150, (shapes) => {
    if (!landings && necked(shapes, flight.joint(button) as Shape[])) drawnIn = true
    if (flight.fly.x > 0.3 && flight.fly.x < 0.7 && shapes.length === 3) {
      const [bead, near, far] = shapes.map(middle)
      // Flying home, its tail drips off behind it, toward the dialog.
      if (near!.y < bead!.y && far!.y < near!.y) trailing = true
    }
  })
  expect(trailing, "flying home, its tail trails behind it").toBe(true)
  expect(drawnIn, "closing, the bead is drawn back into the button's own clay").toBe(true)
  expect(landings, "and lands once").toBe(1)
  expect(inner.shapes(), "leaving nothing behind").toEqual([])
  expect(flight.joint(button), "on either side").toEqual([])
  expect(grown()).toBe(0)
  stop()
})
