import "@ui-sdk/web/tooltip"
import { ClayTooltip } from "../components/popups"
import { define } from "../element"

define("clay-tooltip", ClayTooltip)

declare global {
  interface HTMLElementTagNameMap {
    "clay-tooltip": ClayTooltip
  }
}

export { ClayTooltip }
