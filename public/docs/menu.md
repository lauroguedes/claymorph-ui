# Menu (`<clay-menu>`)

A menu of actions that spills out of its clay button as a soft slab, its items rolling in one after another. Wraps `ui-menu`.

### Preview

```html
<div class="demo-row">
  <clay-menu>
    <ui-menu>
      <ui-menu-trigger><button>Track options</button></ui-menu-trigger>
      <ui-menu-content>
        <ui-menu-item value="rename"><svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"/><path d="m15 5 4 4"/></svg>Rename</ui-menu-item>
        <ui-menu-item value="duplicate"><svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>Duplicate</ui-menu-item>
        <ui-menu-item value="share"><svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" x2="15.42" y1="13.51" y2="17.49"/><line x1="15.41" x2="8.59" y1="6.51" y2="10.49"/></svg>Share</ui-menu-item>
        <ui-menu-separator></ui-menu-separator>
        <ui-menu-item value="delete" variant="danger"><svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M10 11v6"/><path d="M14 11v6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M3 6h18"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>Delete</ui-menu-item>
      </ui-menu-content>
    </ui-menu>
  </clay-menu>
  <clay-menu icon color="lilac">
    <ui-menu>
      <ui-menu-trigger><button aria-label="More actions"><svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg></button></ui-menu-trigger>
      <ui-menu-content>
        <ui-menu-checkbox-item value="pinned">Pinned</ui-menu-checkbox-item>
        <ui-menu-checkbox-item value="muted">Muted</ui-menu-checkbox-item>
      </ui-menu-content>
    </ui-menu>
  </clay-menu>
</div>
```

**Use it for**

- Several actions on one thing that don't fit as buttons.

**Not for**

- Choosing a value: use a select.
- Going to other pages: use links.

## Installation

```bash
npm install claymorph-ui @ui-sdk/web @ui-sdk/core
```

Then import `claymorph-ui/clay.css` once and each element you use, like `claymorph-ui/button`.

## Usage

```html
<clay-menu>
  <ui-menu>
    <ui-menu-trigger><button>Track options</button></ui-menu-trigger>
    <ui-menu-content>
      <ui-menu-item value="rename">Rename</ui-menu-item>
      <ui-menu-separator></ui-menu-separator>
      <ui-menu-item value="delete" variant="danger">Delete</ui-menu-item>
    </ui-menu-content>
  </ui-menu>
</clay-menu>
```

```ts
document.querySelector("ui-menu")!.addEventListener("action", (event) => {
  run((event as CustomEvent<{ value: string }>).detail.value)
})
```

## Attached

With `attached`, the menu squeezes out of its button like Roll's bead, stays melted onto it while it's open, and tucks back in when it closes.

### Attached

```html
<clay-menu attached color="lilac">
  <ui-menu>
    <ui-menu-trigger><button>Track options</button></ui-menu-trigger>
    <ui-menu-content>
      <ui-menu-item value="queue">Add to queue</ui-menu-item>
      <ui-menu-item value="share">Share</ui-menu-item>
      <ui-menu-separator></ui-menu-separator>
      <ui-menu-item value="delete" variant="danger">Delete</ui-menu-item>
    </ui-menu-content>
  </ui-menu>
</clay-menu>
```

## Fuse

`fuse` sets how far the menu melts into its button, from `0`, a slight waist with a small gap, to `1`, where it sits right on the button and the two read as one body. The joint is smooth at every level. Set it with the slider, then open the menu.

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
  <clay-menu attached color="lilac">
    <ui-menu>
      <ui-menu-trigger><button>Track options</button></ui-menu-trigger>
      <ui-menu-content>
        <ui-menu-item value="queue">Add to queue</ui-menu-item>
        <ui-menu-item value="share">Share</ui-menu-item>
        <ui-menu-separator></ui-menu-separator>
        <ui-menu-item value="delete" variant="danger">Delete</ui-menu-item>
      </ui-menu-content>
    </ui-menu>
  </clay-menu>
</div>
```

```ts
export default function setup(root: HTMLElement) {
  const menu = root.querySelector("clay-menu")!
  root.querySelector("ui-slider")!.addEventListener("valuechange", (event) => {
    menu.setAttribute("fuse", String((event as CustomEvent<{ value: number }>).detail.value))
  })
}
```

## API reference

### Attributes

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `color` | `neutral \| teal \| lilac \| sky \| peach \| mint \| butter \| rose \| slate \| ink \| <color>` | `neutral` | The trigger's colour. The list is always `--clay-popup`. |
| `attached` | `boolean` | — | Grows the menu out of its button and keeps them melted together while it's open. |
| `fuse` | `number` | `0` | With `attached`, how far the menu fuses with its button, from 0 to 1. The gap between them closes as it rises; the joint itself is always smooth. |
| `size` | `sm \| md \| lg \| xl` | `md` | The trigger's height. |
| `icon` | `boolean` | — | A square trigger, for an icon button with an `aria-label`. |
| `variant` | `"danger"` | — | On a `<ui-menu-item>`: writes it in the danger colour. |

## Accessibility

- The trigger opens it with Enter, Space or the arrow keys; arrows move between items, typing jumps to one, and Escape closes it and returns focus.
- Checkbox and radio items report their state, and separators aren't focus stops.
