import "@ui-sdk/web/toggle"
import { ClayToggle } from "../components/group"
import { define } from "../element"

define("clay-toggle", ClayToggle)

declare global {
  interface HTMLElementTagNameMap {
    "clay-toggle": ClayToggle
  }
}

export { ClayToggle }
