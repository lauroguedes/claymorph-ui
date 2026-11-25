// Every page as HTML, for the build to write out ahead of time: crawlers and link previews read the
// content and the head without running the site.
import { SITE } from "./content"
import { absolute, headTags } from "./seo"
import { layout, route, routes } from "./shell"

interface Rendered {
  /** Where it's written, relative to the build: `docs/select.html` serves `/docs/select`. */
  file: string
  head: string
  body: string
}

function pages(): Rendered[] {
  const rendered = routes().map((path) => {
    const view = route(path)
    return { file: path === "/" ? "index.html" : `${path.slice(1)}.html`, head: headTags(view), body: layout(view, path) }
  })
  const missing = route("/404")
  rendered.push({ file: "404.html", head: headTags(missing), body: layout(missing, "/404") })
  return rendered
}

/** The canonical address of every page, once: `/docs` is the introduction under another name. */
function sitemap(date: string) {
  const urls = [...new Set(routes().map((path) => route(path).path))]
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((path) => `  <url><loc>${absolute(path)}</loc><lastmod>${date}</lastmod></url>`).join("\n")}
  <url><loc>${absolute("/showcase.html")}</loc><lastmod>${date}</lastmod></url>
</urlset>
`
}

const robots = () => `User-agent: *\nAllow: /\n\nSitemap: ${SITE.url}/sitemap.xml\n`

export { pages, robots, sitemap }
