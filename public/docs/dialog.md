# Dialog (`<clay-dialog>`)

A modal dialog: a thick clay slab that drops onto a blurred page and settles with a squash. Wraps `ui-dialog`.

### Preview

```html
<clay-dialog>
  <ui-dialog>
    <ui-dialog-trigger><button>Clear history</button></ui-dialog-trigger>
    <ui-dialog-backdrop hidden></ui-dialog-backdrop>
    <ui-dialog-content hidden>
      <ui-dialog-title>Clear listening history?</ui-dialog-title>
      <ui-dialog-description>Your recommendations will start from scratch. This can't be undone.</ui-dialog-description>
      <div class="clay-actions">
        <clay-button><ui-dialog-close><button>Keep it</button></ui-dialog-close></clay-button>
        <clay-button color="rose"><ui-dialog-close><button>Clear history</button></ui-dialog-close></clay-button>
      </div>
    </ui-dialog-content>
  </ui-dialog>
</clay-dialog>
```

**Use it for**

- A decision or a short form that needs full attention.

**Not for**

- News someone can ignore: use a toast.
- A small task by its button: use a popover.

## Installation

```bash
npm install claymorph-ui @ui-sdk/web @ui-sdk/core
```

Then import `claymorph-ui/clay.css` once and each element you use, like `claymorph-ui/button`.

## Usage

```html
<clay-dialog>
  <ui-dialog>
    <ui-dialog-trigger><button>Clear history</button></ui-dialog-trigger>
    <ui-dialog-backdrop hidden></ui-dialog-backdrop>
    <ui-dialog-content hidden>
      <ui-dialog-title>Clear listening history?</ui-dialog-title>
      <ui-dialog-description>This can't be undone.</ui-dialog-description>
      <div class="clay-actions">
        <clay-button><ui-dialog-close><button>Keep it</button></ui-dialog-close></clay-button>
        <clay-button color="rose"><ui-dialog-close><button>Clear</button></ui-dialog-close></clay-button>
      </div>
    </ui-dialog-content>
  </ui-dialog>
</clay-dialog>
```

`.clay-actions` lines the buttons up at the end. Each close part wraps its own button, so put a `<clay-button>` around it.

## API reference

### Attributes

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `color` | `neutral \| teal \| lilac \| sky \| peach \| mint \| butter \| rose \| slate \| ink \| <color>` | `neutral` | The trigger's colour. The slab is always `--clay-popup`. |
| `size` | `sm \| md \| lg \| xl` | `md` | The trigger's height. |
| `icon` | `boolean` | — | A square trigger, for an icon button with an `aria-label`. |

## Accessibility

- Focus moves in and stays inside until it closes; Escape closes it and focus returns to the trigger.
- The title names it and the description is read with it.
- The slab doesn't scroll, so keep the content short.
