import "@ui-sdk/web/field"
import "@ui-sdk/web/slider"
import { ClaySlider } from "../components/controls"
import { define } from "../element"

define("clay-slider", ClaySlider)

declare global {
  interface HTMLElementTagNameMap {
    "clay-slider": ClaySlider
  }
}

export { ClaySlider }
