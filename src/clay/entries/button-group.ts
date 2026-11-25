import "@ui-sdk/web/button"
import "@ui-sdk/web/toggle"
import { ClayButtonGroup } from "../components/group"
import { define } from "../element"

define("clay-button-group", ClayButtonGroup)

declare global {
  interface HTMLElementTagNameMap {
    "clay-button-group": ClayButtonGroup
  }
}

export { ClayButtonGroup }
