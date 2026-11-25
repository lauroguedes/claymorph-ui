# Toast (`<clay-toast-region>`)

Toasts that drop in as clay slabs and squash as they land, tinted by their type. Wraps `ui-toast-region`; call `toast()` from anywhere.

### Preview

```html
<div class="demo-row">
  <clay-button color="teal">
    <ui-button><button data-toast="saved">Save playlist</button></ui-button>
  </clay-button>
  <clay-button>
    <ui-button><button data-toast="info">Add to queue</button></ui-button>
  </clay-button>
  <clay-button color="rose">
    <ui-button><button data-toast="error">Fail to sync</button></ui-button>
  </clay-button>
</div>

<clay-toast-region>
  <ui-toast-region>
    <template>
      <ui-toast>
        <ui-toast-title></ui-toast-title>
        <ui-toast-description></ui-toast-description>
        <ui-toast-action><button></button></ui-toast-action>
      </ui-toast>
    </template>
  </ui-toast-region>
</clay-toast-region>
```

```ts
import { toast } from "claymorph-ui/toast"

export default function setup(root: HTMLElement) {
  const messages: Record<string, () => void> = {
    saved: () => toast.success("Playlist saved", { description: "Chill Vibes · 80 songs" }),
    info: () =>
      toast("Added to queue", {
        description: "Golden Hour plays next",
        action: { label: "Undo", onAction: () => toast("Removed from queue") },
      }),
    error: () => toast.error("Couldn't sync", { description: "Check your connection and try again." }),
  }
  root.querySelectorAll<HTMLButtonElement>("[data-toast]").forEach((button) =>
    button.addEventListener("click", () => messages[button.dataset.toast!]!())
  )
}
```

**Use it for**

- Saying that something finished, with an undo if it helps.

**Not for**

- A question that needs an answer: use a dialog.
- Errors in a form: show them by the field.

## Installation

```bash
npm install claymorph-ui @ui-sdk/web @ui-sdk/core
```

Then import `claymorph-ui/clay.css` once and each element you use, like `claymorph-ui/button`.

## Usage

Place one region near the root of the page:

```html
<clay-toast-region>
  <ui-toast-region>
    <template>
      <ui-toast>
        <ui-toast-title></ui-toast-title>
        <ui-toast-description></ui-toast-description>
        <ui-toast-action><button></button></ui-toast-action>
      </ui-toast>
    </template>
  </ui-toast-region>
</clay-toast-region>
```

```ts
import { toast } from "claymorph-ui/toast"

toast.success("Playlist saved", { description: "Chill Vibes · 80 songs" })
toast("Added to queue", { action: { label: "Undo", onAction: undo } })
```

A toast leaves the way it came: it lifts back off and drops toward the edge it came from.

## Attached stack

With `attached`, the stack is one body of clay. Each new toast pulls out of the one before it and stays joined by a neck, like Roll's bead; a toast that leaves tucks back into its neighbour along the same path.

### Attached stack

```html
<div class="demo-row">
  <clay-button color="teal">
    <ui-button><button data-toast="saved">Save playlist</button></ui-button>
  </clay-button>
  <clay-button>
    <ui-button><button data-toast="queue">Add to queue</button></ui-button>
  </clay-button>
  <clay-button color="rose">
    <ui-button><button data-toast="error">Fail to sync</button></ui-button>
  </clay-button>
</div>

<clay-toast-region attached>
  <ui-toast-region>
    <template>
      <ui-toast>
        <ui-toast-title></ui-toast-title>
        <ui-toast-description></ui-toast-description>
        <ui-toast-action><button></button></ui-toast-action>
      </ui-toast>
    </template>
  </ui-toast-region>
</clay-toast-region>
```

```ts
import { createToaster } from "claymorph-ui/toast"

export default function setup(root: HTMLElement) {
  const toast = createToaster()
  root.querySelector<HTMLElement & { toaster: unknown }>("ui-toast-region")!.toaster = toast
  const messages: Record<string, () => void> = {
    saved: () => toast.success("Playlist saved", { description: "Chill Vibes · 80 songs" }),
    queue: () => toast("Added to queue", { description: "Golden Hour plays next" }),
    error: () => toast.error("Couldn't sync", { description: "Check your connection and try again." }),
  }
  root.querySelectorAll<HTMLButtonElement>("[data-toast]").forEach((button) =>
    button.addEventListener("click", () => messages[button.dataset.toast!]!())
  )
}
```

> One region per page shows `toast()`. This demo gives its region a queue of its own with `createToaster()`, so it doesn't share toasts with the one above.

## API reference

### Element attributes

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `attached` | `boolean` | — | On `<clay-toast-region>`: draws the stack as one body, each toast pulled out of the one before it. |

### Functions

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `toast(title, options?)` | `string` | — | Shows a toast and returns its id. `options` takes `description`, `action`, `cancel`, `duration` and `type`. |
| `toast.success / error / warning / info` | `string` | — | The same, with a type. Success, error and warning tint the clay. |
| `toast.dismiss(id?)` | `void` | — | Closes one toast, or all of them. |
| `createToaster()` | `Toaster` | — | A queue of its own, for a second region: set it as the region's `toaster`. |

### Region attributes

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `side` | `top \| bottom` | `bottom` | On `<ui-toast-region>`: the edge the toasts drop from. |
| `align` | `start \| center \| end` | `end` | On `<ui-toast-region>`: where along that edge. |

## Accessibility

- Toasts are announced politely; errors interrupt.
- F6 moves focus into the region and back. Timers pause while it's hovered or focused.
