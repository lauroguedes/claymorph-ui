// Prints a release's notes from the changelog in src/site/content.ts, as Markdown for GitHub.
import { RELEASES } from "../src/site/content.ts"

const version = (process.argv[2] ?? "").replace(/^v/, "")
const release = RELEASES.find((item) => item.version === version)
if (!release) {
  console.error(`No release ${version} in src/site/content.ts`)
  process.exit(1)
}
const label = { new: "New", improved: "Improved", fixed: "Fixed" } as const
const lines = [`## ${release.title}`, ""]
for (const kind of ["new", "improved", "fixed"] as const) {
  const changes = release.changes.filter((change) => change.kind === kind)
  if (!changes.length) continue
  lines.push(`### ${label[kind]}`, "", ...changes.map((change) => `- ${change.text}`), "")
}
lines.push(`Full changelog: https://claymorph-ui.lauroguedes.dev/changelog#v${release.version}`)
console.log(lines.join("\n"))
