# Segmented Control (`<clay-segmented>`)

Pick one of a few options. The selection is a clay bead that rolls along a groove, stretching with its speed. Wraps `ui-segmented-control`.

### Preview

```html
<clay-segmented>
  <ui-segmented-control aria-label="Range" default-value="week">
    <ui-segmented-control-indicator></ui-segmented-control-indicator>
    <ui-segmented-control-item value="day">Day</ui-segmented-control-item>
    <ui-segmented-control-item value="week">Week</ui-segmented-control-item>
    <ui-segmented-control-item value="month">Month</ui-segmented-control-item>
    <ui-segmented-control-item value="year">Year</ui-segmented-control-item>
  </ui-segmented-control>
</clay-segmented>
```

**Use it for**

- Two to five short options, all visible: Day, Week, Month.
- Switching a view.

**Not for**

- More options than fit: use **Pour**.
- On or off: use **Flip**.

## Installation

```bash
npm install claymorph-ui @ui-sdk/web @ui-sdk/core
```

Then import `claymorph-ui/clay.css` once and each element you use, like `claymorph-ui/button`.

## Usage

```html
<clay-segmented>
  <ui-segmented-control aria-label="Range" default-value="week">
    <ui-segmented-control-indicator></ui-segmented-control-indicator>
    <ui-segmented-control-item value="day">Day</ui-segmented-control-item>
    <ui-segmented-control-item value="week">Week</ui-segmented-control-item>
    <ui-segmented-control-item value="month">Month</ui-segmented-control-item>
  </ui-segmented-control>
</clay-segmented>
```

Read and set `value` on `<ui-segmented-control>` and listen for `valuechange`. The bead follows every change, including ones made from code or by an agent.

## API reference

### Attributes

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `color` | `neutral \| teal \| lilac \| sky \| peach \| mint \| butter \| rose \| slate \| ink \| <color>` | `knob` | The bead's colour. |

### State

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `data-clay-ready` | `attribute` | — | Set once the first WebGL2 frame is drawn. Until then the CSS clay shows. |

## Accessibility

- A radio group from ui-sdk: arrow keys move and select, and it needs `aria-label`.
- The CSS indicator stays in the markup and shows without WebGL2.
