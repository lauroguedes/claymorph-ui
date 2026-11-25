import "@ui-sdk/web/meter"
import { ClayMeter } from "../components/bars"
import { define } from "../element"

define("clay-meter", ClayMeter)

declare global {
  interface HTMLElementTagNameMap {
    "clay-meter": ClayMeter
  }
}

export { ClayMeter }
