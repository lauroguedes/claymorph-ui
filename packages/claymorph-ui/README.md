# claymorph-ui

Soft clay web components. One WebGL2 shader draws every surface, with springs that swell, squash and melt parts into each other; [ui-sdk](https://ui-sdk.dev) gives them their keyboard, focus and ARIA. Without WebGL2, plain CSS clay takes over.

## Install

```bash
npm install claymorph-ui @ui-sdk/web @ui-sdk/core
```

`@ui-sdk/web` and `@ui-sdk/core` are peer dependencies, so your app and Clay share one copy.

## Use

Load the styles once, then import the elements you use. Each import registers its element and the ui-sdk parts it wraps.

```ts
import "@ui-sdk/core/web.css"
import "claymorph-ui/clay.css"
import "claymorph-ui/button"
import "claymorph-ui/select"
```

```html
<clay-button color="teal">
  <ui-button><button>Save</button></ui-button>
</clay-button>
```

To register everything at once, import the package itself:

```ts
import "claymorph-ui"
```

Only what you import ends up in your bundle: the component modules have no side effects, so a bundler drops the rest.

## Elements

| Entry | Element |
| --- | --- |
| `claymorph-ui/action-button` | `<clay-action-button>` |
| `claymorph-ui/avatar` | `<clay-avatar>` |
| `claymorph-ui/badge` | `<clay-badge>` |
| `claymorph-ui/button` | `<clay-button>` |
| `claymorph-ui/button-group` | `<clay-button-group>` |
| `claymorph-ui/card` | `<clay-card>` |
| `claymorph-ui/checkbox` | `<clay-checkbox>` |
| `claymorph-ui/dialog` | `<clay-dialog>` |
| `claymorph-ui/input` | `<clay-input>` |
| `claymorph-ui/menu` | `<clay-menu>` |
| `claymorph-ui/meter` | `<clay-meter>` |
| `claymorph-ui/popover` | `<clay-popover>` |
| `claymorph-ui/progress` | `<clay-progress>` |
| `claymorph-ui/radio` | `<clay-radio>` |
| `claymorph-ui/segmented` | `<clay-segmented>` |
| `claymorph-ui/select` | `<clay-select>` |
| `claymorph-ui/slide-confirm` | `<clay-slide-confirm>` |
| `claymorph-ui/slider` | `<clay-slider>` |
| `claymorph-ui/switch` | `<clay-switch>` |
| `claymorph-ui/tabs` | `<clay-tabs>` |
| `claymorph-ui/toast` | `<clay-toast-region>`, plus `toast` and `createToaster` |
| `claymorph-ui/toggle` | `<clay-toggle>` |
| `claymorph-ui/tooltip` | `<clay-tooltip>` |

The package root also exports `CLAY` and `SPRINGS`, the material and motion settings, and `getClayEngine`.

## TypeScript

Types ship with the package. Each entry adds its element to `HTMLElementTagNameMap`, so `document.querySelector("clay-select")` is typed as `ClaySelect`.

## Browsers

Any browser with WebGL2, the Popover API and CSS nesting draws the clay. Without WebGL2, the CSS fallback keeps every element usable and styled.

## License

MIT
