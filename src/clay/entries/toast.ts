import "@ui-sdk/web/toast"
import { ClayToastRegion } from "../components/overlays"
import { define } from "../element"

export { createToaster, toast } from "@ui-sdk/web/toast"

define("clay-toast-region", ClayToastRegion)

declare global {
  interface HTMLElementTagNameMap {
    "clay-toast-region": ClayToastRegion
  }
}

export { ClayToastRegion }
