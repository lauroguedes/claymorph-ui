import { Accessibility, Blend, Bot, CodeXml, Layers, Package, ShieldCheck, type IconNode } from "lucide"
import { codeBlock, escape } from "./code"
import { componentPages, orderedPages, RELEASES, SECTIONS, SITE, type Block, type DocPage, type Row } from "./content"
import { demoHtml, preview } from "./demos"
import { icon } from "./icons"

const slugify = (text: string) => text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")

/** Docs text as plain words, for meta descriptions and cards. */
const plain = (text: string) =>
  text
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")

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

const FEATURES: Array<{ icon: IconNode; title: string; text: string }> = [
  {
    icon: Layers,
    title: "One shader, every surface",
    text: "A single WebGL2 context draws all the clay on a page, with springs that swell, squash and melt, and it stops the moment nothing moves.",
  },
  {
    icon: Accessibility,
    title: "Accessible by default",
    text: "The ui-sdk part inside each element keeps the keyboard, focus, ARIA and forms. The clay only adds the material and the motion.",
  },
  {
    icon: Blend,
    title: "Parts that melt together",
    text: "Lists, menus, cards and tags squeeze out of their trigger and stay fused to it, and `fuse` sets how far they melt in.",
  },
  {
    icon: Package,
    title: "Import only what you use",
    text: "One entry per element, with types. A page with a single button ships about 22 KB gzipped, ui-sdk included.",
  },
  {
    icon: ShieldCheck,
    title: "Works without WebGL2",
    text: "Before the first frame, on older devices and in forced colours, the same clay is drawn with CSS, so nothing breaks.",
  },
  {
    icon: Bot,
    title: "Ready for agents",
    text: "`llms.txt`, Markdown docs and an agent skill ship with it, and every control can be operated over WebMCP.",
  },
]

/** A small settings card made of live elements, so the first thing on the page is the clay itself. */
const HERO_ART = `
  <clay-card class="hero-card" color="slate">
    <div class="hero-card-head">
      <clay-avatar color="peach" status="online"><ui-avatar role="img" aria-label="Mia, online"><ui-avatar-fallback aria-hidden="true">MI</ui-avatar-fallback></ui-avatar></clay-avatar>
      <div>
        <p class="hero-card-title">Evening mix</p>
        <p class="hero-card-sub">24 tracks · 1 h 32 min</p>
      </div>
    </div>
    <clay-select attached color="teal" class="hero-select">
      <ui-select default-value="week">
        <ui-select-label>Played</ui-select-label>
        <ui-select-trigger><button><ui-select-value></ui-select-value></button></ui-select-trigger>
        <ui-select-content>
          <ui-select-item value="day">Today</ui-select-item>
          <ui-select-item value="week">This week</ui-select-item>
          <ui-select-item value="month">This month</ui-select-item>
        </ui-select-content>
      </ui-select>
    </clay-select>
    <clay-slider>
      <ui-field>
        <ui-slider default-value="64" aria-label="Volume">
          <div class="clay-slider-head">
            <ui-field-label>Volume</ui-field-label>
            <ui-slider-value></ui-slider-value>
          </div>
          <ui-slider-control>
            <ui-slider-track>
              <ui-slider-indicator></ui-slider-indicator>
              <ui-slider-thumb></ui-slider-thumb>
            </ui-slider-track>
          </ui-slider-control>
        </ui-slider>
      </ui-field>
    </clay-slider>
    <div class="hero-card-foot">
      <label class="demo-label">
        Autoplay
        <clay-switch color="lilac"><ui-switch default-checked><ui-switch-thumb></ui-switch-thumb></ui-switch></clay-switch>
      </label>
      <clay-action-button color="teal" pending-label="Saving…" success-label="Saved">
        <ui-button><button>Save mix</button></ui-button>
      </clay-action-button>
    </div>
  </clay-card>`

function home() {
  const count = componentPages().length
  const latest = RELEASES[0]!
  return `
    <section class="hero">
      <div class="hero-copy">
        <a class="hero-badge" href="/changelog"><span>New</span>${latest.version} · ${escape(latest.title)}</a>
        <h1>${SITE.tagline}</h1>
        <p class="lead">${SITE.name} is ${count} claymorphism web components. One WebGL2 shader gives them a soft clay body, <a href="https://ui-sdk.dev">ui-sdk</a> gives them their keyboard, focus and ARIA, and they work in React, Vue, Svelte, Angular or plain HTML.</p>
        <div class="hero-actions">
          <clay-button color="teal" size="lg">
            <ui-button><a href="/docs/installation">Get started</a></ui-button>
          </clay-button>
          <clay-button size="lg">
            <ui-button><a href="${SITE.source}">${icon(CodeXml)}View on GitHub</a></ui-button>
          </clay-button>
        </div>
        <div class="hero-install">${codeBlock("terminal", INSTALL)}</div>
      </div>
      <div class="hero-art" data-hero>${HERO_ART}</div>
    </section>
    <section class="stats" aria-label="At a glance">
      <div><p class="stat">1</p><p>WebGL2 context for every surface on the page</p></div>
      <div><p class="stat">${count}</p><p>components, each named for what it does</p></div>
      <div><p class="stat">22 KB</p><p>gzipped for a button, ui-sdk included</p></div>
      <div><p class="stat">MIT</p><p>free and open source</p></div>
    </section>
    <section class="features" aria-labelledby="features-title">
      <div class="section-head">
        <p class="eyebrow">Why ${SITE.name}</p>
        <h2 id="features-title">Soft on the outside, solid underneath</h2>
      </div>
      <div class="feature-grid">${FEATURES.map(
        (feature) => `
        <article class="feature">
          ${icon(feature.icon, "feature-icon")}
          <h3>${feature.title}</h3>
          <p>${inline(feature.text)}</p>
        </article>`
      ).join("")}</div>
    </section>
    <section class="components" aria-labelledby="components-title">
      <div class="section-head">
        <p class="eyebrow">Components</p>
        <h2 id="components-title">${count} components, one verb each</h2>
        <p class="lead">Press a button, Pour a select, Spill a menu, Pop a tooltip. Every element is a ui-sdk part you already know, with a clay body around it.</p>
      </div>
      ${grid()}
    </section>
    <section class="start" aria-labelledby="start-title">
      <div class="section-head">
        <p class="eyebrow">Get started</p>
        <h2 id="start-title">Three steps to clay</h2>
      </div>
      <ol class="steps">
        <li><h3>Install</h3>${codeBlock("terminal", `npm install ${SITE.package} \\\n  @ui-sdk/web @ui-sdk/core`)}</li>
        <li><h3>Import what you use</h3>${codeBlock("main.ts", `import "@ui-sdk/core/web.css"\nimport "${SITE.package}/clay.css"\nimport "${SITE.package}/button"`)}</li>
        <li><h3>Write HTML</h3>${codeBlock("index.html", `<clay-button color="teal">\n  <ui-button><button>Save</button></ui-button>\n</clay-button>`)}</li>
      </ol>
    </section>
    <section class="cta" aria-labelledby="cta-title">
      <clay-card color="teal" class="cta-card">
        <h2 id="cta-title">Give your interface some clay.</h2>
        <p>Read the docs, tune the material in the playground, or see a whole app built from the components.</p>
        <div class="hero-actions">
          <clay-button size="lg"><ui-button><a href="/docs/introduction">Read the docs</a></ui-button></clay-button>
          <clay-button size="lg" color="lilac"><ui-button><a href="/playground">Open the playground</a></ui-button></clay-button>
          <clay-button size="lg" color="peach"><ui-button><a href="/showcase.html">See the showcase</a></ui-button></clay-button>
        </div>
      </clay-card>
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

export { changelog, docPage, home, notFound, plain, slugify }
