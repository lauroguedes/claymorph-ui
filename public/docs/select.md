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
