import "@ui-sdk/web/field"
import "@ui-sdk/web/switch"
import { ClaySwitch } from "../components/controls"
import { define } from "../element"

define("clay-switch", ClaySwitch)

declare global {
  interface HTMLElementTagNameMap {
    "clay-switch": ClaySwitch
  }
}

export { ClaySwitch }
