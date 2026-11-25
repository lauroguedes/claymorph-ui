# Combobox (`<clay-combobox>`)

A combobox whose field is carved like Type's, with a list that pours out under it and narrows as you type, while a well slides between the matches. Wraps `ui-combobox`.

### Preview

```html
<clay-combobox>
  <ui-combobox>
    <ui-combobox-label>Genre</ui-combobox-label>
    <div>
      <ui-combobox-input><input placeholder="Search genres" /></ui-combobox-input>
      <ui-combobox-trigger><button aria-label="Show genres"></button></ui-combobox-trigger>
    </div>
    <ui-combobox-content hidden>
      <ui-combobox-empty>No genres found.</ui-combobox-empty>
      <ui-combobox-list>
        <ui-combobox-item value="ambient">Ambient</ui-combobox-item>
        <ui-combobox-item value="bossa-nova">Bossa nova</ui-combobox-item>
        <ui-combobox-item value="disco">Disco</ui-combobox-item>
        <ui-combobox-item value="drum-bass">Drum and bass</ui-combobox-item>
        <ui-combobox-item value="folk">Folk</ui-combobox-item>
        <ui-combobox-item value="funk">Funk</ui-combobox-item>
        <ui-combobox-item value="hip-hop">Hip-hop</ui-combobox-item>
        <ui-combobox-item value="house">House</ui-combobox-item>
      </ui-combobox-list>
    </ui-combobox-content>
  </ui-combobox>
</clay-combobox>
```

**Use it for**

- One choice from a long list, found by typing: a country, a genre, an assignee.

**Not for**

- A short list people can scan: use **Pour**.
- Free text where suggestions only help: use **Type**.

## Installation

```bash
npm install claymorph-ui @ui-sdk/web @ui-sdk/core
```

Then import `claymorph-ui/clay.css` once and each element you use, like `claymorph-ui/button`.

## Usage

Put the input and its buttons in one box: that box is the field the clay is carved into, and the list lines up with it. A trigger button with no icon of its own gets a chevron.

```html
<clay-combobox>
  <ui-combobox>
    <ui-combobox-label>Genre</ui-combobox-label>
    <div>
      <ui-combobox-input><input placeholder="Search genres" /></ui-combobox-input>
      <ui-combobox-trigger><button aria-label="Show genres"></button></ui-combobox-trigger>
    </div>
    <ui-combobox-content hidden>
      <ui-combobox-empty>No genres found.</ui-combobox-empty>
      <ui-combobox-list>
        <ui-combobox-item value="jazz">Jazz</ui-combobox-item>
        <ui-combobox-item value="samba">Samba</ui-combobox-item>
      </ui-combobox-list>
    </ui-combobox-content>
  </ui-combobox>
</clay-combobox>
```

## Attached

With `attached`, the list squeezes out of the field's rim and stays melted onto it. As you type, it swells and shrinks on a spring with the matches, from the edge it's attached by, and the field's well gives a little as it tucks back in. Type “so”, then delete it, to see it shrink and swell back.

### Attached

```html
<clay-combobox attached color="teal">
  <ui-combobox>
    <ui-combobox-label>Genre</ui-combobox-label>
    <div>
      <ui-combobox-input><input placeholder="Search genres" /></ui-combobox-input>
      <ui-combobox-trigger><button aria-label="Show genres"></button></ui-combobox-trigger>
    </div>
    <ui-combobox-content hidden>
      <ui-combobox-empty>No genres found.</ui-combobox-empty>
      <ui-combobox-list>
        <ui-combobox-item value="ambient">Ambient</ui-combobox-item>
        <ui-combobox-item value="bossa-nova">Bossa nova</ui-combobox-item>
        <ui-combobox-item value="disco">Disco</ui-combobox-item>
        <ui-combobox-item value="drum-bass">Drum and bass</ui-combobox-item>
        <ui-combobox-item value="folk">Folk</ui-combobox-item>
        <ui-combobox-item value="funk">Funk</ui-combobox-item>
        <ui-combobox-item value="hip-hop">Hip-hop</ui-combobox-item>
        <ui-combobox-item value="house">House</ui-combobox-item>
        <ui-combobox-item value="jazz">Jazz</ui-combobox-item>
        <ui-combobox-item value="lo-fi">Lo-fi</ui-combobox-item>
        <ui-combobox-item value="mpb">MPB</ui-combobox-item>
        <ui-combobox-item value="reggae">Reggae</ui-combobox-item>
        <ui-combobox-item value="samba">Samba</ui-combobox-item>
        <ui-combobox-item value="soul">Soul</ui-combobox-item>
        <ui-combobox-item value="synthwave">Synthwave</ui-combobox-item>
        <ui-combobox-item value="techno">Techno</ui-combobox-item>
      </ui-combobox-list>
    </ui-combobox-content>
  </ui-combobox>
</clay-combobox>
```

## Fuse

Like Pour's, `fuse` sets how far the list melts into the field, from `0`, a slight waist with a small gap, to `1`, one body. Set it with the slider, then open the list.

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
  <clay-combobox attached color="lilac">
    <ui-combobox>
      <ui-combobox-label>Genre</ui-combobox-label>
      <div>
        <ui-combobox-input><input placeholder="Search genres" /></ui-combobox-input>
        <ui-combobox-trigger><button aria-label="Show genres"></button></ui-combobox-trigger>
      </div>
      <ui-combobox-content hidden>
        <ui-combobox-empty>No genres found.</ui-combobox-empty>
        <ui-combobox-list>
          <ui-combobox-item value="ambient">Ambient</ui-combobox-item>
          <ui-combobox-item value="bossa-nova">Bossa nova</ui-combobox-item>
          <ui-combobox-item value="disco">Disco</ui-combobox-item>
          <ui-combobox-item value="drum-bass">Drum and bass</ui-combobox-item>
          <ui-combobox-item value="folk">Folk</ui-combobox-item>
          <ui-combobox-item value="funk">Funk</ui-combobox-item>
          <ui-combobox-item value="hip-hop">Hip-hop</ui-combobox-item>
          <ui-combobox-item value="house">House</ui-combobox-item>
          <ui-combobox-item value="jazz">Jazz</ui-combobox-item>
          <ui-combobox-item value="lo-fi">Lo-fi</ui-combobox-item>
          <ui-combobox-item value="mpb">MPB</ui-combobox-item>
          <ui-combobox-item value="reggae">Reggae</ui-combobox-item>
          <ui-combobox-item value="samba">Samba</ui-combobox-item>
          <ui-combobox-item value="soul">Soul</ui-combobox-item>
          <ui-combobox-item value="synthwave">Synthwave</ui-combobox-item>
          <ui-combobox-item value="techno">Techno</ui-combobox-item>
        </ui-combobox-list>
      </ui-combobox-content>
    </ui-combobox>
  </clay-combobox>
</div>
```

```ts
export default function setup(root: HTMLElement) {
  const combobox = root.querySelector("clay-combobox")!
  root.querySelector("ui-slider")!.addEventListener("valuechange", (event) => {
    combobox.setAttribute("fuse", String((event as CustomEvent<{ value: number }>).detail.value))
  })
}
```

## API reference

### Attributes

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `color` | `neutral \| teal \| lilac \| sky \| peach \| mint \| butter \| rose \| slate \| ink \| <color>` | `teal` | The rim's glow while focused. The list uses `--clay-popup`. |
| `size` | `sm \| md \| lg` | `md` | The field's height: 40, 48 or 56 px. |
| `attached` | `boolean` | — | Grows the list out of the field and keeps them melted together while it's open, its size following the matches on a spring. |
| `fuse` | `number` | `0` | With `attached`, how far the list melts into the field, from 0 to 1. |

## Accessibility

- A ui-sdk combobox, the WAI-ARIA pattern with list autocomplete: focus stays in the input while the arrow keys move the highlight, Enter chooses, and Escape closes the list and restores the chosen label.
- Name the input with `ui-combobox-label`, and an icon-only trigger or clear button with `aria-label`.
- Long lists scroll inside the clay, and the well never slides past what shows of them.
- Opening is CSS on `data-starting-style`, and the resize follows the reduced-motion setting, so both are still under reduced motion.
