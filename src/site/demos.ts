import { codeBlock } from "./code"

// Markup and source only: this module also renders pages at build time, where the demos can't run.
const markup = import.meta.glob<string>("./demos/*.html", { query: "?raw", import: "default", eager: true })
const scriptSource = import.meta.glob<string>("./demos/*.ts", { query: "?raw", import: "default", eager: true })

const html = (id: string) => markup[`./demos/${id}.html`]
const source = (id: string) => scriptSource[`./demos/${id}.ts`]

let previews = 0

/** A stage that runs the demo, with its exact source one tab away. */
function preview(id: string, title: string) {
  const demo = html(id)
  if (!demo) return `<p class="missing">Missing demo: ${id}</p>`
  previews += 1
  const n = previews
  const code = source(id)
  return `
    <ui-tabs class="preview" default-value="preview">
      <div class="preview-bar">
        <ui-tabs-list aria-label="${title} (${n})">
          <ui-tabs-tab value="preview"><button>Preview</button></ui-tabs-tab>
          <ui-tabs-tab value="code"><button>Code</button></ui-tabs-tab>
        </ui-tabs-list>
        <span class="preview-file">${id}.html</span>
      </div>
      <ui-tabs-panel value="preview" keep-mounted>
        <div class="stage" data-demo="${id}">${demo}</div>
      </ui-tabs-panel>
      <ui-tabs-panel value="code" keep-mounted>
        ${codeBlock(`${id}.html`, demo)}
        ${code ? codeBlock(`${id}.ts`, code) : ""}
      </ui-tabs-panel>
    </ui-tabs>`
}

export { html as demoHtml, preview }
