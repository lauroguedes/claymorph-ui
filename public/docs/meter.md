# Meter (`<clay-meter>`)

A meter for a value in a known range, across or upright. Upright meters in a row make a clay bar chart. Wraps `ui-meter`.

### Preview

```html
<clay-meter color="sky">
  <ui-meter value="72">
    <ui-meter-label>Storage used</ui-meter-label>
    <ui-meter-value></ui-meter-value>
    <ui-meter-track><ui-meter-indicator></ui-meter-indicator></ui-meter-track>
  </ui-meter>
</clay-meter>
<div class="demo-bars" role="group" aria-label="Hours listened this week">
  <clay-meter orientation="vertical"><ui-meter value="2.6" max="6"><ui-meter-label>Mon</ui-meter-label><ui-meter-track><ui-meter-indicator></ui-meter-indicator></ui-meter-track></ui-meter></clay-meter>
  <clay-meter orientation="vertical"><ui-meter value="4.2" max="6"><ui-meter-label>Tue</ui-meter-label><ui-meter-track><ui-meter-indicator></ui-meter-indicator></ui-meter-track></ui-meter></clay-meter>
  <clay-meter orientation="vertical"><ui-meter value="3.4" max="6"><ui-meter-label>Wed</ui-meter-label><ui-meter-track><ui-meter-indicator></ui-meter-indicator></ui-meter-track></ui-meter></clay-meter>
  <clay-meter orientation="vertical"><ui-meter value="4.9" max="6"><ui-meter-label>Thu</ui-meter-label><ui-meter-track><ui-meter-indicator></ui-meter-indicator></ui-meter-track></ui-meter></clay-meter>
  <clay-meter orientation="vertical"><ui-meter value="3.1" max="6"><ui-meter-label>Fri</ui-meter-label><ui-meter-track><ui-meter-indicator></ui-meter-indicator></ui-meter-track></ui-meter></clay-meter>
</div>
```

**Use it for**

- A measured amount: storage used, battery, hours listened.

**Not for**

- How far a task has got: use a progress bar.

## Installation

```bash
npm install claymorph-ui @ui-sdk/web @ui-sdk/core
```

Then import `claymorph-ui/clay.css` once and each element you use, like `claymorph-ui/button`.

## Usage

```html
<clay-meter color="sky">
  <ui-meter value="72">
    <ui-meter-label>Storage used</ui-meter-label>
    <ui-meter-value></ui-meter-value>
    <ui-meter-track><ui-meter-indicator></ui-meter-indicator></ui-meter-track>
  </ui-meter>
</clay-meter>
```

`orientation="vertical"` stands it upright: give the element a height, and the label goes under the groove. Group a row of them with `role="group"` and a name.

## API reference

### Attributes

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `color` | `neutral \| teal \| lilac \| sky \| peach \| mint \| butter \| rose \| slate \| ink \| <color>` | `teal` | The fill's colour. |
| `orientation` | `horizontal \| vertical` | `horizontal` | Lies across, or stands upright and fills from the bottom. |

## Accessibility

- Each is a `meter` named by its label, with its value and range.
- Charts of meters need a name on the group that says what's measured.
