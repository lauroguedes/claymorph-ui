import "@ui-sdk/web/popover"
import { ClayPopover } from "../components/overlays"
import { define } from "../element"

define("clay-popover", ClayPopover)

declare global {
  interface HTMLElementTagNameMap {
    "clay-popover": ClayPopover
  }
}

export { ClayPopover }
