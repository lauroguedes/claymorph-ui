import "@ui-sdk/web/button"
import { ClayActionButton, type ActionState } from "../components/action-button"
import { define } from "../element"

define("clay-action-button", ClayActionButton)

declare global {
  interface HTMLElementTagNameMap {
    "clay-action-button": ClayActionButton
  }
}

export { ClayActionButton, type ActionState }
