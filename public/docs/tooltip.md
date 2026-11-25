# Tooltip (`<clay-tooltip>`)

Names a control or adds a short hint, as a small clay tag that pops out of its side. Wraps `ui-tooltip`.

### Preview

```html
<div class="demo-row">
  <clay-tooltip>
    <ui-tooltip>
      <clay-button icon color="rose">
        <ui-tooltip-trigger>
          <button aria-label="Like">
            <svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5"/></svg>
          </button>
        </ui-tooltip-trigger>
      </clay-button>
      <ui-tooltip-content>Add to favorites</ui-tooltip-content>
    </ui-tooltip>
  </clay-tooltip>
  <clay-tooltip color="teal">
    <ui-tooltip>
      <clay-button icon>
        <ui-tooltip-trigger>
          <button aria-label="Repeat">
            <svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="m17 2 4 4-4 4"/><path d="M3 11v-1a4 4 0 0 1 4-4h14"/><path d="m7 22-4-4 4-4"/><path d="M21 13v1a4 4 0 0 1-4 4H3"/></svg>
          </button>
        </ui-tooltip-trigger>
      </clay-button>
      <ui-tooltip-content side="bottom">Repeat one</ui-tooltip-content>
    </ui-tooltip>
  </clay-tooltip>
</div>
```

**Use it for**

- Naming an icon-only button.
- A short hint on hover and focus.

**Not for**

- Anything interactive: tooltips can't be focused.

## Installation

```bash
npm install claymorph-ui @ui-sdk/web @ui-sdk/core
```

Then import `claymorph-ui/clay.css` once and each element you use, like `claymorph-ui/button`.

## Usage

```html
<clay-tooltip>
  <ui-tooltip>
    <clay-button icon color="rose">
      <ui-tooltip-trigger><button aria-label="Like">…</button></ui-tooltip-trigger>
    </clay-button>
    <ui-tooltip-content>Add to favorites</ui-tooltip-content>
  </ui-tooltip>
</clay-tooltip>
```

## Attached

With `attached`, the tag squeezes out of its button like Roll's bead, stays melted onto it while it's open, and tucks back in when it closes. It takes the button's colour unless you give it a `color`.

### Attached

```html
<div class="demo-row">
  <clay-tooltip attached>
    <ui-tooltip>
      <clay-button icon color="teal">
        <ui-tooltip-trigger>
          <button aria-label="Shuffle">
            <svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="m18 14 4 4-4 4"/><path d="m18 2 4 4-4 4"/><path d="M2 18h1.973a4 4 0 0 0 3.3-1.7l5.454-8.6a4 4 0 0 1 3.3-1.7H22"/><path d="M2 6h1.972a4 4 0 0 1 3.6 2.2"/><path d="M22 18h-6.041a4 4 0 0 1-3.3-1.8l-.359-.45"/></svg>
          </button>
        </ui-tooltip-trigger>
      </clay-button>
      <ui-tooltip-content>Shuffle the queue</ui-tooltip-content>
    </ui-tooltip>
  </clay-tooltip>
  <clay-tooltip attached>
    <ui-tooltip>
      <clay-button color="lilac">
        <ui-tooltip-trigger><button>Hover me</button></ui-tooltip-trigger>
      </clay-button>
      <ui-tooltip-content side="bottom">It grows out of the button</ui-tooltip-content>
    </ui-tooltip>
  </clay-tooltip>
</div>
```

## Fuse

`fuse` sets how far an attached tag melts into its button, from `0`, joined at a slight waist, to `1`, where the tag sits right on the button and the two read as one body. The joint is smooth at every level. Drag the slider to try them.

### Fuse

```html
<div class="demo-stack">
  <div class="demo-row tooltip-fuse-row">
    <clay-tooltip attached>
      <ui-tooltip>
        <clay-button icon color="teal">
          <ui-tooltip-trigger>
            <button aria-label="Shuffle">
              <svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="m18 14 4 4-4 4"/><path d="m18 2 4 4-4 4"/><path d="M2 18h1.973a4 4 0 0 0 3.3-1.7l5.454-8.6a4 4 0 0 1 3.3-1.7H22"/><path d="M2 6h1.972a4 4 0 0 1 3.6 2.2"/><path d="M22 18h-6.041a4 4 0 0 1-3.3-1.8l-.359-.45"/></svg>
            </button>
          </ui-tooltip-trigger>
        </clay-button>
        <ui-tooltip-content>Shuffle the queue</ui-tooltip-content>
      </ui-tooltip>
    </clay-tooltip>
    <clay-tooltip attached>
      <ui-tooltip>
        <clay-button color="lilac">
          <ui-tooltip-trigger><button>Hover me</button></ui-tooltip-trigger>
        </clay-button>
        <ui-tooltip-content side="bottom">It grows out of the button</ui-tooltip-content>
      </ui-tooltip>
    </clay-tooltip>
  </div>
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
</div>
```

```ts
export default function setup(root: HTMLElement) {
  const tooltips = [...root.querySelectorAll<HTMLElement>("clay-tooltip")]
  const tips = [...root.querySelectorAll<HTMLElement & { open: boolean }>("ui-tooltip")]
  // The tags stay out while the demo is on screen, so you can try the levels; off screen they close,
  // or they'd float over the page in the top layer.
  let shown = false
  for (const tip of tips) {
    tip.addEventListener("openchange", (event) => {
      if (shown && !(event as CustomEvent<{ value: boolean }>).detail.value) event.preventDefault()
    })
  }
  new IntersectionObserver(([entry]) => {
    shown = entry!.isIntersecting
    for (const tip of tips) tip.open = shown
  }).observe(root.querySelector(".tooltip-fuse-row")!)
  root.querySelector("ui-slider")!.addEventListener("valuechange", (event) => {
    const fuse = String((event as CustomEvent<{ value: number }>).detail.value)
    for (const tooltip of tooltips) tooltip.setAttribute("fuse", fuse)
  })
}
```

## API reference

### Attributes

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `color` | `neutral \| teal \| lilac \| sky \| peach \| mint \| butter \| rose \| slate \| ink \| <color>` | `ink` | The tag's colour. Attached tags take the button's colour when this is left out. |
| `attached` | `boolean` | — | Grows the tag out of its clay button and keeps them joined while it's open. |
| `fuse` | `number` | `0` | With `attached`, how far the tag fuses with its button, from 0 to 1. The gap between them closes as it rises; the joint itself is always smooth. |

## Accessibility

- The content has the tooltip role and names or describes its trigger before focus reaches it.
- Escape closes it while focus stays on the trigger.
