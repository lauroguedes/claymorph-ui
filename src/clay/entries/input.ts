import "@ui-sdk/web/field"
import "@ui-sdk/web/input"
import { ClayInput } from "../components/forms"
import { define } from "../element"

define("clay-input", ClayInput)

declare global {
  interface HTMLElementTagNameMap {
    "clay-input": ClayInput
  }
}

export { ClayInput }
