# Progress (`<clay-progress>`)

A progress bar whose groove fills with a worm of clay. Without a value, a lump rolls back and forth. Wraps `ui-progress`.

### Preview

```html
<clay-progress>
  <ui-progress value="35">
    <ui-progress-label>Downloading Chill Vibes</ui-progress-label>
    <ui-progress-value></ui-progress-value>
    <ui-progress-track><ui-progress-indicator></ui-progress-indicator></ui-progress-track>
  </ui-progress>
</clay-progress>
<clay-progress color="lilac">
  <ui-progress>
    <ui-progress-label>Connecting to speaker</ui-progress-label>
    <ui-progress-track><ui-progress-indicator></ui-progress-indicator></ui-progress-track>
  </ui-progress>
</clay-progress>
```

```ts
type Progress = HTMLElement & { value: number | null }

export default function setup(root: HTMLElement) {
  const download = root.querySelector<Progress>("ui-progress[value]")!
  const timer = setInterval(() => {
    if (!download.isConnected) return clearInterval(timer)
    download.value = download.value !== null && download.value < 100 ? Math.min(100, download.value + 7) : 0
  }, 700)
}
```

**Use it for**

- A task under way: a download, an upload, an install.

**Not for**

- An amount that isn't a task, like storage used: use a meter.

## Installation

```bash
npm install claymorph-ui @ui-sdk/web @ui-sdk/core
```

Then import `claymorph-ui/clay.css` once and each element you use, like `claymorph-ui/button`.

## Usage

```html
<clay-progress>
  <ui-progress value="35">
    <ui-progress-label>Downloading</ui-progress-label>
    <ui-progress-value></ui-progress-value>
    <ui-progress-track><ui-progress-indicator></ui-progress-indicator></ui-progress-track>
  </ui-progress>
</clay-progress>
```

Set `value` on `<ui-progress>` as the task moves. Leave it out, or set it to `null`, while how far is unknown.

## API reference

### Attributes

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `color` | `neutral \| teal \| lilac \| sky \| peach \| mint \| butter \| rose \| slate \| ink \| <color>` | `teal` | The fill's colour. |

## Accessibility

- It's a `progressbar` named by its label, and its value is read from the bar itself.
- With reduced motion, an unknown amount shows a still, full groove instead of a rolling lump.
