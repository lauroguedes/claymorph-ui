import "@ui-sdk/web/segmented-control"
import { ClaySegmented } from "../components/controls"
import { define } from "../element"

define("clay-segmented", ClaySegmented)

declare global {
  interface HTMLElementTagNameMap {
    "clay-segmented": ClaySegmented
  }
}

export { ClaySegmented }
