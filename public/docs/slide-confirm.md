# Slide to confirm (`<clay-slide-confirm>`)

A deliberate action: drag a clay ball along its groove to the end. Let go early and it rolls back; at the end it runs `.action`, then shows pending, success or error. Wraps `ui-slider`.

### Preview

```html
<clay-slide-confirm color="rose" pending-label="Deleting…" success-label="History deleted" reset-after="2400">
  <ui-slider aria-label="Slide to delete history">
    <ui-slider-control>
      <ui-slider-track>
        <ui-slider-indicator></ui-slider-indicator>
        <ui-slider-thumb></ui-slider-thumb>
      </ui-slider-track>
    </ui-slider-control>
  </ui-slider>
</clay-slide-confirm>
```

```ts
import type { ClaySlideConfirm } from "claymorph-ui/slide-confirm"

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export default function setup(root: HTMLElement) {
  root.querySelector<ClaySlideConfirm>("clay-slide-confirm")!.action = () => wait(1400)
}
```

**Use it for**

- An action that should be deliberate: delete, send money, publish to everyone.

**Not for**

- Everyday actions: use a button.
- Choosing a value: use a slider.

## Installation

```bash
npm install claymorph-ui @ui-sdk/web @ui-sdk/core
```

Then import `claymorph-ui/clay.css` once and each element you use, like `claymorph-ui/button`.

## Usage

```html
<clay-slide-confirm color="rose" pending-label="Deleting…" success-label="History deleted">
  <ui-slider aria-label="Slide to delete history">
    <ui-slider-control>
      <ui-slider-track>
        <ui-slider-indicator></ui-slider-indicator>
        <ui-slider-thumb></ui-slider-thumb>
      </ui-slider-track>
    </ui-slider-control>
  </ui-slider>
</clay-slide-confirm>
```

```ts
document.querySelector("clay-slide-confirm")!.action = () =>
  fetch("/api/history", { method: "DELETE" })
```

## API reference

### Attributes

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `color` | `neutral \| teal \| lilac \| sky \| peach \| mint \| butter \| rose \| slate \| ink \| <color>` | `teal` | The fill the ball pulls behind it. |
| `threshold` | `number` | `0.9` | Share of the groove the ball must pass for letting go to confirm. |
| `pending-label` | `string` | `Working…` | Written in the groove while `action` runs. |
| `success-label` | `string` | `Done` | Written once it succeeds, and announced. |
| `error-label` | `string` | `Try again` | Written after a failure, and announced. |
| `reset-after` | `number` | `0` | Milliseconds after a success before the ball rolls home. `0` stays confirmed. An error always resets after 2400 ms. |

### Properties and events

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `action` | `() => unknown` | — | Runs once the ball reaches the end. A rejected promise shows the error state. |
| `actionState` | `"idle" \| "pending" \| "success" \| "error"` | — | The current state, also on `data-state`. |
| `statechange` | `CustomEvent<{ state }>` | — | Fires on the element whenever the state changes. |

## Accessibility

- It's a real `ui-slider`: arrows, Page Up/Down, Home and End move the ball, and End confirms.
- The slider's `aria-label` is both its name and the text written in the groove, so write it as an instruction.
- While pending the slider has `aria-busy`; success and error are announced by a status region.
