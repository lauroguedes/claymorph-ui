# Clay UI

Soft clay web components. One WebGL2 shader draws every surface, with springs that swell, squash and melt parts into each other; [ui-sdk](https://ui-sdk.dev) gives them their keyboard, focus and ARIA. Without WebGL2, plain CSS clay takes over.

It ships to npm as [`claymorph-ui`](packages/claymorph-ui):

```bash
npm install claymorph-ui @ui-sdk/web @ui-sdk/core
```

```ts
import "@ui-sdk/core/web.css"
import "claymorph-ui/clay.css"
import "claymorph-ui/button"
```

See the [package README](packages/claymorph-ui/README.md) for every element and entry.

## This repository

| Path | What it is |
| --- | --- |
| `src/clay/` | The library: the WebGL2 engine, the components and one entry per element |
| `src/site/` | The docs site, with live demos, a playground and the changelog |
| `src/showcase/` | Clay Tunes, a music app built only from the components |
| `packages/claymorph-ui/` | The npm package, built from `src/clay/` |
| `skills/clay-ui/` | An agent skill for building with Clay UI |

```bash
npm install
npm run dev        # docs site and showcase
npm test           # unit tests
npm run build:lib  # builds the npm package
npm run pack:lib   # builds it and packs a tarball
```

## License

[MIT](LICENSE)
