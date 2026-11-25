import { ClayCard } from "../components/card"
import { define } from "../element"

define("clay-card", ClayCard)

declare global {
  interface HTMLElementTagNameMap {
    "clay-card": ClayCard
  }
}

export { ClayCard }
