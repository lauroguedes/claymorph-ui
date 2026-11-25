// Fails unless the pushed tag, like v0.4.1, is the version the package was just built with.
import { readFileSync } from "node:fs"
import { resolve } from "node:path"

const tag = process.argv[2] ?? ""
const manifest = JSON.parse(readFileSync(resolve(import.meta.dirname, "../packages/claymorph-ui/package.json"), "utf8"))
if (tag !== `v${manifest.version}`) {
  console.error(`Tag ${tag} doesn't match the package version ${manifest.version}. Add the release to src/site/content.ts first.`)
  process.exit(1)
}
console.log(`Releasing ${manifest.name} ${manifest.version}`)
