import "@ui-sdk/web/command"
import { ClayCommand } from "../components/command"
import { define } from "../element"

define("clay-command", ClayCommand)

declare global {
  interface HTMLElementTagNameMap {
    "clay-command": ClayCommand
  }
}

export { ClayCommand }
