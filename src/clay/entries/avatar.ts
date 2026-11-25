import "@ui-sdk/web/avatar"
import { ClayAvatar } from "../components/card"
import { define } from "../element"

define("clay-avatar", ClayAvatar)

declare global {
  interface HTMLElementTagNameMap {
    "clay-avatar": ClayAvatar
  }
}

export { ClayAvatar }
