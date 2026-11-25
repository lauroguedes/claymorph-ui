import type { IconNode } from "lucide"

// lucide's own createElement needs a DOM; pages are also rendered at build time, so build the string.
function icon(node: IconNode, className = "icon") {
  const parts = node
    .map(([tag, attrs]) => `<${tag} ${Object.entries(attrs).map(([name, value]) => `${name}="${value}"`).join(" ")}/>`)
    .join("")
  return `<svg class="${className}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${parts}</svg>`
}

export { icon }
