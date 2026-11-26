// Builds the npm package in packages/claymorph-ui from src/clay: one ES module per source file, so a
// bundler keeps only the elements a page imports, their declarations, the stylesheet, and an exports
// map with one entry per element. It also builds the CDN files for a page with no bundler: every
// element and the ui-sdk parts they wrap in one module, and one stylesheet. The version comes from the
// latest release in the changelog.
import { execFileSync } from "node:child_process"
import { copyFileSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from "node:fs"
import { join, resolve } from "node:path"
import { build } from "vite"

const root = resolve(import.meta.dirname, "..")
const source = join(root, "src/clay")
const pkg = join(root, "packages/claymorph-ui")
const dist = join(pkg, "dist")

const entries = readdirSync(join(source, "entries"))
  .filter((file) => file.endsWith(".ts"))
  .map((file) => file.slice(0, -3))
  .sort()

const version = /version: "(\d+\.\d+\.\d+)"/.exec(readFileSync(join(root, "src/site/content.ts"), "utf8"))?.[1]
if (!version) throw new Error("No release found in src/site/content.ts")
const uiSdk = JSON.parse(readFileSync(join(root, "node_modules/@ui-sdk/web/package.json"), "utf8")).version as string

rmSync(dist, { recursive: true, force: true })

await build({
  configFile: false,
  root,
  logLevel: "warn",
  publicDir: false,
  build: {
    outDir: dist,
    emptyOutDir: true,
    target: "es2023",
    minify: false,
    sourcemap: true,
    lib: {
      entry: {
        index: join(source, "index.ts"),
        ...Object.fromEntries(entries.map((name) => [`entries/${name}`, join(source, "entries", `${name}.ts`)])),
      },
      formats: ["es"],
    },
    rolldownOptions: {
      external: [/^@ui-sdk\//],
      output: {
        preserveModules: true,
        preserveModulesRoot: source,
        entryFileNames: "[name].js",
      },
    },
  },
})

execFileSync(join(root, "node_modules/.bin/tsc"), ["-p", join(root, "tsconfig.lib.json")], { stdio: "inherit" })

// tsc keeps the source's extensionless imports, which Node's own resolution can't follow.
const withExtensions = (code: string) =>
  code.replace(/((?:from|import)\s*\(?\s*)(["'])(\.{1,2}\/[^"']+?)\2/g, (match, lead, quote, path) =>
    /\.(js|css|json)$/.test(path) ? match : `${lead}${quote}${path}.js${quote}`
  )
const walk = (dir: string): string[] =>
  readdirSync(dir).flatMap((name) => {
    const path = join(dir, name)
    return statSync(path).isDirectory() ? walk(path) : [path]
  })
for (const file of walk(dist).filter((path) => path.endsWith(".d.ts"))) {
  writeFileSync(file, withExtensions(readFileSync(file, "utf8")))
}

copyFileSync(join(source, "clay.css"), join(dist, "clay.css"))

// The CDN files carry ui-sdk with them, so they name it and ship its Apache-2.0 license alongside.
const cdn = join(dist, "cdn")
const banner = `/*! claymorph-ui ${version} · MIT · https://claymorph-ui.lauroguedes.dev · includes @ui-sdk/web and @ui-sdk/core ${uiSdk} · Apache-2.0, see LICENSE-ui-sdk.txt */`
await build({
  configFile: false,
  root,
  logLevel: "warn",
  publicDir: false,
  build: {
    outDir: cdn,
    emptyOutDir: false,
    target: "es2023",
    minify: true,
    // Two more megabytes in every install; debugging is what the per-module build is for.
    sourcemap: false,
    lib: { entry: join(source, "index.ts"), formats: ["es"], fileName: () => "claymorph-ui.js" },
    // Vite keeps the whitespace of an ES library for other bundlers; a CDN file has no other bundler.
    rolldownOptions: { output: { codeSplitting: false, minify: true, postBanner: banner } },
  },
})
const webCss = readFileSync(join(root, "node_modules/@ui-sdk/core/dist/web.css"), "utf8")
writeFileSync(join(cdn, "claymorph-ui.css"), `${banner}\n${webCss}\n${readFileSync(join(source, "clay.css"), "utf8")}`)
copyFileSync(join(root, "node_modules/@ui-sdk/core/LICENSE"), join(cdn, "LICENSE-ui-sdk.txt"))

const manifest = JSON.parse(readFileSync(join(pkg, "package.json"), "utf8"))
const entry = (path: string) => ({ types: `./dist/${path}.d.ts`, default: `./dist/${path}.js` })
manifest.version = version
// What a CDN serves for the bare package URL, like cdn.jsdelivr.net/npm/claymorph-ui.
manifest.unpkg = "./dist/cdn/claymorph-ui.js"
manifest.jsdelivr = "./dist/cdn/claymorph-ui.js"
manifest.exports = {
  ".": entry("index"),
  ...Object.fromEntries(entries.map((name) => [`./${name}`, entry(`entries/${name}`)])),
  "./clay.css": "./dist/clay.css",
  "./package.json": "./package.json",
}
writeFileSync(join(pkg, "package.json"), `${JSON.stringify(manifest, null, 2)}\n`)

const kb = (file: string) => `${(statSync(join(cdn, file)).size / 1024).toFixed(0)} KB`
console.log(`claymorph-ui ${version}: ${entries.length} elements built to ${dist}, and for CDNs ${kb("claymorph-ui.js")} of JS and ${kb("claymorph-ui.css")} of CSS`)
