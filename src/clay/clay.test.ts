import { settle } from "@ui-sdk/core/testing"
import { createAgent } from "@ui-sdk/web/agent"
import { beforeEach, expect, test } from "vitest"
import "./index"
import type { ClayActionButton } from "./index"

const agent = createAgent()

const CHECK = '<svg viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7" /></svg>'

beforeEach(() => {
  document.body.innerHTML = `
    <clay-button color="teal"><ui-button><button>Save</button></ui-button></clay-button>
    <clay-action-button pending-label="Deploying…" success-label="Deployed" error-label="Failed" reset-after="0">
      <ui-button><button>Deploy</button></ui-button>
    </clay-action-button>
    <clay-segmented>
      <ui-segmented-control aria-label="Range" default-value="week">
        <ui-segmented-control-indicator></ui-segmented-control-indicator>
        <ui-segmented-control-item value="day">Day</ui-segmented-control-item>
        <ui-segmented-control-item value="week">Week</ui-segmented-control-item>
        <ui-segmented-control-item value="month">Month</ui-segmented-control-item>
      </ui-segmented-control>
    </clay-segmented>
    <label>Wi-Fi <clay-switch><ui-switch><ui-switch-thumb></ui-switch-thumb></ui-switch></clay-switch></label>
    <label><clay-checkbox><ui-checkbox><ui-checkbox-indicator aria-hidden="true">${CHECK}</ui-checkbox-indicator></ui-checkbox></clay-checkbox> Product updates</label>
    <clay-slider><ui-field>
      <ui-slider default-value="60" aria-label="Volume">
        <ui-field-label>Volume</ui-field-label>
        <ui-slider-control><ui-slider-track>
          <ui-slider-indicator></ui-slider-indicator>
          <ui-slider-thumb></ui-slider-thumb>
        </ui-slider-track></ui-slider-control>
      </ui-slider>
    </ui-field></clay-slider>
    <clay-select>
      <ui-select default-value="week">
        <ui-select-label>Period</ui-select-label>
        <ui-select-trigger><button><ui-select-value></ui-select-value></button></ui-select-trigger>
        <ui-select-content>
          <ui-select-item value="week">This week</ui-select-item>
          <ui-select-item value="month">This month</ui-select-item>
        </ui-select-content>
      </ui-select>
    </clay-select>
    <clay-card><h3>Stats</h3></clay-card>
    <clay-badge color="mint">New</clay-badge>`
})

const deploy = () => document.querySelector<ClayActionButton>("clay-action-button")!

test("an agent can find every clay control by name", async () => {
  await settle()
  const components = agent.snapshot().filter((entry) => !entry.offPage && entry.component !== "more")
  for (const entry of components) {
    expect(entry.label, `${entry.component} ${entry.ref} has no name`).toBeTruthy()
  }
  const labels = components.map((entry) => entry.label)
  for (const label of ["Save", "Deploy", "Range", "Wi-Fi", "Product updates", "Volume", "Period"]) {
    expect(labels, `${label} is missing from the snapshot`).toContain(label)
  }
})

test("an agent can operate every clay control", async () => {
  await settle()
  const result = await agent.act({
    steps: [
      { ref: "Range", action: "setValue", args: ["Month"] },
      { ref: "Wi-Fi", action: "toggle" },
      { ref: "Product updates", action: "toggle" },
      { ref: "Volume", action: "setValue", args: [30] },
      { ref: "Period", action: "setValue", args: ["This month"] },
    ],
  })
  expect(result.ok, result.error?.message).toBe(true)
  await settle()
  expect(document.querySelector("ui-segmented-control-item[value=month]")!.hasAttribute("data-checked")).toBe(true)
  expect(document.querySelector("ui-switch")!.getAttribute("aria-checked")).toBe("true")
  expect(document.querySelector("ui-checkbox")!.hasAttribute("data-checked")).toBe(true)
  expect(document.querySelector<HTMLElement & { value: number }>("ui-slider")!.value).toBe(30)
  expect(document.querySelector("ui-select-value")!.textContent).toBe("This month")
})

test("Roll runs its action, keeps its name and announces success", async () => {
  await settle()
  let finish!: () => void
  deploy().action = () => new Promise<void>((resolve) => (finish = resolve))
  const pressing = agent.act({ steps: [{ ref: "Deploy", action: "press" }] })
  await settle()
  const button = deploy().querySelector("button")!
  expect(deploy().actionState).toBe("pending")
  expect(button.getAttribute("aria-busy")).toBe("true")
  expect(button.querySelector(".clay-sr")!.textContent).toBe("Deploy")
  expect(button.querySelector(".clay-action-label")!.getAttribute("aria-hidden")).toBe("true")
  finish()
  const result = await pressing
  expect(result.ok, result.error?.message).toBe(true)
  await settle()
  expect(deploy().actionState).toBe("success")
  expect(deploy().querySelector("[role=status]")!.textContent).toBe("Deployed")
})

test("Roll shows the error state when its action rejects", async () => {
  await settle()
  deploy().action = () => Promise.reject(new Error("down"))
  deploy().querySelector("button")!.click()
  await settle()
  await new Promise((resolve) => setTimeout(resolve, 0))
  expect(deploy().actionState).toBe("error")
  expect(deploy().querySelector("[role=status]")!.textContent).toBe("Failed")
})

test("without WebGL2 the CSS clay stays: no canvas, no ready flag", async () => {
  await settle()
  expect(document.querySelector("canvas")).toBeNull()
  expect(document.querySelector("[data-clay-ready]")).toBeNull()
  expect(document.querySelector<HTMLElement>("clay-button")!.style.getPropertyValue("--clay-color")).toBe("var(--clay-teal)")
})
