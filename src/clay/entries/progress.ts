import "@ui-sdk/web/progress"
import { ClayProgress } from "../components/bars"
import { define } from "../element"

define("clay-progress", ClayProgress)

declare global {
  interface HTMLElementTagNameMap {
    "clay-progress": ClayProgress
  }
}

export { ClayProgress }
