# Badge (`<clay-badge>`)

A small clay label that stamps in when it appears.

### Preview

```html
<div class="demo-row">
  <clay-badge color="mint">New</clay-badge>
  <clay-badge color="butter">Beta</clay-badge>
  <clay-badge color="rose">3 alerts</clay-badge>
  <clay-badge color="sky">v0.1</clay-badge>
  <clay-badge color="ink">Pro</clay-badge>
</div>
```

**Use it for**

- A status or a count next to something: New, Beta, 3.

**Not for**

- Anything clickable: use **Press** with `size="sm"`.

## Installation

```bash
npm install claymorph-ui @ui-sdk/web @ui-sdk/core
```

Then import `claymorph-ui/clay.css` once and each element you use, like `claymorph-ui/button`.

## Usage

```html
<clay-badge color="mint">New</clay-badge>
```

## API reference

### Attributes

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `color` | `neutral \| teal \| lilac \| sky \| peach \| mint \| butter \| rose \| slate \| ink \| <color>` | — | The clay's colour: a preset, or any CSS colour. It sets `--clay-color` on the element. |

## Accessibility

- Plain text, read where it sits. Don't rely on its colour alone to carry meaning.
