import { resolve } from "node:path"

/** The site imports Clay by its package name, straight from the source. */
export const clayAlias = (root: string) => [
  { find: /^claymorph-ui\/clay\.css$/, replacement: resolve(root, "src/clay/clay.css") },
  { find: /^claymorph-ui\/(.+)$/, replacement: resolve(root, "src/clay/entries/$1.ts") },
  { find: /^claymorph-ui$/, replacement: resolve(root, "src/clay/index.ts") },
]
