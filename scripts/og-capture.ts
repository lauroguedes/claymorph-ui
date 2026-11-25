// Dev only: lets og.html save the social cards and icons it draws with the real clay engine into
// public/, so they're committed and served as static files. Nothing else can be written.
import { mkdirSync, writeFileSync } from "node:fs"
import { join } from "node:path"
import type { Plugin } from "vite"

const NAME = /^\/__og\/(og\/[a-z0-9-]+\.jpg|[a-z0-9-]+\.png)$/

export function ogCapture(): Plugin {
  return {
    name: "clay-og-capture",
    apply: "serve",
    configureServer(server) {
      server.middlewares.use((request, response, next) => {
        const match = request.method === "POST" ? NAME.exec(request.url ?? "") : null
        if (!match) return next()
        const chunks: Buffer[] = []
        request.on("data", (chunk: Buffer) => chunks.push(chunk))
        request.on("end", () => {
          const file = join(server.config.root, "public", match[1]!)
          mkdirSync(join(file, ".."), { recursive: true })
          writeFileSync(file, Buffer.concat(chunks))
          response.statusCode = 204
          response.end()
        })
      })
    },
  }
}
