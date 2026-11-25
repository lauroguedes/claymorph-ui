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

## Attached

With `attached`, the dialog grows out of the button that opened it, moving like the logo. The button's own clay swells and a bead is pulled out of it on a neck that stretches and lets go, and the page only dims once it has let go. The bead flies off dripping a tail of droplets, which run back into it as it slows, then swells into the slab, wobbling wide and tall as it takes on its colour. The contents fade in once it's nearly full size. Closing runs it all back: the slab shrinks to a bead, flies home with its tail behind, and is drawn back into the button, which bounces as it takes it in.

### Attached

```html
<clay-dialog attached color="teal">
  <ui-dialog>
    <ui-dialog-trigger><button>New playlist</button></ui-dialog-trigger>
    <ui-dialog-backdrop hidden></ui-dialog-backdrop>
    <ui-dialog-content hidden>
      <ui-dialog-title>New playlist</ui-dialog-title>
      <ui-dialog-description>Give it a name. You can add songs to it from any album or from your queue.</ui-dialog-description>
      <clay-input><ui-input><input aria-label="Playlist name" placeholder="Sunday morning" /></ui-input></clay-input>
      <div class="clay-actions">
        <clay-button><ui-dialog-close><button>Cancel</button></ui-dialog-close></clay-button>
        <clay-button color="teal"><ui-dialog-close><button>Create</button></ui-dialog-close></clay-button>
      </div>
    </ui-dialog-content>
  </ui-dialog>
</clay-dialog>
```

## API reference

### Attributes

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `color` | `neutral \| teal \| lilac \| sky \| peach \| mint \| butter \| rose \| slate \| ink \| <color>` | `neutral` | The trigger's colour. The slab is always `--clay-popup`. |
| `size` | `sm \| md \| lg \| xl` | `md` | The trigger's height. |
| `icon` | `boolean` | — | A square trigger, for an icon button with an `aria-label`. |
| `attached` | `boolean` | — | Pulls the dialog out of its trigger as a bead that flies to its place and swells into it, and draws it back in when it closes. |

## Accessibility

- Focus moves in and stays inside until it closes; Escape closes it and focus returns to the trigger.
- The title names it and the description is read with it.
- The slab doesn't scroll, so keep the content short.
