# Button (`<clay-button>`)

A clay button. It swells toward the pointer, squashes and glows when pressed, and springs back. Wraps `ui-button`.

### Preview

```html
<div class="demo-row">
  <clay-button color="teal">
    <ui-button><button>Get started</button></ui-button>
  </clay-button>
  <clay-button>
    <ui-button><button>Learn more</button></ui-button>
  </clay-button>
  <clay-button color="lilac">
    <ui-button><button>Invite</button></ui-button>
  </clay-button>
  <clay-button color="peach">
    <ui-button><button>Share</button></ui-button>
  </clay-button>
</div>
```

**Use it for**

- One action: Save, Continue, Open.
- A row of actions with different weights, by colour.

**Not for**

- An action that takes time and should show it: use **Roll**.
- Choosing one of a few options: use **Slide**.

## Installation

```bash
npm install claymorph-ui @ui-sdk/web @ui-sdk/core
```

Then import `claymorph-ui/clay.css` once and each element you use, like `claymorph-ui/button`.

## Usage

```html
<clay-button color="teal">
  <ui-button><button>Save</button></ui-button>
</clay-button>
```

Listen for `action` on `<ui-button>`, as with any ui-sdk button. `event.detail.waitUntil(promise)` keeps it pending.

## Examples

### Sizes and shapes

```html
<div class="demo-row">
  <clay-button size="sm" color="sky">
    <ui-button><button>Small</button></ui-button>
  </clay-button>
  <clay-button color="sky">
    <ui-button><button>Medium</button></ui-button>
  </clay-button>
  <clay-button size="lg" color="sky" shape="rounded">
    <ui-button><button>Large</button></ui-button>
  </clay-button>
  <clay-button size="xl" color="slate" shape="rounded">
    <ui-button><button>Extra large</button></ui-button>
  </clay-button>
</div>
```

`size` is `sm`, `md`, `lg` or `xl`. `shape="rounded"` trades the pill for soft corners.

## API reference

### Attributes

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `color` | `neutral \| teal \| lilac \| sky \| peach \| mint \| butter \| rose \| slate \| ink \| <color>` | — | The clay's colour: a preset, or any CSS colour. It sets `--clay-color` on the element. |
| `size` | `sm \| md \| lg \| xl` | `md` | Height: 36, 44, 52 or 64 px. |
| `shape` | `pill \| rounded` | `pill` | Pill ends or soft corners. |
| `icon` | `boolean` | — | Makes it square, for an icon-only button. Give the button an `aria-label`. |

### State

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `data-clay-ready` | `attribute` | — | Set once the first WebGL2 frame is drawn. Until then the CSS clay shows. |
| `data-tone` | `"light" \| "dark"` | — | Set from the clay colour's luminance so text can pick a readable colour. |

## Accessibility

- The real element is the `<button>` inside `<ui-button>`: its text is its name, and Enter and Space press it.
- The canvas is `aria-hidden` and ignores the pointer.
- Under reduced motion, every spring jumps to its end.
