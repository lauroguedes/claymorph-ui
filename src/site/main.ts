import "@ui-sdk/core/web.css"
import "@ui-sdk/web/tabs"
import { createAgent, registerTools } from "@ui-sdk/web/agent"
import "claymorph-ui"
import "claymorph-ui/clay.css"
import { wireCopy } from "./code"
import { componentPages, PAGES, SECTIONS, SITE } from "./content"
import { mountDemos } from "./demos"
import { changelog, docPage, home, notFound } from "./pages"
import { mountPlayground, playground } from "./playground"
import "./site.css"

const app = document.querySelector<HTMLElement>("#app")!

const LOGO = `<svg viewBox="0 0 32 32" aria-hidden="true"><defs><radialGradient id="logo" cx="35%" cy="30%" r="75%"><stop offset="0" stop-color="#bfe6e3"/><stop offset=".6" stop-color="#4e9fa3"/><stop offset="1" stop-color="#2a6f78"/></radialGradient></defs><path d="M16 3c7 0 13 4.5 13 12.5S23.5 29 15.5 29 3 24 3 16.5 9 3 16 3z" fill="url(#logo)"/><ellipse cx="11.5" cy="10.5" rx="4" ry="2.6" fill="#fff" opacity=".45"/></svg>`

const SUN = `<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4.5"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>`

function header(path: string) {
  const link = (href: string, label: string) =>
    `<a href="${href}"${path === href || (href !== "/" && path.startsWith(href)) ? ' aria-current="page"' : ""}>${label}</a>`
  return `
    <header class="site-header">
      <a class="brand" href="/">${LOGO}<span>${SITE.name}</span></a>
      <nav aria-label="Site">
        ${link("/docs", "Docs")}
        ${link("/playground", "Playground")}
        ${link("/changelog", "Changelog")}
        ${link("/docs/ai", "For AI")}
        <a href="/showcase.html">Showcase</a>
      </nav>
      <clay-button size="sm" class="theme-toggle">
        <ui-button><button aria-label="Switch to dark theme" data-theme-toggle>${SUN}</button></ui-button>
      </clay-button>
    </header>`
}

function sidebar(slug: string) {
  const item = (page: (typeof PAGES)[number]) =>
    `<li><a href="/docs/${page.slug}"${page.slug === slug ? ' aria-current="page"' : ""}>${page.verb ? `<span class="side-verb">${page.verb}</span>` : ""}${page.title}</a></li>`
  return `
    <aside class="sidebar">
      <nav aria-label="Docs">
        <p class="side-group">Get started</p>
        <ul>${PAGES.filter((p) => p.group === "start").map(item).join("")}</ul>
        <p class="side-group">Components</p>
        ${SECTIONS.map(
          (section) =>
            `<p class="side-sub">${section}</p><ul>${componentPages()
              .filter((page) => page.section === section)
              .map(item)
              .join("")}</ul>`
        ).join("")}
        <p class="side-group">Resources</p>
        <ul>
          <li><a href="/playground">Playground</a></li>
          <li><a href="/changelog">Changelog</a></li>
          <li><a href="/llms.txt">llms.txt</a></li>
        </ul>
      </nav>
    </aside>`
}

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

function route(path: string) {
  const clean = path.replace(/\/+$/, "") || "/"
  if (clean === "/") return { title: SITE.name, body: home(), shell: false }
  if (clean === "/playground") return { title: `Playground · ${SITE.name}`, body: playground(), shell: false, playground: true }
  if (clean === "/changelog") return { title: `Changelog · ${SITE.name}`, body: changelog(), shell: "changelog" }
  if (clean === "/docs" || clean.startsWith("/docs/")) {
    const slug = clean === "/docs" ? "introduction" : clean.slice(6)
    const page = PAGES.find((p) => p.slug === slug)
    if (page) return { title: `${page.title} · ${SITE.name}`, body: docPage(page), shell: slug, description: page.description }
  }
  return { title: `Not found · ${SITE.name}`, body: notFound(), shell: "missing" }
}

function render(path: string, scroll = true) {
  const view = route(path)
  document.title = view.title
  const main = view.shell
    ? `<div class="docs-shell">${sidebar(typeof view.shell === "string" ? view.shell : "")}<main id="main">${view.body}</main><aside class="toc" aria-label="On this page"></aside></div>`
    : `<main id="main" class="${view.playground ? "wide" : "home"}">${view.body}</main>`
  app.innerHTML = `<a class="skip" href="#main">Skip to content</a>${header(path)}${main}<footer class="site-footer"><p>${SITE.name} · built on <a href="https://ui-sdk.dev">ui-sdk</a> · MIT</p></footer>`
  mountDemos(app)
  wireCopy(app)
  wireTheme()
  wireCopyPage()
  wirePackageManager()
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
