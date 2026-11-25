// Everything a page is made of, as strings: the client renders it on navigation, and the build renders
// every route ahead of time with it, so nothing here may touch the DOM or load the elements.
import { CodeXml, Package } from "lucide"
import { componentPages, PAGES, SECTIONS, SITE } from "./content"
import { icon } from "./icons"
import { changelog, docPage, home, notFound, plain } from "./pages"
import { playground } from "./playground"

/** The mark as an SVG, inside `<clay-logo>`, until its clay draws or where WebGL2 isn't there. */
const LOGO_MARK = `<svg viewBox="0 0 32 32" aria-hidden="true"><defs><radialGradient id="logo-body" cx="35%" cy="32%" r="75%"><stop offset="0" stop-color="#bfe6e3"/><stop offset=".6" stop-color="#4e9fa3"/><stop offset="1" stop-color="#2a6f78"/></radialGradient><radialGradient id="logo-bead" cx="35%" cy="30%" r="80%"><stop offset="0" stop-color="#e4defc"/><stop offset="1" stop-color="#8d7fd6"/></radialGradient></defs><circle cx="14" cy="17.5" r="11.5" fill="url(#logo-body)"/><circle cx="26.2" cy="6" r="4.6" fill="url(#logo-bead)"/><ellipse cx="10" cy="12.5" rx="3.6" ry="2.3" fill="#fff" opacity=".4"/></svg>`

const SUN = `<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4.5"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>`

/** Search results show about 160 characters: cut longer text at a word, not mid-way. */
const excerpt = (text: string, max = 158) => {
  if (text.length <= max) return text
  const cut = text.slice(0, max)
  return `${cut.slice(0, cut.lastIndexOf(" ")).replace(/[,;:]$/, "")}…`
}

interface View {
  /** The page's own address, which canonical links and the sitemap use. */
  path: string
  title: string
  description: string
  /** What the page's social card says. */
  card: { eyebrow: string; heading: string }
  /** The social card image, `/og/<og>.jpg`. */
  og: string
  body: string
  shell: string | false
  playground?: boolean
  article?: boolean
  missing?: boolean
}

function header(path: string) {
  const link = (href: string, label: string) =>
    `<a href="${href}"${path === href || (href !== "/" && path.startsWith(href)) ? ' aria-current="page"' : ""}>${label}</a>`
  return `
    <header class="site-header">
      <a class="brand" href="/" aria-label="${SITE.name} home"><clay-logo>${LOGO_MARK}</clay-logo><span>${SITE.name}</span></a>
      <nav aria-label="Site">
        ${link("/docs", "Docs")}
        ${link("/playground", "Playground")}
        ${link("/changelog", "Changelog")}
        ${link("/docs/ai", "For AI")}
        <a href="/showcase.html">Showcase</a>
      </nav>
      <div class="header-links">
        <a class="icon-link" href="${SITE.source}" aria-label="${SITE.name} on GitHub">${icon(CodeXml)}</a>
        <a class="icon-link" href="${SITE.npm}" aria-label="${SITE.package} on npm">${icon(Package)}</a>
      </div>
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

function footer() {
  const column = (title: string, links: Array<[string, string]>) =>
    `<div><p class="footer-title">${title}</p><ul>${links.map(([href, label]) => `<li><a href="${href}">${label}</a></li>`).join("")}</ul></div>`
  return `
    <footer class="site-footer">
      <div class="footer-inner">
        <div class="footer-brand">
          <a class="brand" href="/"><clay-logo>${LOGO_MARK}</clay-logo><span>${SITE.name}</span></a>
          <p>${SITE.tagline} Claymorphism web components, built on <a href="https://ui-sdk.dev">ui-sdk</a>.</p>
        </div>
        ${column("Docs", [
          ["/docs/introduction", "Introduction"],
          ["/docs/installation", "Installation"],
          ["/docs/theming", "Theming"],
          ["/docs/button", "Components"],
        ])}
        ${column("Resources", [
          ["/playground", "Playground"],
          ["/showcase.html", "Showcase"],
          ["/changelog", "Changelog"],
          ["/llms.txt", "llms.txt"],
        ])}
        ${column("Project", [
          [SITE.source, "GitHub"],
          [SITE.npm, "npm"],
          [`${SITE.source}/issues`, "Issues"],
          [`${SITE.source}/blob/main/LICENSE`, "MIT License"],
        ])}
      </div>
      <p class="footer-legal">© ${new Date().getFullYear()} ${SITE.author}. Released under the MIT License.</p>
    </footer>`
}

function route(path: string): View {
  const clean = path.replace(/\/+$/, "") || "/"
  if (clean === "/") {
    return {
      path: "/",
      title: `${SITE.name} · Claymorphism web components`,
      description: `${componentPages().length} claymorphism web components drawn by one WebGL2 shader, accessible by default with ui-sdk. Any framework, with a CSS fallback.`,
      card: { eyebrow: "Claymorphism web components", heading: SITE.tagline },
      og: "home",
      body: home(),
      shell: false,
    }
  }
  if (clean === "/playground") {
    return {
      path: clean,
      title: `Playground · ${SITE.name}`,
      description: `Tune ${SITE.name}'s clay live: light, sheen, grain, shadows and motion, then copy the values into your app.`,
      card: { eyebrow: "Playground", heading: "Tune the clay" },
      og: "playground",
      body: playground(),
      shell: false,
      playground: true,
    }
  }
  if (clean === "/changelog") {
    return {
      path: clean,
      title: `Changelog · ${SITE.name}`,
      description: `What's new in ${SITE.name}, release by release.`,
      card: { eyebrow: "Changelog", heading: "What's new" },
      og: "changelog",
      body: changelog(),
      shell: "changelog",
    }
  }
  if (clean === "/docs" || clean.startsWith("/docs/")) {
    const slug = clean === "/docs" ? "introduction" : clean.slice(6)
    const page = PAGES.find((p) => p.slug === slug)
    if (page) {
      return {
        path: `/docs/${page.slug}`,
        title: `${page.title} · ${SITE.name}`,
        description: excerpt(plain(page.description)),
        card: {
          eyebrow: page.group === "start" ? "Docs" : `Components · ${page.verb}`,
          heading: page.tag ? `${page.title}` : page.title,
        },
        og: `docs-${page.slug}`,
        body: docPage(page),
        shell: slug,
        article: true,
      }
    }
  }
  return {
    path: clean,
    title: `Not found · ${SITE.name}`,
    description: "That page isn't here.",
    card: { eyebrow: SITE.name, heading: "Not found" },
    og: "home",
    body: notFound(),
    shell: "missing",
    missing: true,
  }
}

/** Everything inside `#app` for a view. */
function layout(view: View, path: string) {
  const main = view.shell
    ? `<div class="docs-shell">${sidebar(view.shell)}<main id="main">${view.body}</main><aside class="toc" aria-label="On this page"></aside></div>`
    : `<main id="main" class="${view.playground ? "wide" : "home"}">${view.body}</main>`
  return `<a class="skip" href="#main">Skip to content</a>${header(path)}${main}${footer()}`
}

/** Every page the site has, to render ahead of time. `/docs` is the introduction under another name. */
function routes() {
  return ["/", "/docs", ...PAGES.map((page) => `/docs/${page.slug}`), "/playground", "/changelog"]
}

export { layout, LOGO_MARK, route, routes, type View }
