import { expect, test } from "vitest"
import { SITE } from "./content"
import { headTags } from "./seo"
import { route, routes } from "./shell"

// The cards on disk, by name, without loading them.
const cards = new Set(Object.keys(import.meta.glob("../../public/og/*.jpg")).map((path) => path.split("/").pop()))

const pages = [...new Map(routes().map((path) => [route(path).path, route(path)])).values()]

test("every page has its own title, a description short enough for search results, and a social card", () => {
  const titles = new Set<string>()
  for (const view of pages) {
    expect(titles.has(view.title), `${view.path} repeats a title`).toBe(false)
    titles.add(view.title)
    expect(view.description.length, `${view.path}'s description`).toBeGreaterThan(30)
    expect(view.description.length, `${view.path}'s description`).toBeLessThanOrEqual(160)
    expect(cards.has(`${view.og}.jpg`), `public/og/${view.og}.jpg: run /og.html?save`).toBe(true)
  }
})

test("a page's head points search engines and link previews at its one address", () => {
  const head = headTags(route("/docs/select"))
  expect(head).toContain(`<link data-seo rel="canonical" href="${SITE.url}/docs/select" />`)
  expect(head).toContain(`content="${SITE.url}/og/docs-select.jpg"`)
  expect(head).toContain('name="twitter:card" content="summary_large_image"')
  expect(head).toContain("application/ld+json")
  expect(route("/docs").path, "/docs is the introduction under another name").toBe("/docs/introduction")
  const missing = headTags(route("/no-such-page"))
  expect(missing).toContain('name="robots" content="noindex"')
  expect(missing).not.toContain("canonical")
})
