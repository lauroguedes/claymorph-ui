import "@ui-sdk/web/field"
import "@ui-sdk/web/radio"
import { ClayRadio } from "../components/forms"
import { define } from "../element"

define("clay-radio", ClayRadio)

declare global {
  interface HTMLElementTagNameMap {
    "clay-radio": ClayRadio
  }
}

export { ClayRadio }
