import "@ui-sdk/web/checkbox"
import "@ui-sdk/web/field"
import { ClayCheckbox } from "../components/controls"
import { define } from "../element"

define("clay-checkbox", ClayCheckbox)

declare global {
  interface HTMLElementTagNameMap {
    "clay-checkbox": ClayCheckbox
  }
}

export { ClayCheckbox }
