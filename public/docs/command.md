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
