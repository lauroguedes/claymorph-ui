import { resolve } from "node:path"
import { defineConfig } from "vite"
import { aiFiles } from "./scripts/ai-files"

// The site imports Clay by its package name, straight from the source.
const clay = [
  { find: /^claymorph-ui\/clay\.css$/, replacement: resolve(import.meta.dirname, "src/clay/clay.css") },
  { find: /^claymorph-ui\/(.+)$/, replacement: resolve(import.meta.dirname, "src/clay/entries/$1.ts") },
  { find: /^claymorph-ui$/, replacement: resolve(import.meta.dirname, "src/clay/index.ts") },
]

export default defineConfig({
  plugins: [aiFiles()],
  resolve: { alias: clay },
  build: {
    rollupOptions: {
      input: {
        docs: resolve(import.meta.dirname, "index.html"),
        showcase: resolve(import.meta.dirname, "showcase.html"),
      },
    },
  },
})
