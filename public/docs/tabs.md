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
