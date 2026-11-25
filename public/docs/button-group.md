# Button group (`<clay-button-group>`)

Related buttons fused into one clay body. Each part swells and squashes on its own, and a pressed toggle inside sinks into a well. Wraps `ui-button` or `ui-toggle` buttons.

### Preview

```html
<clay-button-group aria-label="Playback" color="sky">
  <ui-button><button aria-label="Previous track"><svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M17.971 4.285A2 2 0 0 1 21 6v12a2 2 0 0 1-3.029 1.715l-9.997-5.998a2 2 0 0 1-.003-3.432z"/><path d="M3 20V4"/></svg></button></ui-button>
  <ui-button><button aria-label="Play"><svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 5a2 2 0 0 1 3.008-1.728l11.997 6.998a2 2 0 0 1 .003 3.458l-12 7A2 2 0 0 1 5 19z"/></svg></button></ui-button>
  <ui-button><button aria-label="Next track"><svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M21 4v16"/><path d="M6.029 4.285A2 2 0 0 0 3 6v12a2 2 0 0 0 3.029 1.715l9.997-5.998a2 2 0 0 0 .003-3.432z"/></svg></button></ui-button>
</clay-button-group>
<clay-button-group aria-label="Message">
  <ui-button><button><svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><rect width="20" height="5" x="2" y="3" rx="1"/><path d="M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8"/><path d="M10 12h4"/></svg>Archive</button></ui-button>
  <ui-button><button><svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 22V4a1 1 0 0 1 .4-.8A6 6 0 0 1 8 2c3 0 5 2 7.333 2q2 0 3.067-.8A1 1 0 0 1 20 4v10a1 1 0 0 1-.4.8A6 6 0 0 1 16 16c-3 0-5-2-8-2a6 6 0 0 0-4 1.528"/></svg>Report</button></ui-button>
  <ui-button><button aria-label="More"><svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg></button></ui-button>
</clay-button-group>
```

**Use it for**

- Two to five related actions that belong together: playback, text style, message actions.

**Not for**

- Choosing one option: use a segmented control.
- Unrelated actions: space out separate buttons.

## Installation

```bash
npm install claymorph-ui @ui-sdk/web @ui-sdk/core
```

Then import `claymorph-ui/clay.css` once and each element you use, like `claymorph-ui/button`.

## Usage

```html
<clay-button-group aria-label="Playback" color="sky">
  <ui-button><button aria-label="Previous track">…</button></ui-button>
  <ui-button><button aria-label="Play">…</button></ui-button>
  <ui-button><button aria-label="Next track">…</button></ui-button>
</clay-button-group>
```

## Toggles

Put `ui-toggle` buttons in the group and the pressed ones sink into wells of the same body.

### Text style

```html
<clay-button-group aria-label="Text style" color="butter">
  <ui-toggle><button aria-label="Bold"><svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 12h9a4 4 0 010 8H7a1 1 0 01-1-1V5a1 1 0 011-1h7a4 4 0 010 8"/></svg></button></ui-toggle>
  <ui-toggle default-pressed><button aria-label="Italic"><svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><line x1="19" x2="10" y1="4" y2="4"/><line x1="14" x2="5" y1="20" y2="20"/><line x1="15" x2="9" y1="4" y2="20"/></svg></button></ui-toggle>
  <ui-toggle><button aria-label="Underline"><svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 4v6a6 6 0 0 0 12 0V4"/><line x1="4" x2="20" y1="20" y2="20"/></svg></button></ui-toggle>
</clay-button-group>
```

## API reference

### Attributes

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `color` | `neutral \| teal \| lilac \| sky \| peach \| mint \| butter \| rose \| slate \| ink \| <color>` | `neutral` | The clay's colour: a preset, or any CSS colour. It sets `--clay-color` on the element. |
| `size` | `sm \| md \| lg \| xl` | `md` | The height of every part. |
| `aria-label` | `string` | — | Names the group. The element gets `role="group"` unless it has a role. |

## Accessibility

- Each part is its own button in the tab order, with its own name. Give icon-only parts an `aria-label`.
- Toggles report their state with `aria-pressed`.
- Up to 16 buttons fuse; more stay plain.
