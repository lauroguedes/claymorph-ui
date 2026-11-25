import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs"
import { dirname, join } from "node:path"
import type { Plugin } from "vite"
import { componentPages, orderedPages, SITE, type Block, type DocPage, type Row } from "../src/site/content"

const fence = (lang: string, code: string) => `\`\`\`${lang}\n${code.trim()}\n\`\`\``

const table = (rows: Row[]) =>
  [
    "| Name | Type | Default | Description |",
    "| --- | --- | --- | --- |",
    ...rows.map(
      (row) =>
        `| \`${row.name}\` | \`${row.type.replace(/\|/g, "\\|")}\` | ${row.default ? `\`${row.default}\`` : "—"} | ${row.description.replace(/\|/g, "\\|")} |`
    ),
  ].join("\n")

function blockToMarkdown(root: string, block: Block): string {
  switch (block.type) {
    case "p":
      return block.text
    case "h":
      return `## ${block.text}`
    case "list":
      return block.items.map((item) => `- ${item}`).join("\n")
    case "note":
      return `> ${block.text}`
    case "demo": {
      const demos = join(root, "src/site/demos")
      const html = join(demos, `${block.id}.html`)
      const ts = join(demos, `${block.id}.ts`)
      if (!existsSync(html)) throw new Error(`Unknown demo "${block.id}"`)
      const parts = [`### ${block.title}`, fence("html", readFileSync(html, "utf8"))]
      if (existsSync(ts)) parts.push(fence("ts", readFileSync(ts, "utf8")))
      return parts.join("\n\n")
    }
    case "code":
      return fence(block.title.endsWith(".ts") ? "ts" : block.title.endsWith(".html") ? "html" : "text", block.code)
    case "install":
      return `## Installation\n\n${fence("bash", `npm install ${SITE.package} @ui-sdk/web @ui-sdk/core`)}\n\nThen import \`${SITE.package}/clay.css\` once and each element you use, like \`${SITE.package}/button\`.`
    case "when":
      return `**Use it for**\n\n${block.use.map((u) => `- ${u}`).join("\n")}\n\n**Not for**\n\n${block.avoid.map((a) => `- ${a}`).join("\n")}`
    case "api":
      return `### ${block.title}\n\n${table(block.rows)}`
    case "tokens":
      return "Tokens: `--clay-color`, `--clay-surface`, `--clay-knob`, `--clay-popup`, `--clay-success`, `--clay-danger`, the presets `--clay-teal` … `--clay-ink`, `--clay-text`, `--clay-ring` and the `--clay-spring` easing."
    case "index":
      return componentPages()
        .map((page) => `- **${page.verb}**: [${page.title}](/docs/${page.slug}.md), \`<${page.tag}>\`. ${page.signature}`)
        .join("\n")
  }
}

function pageToMarkdown(root: string, page: DocPage) {
  const head = page.tag ? `# ${page.title} (\`<${page.tag}>\`)` : `# ${page.title}`
  const hero = page.hero ? [blockToMarkdown(root, { type: "demo", id: page.hero, title: "Preview" })] : []
  return [head, page.description, ...hero, ...page.blocks.map((block) => blockToMarkdown(root, block))].join("\n\n") + "\n"
}

const RULES = `## Rules for AI agents

- Wrap ui-sdk parts in a clay element: \`<clay-button><ui-button><button>…</button></ui-button></clay-button>\`. Keep the ui-sdk part's own markup inside it exactly as its docs show.
- Never recreate the clay with your own \`box-shadow\`, canvas or SVG. The elements draw it with WebGL2 and fall back to CSS by themselves.
- Import once: \`import "@ui-sdk/core/web.css"\` then \`import "./clay"\` (the copied \`src/clay/\` folder).
- Colour with the \`color\` attribute (a preset or any CSS colour) or the \`--clay-*\` variables. Tune the material with the \`CLAY\` object.
- Pick by verb: ${componentPages()
  .map((page) => `${page.verb} → \`<${page.tag}>\``)
  .join(", ")}.
- Behaviour, events and names come from the ui-sdk part inside: listen on \`<ui-button>\`, \`<ui-switch>\` and so on, and name every control.`

function generate(root: string) {
  const pub = join(root, "public")
  const write = (file: string, text: string) => {
    mkdirSync(dirname(file), { recursive: true })
    writeFileSync(file, text)
  }
  const markdown = orderedPages().map((page) => [page, pageToMarkdown(root, page)] as const)
  for (const [page, text] of markdown) write(join(pub, "docs", `${page.slug}.md`), text)

  const group = (name: DocPage["group"]) =>
    orderedPages()
      .filter((page) => page.group === name)
      .map((page) => `- [${page.title}](/docs/${page.slug}.md)${page.verb ? ` (${page.verb})` : ""}: ${page.description.replace(/\s+/g, " ")}`)
      .join("\n")

  const llms = `# ${SITE.name}

> ${SITE.summary}

${RULES}

## Get started

${group("start")}

## Components

${group("components")}

## Optional

- [Everything in one file](/llms-full.txt)
- [Changelog](/changelog)
`
  write(join(pub, "llms.txt"), llms)
  write(join(pub, "llms-full.txt"), `# ${SITE.name}\n\n> ${SITE.summary}\n\n${RULES}\n\n${markdown.map(([, text]) => text).join("\n---\n\n")}`)
  write(
    join(root, "skills/clay-ui/references/components.md"),
    `<!-- Generated from src/site/content.ts by scripts/ai-files.ts. Do not edit. -->\n\n${markdown
      .filter(([page]) => page.group === "components")
      .map(([, text]) => text)
      .join("\n---\n\n")}`
  )
}

function aiFiles(): Plugin {
  let root = process.cwd()
  return {
    name: "clay-ai-files",
    configResolved(config) {
      root = config.root
    },
    buildStart() {
      generate(root)
    },
    configureServer(server) {
      generate(root)
      server.watcher.on("change", (file) => {
        if (file.includes("src/site/content.ts") || file.includes("src/site/demos/")) generate(root)
      })
    },
  }
}

export { aiFiles }
