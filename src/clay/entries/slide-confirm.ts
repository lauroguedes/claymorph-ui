import "@ui-sdk/web/slider"
import { ClaySlideConfirm, type SlideState } from "../components/slide"
import { define } from "../element"

define("clay-slide-confirm", ClaySlideConfirm)

declare global {
  interface HTMLElementTagNameMap {
    "clay-slide-confirm": ClaySlideConfirm
  }
}

export { ClaySlideConfirm, type SlideState }
