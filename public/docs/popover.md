# Popover (`<clay-popover>`)

A small clay card that unfolds from its button, for a few controls or a short message. Wraps `ui-popover`.

### Preview

```html
<clay-popover color="teal">
  <ui-popover>
    <ui-popover-trigger><button><svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" x2="15.42" y1="13.51" y2="17.49"/><line x1="15.41" x2="8.59" y1="6.51" y2="10.49"/></svg>Share</button></ui-popover-trigger>
    <ui-popover-content>
      <ui-popover-title>Share this playlist</ui-popover-title>
      <ui-popover-description>Anyone with the link can listen.</ui-popover-description>
      <clay-input size="sm">
        <ui-input><input aria-label="Playlist link" value="clay.fm/p/chill-vibes" readonly /></ui-input>
      </clay-input>
      <div class="clay-actions">
        <clay-button size="sm" color="teal">
          <ui-popover-close><button>Copy link</button></ui-popover-close>
        </clay-button>
      </div>
    </ui-popover-content>
  </ui-popover>
</clay-popover>
```

**Use it for**

- A short task next to its button: share, a quick setting, a note.

**Not for**

- A name or a hint: use a tooltip.
- A task that needs full attention: use a dialog.

## Installation

```bash
npm install claymorph-ui @ui-sdk/web @ui-sdk/core
```

Then import `claymorph-ui/clay.css` once and each element you use, like `claymorph-ui/button`.

## Usage

```html
<clay-popover color="teal">
  <ui-popover>
    <ui-popover-trigger><button>Share</button></ui-popover-trigger>
    <ui-popover-content>
      <ui-popover-title>Share this playlist</ui-popover-title>
      <ui-popover-description>Anyone with the link can listen.</ui-popover-description>
      <clay-button size="sm" color="teal">
        <ui-popover-close><button>Copy link</button></ui-popover-close>
      </clay-button>
    </ui-popover-content>
  </ui-popover>
</clay-popover>
```

## Attached

With `attached`, the card squeezes out of its button like Roll's bead, stays melted onto it while it's open, and tucks back in when it closes.

### Attached

```html
<clay-popover attached color="teal">
  <ui-popover>
    <ui-popover-trigger><button>Share</button></ui-popover-trigger>
    <ui-popover-content>
      <ui-popover-title>Share this playlist</ui-popover-title>
      <ui-popover-description>Anyone with the link can listen.</ui-popover-description>
      <div class="clay-actions">
        <clay-button size="sm" color="teal">
          <ui-popover-close><button>Copy link</button></ui-popover-close>
        </clay-button>
      </div>
    </ui-popover-content>
  </ui-popover>
</clay-popover>
```

## Fuse

`fuse` sets how far the card melts into its button, from `0`, a slight waist with a small gap, to `1`, where it sits right on the button and the two read as one body. The joint is smooth at every level. Set it with the slider, then open the card.

### Fuse

```html
<div class="demo-stack fuse-demo">
  <clay-slider>
    <ui-field>
      <ui-slider default-value="0" min="0" max="1" step="0.05" aria-label="Fuse">
        <div class="clay-slider-head">
          <ui-field-label>fuse</ui-field-label>
          <ui-slider-value></ui-slider-value>
        </div>
        <ui-slider-control>
          <ui-slider-track>
            <ui-slider-indicator></ui-slider-indicator>
            <ui-slider-thumb></ui-slider-thumb>
          </ui-slider-track>
        </ui-slider-control>
      </ui-slider>
    </ui-field>
  </clay-slider>
  <clay-popover attached color="teal">
    <ui-popover>
      <ui-popover-trigger><button>Share</button></ui-popover-trigger>
      <ui-popover-content>
        <ui-popover-title>Share this playlist</ui-popover-title>
        <ui-popover-description>Anyone with the link can listen.</ui-popover-description>
        <div class="clay-actions">
          <clay-button size="sm" color="teal">
            <ui-popover-close><button>Copy link</button></ui-popover-close>
          </clay-button>
        </div>
      </ui-popover-content>
    </ui-popover>
  </clay-popover>
</div>
```

```ts
export default function setup(root: HTMLElement) {
  const popover = root.querySelector("clay-popover")!
  root.querySelector("ui-slider")!.addEventListener("valuechange", (event) => {
    popover.setAttribute("fuse", String((event as CustomEvent<{ value: number }>).detail.value))
  })
}
```

## API reference

### Attributes

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `color` | `neutral \| teal \| lilac \| sky \| peach \| mint \| butter \| rose \| slate \| ink \| <color>` | `neutral` | The trigger's colour. The card is always `--clay-popup`. |
| `attached` | `boolean` | — | Grows the card out of its button and keeps them melted together while it's open. |
| `fuse` | `number` | `0` | With `attached`, how far the card fuses with its button, from 0 to 1. The gap between them closes as it rises; the joint itself is always smooth. |
| `size` | `sm \| md \| lg \| xl` | `md` | The trigger's height. |
| `icon` | `boolean` | — | A square trigger, for an icon button with an `aria-label`. |

## Accessibility

- The card has the dialog role, named by its title and described by its description.
- Focus moves into it when it opens; Escape or a press outside closes it and focus returns to the trigger.
