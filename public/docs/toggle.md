# Toggle (`<clay-toggle>`)

A toggle button whose clay sinks into a coloured well while it's on, and pops back out when it's off. Wraps `ui-toggle`.

### Preview

```html
<div class="demo-row">
  <clay-toggle icon color="rose">
    <ui-toggle default-pressed>
      <button aria-label="Like"><svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5"/></svg></button>
    </ui-toggle>
  </clay-toggle>
  <clay-toggle icon color="sky">
    <ui-toggle>
      <button aria-label="Shuffle"><svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="m18 14 4 4-4 4"/><path d="m18 2 4 4-4 4"/><path d="M2 18h1.973a4 4 0 0 0 3.3-1.7l5.454-8.6a4 4 0 0 1 3.3-1.7H22"/><path d="M2 6h1.972a4 4 0 0 1 3.6 2.2"/><path d="M22 18h-6.041a4 4 0 0 1-3.3-1.8l-.359-.45"/></svg></button>
    </ui-toggle>
  </clay-toggle>
  <clay-toggle icon color="lilac">
    <ui-toggle>
      <button aria-label="Repeat"><svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="m17 2 4 4-4 4"/><path d="M3 11v-1a4 4 0 0 1 4-4h14"/><path d="m7 22-4-4 4-4"/><path d="M21 13v1a4 4 0 0 1-4 4H3"/></svg></button>
    </ui-toggle>
  </clay-toggle>
  <clay-toggle color="teal">
    <ui-toggle>
      <button>Follow</button>
    </ui-toggle>
  </clay-toggle>
</div>
```

**Use it for**

- An on or off action on a button: like, shuffle, mute, bold.

**Not for**

- A setting that applies at once and reads as a sentence: use a switch.
- One of several options: use a segmented control.

## Installation

```bash
npm install claymorph-ui @ui-sdk/web @ui-sdk/core
```

Then import `claymorph-ui/clay.css` once and each element you use, like `claymorph-ui/button`.

## Usage

```html
<clay-toggle icon color="rose">
  <ui-toggle>
    <button aria-label="Like"><svg class="icon" aria-hidden="true">…</svg></button>
  </ui-toggle>
</clay-toggle>
```

Start it on with `default-pressed` on `<ui-toggle>`, and listen for `pressedchange` there. A text toggle needs no `icon`.

## API reference

### Attributes

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `color` | `neutral \| teal \| lilac \| sky \| peach \| mint \| butter \| rose \| slate \| ink \| <color>` | `teal` | The colour of the well while it's on. |
| `size` | `sm \| md \| lg \| xl` | `md` | 36, 44, 52 or 64 px tall. |
| `icon` | `boolean` | — | Makes it square, for an icon-only toggle. |
| `shape` | `pill \| rounded` | `pill` | Fully round ends, or soft corners. |

### State

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `data-pressed` | `"true" \| "false"` | — | Mirrors the toggle, so the text can take the well's tone. |
| `data-clay-ready` | `attribute` | — | Set once the first WebGL2 frame is drawn. Until then the CSS clay shows. |
| `data-tone` | `"light" \| "dark"` | — | Set from the clay colour's luminance so text can pick a readable colour. |

## Accessibility

- The button reports its state with `aria-pressed`. Keep its label the same in both states: screen readers say whether it's pressed.
- An icon-only toggle needs an `aria-label` on the button.
