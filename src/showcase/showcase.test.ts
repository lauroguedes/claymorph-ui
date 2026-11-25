import { settle } from "@ui-sdk/core/testing"
import "@ui-sdk/web/field"
import { createAgent } from "@ui-sdk/web/agent"
import { afterEach, beforeEach, expect, test } from "vitest"
import "../clay"
import { toast } from "../clay"
import { renderShowcase } from "./app"
import { tracks } from "./data"

const agent = createAgent()
let stop = () => {}

beforeEach(() => {
  tracks.forEach((track) => (track.liked = track.id === "sunset-drive" || track.id === "coffee-shop"))
  stop = renderShowcase(document.body)
})

afterEach(() => {
  stop()
  toast.dismiss()
})

const titles = () => [...document.querySelectorAll("ui-toast-title")].map((title) => title.textContent)

test("an agent can find every control in the showcase by name", async () => {
  await settle()
  const components = agent.snapshot().filter((entry) => !entry.offPage && entry.component !== "more")
  for (const entry of components) {
    expect(entry.label, `${entry.component} ${entry.ref} has no name`).toBeTruthy()
  }
  const labels = components.map((entry) => entry.label)
  for (const label of [
    "Sections",
    "Search songs and artists",
    "Dark theme",
    "Account",
    "Listening period",
    "Like Sunset Drive",
    "Play Golden Hour",
    "More for Coffee Shop",
    "Previous track",
    "Play",
    "Track position",
    "Volume",
  ]) {
    expect(labels, `${label} is missing from the snapshot`).toContain(label)
  }
})

test("an agent can switch sections, change the period and play a track", async () => {
  await settle()
  const result = await agent.act({
    steps: [
      { ref: "Listening period", action: "setValue", args: ["last"] },
      { ref: "Play Golden Hour", action: "press" },
      { ref: "Sections", action: "setValue", args: ["settings"] },
    ],
  })
  expect(result.ok, result.error?.message).toBe(true)
  await settle()
  expect(document.querySelector("[data-chart] ui-meter")!.getAttribute("aria-label")).toBe("Mon: 3.1 hours")
  expect(document.querySelector("[data-now-title]")!.textContent).toBe("Golden Hour")
  expect(document.querySelector("[data-playing] button")!.getAttribute("aria-pressed")).toBe("true")
  expect(document.querySelector("ui-tabs-panel[value=settings]")!.hasAttribute("hidden")).toBe(false)
  expect(document.querySelector("[data-title]")!.textContent).toBe("Settings")
})

test("liking a track adds it to Liked songs, and unliking removes it", async () => {
  await settle()
  const liked = () => [...document.querySelectorAll("[data-liked] .track-title")].map((title) => title.textContent)
  expect(liked()).toEqual(["Sunset Drive", "Coffee Shop"])
  const result = await agent.act({ steps: [{ ref: "Like Golden Hour", action: "toggle" }] })
  expect(result.ok, result.error?.message).toBe(true)
  await settle()
  expect(liked()).toEqual(["Sunset Drive", "Golden Hour", "Coffee Shop"])
  expect(titles()).toContain("Added to Liked songs")
  document.querySelector<HTMLButtonElement>("[data-liked] [data-like=sunset-drive]")!.click()
  await settle()
  expect(liked()).toEqual(["Golden Hour", "Coffee Shop"])
  const recentHeart = document.querySelector("[data-recent] [data-like=sunset-drive]")!
  expect(recentHeart.getAttribute("aria-pressed")).toBe("false")
})

test("search filters the recent tracks and says when nothing matches", async () => {
  await settle()
  const search = document.querySelector<HTMLInputElement>("[data-search]")!
  search.value = "coffee"
  search.dispatchEvent(new Event("input"))
  const visible = () =>
    [...document.querySelectorAll<HTMLElement>("[data-recent] li")].filter((row) => !row.hidden).map((row) => row.dataset.track)
  expect(visible()).toEqual(["coffee-shop"])
  search.value = "zzz"
  search.dispatchEvent(new Event("input"))
  expect(visible()).toEqual([])
  expect(document.querySelector<HTMLElement>("[data-empty]")!.hidden).toBe(false)
})

test("removing a track from history can be undone from the toast", async () => {
  await settle()
  const menu = document.querySelector("[data-track-menu=golden-hour]")!
  menu.dispatchEvent(new CustomEvent("action", { detail: { value: "remove" } }))
  await settle()
  expect(document.querySelector("[data-recent] [data-track=golden-hour]")).toBeNull()
  expect(titles()).toContain("Removed from history")
  const undo = [...document.querySelectorAll<HTMLButtonElement>("ui-toast-action button")].find(
    (button) => button.textContent === "Undo"
  )!
  undo.click()
  await settle()
  const order = [...document.querySelectorAll<HTMLElement>("[data-recent] li")].map((row) => row.dataset.track)
  expect(order).toEqual(["sunset-drive", "golden-hour", "coffee-shop", "night-swim"])
})
