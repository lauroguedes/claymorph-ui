import "@ui-sdk/web/menu"
import { ClayMenu } from "../components/overlays"
import { define } from "../element"

define("clay-menu", ClayMenu)

declare global {
  interface HTMLElementTagNameMap {
    "clay-menu": ClayMenu
  }
}

export { ClayMenu }
