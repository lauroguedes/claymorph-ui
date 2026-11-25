import "@ui-sdk/web/tabs"
import { ClayTabs } from "../components/tabs"
import { define } from "../element"

define("clay-tabs", ClayTabs)

declare global {
  interface HTMLElementTagNameMap {
    "clay-tabs": ClayTabs
  }
}

export { ClayTabs }
