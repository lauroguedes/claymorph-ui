import { resolve } from "node:path"
import { defineConfig } from "vite"
import { aiFiles } from "./scripts/ai-files"
import { clayAlias } from "./scripts/alias"
import { ogCapture } from "./scripts/og-capture"
import { prerender } from "./scripts/prerender"

export default defineConfig({
  plugins: [aiFiles(), prerender(), ogCapture()],
  resolve: { alias: clayAlias(import.meta.dirname) },
  build: {
    rolldownOptions: {
      input: {
        docs: resolve(import.meta.dirname, "index.html"),
        showcase: resolve(import.meta.dirname, "showcase.html"),
      },
    },
  },
})
