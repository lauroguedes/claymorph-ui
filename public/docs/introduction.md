# Introduction

Soft clay web components. One WebGL2 shader draws every surface, ui-sdk does the behaviour, and CSS draws the same clay when WebGL2 isn't there.

Clay UI gives ui-sdk's web components a clay body. You keep writing the ui-sdk parts you know, like `<ui-button>` or `<ui-switch>`, and wrap them in a clay element. The wrapper adds the material and the motion; the keyboard, focus, ARIA and form behaviour stay in ui-sdk.

Every component is named for **one verb**, so picking one takes a second:

- **Press**: [Button](/docs/button.md), `<clay-button>`. Swells under the pointer, squashes when pressed.
- **Roll**: [Action Button](/docs/action-button.md), `<clay-action-button>`. Its bead melts in while the action runs.
- **Latch**: [Toggle](/docs/toggle.md), `<clay-toggle>`. It stays pressed in.
- **Fuse**: [Button group](/docs/button-group.md), `<clay-button-group>`. Buttons fused into one body.
- **Drag**: [Slide to confirm](/docs/slide-confirm.md), `<clay-slide-confirm>`. Drag the ball to the end.
- **Type**: [Input](/docs/input.md), `<clay-input>`. Carved into the clay.
- **Slide**: [Segmented Control](/docs/segmented.md), `<clay-segmented>`. A bead rolls along a groove to the choice.
- **Flip**: [Switch](/docs/switch.md), `<clay-switch>`. The knob rolls across; the groove fills.
- **Tick**: [Checkbox](/docs/checkbox.md), `<clay-checkbox>`. A dent pushes up into a filled bump.
- **Pick**: [Radio group](/docs/radio.md), `<clay-radio>`. A bead hops into the dent.
- **Stretch**: [Slider](/docs/slider.md), `<clay-slider>`. The ball stretches with speed.
- **Pour**: [Select](/docs/select.md), `<clay-select>`. The list pours out of the button.
- **Shift**: [Tabs](/docs/tabs.md), `<clay-tabs>`. The bead rolls to the view.
- **Spill**: [Menu](/docs/menu.md), `<clay-menu>`. The list spills out of the button.
- **Unfold**: [Popover](/docs/popover.md), `<clay-popover>`. A card unfolds from the button.
- **Lift**: [Dialog](/docs/dialog.md), `<clay-dialog>`. A slab lifted off the page.
- **Pop**: [Tooltip](/docs/tooltip.md), `<clay-tooltip>`. A small clay tag pops out.
- **Drop**: [Toast](/docs/toast.md), `<clay-toast-region>`. It drops in and squashes.
- **Hold**: [Card](/docs/card.md), `<clay-card>`. A soft slab that holds content.
- **Stamp**: [Badge](/docs/badge.md), `<clay-badge>`. A small pressed label.
- **Frame**: [Avatar](/docs/avatar.md), `<clay-avatar>`. A face set in a clay ring.
- **Fill**: [Progress](/docs/progress.md), `<clay-progress>`. The groove fills with clay.
- **Gauge**: [Meter](/docs/meter.md), `<clay-meter>`. A level set in clay.

## How the clay is drawn

- **One WebGL2 context** draws every surface on the page, then copies each into its own small canvas. Browsers cap WebGL contexts, so the page never runs out.
- **Shapes are signed distance fields**: rounded rectangles with a pillow-shaped height profile. Wells are the same shape pressed in. Shapes can melt into each other with a smooth union, like the Roll button's bead.
- **Clay shading**: wrap lighting, a subsurface tint near the terminator, a broad matte sheen, fine fingerprint grain and a shadow tinted with the clay's own colour.
- **Springs, not keyframes**: an analytic damped spring drives hover swell, press squash and every knob, bead and ball. It runs only while something moves.
- **It degrades to CSS**: before the first frame, without WebGL2, on context loss or in forced colours, the same clay is drawn with layered `box-shadow`.
