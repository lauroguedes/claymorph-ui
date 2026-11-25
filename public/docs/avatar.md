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
