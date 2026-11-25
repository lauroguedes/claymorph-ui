// Installs the built package the way a user would, from its packed tarball, into a throwaway app with
// nothing but the peer dependencies, then checks that it builds, that a bundler keeps only what the app
// imports, and that its types resolve under both bundler and Node resolution.
import { execFileSync } from "node:child_process"
import { mkdirSync, mkdtempSync, readdirSync, readFileSync, rmSync, symlinkSync, writeFileSync } from "node:fs"
import { tmpdir } from "node:os"
import { join, resolve } from "node:path"
import { build } from "vite"

const root = resolve(import.meta.dirname, "..")
const work = mkdtempSync(join(tmpdir(), "claymorph-smoke-"))
const fail = (message: string): never => {
  console.error(`smoke test failed: ${message}`)
  process.exit(1)
}

try {
  const tarball = execFileSync("npm", ["pack", join(root, "packages/claymorph-ui"), "--pack-destination", work, "--silent"], {
    encoding: "utf8",
  }).trim().split("\n").at(-1)!
  const app = join(work, "app")
  const modules = join(app, "node_modules")
  mkdirSync(join(modules, "@ui-sdk"), { recursive: true })
  execFileSync("tar", ["-xzf", join(work, tarball), "-C", work])
  execFileSync("mv", [join(work, "package"), join(modules, "claymorph-ui")])
  for (const name of ["web", "core"]) symlinkSync(join(root, "node_modules/@ui-sdk", name), join(modules, "@ui-sdk", name))

  writeFileSync(join(app, "package.json"), JSON.stringify({ name: "smoke", private: true, type: "module" }))
  writeFileSync(
    join(app, "index.html"),
    `<!doctype html><html><body><clay-button><ui-button><button>Save</button></ui-button></clay-button><script type="module" src="./main.ts"></script></body></html>`
  )
  writeFileSync(join(app, "main.ts"), `import "@ui-sdk/core/web.css"\nimport "claymorph-ui/clay.css"\nimport "claymorph-ui/button"\n`)
  await build({ root: app, configFile: false, logLevel: "warn", build: { outDir: "dist" } })
  const assets = join(app, "dist/assets")
  const js = readdirSync(assets)
    .filter((file) => file.endsWith(".js"))
    .map((file) => readFileSync(join(assets, file), "utf8"))
    .join("\n")
  if (!js.includes("clay-button")) fail("the button wasn't in the bundle")
  for (const unused of ["clay-select", "clay-menu", "clay-tooltip", "ui-select-trigger"]) {
    if (js.includes(unused)) fail(`${unused} was bundled though the app only imports the button`)
  }

  writeFileSync(
    join(app, "typed.ts"),
    `import type { ClayButton } from "claymorph-ui/button"
import { CLAY, type ClaySelect } from "claymorph-ui"
import { toast } from "claymorph-ui/toast"
const button: ClayButton | null = document.querySelector("clay-button")
const select: ClaySelect | null = document.querySelector("clay-select")
CLAY.grain = 0.1
toast("Saved")
export { button, select }
`
  )
  for (const [module, resolution] of [["esnext", "bundler"], ["nodenext", "nodenext"]]) {
    writeFileSync(
      join(app, "tsconfig.json"),
      JSON.stringify({
        compilerOptions: { target: "es2023", module, moduleResolution: resolution, lib: ["ES2023", "DOM"], strict: true, noEmit: true, types: [] },
        files: ["typed.ts"],
      })
    )
    try {
      execFileSync(join(root, "node_modules/.bin/tsc"), ["-p", join(app, "tsconfig.json")], { stdio: "pipe" })
    } catch (error) {
      fail(`types don't resolve with ${resolution} resolution:\n${(error as { stdout?: Buffer }).stdout?.toString() ?? error}`)
    }
  }
  console.log(`smoke test passed: ${tarball} installs, tree-shakes and type-checks`)
} finally {
  rmSync(work, { recursive: true, force: true })
}
