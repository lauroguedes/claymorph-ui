# Theming

Colour with CSS variables, tune the material with one config object.

Every colour the shader uses is read from CSS custom properties on the element, so presets, themes and your own colours all go through CSS. Light and dark follow `prefers-color-scheme`, or `data-theme` on `<html>`.

Tokens: `--clay-color`, `--clay-surface`, `--clay-knob`, `--clay-popup`, `--clay-success`, `--clay-danger`, the presets `--clay-teal` … `--clay-ink`, `--clay-text`, `--clay-ring` and the `--clay-spring` easing.

Each element wears its own `--clay-color`, so a coloured card doesn't recolour the controls inside it. The other tokens come from where a part sits: set `--clay-surface` or `--clay-text` on a dark card and the grooves and labels of the controls in it follow.

## Your own colour

```html
<clay-button color="oklch(0.72 0.12 30)">
  <ui-button><button>Coral</button></ui-button>
</clay-button>
```

## The material

`CLAY` holds the shader's material and light: pillow, steepness, wrap, subsurface, sheen, grain, shadows and the light direction. Change it at startup, or tune it live in the [Playground](/playground) and paste the values it copies.

```ts
import { CLAY, getClayEngine } from "claymorph-ui"

Object.assign(CLAY, { pillow: 0.7, grain: 0.08 })
getClayEngine()?.invalidateAll()
```
