# Installation

Install the package, load the styles once, import the elements you use.

## Installation

```bash
npm install claymorph-ui @ui-sdk/web @ui-sdk/core
```

Then import `claymorph-ui/clay.css` once and each element you use, like `claymorph-ui/button`.

`@ui-sdk/web` and `@ui-sdk/core` are peer dependencies, so your app and Clay share one copy. Load ui-sdk's styles and Clay's once, then import each element you use.

```ts
import "@ui-sdk/core/web.css"
import "claymorph-ui/clay.css"
import "claymorph-ui/button"
import "claymorph-ui/select"
```

Every element has its own entry, named for its tag without `clay-`: `claymorph-ui/button`, `claymorph-ui/select`, `claymorph-ui/toast`. Each one registers its element and the ui-sdk parts it wraps, so `<ui-button>` and friends are defined too, and your bundler leaves out the elements you don't import. `claymorph-ui/toast` also exports `toast` and `createToaster`.

```ts
// Or register every element at once.
import "claymorph-ui"
```

```html
<clay-button color="teal">
  <ui-button><button>Get started</button></ui-button>
</clay-button>
```

Types ship with the package. Each entry adds its element to `HTMLElementTagNameMap`, so `document.querySelector("clay-select")` is typed as `ClaySelect`.

## From a CDN

For a prototype, a CodePen or a page with no build step, load the CDN build: one stylesheet with ui-sdk's styles and Clay's, and one module with every element and the ui-sdk parts they wrap. There's nothing to install.

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/claymorph-ui@0/dist/cdn/claymorph-ui.css" />
<script type="module" src="https://cdn.jsdelivr.net/npm/claymorph-ui@0/dist/cdn/claymorph-ui.js"></script>

<clay-button color="teal">
  <ui-button><button>Get started</button></ui-button>
</clay-button>
```

The module exports what the package does, so a script can `import { toast } from "https://cdn.jsdelivr.net/npm/claymorph-ui@0/dist/cdn/claymorph-ui.js"`. It's about 160 KB gzipped with ui-sdk inside, so it already includes ui-sdk's parts: don't load ui-sdk's own `web.js` beside it. A bundler that imports only the elements a page uses ships much less. The same files are on unpkg, and in production pin an exact version, like `claymorph-ui@0.5.0`.

> Each surface draws its shadow a little outside its element. If a page scrolls sideways because of an element at its edge, give `html` and `body` `overflow-x: clip`.

> With Tailwind CSS, start the global stylesheet with `@layer ui-sdk;` above `@import "tailwindcss";`, and import `@ui-sdk/core/web.css` into `layer(components)`, so Tailwind's base styles don't reset it.
