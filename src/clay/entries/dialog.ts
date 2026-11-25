import "@ui-sdk/web/dialog"
import { ClayDialog } from "../components/overlays"
import { define } from "../element"

define("clay-dialog", ClayDialog)

declare global {
  interface HTMLElementTagNameMap {
    "clay-dialog": ClayDialog
  }
}

export { ClayDialog }
