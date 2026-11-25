import "@ui-sdk/web/select"
import { ClaySelect } from "../components/popups"
import { define } from "../element"

define("clay-select", ClaySelect)

declare global {
  interface HTMLElementTagNameMap {
    "clay-select": ClaySelect
  }
}

export { ClaySelect }
