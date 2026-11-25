# Action Button (`<clay-action-button>`)

An async action. A clay bead sits beside the body; pressing it melts the bead in, it stays melted while the action runs, then turns into a check (or a cross) and rolls back out.

### Preview

```html
<clay-action-button color="teal" pending-label="Deploying…" success-label="Deployed">
  <ui-button><button>Deploy</button></ui-button>
</clay-action-button>
```

```ts
import type { ClayActionButton } from "claymorph-ui/action-button"

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export default function setup(root: HTMLElement) {
  const deploy = root.querySelector<ClayActionButton>("clay-action-button")!
  deploy.action = () => wait(1600)
}
```

**Use it for**

- Saving, sending or deploying: one action that takes a moment.
- When the result should be seen on the button itself.

**Not for**

- An instant action: use **Press**.
- A destructive action: confirm it first.

## Installation

```bash
npm install claymorph-ui @ui-sdk/web @ui-sdk/core
```

Then import `claymorph-ui/clay.css` once and each element you use, like `claymorph-ui/button`.

## Usage

```html
<clay-action-button color="teal" pending-label="Deploying…" success-label="Deployed">
  <ui-button><button>Deploy</button></ui-button>
</clay-action-button>
```

```ts
const deploy = document.querySelector("clay-action-button")!
deploy.action = () => fetch("/api/deploy", { method: "POST" })
```

`action` runs on press. While its promise is pending the button is busy and announces the pending label; when it resolves the bead turns into a check, when it rejects into a cross.

## The flow

- **Idle**: the bead sits apart, with an arrow.
- **Pending**: the bead melts into the body; the label and a spinner change.
- **Success**: the bead swells, turns mint and shows a check.
- **Error**: the body shakes, the bead turns rose and shows a cross.
- After `reset-after` ms it rolls back to idle.

## Examples

### When it fails

```html
<clay-action-button color="lilac" pending-label="Sending…" success-label="Sent" error-label="Couldn't send">
  <ui-button><button>Send invite</button></ui-button>
</clay-action-button>
```

```ts
import type { ClayActionButton } from "claymorph-ui/action-button"

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export default function setup(root: HTMLElement) {
  const send = root.querySelector<ClayActionButton>("clay-action-button")!
  send.action = async () => {
    await wait(1200)
    throw new Error("The server is unreachable")
  }
}
```

## API reference

### Attributes

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `color` | `neutral \| teal \| lilac \| sky \| peach \| mint \| butter \| rose \| slate \| ink \| <color>` | — | The clay's colour: a preset, or any CSS colour. It sets `--clay-color` on the element. |
| `size` | `sm \| md \| lg` | `md` | Height: 40, 48 or 56 px. |
| `pending-label` | `string` | `Working…` | Shown and announced while the action runs. |
| `success-label` | `string` | `Done` | Shown and announced when it resolves. |
| `error-label` | `string` | `Try again` | Shown and announced when it rejects. |
| `reset-after` | `number (ms)` | `2400` | When to roll back to idle. `0` stays. |

### Properties

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `action` | `() => unknown` | — | Runs on press. Return a promise to show pending. |
| `actionState` | `"idle" \| "pending" \| "success" \| "error"` | — | Read only. |

### Events

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `statechange` | `CustomEvent<{ state }>` | — | Fires on every state change. |

## Accessibility

- The button keeps its idle label as its name in every state; visible labels are `aria-hidden`.
- ui-button marks it busy and announces the pending label; a `role=status` region announces success or error.
- It ignores presses while pending, so an action never runs twice.
