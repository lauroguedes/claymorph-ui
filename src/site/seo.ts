// The <head> of a page: title, description, canonical link, social cards and structured data. Every tag
// carries `data-seo`, so the client can swap them all on navigation.
import { escape } from "./code"
import { SITE } from "./content"
import type { View } from "./shell"

const absolute = (path: string) => `${SITE.url}${path === "/" ? "/" : path}`

/** JSON inside a script tag, without anything that could close it early. */
const jsonLd = (data: unknown) =>
  `<script data-seo type="application/ld+json">${JSON.stringify(data).replace(/</g, "\\u003c")}</script>`

function structuredData(view: View, url: string, image: string) {
  const site = { "@type": "WebSite", "@id": `${SITE.url}/#website`, name: SITE.name, url: `${SITE.url}/` }
  const author = { "@type": "Person", name: SITE.author, url: "https://github.com/lauroguedes" }
  if (view.path === "/") {
    return {
      "@context": "https://schema.org",
      "@graph": [
        { ...site, description: view.description, inLanguage: "en" },
        {
          "@type": "SoftwareSourceCode",
          name: SITE.name,
          description: view.description,
          url: `${SITE.url}/`,
          codeRepository: SITE.source,
          programmingLanguage: ["TypeScript", "CSS", "GLSL"],
          runtimePlatform: "Web browser",
          license: "https://opensource.org/licenses/MIT",
          image,
          author,
        },
      ],
    }
  }
  const crumbs = [
    { name: SITE.name, item: `${SITE.url}/` },
    ...(view.article ? [{ name: "Docs", item: `${SITE.url}/docs/introduction` }] : []),
    { name: view.card.heading, item: url },
  ]
  return {
    "@context": "https://schema.org",
    "@graph": [
      ...(view.article
        ? [
            {
              "@type": "TechArticle",
              headline: view.title,
              description: view.description,
              url,
              image,
              author,
              isPartOf: { "@id": `${SITE.url}/#website` },
              inLanguage: "en",
            },
          ]
        : []),
      {
        "@type": "BreadcrumbList",
        itemListElement: crumbs.map((crumb, index) => ({ "@type": "ListItem", position: index + 1, ...crumb })),
      },
    ],
  }
}

function headTags(view: View) {
  const url = absolute(view.path)
  const image = `${SITE.url}/og/${view.og}.jpg`
  const alt = `${view.card.heading} · ${SITE.name}`
  const title = escape(view.title)
  const description = escape(view.description)
  const tags = [
    `<title data-seo>${title}</title>`,
    `<meta data-seo name="description" content="${description}" />`,
    view.missing ? `<meta data-seo name="robots" content="noindex" />` : `<link data-seo rel="canonical" href="${url}" />`,
    `<meta data-seo property="og:type" content="${view.article ? "article" : "website"}" />`,
    `<meta data-seo property="og:site_name" content="${SITE.name}" />`,
    `<meta data-seo property="og:locale" content="en_US" />`,
    `<meta data-seo property="og:title" content="${title}" />`,
    `<meta data-seo property="og:description" content="${description}" />`,
    `<meta data-seo property="og:url" content="${url}" />`,
    `<meta data-seo property="og:image" content="${image}" />`,
    `<meta data-seo property="og:image:type" content="image/jpeg" />`,
    `<meta data-seo property="og:image:width" content="1200" />`,
    `<meta data-seo property="og:image:height" content="630" />`,
    `<meta data-seo property="og:image:alt" content="${escape(alt)}" />`,
    `<meta data-seo name="twitter:card" content="summary_large_image" />`,
    `<meta data-seo name="twitter:title" content="${title}" />`,
    `<meta data-seo name="twitter:description" content="${description}" />`,
    `<meta data-seo name="twitter:image" content="${image}" />`,
    `<meta data-seo name="twitter:image:alt" content="${escape(alt)}" />`,
  ]
  if (!view.missing) tags.push(jsonLd(structuredData(view, url, image)))
  return tags.join("\n    ")
}

export { absolute, headTags }
