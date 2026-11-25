import "@ui-sdk/web/button"
import { ClayButton } from "../components/button"
import { define } from "../element"

define("clay-button", ClayButton)

declare global {
  interface HTMLElementTagNameMap {
    "clay-button": ClayButton
  }
}

export { ClayButton }
