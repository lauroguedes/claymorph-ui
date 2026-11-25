import { codeBlock, escape } from "./code"
import { componentPages, orderedPages, RELEASES, SECTIONS, SITE, type Block, type DocPage, type Row } from "./content"
import { demoHtml, preview } from "./demos"

const slugify = (text: string) => text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")

function inline(text: string) {
  return escape(text)
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/\[([^\]]+)\]\((\/[^)]*)\)/g, '<a href="$2">$1</a>')
}

const TOKENS: Row[] = [
  { name: "--clay-color", type: "color", description: "The element's own clay. Set by `color`." },
  { name: "--clay-surface", type: "color", default: "#dde5ed", description: "Grooves and boxes of controls." },
  { name: "--clay-knob", type: "color", default: "#f6f9fb", description: "Knobs, balls and the segmented bead." },
  { name: "--clay-popup", type: "color", default: "#eef3f7", description: "Select lists, menus, popovers, dialogs and plain toasts." },
  { name: "--clay-success / --clay-danger", type: "color", description: "Roll's bead when it lands or fails, success and error toasts, an invalid field's rim." },
  { name: "--clay-danger-text", type: "color", description: "Danger menu items and error messages written on clay." },
  { name: "--clay-teal … --clay-ink", type: "color", description: "The ten presets `color` accepts." },
  { name: "--clay-text / --clay-text-soft", type: "color", description: "Text on light clay." },
  { name: "--clay-ring", type: "color", description: "Focus outlines." },
  { name: "--clay-spring", type: "easing", description: "A `linear()` spring for CSS motion: popups, labels, icons." },
]

function table(title: string, rows: Row[]) {
  return `
    <h3 class="api-title">${escape(title)}</h3>
    <div class="table-wrap"><table class="api">
      <thead><tr><th>Name</th><th>Type</th><th>Default</th></tr></thead>
      <tbody>${rows
        .map(
          (row) => `
        <tr>
          <td><code>${escape(row.name)}</code><p>${inline(row.description)}</p></td>
          <td><code class="type">${escape(row.type)}</code></td>
          <td>${row.default ? `<code>${escape(row.default)}</code>` : "—"}</td>
        </tr>`
        )
        .join("")}</tbody>
    </table></div>`
}

function tiles(pages: DocPage[]) {
  return `<div class="grid">${pages
    .map(
      (page) => `
    <article class="tile">
      <div class="stage tile-stage" data-demo="${page.hero}">${demoHtml(page.hero!) ?? ""}</div>
      <a class="tile-link" href="/docs/${page.slug}">
        <span class="tile-verb">${page.verb}</span>
        <span class="tile-title">${page.title}</span>
        <span class="tile-sig">${page.signature}</span>
        <svg aria-hidden="true" viewBox="0 0 24 24"><path d="M5 12h13M13 6l6 6-6 6"/></svg>
      </a>
    </article>`
    )
    .join("")}</div>`
}

function grid() {
  return SECTIONS.map(
    (section) => `
    <section class="grid-section" aria-labelledby="section-${slugify(section)}">
      <h2 class="grid-heading" id="section-${slugify(section)}">${section}</h2>
      ${tiles(componentPages().filter((page) => page.section === section))}
    </section>`
  ).join("")
}

const INSTALL = `npm install ${SITE.package} @ui-sdk/web @ui-sdk/core`

function install() {
  return `
    <h2 id="installation">Installation</h2>
    <div class="install">
      <clay-segmented class="pm">
        <ui-segmented-control aria-label="Package manager" default-value="npm">
          <ui-segmented-control-indicator></ui-segmented-control-indicator>
          ${["npm", "pnpm", "yarn", "bun"].map((pm) => `<ui-segmented-control-item value="${pm}">${pm}</ui-segmented-control-item>`).join("")}
        </ui-segmented-control>
      </clay-segmented>
      ${codeBlock("terminal", INSTALL)}
      <p>Then import <code>${SITE.package}/clay.css</code> once and each element you use, like <code>${SITE.package}/button</code>.</p>
    </div>`
}

function block(b: Block, page: DocPage): string {
  switch (b.type) {
    case "p":
      return `<p>${inline(b.text)}</p>`
    case "h":
      return `<h2 id="${slugify(b.text)}">${escape(b.text)}</h2>`
    case "list":
      return `<ul class="list">${b.items.map((item) => `<li>${inline(item)}</li>`).join("")}</ul>`
    case "note":
      return `<aside class="note">${inline(b.text)}</aside>`
    case "demo":
      return `<div class="example">${preview(b.id, b.title)}</div>`
    case "code":
      return codeBlock(b.title, b.code)
    case "install":
      return install()
    case "when":
      return `
        <div class="when">
          <div><h3>Use it for</h3><ul>${b.use.map((u) => `<li class="yes">${inline(u)}</li>`).join("")}</ul></div>
          <div><h3>Not for</h3><ul>${b.avoid.map((a) => `<li class="no">${inline(a)}</li>`).join("")}</ul></div>
        </div>`
    case "api":
      return table(b.title, b.rows)
    case "tokens":
      return table("Tokens", TOKENS)
    case "index":
      return grid()
  }
  void page
}

function docPage(page: DocPage) {
  const all = orderedPages()
  const index = all.indexOf(page)
  const prev = all[index - 1]
  const next = all[index + 1]
  return `
    <article class="doc">
      <header class="doc-head">
        <p class="eyebrow">${page.group === "start" ? "Get started" : `Components · ${page.verb}`}</p>
        <h1>${escape(page.title)}${page.tag ? ` <code class="tag">&lt;${page.tag}&gt;</code>` : ""}</h1>
        <p class="lead">${inline(page.description)}</p>
        <div class="doc-actions">
          <clay-button size="sm">
            <ui-button><button data-copy-page="${page.slug}">Copy page</button></ui-button>
          </clay-button>
          <a class="text-link" href="/docs/${page.slug}.md">Markdown</a>
        </div>
      </header>
      ${page.hero ? `<div class="hero-preview">${preview(page.hero, `${page.title} preview`)}</div>` : ""}
      ${page.blocks.map((b) => block(b, page)).join("")}
      <nav class="pager" aria-label="Pages">
        ${prev ? `<a href="/docs/${prev.slug}"><span>Previous</span>${prev.title}</a>` : "<span></span>"}
        ${next ? `<a href="/docs/${next.slug}" class="next"><span>Next</span>${next.title}</a>` : ""}
      </nav>
    </article>`
}

function home() {
  return `
    <section class="hero">
      <p class="eyebrow">${SITE.name} · web components</p>
      <h1>${SITE.tagline}</h1>
      <p class="lead">${componentPages().length} soft clay components for any page. One WebGL2 shader draws them, <a href="https://ui-sdk.dev">ui-sdk</a> gives them their keyboard, focus and ARIA, and plain CSS takes over when WebGL2 isn't there.</p>
      <div class="hero-actions">
        <clay-button color="teal" size="lg">
          <ui-button><a href="/docs">Get started</a></ui-button>
        </clay-button>
        <clay-button size="lg">
          <ui-button><a href="/playground">Open the playground</a></ui-button>
        </clay-button>
      </div>
    </section>
    <section aria-label="Components">${grid()}</section>
    <section class="facts" aria-label="Facts">
      <div><p class="fact">1</p><p>WebGL2 context for every surface on the page.</p></div>
      <div><p class="fact">${componentPages().length}</p><p>components, one verb each.</p></div>
      <div><p class="fact">0</p><p>dependencies besides ui-sdk.</p></div>
    </section>
    <section class="home-install">
      <h2>Install in one command</h2>
      ${codeBlock("terminal", INSTALL)}
      ${codeBlock("index.html", `<clay-button color="teal">\n  <ui-button><button>Get started</button></ui-button>\n</clay-button>`)}
    </section>`
}

function changelog() {
  return `
    <article class="doc">
      <header class="doc-head">
        <p class="eyebrow">Changelog</p>
        <h1>What's new</h1>
      </header>
      ${RELEASES.map(
        (release) => `
        <section class="release">
          <h2 id="v${release.version}">${release.version} <span>${escape(release.title)}</span></h2>
          <p class="date">${release.date}</p>
          <ul class="list">${release.changes
            .map((change) => `<li><span class="kind kind-${change.kind}">${change.kind}</span> ${inline(change.text)}</li>`)
            .join("")}</ul>
        </section>`
      ).join("")}
    </article>`
}

function notFound() {
  return `<article class="doc"><h1>Not found</h1><p class="lead">That page isn't here. <a href="/docs">Back to the docs</a>.</p></article>`
}

export { changelog, docPage, home, notFound, slugify }
