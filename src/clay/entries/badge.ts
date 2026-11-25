import { ClayBadge } from "../components/card"
import { define } from "../element"

define("clay-badge", ClayBadge)

declare global {
  interface HTMLElementTagNameMap {
    "clay-badge": ClayBadge
  }
}

export { ClayBadge }
