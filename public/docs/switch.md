# Switch (`<clay-switch>`)

On or off. The knob rolls across a groove that fills with colour, and squashes as it travels. Wraps `ui-switch`.

### Preview

```html
<div class="demo-stack">
  <label class="demo-label">
    Wi-Fi
    <clay-switch>
      <ui-switch default-checked><ui-switch-thumb></ui-switch-thumb></ui-switch>
    </clay-switch>
  </label>
  <label class="demo-label">
    Do not disturb
    <clay-switch color="lilac">
      <ui-switch><ui-switch-thumb></ui-switch-thumb></ui-switch>
    </clay-switch>
  </label>
</div>
```

**Use it for**

- A setting that applies at once: Wi-Fi, notifications.

**Not for**

- A choice that's submitted later with a form: use **Tick**.

## Installation

```bash
npm install claymorph-ui @ui-sdk/web @ui-sdk/core
```

Then import `claymorph-ui/clay.css` once and each element you use, like `claymorph-ui/button`.

## Usage

```html
<label>
  Notifications
  <clay-switch>
    <ui-switch default-checked><ui-switch-thumb></ui-switch-thumb></ui-switch>
  </clay-switch>
</label>
```

## API reference

### Attributes

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `color` | `neutral \| teal \| lilac \| sky \| peach \| mint \| butter \| rose \| slate \| ink \| <color>` | `teal` | The colour the groove fills with. |
| `size` | `sm \| md \| lg` | `md` | 46×26, 56×32 or 68×38 px. |

## Accessibility

- `<ui-switch>` has the switch role and takes its name from the label around it.
- Space toggles it; the knob follows `checked` however it changes.
