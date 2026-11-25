# Input (`<clay-input>`)

A text field carved into the clay. The well deepens while it's focused, gives a little as you type, and its rim turns red once the value is invalid. Wraps `ui-input`, `ui-input-group` or a `<textarea>`.

### Preview

```html
<clay-input>
  <svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="m21 21-4.34-4.34"/><circle cx="11" cy="11" r="8"/></svg>
  <ui-input-group>
    <ui-input><input type="search" aria-label="Search songs and artists" placeholder="Search songs, artists…" /></ui-input>
    <ui-input-clear><button type="button" aria-label="Clear search"></button></ui-input-clear>
  </ui-input-group>
</clay-input>
<ui-field>
  <ui-field-label>Email</ui-field-label>
  <clay-input>
    <svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7"/><rect x="2" y="4" width="20" height="16" rx="2"/></svg>
    <ui-input><input type="email" required placeholder="you@example.com" /></ui-input>
  </clay-input>
  <ui-field-description>We'll send your weekly mix here.</ui-field-description>
</ui-field>
<ui-field>
  <clay-input attached>
    <ui-field-label>Display name</ui-field-label>
    <ui-input><input value="Aryan" required /></ui-input>
    <ui-field-description>Shown on mixes you share.</ui-field-description>
  </clay-input>
</ui-field>
```

**Use it for**

- Free text: a search, a name, an email.

**Not for**

- One of a few options: use radios or a select.
- A value by feel: use a slider.

## Installation

```bash
npm install claymorph-ui @ui-sdk/web @ui-sdk/core
```

Then import `claymorph-ui/clay.css` once and each element you use, like `claymorph-ui/button`.

## Usage

```html
<ui-field>
  <ui-field-label>Email</ui-field-label>
  <clay-input>
    <ui-input><input type="email" required /></ui-input>
  </clay-input>
</ui-field>
```

An icon placed before the input sits inside the well. A search field can wrap `ui-input-group` with a `ui-input-clear` button. While the field has focus, its rim glows in the input's colour.

## Attached label and hint

With `attached`, put the `ui-field-label` and `ui-field-description` inside `<clay-input>`. They become small beads melted onto the rim, like the status bead on an avatar. Focus pulls them a little further out. The third field in the demo above shows it.

```html
<ui-field>
  <clay-input attached>
    <ui-field-label>Display name</ui-field-label>
    <ui-input><input value="Aryan" required /></ui-input>
    <ui-field-description>Shown on mixes you share.</ui-field-description>
  </clay-input>
</ui-field>
```

## API reference

### Attributes

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `color` | `neutral \| teal \| lilac \| sky \| peach \| mint \| butter \| rose \| slate \| ink \| <color>` | `teal` | The colour the rim glows while focused. |
| `size` | `sm \| md \| lg` | `md` | 40, 48 or 56 px tall. |
| `attached` | `boolean` | — | Draws the `ui-field-label` and `ui-field-description` inside it as beads joined to the rim. Leaves room above and below. |

### State

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `data-invalid` | `attribute` | — | Set while the field matches `:user-invalid` or has `aria-invalid="true"`. |
| `data-clay-ready` | `attribute` | — | Set once the first WebGL2 frame is drawn. Until then the CSS clay shows. |
| `data-tone` | `"light" \| "dark"` | — | Set from the clay colour's luminance so text can pick a readable colour. |

## Accessibility

- Name the field with a `ui-field-label`, or with `aria-label` on the input when there's no visible label.
- Focus shows as the whole rim glowing. Without WebGL2, and in forced colours, an outline goes around the field instead.
- Attached labels and hints are still the field's `ui-field-label` and `ui-field-description`, so they name and describe the input as usual.
