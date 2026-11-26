<!-- Generated from src/site/content.ts by scripts/ai-files.ts. Do not edit. -->

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

---

# Command (`<clay-command>`)

The search and list of a command palette: the search is carved like Type's field, a well slides between the commands, and the slab swells and shrinks as typing narrows the list. Wraps `ui-command`; in a dialog, it's a ⌘K palette.

### Preview

```html
<clay-command>
  <ui-command>
    <div>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m21 21-4.34-4.34" /><circle cx="11" cy="11" r="8" /></svg>
      <ui-command-input><input aria-label="Search commands" placeholder="Type a command or search…" /></ui-command-input>
    </div>
    <ui-command-empty>No commands found.</ui-command-empty>
    <ui-command-list>
      <ui-command-group>
        <ui-command-group-label>Playback</ui-command-group-label>
        <ui-command-item value="play"><ui-command-item-icon><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 5a2 2 0 0 1 3.008-1.728l11.997 6.998a2 2 0 0 1 .003 3.458l-12 7A2 2 0 0 1 5 19z" /></svg></ui-command-item-icon>Play or pause</ui-command-item>
        <ui-command-item value="shuffle"><ui-command-item-icon><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m18 14 4 4-4 4" /><path d="m18 2 4 4-4 4" /><path d="M2 18h1.973a4 4 0 0 0 3.3-1.7l5.454-8.6a4 4 0 0 1 3.3-1.7H22" /><path d="M2 6h1.972a4 4 0 0 1 3.6 2.2" /><path d="M22 18h-6.041a4 4 0 0 1-3.3-1.8l-.359-.45" /></svg></ui-command-item-icon>Shuffle the queue</ui-command-item>
        <ui-command-item value="repeat"><ui-command-item-icon><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m17 2 4 4-4 4" /><path d="M3 11v-1a4 4 0 0 1 4-4h14" /><path d="m7 22-4-4 4-4" /><path d="M21 13v1a4 4 0 0 1-4 4H3" /></svg></ui-command-item-icon>Repeat this song</ui-command-item>
      </ui-command-group>
      <ui-command-separator></ui-command-separator>
      <ui-command-group>
        <ui-command-group-label>Go to</ui-command-group-label>
        <ui-command-item value="library"><ui-command-item-icon><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m16 6 4 14" /><path d="M12 6v14" /><path d="M8 8v12" /><path d="M4 4v16" /></svg></ui-command-item-icon>Library</ui-command-item>
        <ui-command-item value="playlists"><ui-command-item-icon><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M16 5H3" /><path d="M11 12H3" /><path d="M11 19H3" /><path d="M21 16V5" /><circle cx="18" cy="16" r="3" /></svg></ui-command-item-icon>Playlists</ui-command-item>
        <ui-command-item value="liked"><ui-command-item-icon><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5" /></svg></ui-command-item-icon>Liked songs</ui-command-item>
        <ui-command-item value="settings"><ui-command-item-icon><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915" /><circle cx="12" cy="12" r="3" /></svg></ui-command-item-icon>Settings</ui-command-item>
      </ui-command-group>
      <ui-command-separator></ui-command-separator>
      <ui-command-group>
        <ui-command-group-label>Appearance</ui-command-group-label>
        <ui-command-item value="theme"><ui-command-item-icon><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401" /></svg></ui-command-item-icon>Switch the theme</ui-command-item>
      </ui-command-group>
    </ui-command-list>
  </ui-command>
</clay-command>
```

**Use it for**

- Running any action or going anywhere from the keyboard, by name: a palette behind ⌘K.

**Not for**

- Choosing a value for a form: use **Sift**.
- A few actions on one thing: use **Spill**.

## Installation

```bash
npm install claymorph-ui @ui-sdk/web @ui-sdk/core
```

Then import `claymorph-ui/clay.css` once and each element you use, like `claymorph-ui/button`.

## Usage

Put the search input and its icon in one box: that box is the field the clay is carved into. On its own, the command is a clay slab; type and it swells and shrinks with the list on a spring.

```html
<clay-command>
  <ui-command>
    <div>
      <svg aria-hidden="true">…</svg>
      <ui-command-input><input aria-label="Search commands" placeholder="Type a command or search…" /></ui-command-input>
    </div>
    <ui-command-empty>No commands found.</ui-command-empty>
    <ui-command-list>
      <ui-command-group>
        <ui-command-group-label>Playback</ui-command-group-label>
        <ui-command-item value="play">Play or pause</ui-command-item>
        <ui-command-item value="shuffle">Shuffle the queue</ui-command-item>
      </ui-command-group>
    </ui-command-list>
  </ui-command>
</clay-command>
```

## Palette

For a palette, put the command in a `<clay-dialog>`, give its trigger a `shortcut`, like `mod+k`, and close the dialog on the command's `action` event. The dialog is the slab: it drops onto the page near the top, so the search stays put, and it swells and shrinks with the list as you type. Press the button or ⌘J / Ctrl+J, then type.

### Palette

```html
<clay-dialog color="teal">
  <ui-dialog>
    <ui-dialog-trigger shortcut="mod+j"><button><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m21 21-4.34-4.34" /><circle cx="11" cy="11" r="8" /></svg>Search<ui-dialog-shortcut></ui-dialog-shortcut></button></ui-dialog-trigger>
    <ui-dialog-backdrop hidden></ui-dialog-backdrop>
    <ui-dialog-content hidden>
      <ui-dialog-title>Command palette</ui-dialog-title>
      <clay-command>
        <ui-command>
          <div>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m21 21-4.34-4.34" /><circle cx="11" cy="11" r="8" /></svg>
            <ui-command-input><input aria-label="Search commands" placeholder="Type a command or search…" /></ui-command-input>
          </div>
          <ui-command-empty>No commands found.</ui-command-empty>
          <ui-command-list>
            <ui-command-group>
              <ui-command-group-label>Playback</ui-command-group-label>
              <ui-command-item value="play" shortcut="alt+p"><ui-command-item-icon><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 5a2 2 0 0 1 3.008-1.728l11.997 6.998a2 2 0 0 1 .003 3.458l-12 7A2 2 0 0 1 5 19z" /></svg></ui-command-item-icon>Play or pause<ui-command-shortcut></ui-command-shortcut></ui-command-item>
              <ui-command-item value="shuffle" shortcut="alt+s"><ui-command-item-icon><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m18 14 4 4-4 4" /><path d="m18 2 4 4-4 4" /><path d="M2 18h1.973a4 4 0 0 0 3.3-1.7l5.454-8.6a4 4 0 0 1 3.3-1.7H22" /><path d="M2 6h1.972a4 4 0 0 1 3.6 2.2" /><path d="M22 18h-6.041a4 4 0 0 1-3.3-1.8l-.359-.45" /></svg></ui-command-item-icon>Shuffle the queue<ui-command-shortcut></ui-command-shortcut></ui-command-item>
              <ui-command-item value="repeat" shortcut="alt+r"><ui-command-item-icon><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m17 2 4 4-4 4" /><path d="M3 11v-1a4 4 0 0 1 4-4h14" /><path d="m7 22-4-4 4-4" /><path d="M21 13v1a4 4 0 0 1-4 4H3" /></svg></ui-command-item-icon>Repeat this song<ui-command-shortcut></ui-command-shortcut></ui-command-item>
            </ui-command-group>
            <ui-command-separator></ui-command-separator>
            <ui-command-group>
              <ui-command-group-label>Go to</ui-command-group-label>
              <ui-command-item value="library"><ui-command-item-icon><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m16 6 4 14" /><path d="M12 6v14" /><path d="M8 8v12" /><path d="M4 4v16" /></svg></ui-command-item-icon>Library</ui-command-item>
              <ui-command-item value="playlists"><ui-command-item-icon><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M16 5H3" /><path d="M11 12H3" /><path d="M11 19H3" /><path d="M21 16V5" /><circle cx="18" cy="16" r="3" /></svg></ui-command-item-icon>Playlists</ui-command-item>
              <ui-command-item value="liked"><ui-command-item-icon><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5" /></svg></ui-command-item-icon>Liked songs</ui-command-item>
              <ui-command-item value="settings"><ui-command-item-icon><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915" /><circle cx="12" cy="12" r="3" /></svg></ui-command-item-icon>Settings</ui-command-item>
            </ui-command-group>
            <ui-command-separator></ui-command-separator>
            <ui-command-group>
              <ui-command-group-label>Appearance</ui-command-group-label>
              <ui-command-item value="theme"><ui-command-item-icon><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401" /></svg></ui-command-item-icon>Switch the theme</ui-command-item>
            </ui-command-group>
          </ui-command-list>
        </ui-command>
      </clay-command>
    </ui-dialog-content>
  </ui-dialog>
</clay-dialog>
```

```ts
export default function setup(root: HTMLElement) {
  const dialog = root.querySelector("ui-dialog") as HTMLElement & { open: boolean }
  // Running a command closes the palette, which hands focus back to its button.
  root.querySelector("ui-command")!.addEventListener("action", () => {
    dialog.open = false
  })
}
```

## Attached

With `attached` on the `<clay-dialog>`, the palette is pulled out of its button's own clay, flies up and swells into place, and flies back into the button when it closes, as Lift does. Opened with the shortcut while its button is out of sight, it swells in place instead. Press the button or ⌘K / Ctrl+K.

### Attached

```html
<clay-dialog attached color="teal">
  <ui-dialog>
    <ui-dialog-trigger shortcut="mod+k"><button><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m21 21-4.34-4.34" /><circle cx="11" cy="11" r="8" /></svg>Search<ui-dialog-shortcut></ui-dialog-shortcut></button></ui-dialog-trigger>
    <ui-dialog-backdrop hidden></ui-dialog-backdrop>
    <ui-dialog-content hidden>
      <ui-dialog-title>Command palette</ui-dialog-title>
      <clay-command>
        <ui-command>
          <div>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m21 21-4.34-4.34" /><circle cx="11" cy="11" r="8" /></svg>
            <ui-command-input><input aria-label="Search commands" placeholder="Type a command or search…" /></ui-command-input>
          </div>
          <ui-command-empty>No commands found.</ui-command-empty>
          <ui-command-list>
            <ui-command-group>
              <ui-command-group-label>Playback</ui-command-group-label>
              <ui-command-item value="play" shortcut="alt+p"><ui-command-item-icon><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 5a2 2 0 0 1 3.008-1.728l11.997 6.998a2 2 0 0 1 .003 3.458l-12 7A2 2 0 0 1 5 19z" /></svg></ui-command-item-icon>Play or pause<ui-command-shortcut></ui-command-shortcut></ui-command-item>
              <ui-command-item value="shuffle" shortcut="alt+s"><ui-command-item-icon><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m18 14 4 4-4 4" /><path d="m18 2 4 4-4 4" /><path d="M2 18h1.973a4 4 0 0 0 3.3-1.7l5.454-8.6a4 4 0 0 1 3.3-1.7H22" /><path d="M2 6h1.972a4 4 0 0 1 3.6 2.2" /><path d="M22 18h-6.041a4 4 0 0 1-3.3-1.8l-.359-.45" /></svg></ui-command-item-icon>Shuffle the queue<ui-command-shortcut></ui-command-shortcut></ui-command-item>
              <ui-command-item value="repeat" shortcut="alt+r"><ui-command-item-icon><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m17 2 4 4-4 4" /><path d="M3 11v-1a4 4 0 0 1 4-4h14" /><path d="m7 22-4-4 4-4" /><path d="M21 13v1a4 4 0 0 1-4 4H3" /></svg></ui-command-item-icon>Repeat this song<ui-command-shortcut></ui-command-shortcut></ui-command-item>
            </ui-command-group>
            <ui-command-separator></ui-command-separator>
            <ui-command-group>
              <ui-command-group-label>Go to</ui-command-group-label>
              <ui-command-item value="library"><ui-command-item-icon><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m16 6 4 14" /><path d="M12 6v14" /><path d="M8 8v12" /><path d="M4 4v16" /></svg></ui-command-item-icon>Library</ui-command-item>
              <ui-command-item value="playlists"><ui-command-item-icon><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M16 5H3" /><path d="M11 12H3" /><path d="M11 19H3" /><path d="M21 16V5" /><circle cx="18" cy="16" r="3" /></svg></ui-command-item-icon>Playlists</ui-command-item>
              <ui-command-item value="liked"><ui-command-item-icon><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5" /></svg></ui-command-item-icon>Liked songs</ui-command-item>
              <ui-command-item value="settings"><ui-command-item-icon><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915" /><circle cx="12" cy="12" r="3" /></svg></ui-command-item-icon>Settings</ui-command-item>
            </ui-command-group>
            <ui-command-separator></ui-command-separator>
            <ui-command-group>
              <ui-command-group-label>Appearance</ui-command-group-label>
              <ui-command-item value="theme"><ui-command-item-icon><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401" /></svg></ui-command-item-icon>Switch the theme</ui-command-item>
            </ui-command-group>
          </ui-command-list>
        </ui-command>
      </clay-command>
    </ui-dialog-content>
  </ui-dialog>
</clay-dialog>
```

```ts
export default function setup(root: HTMLElement) {
  const dialog = root.querySelector("ui-dialog") as HTMLElement & { open: boolean }
  // Running a command closes the palette, which hands focus back to its button.
  root.querySelector("ui-command")!.addEventListener("action", () => {
    dialog.open = false
  })
}
```

## API reference

### Attributes

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `color` | `neutral \| teal \| lilac \| sky \| peach \| mint \| butter \| rose \| slate \| ink \| <color>` | `teal` | The search field's glow while focused. The slab uses `--clay-popup`. |

## Accessibility

- A ui-sdk command: a combobox whose list is always shown. Focus stays in the search while the arrow keys move the highlight, Enter runs the command, and Escape clears the search.
- Name the search input with `aria-label`, and give a palette's dialog a `ui-dialog-title`: it names the dialog, and is hidden from view since the search speaks for itself.
- An item's `shortcut` runs it while the list is mounted, and `ui-command-shortcut` shows its keys for the current platform.
- The slab's swelling follows the reduced-motion setting.

---

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

---

# Action Button (`<clay-action-button>`)

An async action. A clay bead sits beside the body; pressing it melts the bead in, it stays melted while the action runs, then turns into a check (or a cross) and rolls back out.

### Preview

```html
<clay-action-button color="teal" pending-label="Deploying…" success-label="Deployed">
  <ui-button><button>Deploy</button></ui-button>
</clay-action-button>
```

```ts
import type { ClayActionButton } from "claymorph-ui/action-button"

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export default function setup(root: HTMLElement) {
  const deploy = root.querySelector<ClayActionButton>("clay-action-button")!
  deploy.action = () => wait(1600)
}
```

**Use it for**

- Saving, sending or deploying: one action that takes a moment.
- When the result should be seen on the button itself.

**Not for**

- An instant action: use **Press**.
- A destructive action: confirm it first.

## Installation

```bash
npm install claymorph-ui @ui-sdk/web @ui-sdk/core
```

Then import `claymorph-ui/clay.css` once and each element you use, like `claymorph-ui/button`.

## Usage

```html
<clay-action-button color="teal" pending-label="Deploying…" success-label="Deployed">
  <ui-button><button>Deploy</button></ui-button>
</clay-action-button>
```

```ts
const deploy = document.querySelector("clay-action-button")!
deploy.action = () => fetch("/api/deploy", { method: "POST" })
```

`action` runs on press. While its promise is pending the button is busy and announces the pending label; when it resolves the bead turns into a check, when it rejects into a cross.

## The flow

- **Idle**: the bead sits apart, with an arrow.
- **Pending**: the bead melts into the body; the label and a spinner change.
- **Success**: the bead swells, turns mint and shows a check.
- **Error**: the body shakes, the bead turns rose and shows a cross.
- After `reset-after` ms it rolls back to idle.

## Examples

### When it fails

```html
<clay-action-button color="lilac" pending-label="Sending…" success-label="Sent" error-label="Couldn't send">
  <ui-button><button>Send invite</button></ui-button>
</clay-action-button>
```

```ts
import type { ClayActionButton } from "claymorph-ui/action-button"

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export default function setup(root: HTMLElement) {
  const send = root.querySelector<ClayActionButton>("clay-action-button")!
  send.action = async () => {
    await wait(1200)
    throw new Error("The server is unreachable")
  }
}
```

## API reference

### Attributes

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `color` | `neutral \| teal \| lilac \| sky \| peach \| mint \| butter \| rose \| slate \| ink \| <color>` | — | The clay's colour: a preset, or any CSS colour. It sets `--clay-color` on the element. |
| `size` | `sm \| md \| lg` | `md` | Height: 40, 48 or 56 px. |
| `pending-label` | `string` | `Working…` | Shown and announced while the action runs. |
| `success-label` | `string` | `Done` | Shown and announced when it resolves. |
| `error-label` | `string` | `Try again` | Shown and announced when it rejects. |
| `reset-after` | `number (ms)` | `2400` | When to roll back to idle. `0` stays. |

### Properties

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `action` | `() => unknown` | — | Runs on press. Return a promise to show pending. |
| `actionState` | `"idle" \| "pending" \| "success" \| "error"` | — | Read only. |

### Events

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `statechange` | `CustomEvent<{ state }>` | — | Fires on every state change. |

## Accessibility

- The button keeps its idle label as its name in every state; visible labels are `aria-hidden`.
- ui-button marks it busy and announces the pending label; a `role=status` region announces success or error.
- It ignores presses while pending, so an action never runs twice.

---

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

---

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

---

# Slide to confirm (`<clay-slide-confirm>`)

A deliberate action: drag a clay ball along its groove to the end. Let go early and it rolls back; at the end it runs `.action`, then shows pending, success or error. Wraps `ui-slider`.

### Preview

```html
<clay-slide-confirm color="rose" pending-label="Deleting…" success-label="History deleted" reset-after="2400">
  <ui-slider aria-label="Slide to delete history">
    <ui-slider-control>
      <ui-slider-track>
        <ui-slider-indicator></ui-slider-indicator>
        <ui-slider-thumb></ui-slider-thumb>
      </ui-slider-track>
    </ui-slider-control>
  </ui-slider>
</clay-slide-confirm>
```

```ts
import type { ClaySlideConfirm } from "claymorph-ui/slide-confirm"

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export default function setup(root: HTMLElement) {
  root.querySelector<ClaySlideConfirm>("clay-slide-confirm")!.action = () => wait(1400)
}
```

**Use it for**

- An action that should be deliberate: delete, send money, publish to everyone.

**Not for**

- Everyday actions: use a button.
- Choosing a value: use a slider.

## Installation

```bash
npm install claymorph-ui @ui-sdk/web @ui-sdk/core
```

Then import `claymorph-ui/clay.css` once and each element you use, like `claymorph-ui/button`.

## Usage

```html
<clay-slide-confirm color="rose" pending-label="Deleting…" success-label="History deleted">
  <ui-slider aria-label="Slide to delete history">
    <ui-slider-control>
      <ui-slider-track>
        <ui-slider-indicator></ui-slider-indicator>
        <ui-slider-thumb></ui-slider-thumb>
      </ui-slider-track>
    </ui-slider-control>
  </ui-slider>
</clay-slide-confirm>
```

```ts
document.querySelector("clay-slide-confirm")!.action = () =>
  fetch("/api/history", { method: "DELETE" })
```

## API reference

### Attributes

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `color` | `neutral \| teal \| lilac \| sky \| peach \| mint \| butter \| rose \| slate \| ink \| <color>` | `teal` | The fill the ball pulls behind it. |
| `threshold` | `number` | `0.9` | Share of the groove the ball must pass for letting go to confirm. |
| `pending-label` | `string` | `Working…` | Written in the groove while `action` runs. |
| `success-label` | `string` | `Done` | Written once it succeeds, and announced. |
| `error-label` | `string` | `Try again` | Written after a failure, and announced. |
| `reset-after` | `number` | `0` | Milliseconds after a success before the ball rolls home. `0` stays confirmed. An error always resets after 2400 ms. |

### Properties and events

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `action` | `() => unknown` | — | Runs once the ball reaches the end. A rejected promise shows the error state. |
| `actionState` | `"idle" \| "pending" \| "success" \| "error"` | — | The current state, also on `data-state`. |
| `statechange` | `CustomEvent<{ state }>` | — | Fires on the element whenever the state changes. |

## Accessibility

- It's a real `ui-slider`: arrows, Page Up/Down, Home and End move the ball, and End confirms.
- The slider's `aria-label` is both its name and the text written in the groove, so write it as an instruction.
- While pending the slider has `aria-busy`; success and error are announced by a status region.

---

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

---

# Segmented Control (`<clay-segmented>`)

Pick one of a few options. The selection is a clay bead that rolls along a groove, stretching with its speed. Wraps `ui-segmented-control`.

### Preview

```html
<clay-segmented>
  <ui-segmented-control aria-label="Range" default-value="week">
    <ui-segmented-control-indicator></ui-segmented-control-indicator>
    <ui-segmented-control-item value="day">Day</ui-segmented-control-item>
    <ui-segmented-control-item value="week">Week</ui-segmented-control-item>
    <ui-segmented-control-item value="month">Month</ui-segmented-control-item>
    <ui-segmented-control-item value="year">Year</ui-segmented-control-item>
  </ui-segmented-control>
</clay-segmented>
```

**Use it for**

- Two to five short options, all visible: Day, Week, Month.
- Switching a view.

**Not for**

- More options than fit: use **Pour**.
- On or off: use **Flip**.

## Installation

```bash
npm install claymorph-ui @ui-sdk/web @ui-sdk/core
```

Then import `claymorph-ui/clay.css` once and each element you use, like `claymorph-ui/button`.

## Usage

```html
<clay-segmented>
  <ui-segmented-control aria-label="Range" default-value="week">
    <ui-segmented-control-indicator></ui-segmented-control-indicator>
    <ui-segmented-control-item value="day">Day</ui-segmented-control-item>
    <ui-segmented-control-item value="week">Week</ui-segmented-control-item>
    <ui-segmented-control-item value="month">Month</ui-segmented-control-item>
  </ui-segmented-control>
</clay-segmented>
```

Read and set `value` on `<ui-segmented-control>` and listen for `valuechange`. The bead follows every change, including ones made from code or by an agent.

## API reference

### Attributes

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `color` | `neutral \| teal \| lilac \| sky \| peach \| mint \| butter \| rose \| slate \| ink \| <color>` | `knob` | The bead's colour. |

### State

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `data-clay-ready` | `attribute` | — | Set once the first WebGL2 frame is drawn. Until then the CSS clay shows. |

## Accessibility

- A radio group from ui-sdk: arrow keys move and select, and it needs `aria-label`.
- The CSS indicator stays in the markup and shows without WebGL2.

---

# Switch (`<clay-switch>`)

On or off. The knob rolls across a groove that fills with colour, and squashes as it travels. Wraps `ui-switch`.

### Preview

```html
<div class="demo-stack">
  <label class="demo-label">
    Wi-Fi
    <clay-switch>
      <ui-switch default-checked><ui-switch-thumb></ui-switch-thumb></ui-switch>
    </clay-switch>
  </label>
  <label class="demo-label">
    Do not disturb
    <clay-switch color="lilac">
      <ui-switch><ui-switch-thumb></ui-switch-thumb></ui-switch>
    </clay-switch>
  </label>
</div>
```

**Use it for**

- A setting that applies at once: Wi-Fi, notifications.

**Not for**

- A choice that's submitted later with a form: use **Tick**.

## Installation

```bash
npm install claymorph-ui @ui-sdk/web @ui-sdk/core
```

Then import `claymorph-ui/clay.css` once and each element you use, like `claymorph-ui/button`.

## Usage

```html
<label>
  Notifications
  <clay-switch>
    <ui-switch default-checked><ui-switch-thumb></ui-switch-thumb></ui-switch>
  </clay-switch>
</label>
```

## API reference

### Attributes

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `color` | `neutral \| teal \| lilac \| sky \| peach \| mint \| butter \| rose \| slate \| ink \| <color>` | `teal` | The colour the groove fills with. |
| `size` | `sm \| md \| lg` | `md` | 46×26, 56×32 or 68×38 px. |

## Accessibility

- `<ui-switch>` has the switch role and takes its name from the label around it.
- Space toggles it; the knob follows `checked` however it changes.

---

# Checkbox (`<clay-checkbox>`)

A checkbox whose dent pushes up into a filled clay bump when checked, while the check draws in. Wraps `ui-checkbox`.

### Preview

```html
<div class="demo-stack">
  <label class="demo-label demo-check">
    <clay-checkbox>
      <ui-checkbox name="updates" default-checked>
        <ui-checkbox-indicator aria-hidden="true">
          <svg viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7" /></svg>
        </ui-checkbox-indicator>
      </ui-checkbox>
    </clay-checkbox>
    Product updates
  </label>
  <label class="demo-label demo-check">
    <clay-checkbox color="peach">
      <ui-checkbox name="digest">
        <ui-checkbox-indicator aria-hidden="true">
          <svg viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7" /></svg>
        </ui-checkbox-indicator>
      </ui-checkbox>
    </clay-checkbox>
    Weekly digest
  </label>
</div>
```

**Use it for**

- Independent options in a form.
- Agreeing to something.

**Not for**

- A setting that applies at once: use **Flip**.

## Installation

```bash
npm install claymorph-ui @ui-sdk/web @ui-sdk/core
```

Then import `claymorph-ui/clay.css` once and each element you use, like `claymorph-ui/button`.

## Usage

```html
<label>
  <clay-checkbox>
    <ui-checkbox name="updates">
      <ui-checkbox-indicator aria-hidden="true">
        <svg viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7" /></svg>
      </ui-checkbox-indicator>
    </ui-checkbox>
  </clay-checkbox>
  Product updates
</label>
```

## API reference

### Attributes

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `color` | `neutral \| teal \| lilac \| sky \| peach \| mint \| butter \| rose \| slate \| ink \| <color>` | `teal` | The colour of the checked bump. |

## Accessibility

- `<ui-checkbox>` has the checkbox role, takes its name from the label and submits with its form.
- Indeterminate shows the bump half raised.

---

# Radio group (`<clay-radio>`)

Radios carved as dents in the clay. A bead hops into the one you pick. Wraps `ui-radio-group`.

### Preview

```html
<ui-field>
  <ui-field-label>Audio quality</ui-field-label>
  <clay-radio>
    <ui-radio-group default-value="high">
      <label><ui-radio value="normal"><ui-radio-indicator></ui-radio-indicator></ui-radio>Normal</label>
      <label><ui-radio value="high"><ui-radio-indicator></ui-radio-indicator></ui-radio>High</label>
      <label><ui-radio value="lossless"><ui-radio-indicator></ui-radio-indicator></ui-radio>Lossless</label>
    </ui-radio-group>
  </clay-radio>
</ui-field>
```

**Use it for**

- One of two to seven options in a form, all visible at once.

**Not for**

- Many options: use a select.
- Switching views: use tabs.

## Installation

```bash
npm install claymorph-ui @ui-sdk/web @ui-sdk/core
```

Then import `claymorph-ui/clay.css` once and each element you use, like `claymorph-ui/button`.

## Usage

```html
<ui-field>
  <ui-field-label>Audio quality</ui-field-label>
  <clay-radio>
    <ui-radio-group default-value="high">
      <label><ui-radio value="normal"><ui-radio-indicator></ui-radio-indicator></ui-radio>Normal</label>
      <label><ui-radio value="high"><ui-radio-indicator></ui-radio-indicator></ui-radio>High</label>
    </ui-radio-group>
  </clay-radio>
</ui-field>
```

## API reference

### Attributes

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `color` | `neutral \| teal \| lilac \| sky \| peach \| mint \| butter \| rose \| slate \| ink \| <color>` | `teal` | The bead's colour. |
| `orientation` | `vertical \| horizontal` | `vertical` | Lays the options out in a column or a row. |

## Accessibility

- The group is one tab stop; arrow keys move and check. Wrap each radio with its text in a `<label>`.
- A `ui-field-label` names the group; without one, give `<ui-radio-group>` an `aria-label`.
- Up to seven radios get dents; more stay plain.

---

# Slider (`<clay-slider>`)

A slider with a clay ball that stretches with its speed, swells while held and drags a filled groove behind it. Wraps `ui-slider`.

### Preview

```html
<clay-slider>
  <ui-field>
    <ui-slider default-value="60" aria-label="Volume">
      <div class="clay-slider-head">
        <ui-field-label>Volume</ui-field-label>
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
```

**Use it for**

- A value where the exact number matters less than the feel: volume, size.

**Not for**

- An exact number: use a number input.

## Installation

```bash
npm install claymorph-ui @ui-sdk/web @ui-sdk/core
```

Then import `claymorph-ui/clay.css` once and each element you use, like `claymorph-ui/button`.

## Usage

```html
<clay-slider>
  <ui-field>
    <ui-slider default-value="60" aria-label="Volume">
      <div class="clay-slider-head">
        <ui-field-label>Volume</ui-field-label>
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
```

## API reference

### Attributes

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `color` | `neutral \| teal \| lilac \| sky \| peach \| mint \| butter \| rose \| slate \| ink \| <color>` | `teal` | The fill's colour. |

## Accessibility

- Each thumb renders a hidden `<input type=range>`: arrows, Page Up/Down, Home and End work, and phones adjust it with their own gestures.
- Show the name with a `ui-field-label` inside a `ui-field`, and repeat it as `aria-label` on `<ui-slider>`: the agent bridge reads the slider's name from there. `ui-slider-value` shows the formatted value.

---

# Select (`<clay-select>`)

A select whose list pours out of its clay button: it grows from the trigger on a spring while the options drop in one by one, and the chosen value is wiped in out of a blur. Wraps `ui-select`.

### Preview

```html
<clay-select>
  <ui-select default-value="week">
    <ui-select-label>Period</ui-select-label>
    <ui-select-trigger><button><ui-select-value></ui-select-value></button></ui-select-trigger>
    <ui-select-content>
      <ui-select-item value="day">Today</ui-select-item>
      <ui-select-item value="week">This week</ui-select-item>
      <ui-select-item value="month">This month</ui-select-item>
      <ui-select-item value="year">This year</ui-select-item>
    </ui-select-content>
  </ui-select>
</clay-select>
```

**Use it for**

- One choice from a list longer than a few options.

**Not for**

- Two to five short options: use **Slide**.
- Searching a long list: use **Sift**.

## Installation

```bash
npm install claymorph-ui @ui-sdk/web @ui-sdk/core
```

Then import `claymorph-ui/clay.css` once and each element you use, like `claymorph-ui/button`.

## Usage

```html
<clay-select>
  <ui-select default-value="week">
    <ui-select-label>Period</ui-select-label>
    <ui-select-trigger><button><ui-select-value></ui-select-value></button></ui-select-trigger>
    <ui-select-content>
      <ui-select-item value="day">Today</ui-select-item>
      <ui-select-item value="week">This week</ui-select-item>
      <ui-select-item value="month">This month</ui-select-item>
    </ui-select-content>
  </ui-select>
</clay-select>
```

## Attached

With `attached`, the list squeezes out of the trigger like Roll's bead and stays melted onto it, their colours blending across the joint. Closing eases it back in, the trigger gives a little bounce, and only then does the new value show.

### Attached

```html
<clay-select attached color="teal">
  <ui-select default-value="week">
    <ui-select-label>Period</ui-select-label>
    <ui-select-trigger><button><ui-select-value></ui-select-value></button></ui-select-trigger>
    <ui-select-content>
      <ui-select-item value="day">Today</ui-select-item>
      <ui-select-item value="week">This week</ui-select-item>
      <ui-select-item value="month">This month</ui-select-item>
      <ui-select-item value="year">This year</ui-select-item>
    </ui-select-content>
  </ui-select>
</clay-select>
```

## Fuse

The joint is always smooth: the trigger's edge never shades a line across it, only their colours blend. `fuse` sets how far the list melts in, from `0`, a slight waist with a small gap, to `1`, where it sits right on the trigger and the two read as one body. Menus, popovers and tooltips take it too. Set it with the slider, then open the list.

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
  <clay-select attached color="teal">
    <ui-select default-value="month">
      <ui-select-label>Period</ui-select-label>
      <ui-select-trigger><button><ui-select-value></ui-select-value></button></ui-select-trigger>
      <ui-select-content>
        <ui-select-item value="day">Today</ui-select-item>
        <ui-select-item value="week">This week</ui-select-item>
        <ui-select-item value="month">This month</ui-select-item>
        <ui-select-item value="year">This year</ui-select-item>
      </ui-select-content>
    </ui-select>
  </clay-select>
</div>
```

```ts
export default function setup(root: HTMLElement) {
  const select = root.querySelector("clay-select")!
  root.querySelector("ui-slider")!.addEventListener("valuechange", (event) => {
    select.setAttribute("fuse", String((event as CustomEvent<{ value: number }>).detail.value))
  })
}
```

## API reference

### Attributes

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `color` | `neutral \| teal \| lilac \| sky \| peach \| mint \| butter \| rose \| slate \| ink \| <color>` | `neutral` | The trigger's colour. The list uses `--clay-popup`. |
| `attached` | `boolean` | — | Grows the list out of the trigger and keeps them melted together while it's open. |
| `fuse` | `number` | `0` | With `attached`, how far the list melts into the trigger, from 0 to 1. The gap between them closes as it rises; the joint itself is always smooth. |

## Accessibility

- A ui-sdk select: a combobox trigger, a listbox, typeahead, and the value submitted with its form.
- The list's opening is CSS on `data-starting-style`, so it's off under reduced motion.

---

# Tabs (`<clay-tabs>`)

Tabs whose selection is a clay bead rolling along a groove, stretching as it travels. The panel slides in from the side the bead moved. Wraps `ui-tabs`.

### Preview

```html
<clay-tabs>
  <ui-tabs default-value="songs">
    <ui-tabs-list aria-label="Library">
      <ui-tabs-tab value="songs"><button type="button">Songs</button></ui-tabs-tab>
      <ui-tabs-tab value="albums"><button type="button">Albums</button></ui-tabs-tab>
      <ui-tabs-tab value="podcasts"><button type="button">Podcasts</button></ui-tabs-tab>
    </ui-tabs-list>
    <ui-tabs-panel value="songs">312 songs, synced to this device.</ui-tabs-panel>
    <ui-tabs-panel value="albums">24 albums from 18 artists.</ui-tabs-panel>
    <ui-tabs-panel value="podcasts">8 shows you follow, 3 new episodes.</ui-tabs-panel>
  </ui-tabs>
</clay-tabs>
```

**Use it for**

- Switching between views of the same thing, in place.

**Not for**

- Choosing a value for a form or a filter: use a segmented control.
- Going to another page: use links.

## Installation

```bash
npm install claymorph-ui @ui-sdk/web @ui-sdk/core
```

Then import `claymorph-ui/clay.css` once and each element you use, like `claymorph-ui/button`.

## Usage

```html
<clay-tabs>
  <ui-tabs default-value="songs">
    <ui-tabs-list aria-label="Library">
      <ui-tabs-tab value="songs"><button type="button">Songs</button></ui-tabs-tab>
      <ui-tabs-tab value="albums"><button type="button">Albums</button></ui-tabs-tab>
    </ui-tabs-list>
    <ui-tabs-panel value="songs">…</ui-tabs-panel>
    <ui-tabs-panel value="albums">…</ui-tabs-panel>
  </ui-tabs>
</clay-tabs>
```

## Vertical

Set `orientation="vertical"` on `<ui-tabs>`. The list becomes a column and Up and Down move between tabs.

### Vertical

```html
<clay-tabs color="teal">
  <ui-tabs default-value="general" orientation="vertical">
    <ui-tabs-list aria-label="Preferences">
      <ui-tabs-tab value="general"><button type="button">General</button></ui-tabs-tab>
      <ui-tabs-tab value="playback"><button type="button">Playback</button></ui-tabs-tab>
      <ui-tabs-tab value="privacy"><button type="button">Privacy</button></ui-tabs-tab>
    </ui-tabs-list>
    <ui-tabs-panel value="general">Language, region and the page you start on.</ui-tabs-panel>
    <ui-tabs-panel value="playback">Crossfade, gapless playback and audio quality.</ui-tabs-panel>
    <ui-tabs-panel value="privacy">Who can see what you listen to.</ui-tabs-panel>
  </ui-tabs>
</clay-tabs>
```

## API reference

### Attributes

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `color` | `neutral \| teal \| lilac \| sky \| peach \| mint \| butter \| rose \| slate \| ink \| <color>` | `knob` | The bead's colour. Text on it takes its tone. |

## Accessibility

- Arrow keys move between tabs, Home and End jump to the ends, and Tab moves into the panel.
- Name the list with `aria-label`. A tab can be a link with `<a href>` when choosing it should navigate.

---

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

---

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

---

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

---

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

---

# Toast (`<clay-toast-region>`)

Toasts that drop in as clay slabs and squash as they land, tinted by their type. Wraps `ui-toast-region`; call `toast()` from anywhere.

### Preview

```html
<div class="demo-row">
  <clay-button color="teal">
    <ui-button><button data-toast="saved">Save playlist</button></ui-button>
  </clay-button>
  <clay-button>
    <ui-button><button data-toast="info">Add to queue</button></ui-button>
  </clay-button>
  <clay-button color="rose">
    <ui-button><button data-toast="error">Fail to sync</button></ui-button>
  </clay-button>
</div>

<clay-toast-region>
  <ui-toast-region>
    <template>
      <ui-toast>
        <ui-toast-title></ui-toast-title>
        <ui-toast-description></ui-toast-description>
        <ui-toast-action><button></button></ui-toast-action>
      </ui-toast>
    </template>
  </ui-toast-region>
</clay-toast-region>
```

```ts
import { toast } from "claymorph-ui/toast"

export default function setup(root: HTMLElement) {
  const messages: Record<string, () => void> = {
    saved: () => toast.success("Playlist saved", { description: "Chill Vibes · 80 songs" }),
    info: () =>
      toast("Added to queue", {
        description: "Golden Hour plays next",
        action: { label: "Undo", onAction: () => toast("Removed from queue") },
      }),
    error: () => toast.error("Couldn't sync", { description: "Check your connection and try again." }),
  }
  root.querySelectorAll<HTMLButtonElement>("[data-toast]").forEach((button) =>
    button.addEventListener("click", () => messages[button.dataset.toast!]!())
  )
}
```

**Use it for**

- Saying that something finished, with an undo if it helps.

**Not for**

- A question that needs an answer: use a dialog.
- Errors in a form: show them by the field.

## Installation

```bash
npm install claymorph-ui @ui-sdk/web @ui-sdk/core
```

Then import `claymorph-ui/clay.css` once and each element you use, like `claymorph-ui/button`.

## Usage

Place one region near the root of the page:

```html
<clay-toast-region>
  <ui-toast-region>
    <template>
      <ui-toast>
        <ui-toast-title></ui-toast-title>
        <ui-toast-description></ui-toast-description>
        <ui-toast-action><button></button></ui-toast-action>
      </ui-toast>
    </template>
  </ui-toast-region>
</clay-toast-region>
```

```ts
import { toast } from "claymorph-ui/toast"

toast.success("Playlist saved", { description: "Chill Vibes · 80 songs" })
toast("Added to queue", { action: { label: "Undo", onAction: undo } })
```

A toast leaves the way it came: it lifts back off and drops toward the edge it came from.

## Attached stack

With `attached`, the stack is one body of clay. Each new toast pulls out of the one before it and stays joined by a neck, like Roll's bead; a toast that leaves tucks back into its neighbour along the same path.

### Attached stack

```html
<div class="demo-row">
  <clay-button color="teal">
    <ui-button><button data-toast="saved">Save playlist</button></ui-button>
  </clay-button>
  <clay-button>
    <ui-button><button data-toast="queue">Add to queue</button></ui-button>
  </clay-button>
  <clay-button color="rose">
    <ui-button><button data-toast="error">Fail to sync</button></ui-button>
  </clay-button>
</div>

<clay-toast-region attached>
  <ui-toast-region>
    <template>
      <ui-toast>
        <ui-toast-title></ui-toast-title>
        <ui-toast-description></ui-toast-description>
        <ui-toast-action><button></button></ui-toast-action>
      </ui-toast>
    </template>
  </ui-toast-region>
</clay-toast-region>
```

```ts
import { createToaster } from "claymorph-ui/toast"

export default function setup(root: HTMLElement) {
  const toast = createToaster()
  root.querySelector<HTMLElement & { toaster: unknown }>("ui-toast-region")!.toaster = toast
  const messages: Record<string, () => void> = {
    saved: () => toast.success("Playlist saved", { description: "Chill Vibes · 80 songs" }),
    queue: () => toast("Added to queue", { description: "Golden Hour plays next" }),
    error: () => toast.error("Couldn't sync", { description: "Check your connection and try again." }),
  }
  root.querySelectorAll<HTMLButtonElement>("[data-toast]").forEach((button) =>
    button.addEventListener("click", () => messages[button.dataset.toast!]!())
  )
}
```

> One region per page shows `toast()`. This demo gives its region a queue of its own with `createToaster()`, so it doesn't share toasts with the one above.

## API reference

### Element attributes

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `attached` | `boolean` | — | On `<clay-toast-region>`: draws the stack as one body, each toast pulled out of the one before it. |

### Functions

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `toast(title, options?)` | `string` | — | Shows a toast and returns its id. `options` takes `description`, `action`, `cancel`, `duration` and `type`. |
| `toast.success / error / warning / info` | `string` | — | The same, with a type. Success, error and warning tint the clay. |
| `toast.dismiss(id?)` | `void` | — | Closes one toast, or all of them. |
| `createToaster()` | `Toaster` | — | A queue of its own, for a second region: set it as the region's `toaster`. |

### Region attributes

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `side` | `top \| bottom` | `bottom` | On `<ui-toast-region>`: the edge the toasts drop from. |
| `align` | `start \| center \| end` | `end` | On `<ui-toast-region>`: where along that edge. |

## Accessibility

- Toasts are announced politely; errors interrupt.
- F6 moves focus into the region and back. Timers pause while it's hovered or focused.

---

# Card (`<clay-card>`)

A clay slab that holds content. Flatter than a button, with a deeper shadow. `interactive` makes it swell.

### Preview

```html
<div class="demo-row">
  <clay-card color="mint" class="demo-card">
    <clay-badge color="neutral">+16%</clay-badge>
    <h3>Songs played</h3>
    <p class="demo-stat">1,248</p>
  </clay-card>
  <clay-card color="lilac" elevation="3" class="demo-card">
    <clay-badge color="neutral">7 days</clay-badge>
    <h3>Current streak</h3>
    <p class="demo-stat">7</p>
  </clay-card>
</div>
```

**Use it for**

- Grouping related content: a stat, a summary, a settings group.

**Not for**

- The whole card as one action: put a **Press** inside, or use `interactive` with a link inside.

## Installation

```bash
npm install claymorph-ui @ui-sdk/web @ui-sdk/core
```

Then import `claymorph-ui/clay.css` once and each element you use, like `claymorph-ui/button`.

## Usage

```html
<clay-card color="mint" elevation="2">
  <h3>Songs played</h3>
  <p>1,248</p>
</clay-card>
```

## API reference

### Attributes

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `color` | `neutral \| teal \| lilac \| sky \| peach \| mint \| butter \| rose \| slate \| ink \| <color>` | — | The clay's colour: a preset, or any CSS colour. It sets `--clay-color` on the element. |
| `elevation` | `1 \| 2 \| 3` | `2` | How far it floats: the shadow's size and offset. |
| `radius` | `number (px)` | `28` | Corner radius of the clay. |
| `interactive` | `boolean` | — | Swells and squashes like a button. Read once, when it connects. |

## Accessibility

- A plain container: give it a heading, and put real controls inside for actions.

---

# Badge (`<clay-badge>`)

A small clay label that stamps in when it appears.

### Preview

```html
<div class="demo-row">
  <clay-badge color="mint">New</clay-badge>
  <clay-badge color="butter">Beta</clay-badge>
  <clay-badge color="rose">3 alerts</clay-badge>
  <clay-badge color="sky">v0.1</clay-badge>
  <clay-badge color="ink">Pro</clay-badge>
</div>
```

**Use it for**

- A status or a count next to something: New, Beta, 3.

**Not for**

- Anything clickable: use **Press** with `size="sm"`.

## Installation

```bash
npm install claymorph-ui @ui-sdk/web @ui-sdk/core
```

Then import `claymorph-ui/clay.css` once and each element you use, like `claymorph-ui/button`.

## Usage

```html
<clay-badge color="mint">New</clay-badge>
```

## API reference

### Attributes

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `color` | `neutral \| teal \| lilac \| sky \| peach \| mint \| butter \| rose \| slate \| ink \| <color>` | — | The clay's colour: a preset, or any CSS colour. It sets `--clay-color` on the element. |

## Accessibility

- Plain text, read where it sits. Don't rely on its colour alone to carry meaning.

---

# Avatar (`<clay-avatar>`)

An avatar set in a clay ring, with an optional status bead melted onto it. Wraps `ui-avatar`.

### Preview

```html
<div class="demo-row">
  <clay-avatar size="sm"><ui-avatar><ui-avatar-fallback>AL</ui-avatar-fallback></ui-avatar></clay-avatar>
  <clay-avatar color="peach" status="online"><ui-avatar role="img" aria-label="Mia, online"><ui-avatar-fallback aria-hidden="true">MI</ui-avatar-fallback></ui-avatar></clay-avatar>
  <clay-avatar size="lg" color="lilac" status="away"><ui-avatar role="img" aria-label="Noah, away"><ui-avatar-fallback aria-hidden="true">NO</ui-avatar-fallback></ui-avatar></clay-avatar>
  <clay-avatar size="xl" color="mint"><ui-avatar><ui-avatar-fallback>JV</ui-avatar-fallback></ui-avatar></clay-avatar>
</div>
```

**Use it for**

- Showing who someone is, next to their name or what they made.

**Not for**

- Decorative pictures: use a plain `<img>`.

## Installation

```bash
npm install claymorph-ui @ui-sdk/web @ui-sdk/core
```

Then import `claymorph-ui/clay.css` once and each element you use, like `claymorph-ui/button`.

## Usage

```html
<clay-avatar size="lg" status="online">
  <ui-avatar>
    <img src="/mia.png" alt="Mia, online" />
    <ui-avatar-fallback>MI</ui-avatar-fallback>
  </ui-avatar>
</clay-avatar>
```

## API reference

### Attributes

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `color` | `neutral \| teal \| lilac \| sky \| peach \| mint \| butter \| rose \| slate \| ink \| <color>` | `neutral` | The ring's colour. |
| `size` | `sm \| md \| lg \| xl` | `md` | 36, 48, 64 or 96 px across. |
| `status` | `online \| away \| busy \| offline` | — | Melts a coloured bead onto the ring. |

## Accessibility

- The image's `alt` names the person. With only a fallback, give `<ui-avatar>` `role="img"` and an `aria-label`.
- The status bead is drawn, not read: say the status in the name too.

---

# Progress (`<clay-progress>`)

A progress bar whose groove fills with a worm of clay. Without a value, a lump rolls back and forth. Wraps `ui-progress`.

### Preview

```html
<clay-progress>
  <ui-progress value="35">
    <ui-progress-label>Downloading Chill Vibes</ui-progress-label>
    <ui-progress-value></ui-progress-value>
    <ui-progress-track><ui-progress-indicator></ui-progress-indicator></ui-progress-track>
  </ui-progress>
</clay-progress>
<clay-progress color="lilac">
  <ui-progress>
    <ui-progress-label>Connecting to speaker</ui-progress-label>
    <ui-progress-track><ui-progress-indicator></ui-progress-indicator></ui-progress-track>
  </ui-progress>
</clay-progress>
```

```ts
type Progress = HTMLElement & { value: number | null }

export default function setup(root: HTMLElement) {
  const download = root.querySelector<Progress>("ui-progress[value]")!
  const timer = setInterval(() => {
    if (!download.isConnected) return clearInterval(timer)
    download.value = download.value !== null && download.value < 100 ? Math.min(100, download.value + 7) : 0
  }, 700)
}
```

**Use it for**

- A task under way: a download, an upload, an install.

**Not for**

- An amount that isn't a task, like storage used: use a meter.

## Installation

```bash
npm install claymorph-ui @ui-sdk/web @ui-sdk/core
```

Then import `claymorph-ui/clay.css` once and each element you use, like `claymorph-ui/button`.

## Usage

```html
<clay-progress>
  <ui-progress value="35">
    <ui-progress-label>Downloading</ui-progress-label>
    <ui-progress-value></ui-progress-value>
    <ui-progress-track><ui-progress-indicator></ui-progress-indicator></ui-progress-track>
  </ui-progress>
</clay-progress>
```

Set `value` on `<ui-progress>` as the task moves. Leave it out, or set it to `null`, while how far is unknown.

## API reference

### Attributes

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `color` | `neutral \| teal \| lilac \| sky \| peach \| mint \| butter \| rose \| slate \| ink \| <color>` | `teal` | The fill's colour. |

## Accessibility

- It's a `progressbar` named by its label, and its value is read from the bar itself.
- With reduced motion, an unknown amount shows a still, full groove instead of a rolling lump.

---

# Meter (`<clay-meter>`)

A meter for a value in a known range, across or upright. Upright meters in a row make a clay bar chart. Wraps `ui-meter`.

### Preview

```html
<clay-meter color="sky">
  <ui-meter value="72">
    <ui-meter-label>Storage used</ui-meter-label>
    <ui-meter-value></ui-meter-value>
    <ui-meter-track><ui-meter-indicator></ui-meter-indicator></ui-meter-track>
  </ui-meter>
</clay-meter>
<div class="demo-bars" role="group" aria-label="Hours listened this week">
  <clay-meter orientation="vertical"><ui-meter value="2.6" max="6"><ui-meter-label>Mon</ui-meter-label><ui-meter-track><ui-meter-indicator></ui-meter-indicator></ui-meter-track></ui-meter></clay-meter>
  <clay-meter orientation="vertical"><ui-meter value="4.2" max="6"><ui-meter-label>Tue</ui-meter-label><ui-meter-track><ui-meter-indicator></ui-meter-indicator></ui-meter-track></ui-meter></clay-meter>
  <clay-meter orientation="vertical"><ui-meter value="3.4" max="6"><ui-meter-label>Wed</ui-meter-label><ui-meter-track><ui-meter-indicator></ui-meter-indicator></ui-meter-track></ui-meter></clay-meter>
  <clay-meter orientation="vertical"><ui-meter value="4.9" max="6"><ui-meter-label>Thu</ui-meter-label><ui-meter-track><ui-meter-indicator></ui-meter-indicator></ui-meter-track></ui-meter></clay-meter>
  <clay-meter orientation="vertical"><ui-meter value="3.1" max="6"><ui-meter-label>Fri</ui-meter-label><ui-meter-track><ui-meter-indicator></ui-meter-indicator></ui-meter-track></ui-meter></clay-meter>
</div>
```

**Use it for**

- A measured amount: storage used, battery, hours listened.

**Not for**

- How far a task has got: use a progress bar.

## Installation

```bash
npm install claymorph-ui @ui-sdk/web @ui-sdk/core
```

Then import `claymorph-ui/clay.css` once and each element you use, like `claymorph-ui/button`.

## Usage

```html
<clay-meter color="sky">
  <ui-meter value="72">
    <ui-meter-label>Storage used</ui-meter-label>
    <ui-meter-value></ui-meter-value>
    <ui-meter-track><ui-meter-indicator></ui-meter-indicator></ui-meter-track>
  </ui-meter>
</clay-meter>
```

`orientation="vertical"` stands it upright: give the element a height, and the label goes under the groove. Group a row of them with `role="group"` and a name.

## API reference

### Attributes

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `color` | `neutral \| teal \| lilac \| sky \| peach \| mint \| butter \| rose \| slate \| ink \| <color>` | `teal` | The fill's colour. |
| `orientation` | `horizontal \| vertical` | `horizontal` | Lies across, or stands upright and fills from the bottom. |

## Accessibility

- Each is a `meter` named by its label, with its value and range.
- Charts of meters need a name on the group that says what's measured.
