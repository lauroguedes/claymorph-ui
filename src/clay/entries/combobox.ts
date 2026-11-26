import "@ui-sdk/web/combobox"
import { ClayCombobox } from "../components/combobox"
import { define } from "../element"

define("clay-combobox", ClayCombobox)

declare global {
  interface HTMLElementTagNameMap {
    "clay-combobox": ClayCombobox
  }
}

export { ClayCombobox }
