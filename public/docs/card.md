# Card (`<clay-card>`)

A clay slab that holds content. Flatter than a button, with a deeper shadow. `interactive` makes it swell.

### Preview

```html
<div class="demo-row">
  <clay-card color="mint" class="demo-card">
    <clay-badge color="neutral">+16%</clay-badge>
    <h3>Songs played</h3>
    <p class="demo-stat">1,248</p>
  </clay-card>
  <clay-card color="lilac" elevation="3" class="demo-card">
    <clay-badge color="neutral">7 days</clay-badge>
    <h3>Current streak</h3>
    <p class="demo-stat">7</p>
  </clay-card>
</div>
```

**Use it for**

- Grouping related content: a stat, a summary, a settings group.

**Not for**

- The whole card as one action: put a **Press** inside, or use `interactive` with a link inside.

## Installation

```bash
npm install claymorph-ui @ui-sdk/web @ui-sdk/core
```

Then import `claymorph-ui/clay.css` once and each element you use, like `claymorph-ui/button`.

## Usage

```html
<clay-card color="mint" elevation="2">
  <h3>Songs played</h3>
  <p>1,248</p>
</clay-card>
```

## API reference

### Attributes

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `color` | `neutral \| teal \| lilac \| sky \| peach \| mint \| butter \| rose \| slate \| ink \| <color>` | — | The clay's colour: a preset, or any CSS colour. It sets `--clay-color` on the element. |
| `elevation` | `1 \| 2 \| 3` | `2` | How far it floats: the shadow's size and offset. |
| `radius` | `number (px)` | `28` | Corner radius of the clay. |
| `interactive` | `boolean` | — | Swells and squashes like a button. Read once, when it connects. |

## Accessibility

- A plain container: give it a heading, and put real controls inside for actions.
