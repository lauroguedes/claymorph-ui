# Checkbox (`<clay-checkbox>`)

A checkbox whose dent pushes up into a filled clay bump when checked, while the check draws in. Wraps `ui-checkbox`.

### Preview

```html
<div class="demo-stack">
  <label class="demo-label demo-check">
    <clay-checkbox>
      <ui-checkbox name="updates" default-checked>
        <ui-checkbox-indicator aria-hidden="true">
          <svg viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7" /></svg>
        </ui-checkbox-indicator>
      </ui-checkbox>
    </clay-checkbox>
    Product updates
  </label>
  <label class="demo-label demo-check">
    <clay-checkbox color="peach">
      <ui-checkbox name="digest">
        <ui-checkbox-indicator aria-hidden="true">
          <svg viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7" /></svg>
        </ui-checkbox-indicator>
      </ui-checkbox>
    </clay-checkbox>
    Weekly digest
  </label>
</div>
```

**Use it for**

- Independent options in a form.
- Agreeing to something.

**Not for**

- A setting that applies at once: use **Flip**.

## Installation

```bash
npm install claymorph-ui @ui-sdk/web @ui-sdk/core
```

Then import `claymorph-ui/clay.css` once and each element you use, like `claymorph-ui/button`.

## Usage

```html
<label>
  <clay-checkbox>
    <ui-checkbox name="updates">
      <ui-checkbox-indicator aria-hidden="true">
        <svg viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7" /></svg>
      </ui-checkbox-indicator>
    </ui-checkbox>
  </clay-checkbox>
  Product updates
</label>
```

## API reference

### Attributes

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `color` | `neutral \| teal \| lilac \| sky \| peach \| mint \| butter \| rose \| slate \| ink \| <color>` | `teal` | The colour of the checked bump. |

## Accessibility

- `<ui-checkbox>` has the checkbox role, takes its name from the label and submits with its form.
- Indeterminate shows the bump half raised.
