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
