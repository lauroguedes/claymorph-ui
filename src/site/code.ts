const escape = (text: string) =>
  text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;")

type Rule = [RegExp, string]

const LANGS: Record<string, Rule[]> = {
  html: [
    [/<!--[\s\S]*?-->/, "comment"],
    [/<\/?[\w-]+/, "tag"],
    [/\/?>/, "tag"],
    [/"[^"]*"/, "string"],
    [/[\w-:]+(?==)/, "attr"],
  ],
  ts: [
    [/\/\/.*|\/\*[\s\S]*?\*\//, "comment"],
    [/`(?:\\.|[^`])*`|"(?:\\.|[^"])*"|'(?:\\.|[^'])*'/, "string"],
    [/\b(?:import|export|from|const|let|function|return|async|await|new|throw|default|type|interface|if|else)\b/, "keyword"],
    [/\b\d+(?:\.\d+)?\b/, "number"],
  ],
  css: [
    [/\/\*[\s\S]*?\*\//, "comment"],
    [/--[\w-]+/, "attr"],
    [/#[\da-fA-F]{3,8}\b/, "number"],
    [/[\w-]+(?=\s*\{)/, "tag"],
  ],
  bash: [
    [/#.*/, "comment"],
    [/^\s*(?:npm|pnpm|yarn|bun|npx)\b/m, "keyword"],
    [/"[^"]*"/, "string"],
  ],
  text: [],
}

const langOf = (title: string) => {
  if (title.endsWith(".html")) return "html"
  if (title.endsWith(".ts")) return "ts"
  if (title.endsWith(".css")) return "css"
  if (title === "terminal") return "bash"
  return "text"
}

function highlight(code: string, lang: string) {
  const rules = LANGS[lang] ?? []
  if (!rules.length) return escape(code)
  const pattern = new RegExp(rules.map(([re]) => `(${re.source})`).join("|"), "gm")
  let out = ""
  let last = 0
  for (const match of code.matchAll(pattern)) {
    const index = match.index!
    out += escape(code.slice(last, index))
    const group = match.slice(1).findIndex((value) => value !== undefined)
    out += `<span class="tok-${rules[group]![1]}">${escape(match[0])}</span>`
    last = index + match[0].length
  }
  return out + escape(code.slice(last))
}

let copies = 0

function codeBlock(title: string, code: string) {
  copies += 1
  return `
    <figure class="code">
      <figcaption>
        <span class="code-title">${escape(title)}</span>
        <ui-button><button class="copy" type="button" aria-label="Copy ${escape(title)} (${copies})" data-copy>${COPY_ICON}</button></ui-button>
      </figcaption>
      <pre><code>${highlight(code.trim(), langOf(title))}</code></pre>
      <template data-source>${escape(code.trim())}</template>
    </figure>`
}

const COPY_ICON =
  '<svg aria-hidden="true" viewBox="0 0 24 24"><rect x="9" y="9" width="12" height="12" rx="3"/><path d="M5 15V6a2 2 0 0 1 2-2h9"/></svg>'
const CHECK_ICON = '<svg aria-hidden="true" viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7"/></svg>'

function wireCopy(root: ParentNode) {
  for (const wrapper of root.querySelectorAll<HTMLElement>("figure.code ui-button")) {
    wrapper.addEventListener("action", async () => {
      const figure = wrapper.closest("figure")!
      const template = figure.querySelector<HTMLTemplateElement>("template[data-source]")!
      const button = wrapper.querySelector("button")!
      try {
        await navigator.clipboard.writeText(template.innerHTML.replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&amp;/g, "&"))
        button.innerHTML = CHECK_ICON
        setTimeout(() => (button.innerHTML = COPY_ICON), 1400)
      } catch {
        button.title = "Copying isn't allowed here"
      }
    })
  }
}

export { codeBlock, escape, highlight, langOf, wireCopy }
