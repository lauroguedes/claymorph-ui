# Radio group (`<clay-radio>`)

Radios carved as dents in the clay. A bead hops into the one you pick. Wraps `ui-radio-group`.

### Preview

```html
<ui-field>
  <ui-field-label>Audio quality</ui-field-label>
  <clay-radio>
    <ui-radio-group default-value="high">
      <label><ui-radio value="normal"><ui-radio-indicator></ui-radio-indicator></ui-radio>Normal</label>
      <label><ui-radio value="high"><ui-radio-indicator></ui-radio-indicator></ui-radio>High</label>
      <label><ui-radio value="lossless"><ui-radio-indicator></ui-radio-indicator></ui-radio>Lossless</label>
    </ui-radio-group>
  </clay-radio>
</ui-field>
```

**Use it for**

- One of two to seven options in a form, all visible at once.

**Not for**

- Many options: use a select.
- Switching views: use tabs.

## Installation

```bash
npm install claymorph-ui @ui-sdk/web @ui-sdk/core
```

Then import `claymorph-ui/clay.css` once and each element you use, like `claymorph-ui/button`.

## Usage

```html
<ui-field>
  <ui-field-label>Audio quality</ui-field-label>
  <clay-radio>
    <ui-radio-group default-value="high">
      <label><ui-radio value="normal"><ui-radio-indicator></ui-radio-indicator></ui-radio>Normal</label>
      <label><ui-radio value="high"><ui-radio-indicator></ui-radio-indicator></ui-radio>High</label>
    </ui-radio-group>
  </clay-radio>
</ui-field>
```

## API reference

### Attributes

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `color` | `neutral \| teal \| lilac \| sky \| peach \| mint \| butter \| rose \| slate \| ink \| <color>` | `teal` | The bead's colour. |
| `orientation` | `vertical \| horizontal` | `vertical` | Lays the options out in a column or a row. |

## Accessibility

- The group is one tab stop; arrow keys move and check. Wrap each radio with its text in a `<label>`.
- A `ui-field-label` names the group; without one, give `<ui-radio-group>` an `aria-label`.
- Up to seven radios get dents; more stay plain.
