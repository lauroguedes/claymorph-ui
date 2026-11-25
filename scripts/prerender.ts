// Writes every page of the docs site as its own HTML file after the build, with its head and content
// in place, plus the sitemap and robots.txt. The pages come from the same code the client renders with,
// loaded through Vite so its imports resolve as they do in the app.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs"
import { dirname, join, resolve } from "node:path"
import { createServer, type Plugin } from "vite"
import { clayAlias } from "./alias"

const HEAD = /<!--seo-->[\s\S]*?<!--\/seo-->/

export function prerender(): Plugin {
  let root = process.cwd()
  let outDir = "dist"
  return {
    name: "clay-prerender",
    apply: "build",
    configResolved(config) {
      root = config.root
      outDir = resolve(config.root, config.build.outDir)
    },
    async closeBundle() {
      const server = await createServer({
        root,
        configFile: false,
        logLevel: "error",
        appType: "custom",
        server: { middlewareMode: true, hmr: false, ws: false },
        resolve: { alias: clayAlias(root) },
        optimizeDeps: { noDiscovery: true, include: [] },
      })
      try {
        const site = await server.ssrLoadModule("/src/site/prerender.ts")
        const template = readFileSync(join(outDir, "index.html"), "utf8")
        if (!HEAD.test(template)) throw new Error("index.html has no <!--seo--> region")
        const pages = site.pages() as Array<{ file: string; head: string; body: string }>
        for (const page of pages) {
          const html = template.replace(HEAD, page.head).replace('<div id="app"></div>', `<div id="app">${page.body}</div>`)
          const file = join(outDir, page.file)
          mkdirSync(dirname(file), { recursive: true })
          writeFileSync(file, html)
        }
        writeFileSync(join(outDir, "sitemap.xml"), site.sitemap(new Date().toISOString().slice(0, 10)))
        writeFileSync(join(outDir, "robots.txt"), site.robots())
        console.log(`prerendered ${pages.length} pages`)
      } finally {
        await server.close()
      }
    },
  }
}
