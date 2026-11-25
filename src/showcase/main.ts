import "@ui-sdk/core/web.css"
import "@ui-sdk/web/field"
import "claymorph-ui"
import "claymorph-ui/clay.css"
import "./showcase.css"
import { renderShowcase } from "./app"

const stored = (() => {
  try {
    return localStorage.getItem("clay-theme")
  } catch {
    return null
  }
})()
const dark = stored ? stored === "dark" : matchMedia("(prefers-color-scheme: dark)").matches
document.documentElement.dataset.theme = dark ? "dark" : "light"

renderShowcase(document.querySelector<HTMLElement>("#app")!, { dark })
