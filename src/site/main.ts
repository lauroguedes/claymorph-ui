import "@ui-sdk/core/web.css"
import "@ui-sdk/web/tabs"
import { createAgent, registerTools } from "@ui-sdk/web/agent"
import "claymorph-ui"
import "claymorph-ui/clay.css"
import type { ClayActionButton } from "claymorph-ui/action-button"
import { wireCopy } from "./code"
import { SITE } from "./content"
import { mountDemos } from "./demo-scripts"
import "./logo"
import { mountPlayground } from "./playground"
import { headTags } from "./seo"
import { layout, route, type View } from "./shell"
import "./site.css"

const app = document.querySelector<HTMLElement>("#app")!

function toc(root: HTMLElement) {
  const headings = [...root.querySelectorAll<HTMLHeadingElement>(".doc h2[id]")]
  const rail = root.querySelector<HTMLElement>(".toc")
  if (!rail || headings.length < 2) return
  rail.innerHTML = `<p class="side-group">On this page</p><ul>${headings
    .map((h) => `<li><a href="#${h.id}">${h.textContent}</a></li>`)
    .join("")}</ul>`
  const links = new Map(headings.map((h) => [h, rail.querySelector<HTMLAnchorElement>(`a[href="#${h.id}"]`)!]))
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue
        links.forEach((a) => a.removeAttribute("aria-current"))
        links.get(entry.target as HTMLHeadingElement)?.setAttribute("aria-current", "true")
      }
    },
    { rootMargin: "0px 0px -70% 0px" }
  )
  headings.forEach((h) => observer.observe(h))
}

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

/** Swaps the head's title, description, canonical link and social tags for the new page's. */
function updateHead(view: View) {
  for (const tag of document.head.querySelectorAll("[data-seo]")) tag.remove()
  document.head.insertAdjacentHTML("beforeend", headTags(view))
}

function render(path: string, scroll = true) {
  const view = route(path)
  updateHead(view)
  // The build already rendered this page into #app; rendering it again wires the same markup.
  app.innerHTML = layout(view, path)
  mountDemos(app)
  wireCopy(app)
  wireTheme()
  wireCopyPage()
  wirePackageManager()
  const save = app.querySelector<ClayActionButton>("[data-hero] clay-action-button")
  if (save) save.action = () => wait(1400)
  if (view.playground) mountPlayground(app)
  toc(app)
  if (scroll && !location.hash) window.scrollTo(0, 0)
  else if (location.hash) document.getElementById(location.hash.slice(1))?.scrollIntoView()
}

function wireCopyPage() {
  const button = app.querySelector<HTMLButtonElement>("[data-copy-page]")
  button?.closest("ui-button")?.addEventListener("action", (event) => {
    const run = fetch(`/docs/${button.dataset.copyPage}.md`)
      .then((response) => response.text())
      .then((text) => navigator.clipboard.writeText(text))
      .catch(() => undefined)
    ;(event as CustomEvent<{ waitUntil(p: Promise<unknown>): void }>).detail.waitUntil(run)
  })
}

const PM = "clay-pm"

function wirePackageManager() {
  for (const control of app.querySelectorAll<HTMLElement & { value: string | null }>(".pm ui-segmented-control")) {
    let saved = "npm"
    try {
      saved = localStorage.getItem(PM) ?? "npm"
    } catch {
      // Defaults to npm.
    }
    const code = control.closest(".install")!.querySelector("code")!
    const show = (pm: string) => {
      code.textContent = `${pm === "npm" ? "npm install" : `${pm} add`} ${SITE.package} @ui-sdk/web @ui-sdk/core`
    }
    customElements.whenDefined("ui-segmented-control").then(() => {
      control.value = saved
      show(saved)
    })
    control.addEventListener("valuechange", (event) => {
      const value = (event as CustomEvent<{ value: string | null }>).detail.value ?? "npm"
      show(value)
      try {
        localStorage.setItem(PM, value)
      } catch {
        // Not remembering is fine.
      }
    })
  }
}

function currentTheme() {
  return (
    document.documentElement.dataset.theme ?? (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light")
  )
}

function wireTheme() {
  const button = app.querySelector<HTMLButtonElement>("[data-theme-toggle]")!
  const sync = () => button.setAttribute("aria-label", currentTheme() === "dark" ? "Switch to light theme" : "Switch to dark theme")
  sync()
  button.closest("ui-button")!.addEventListener("action", () => {
    const next = currentTheme() === "dark" ? "light" : "dark"
    document.documentElement.dataset.theme = next
    try {
      localStorage.setItem("clay-theme", next)
    } catch {
      // The theme just won't persist.
    }
    sync()
  })
}

try {
  const saved = localStorage.getItem("clay-theme")
  if (saved) document.documentElement.dataset.theme = saved
} catch {
  // Follow the system.
}

document.addEventListener("click", (event) => {
  if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey) return
  const link = (event.target as Element).closest?.("a")
  if (!link || link.target || link.origin !== location.origin) return
  const path = link.pathname
  if (/\.(md|txt|html)$/.test(path)) return
  if (path === location.pathname && link.hash) return
  event.preventDefault()
  history.pushState(null, "", path + link.hash)
  render(path)
})

addEventListener("popstate", () => render(location.pathname, false))

render(location.pathname, false)

const agent = createAgent()
registerTools(agent, {
  allow: (step) => (step.confirm ? Promise.resolve(window.confirm(step.confirm)) : true),
})
