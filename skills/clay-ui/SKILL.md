---
name: clay-ui
description: Builds interfaces with Clay UI, soft clay web components drawn by one WebGL2 shader on top of ui-sdk. Use when a project depends on claymorph-ui, has src/clay/, or mentions Clay UI, claymorphism components, or any of its verbs - Press (button), Roll (async action button), Latch (toggle), Fuse (button group), Drag (slide to confirm), Type (input), Slide (segmented control), Flip (switch), Tick (checkbox), Pick (radio group), Stretch (slider), Pour (select), Shift (tabs), Spill (menu), Unfold (popover), Lift (dialog), Pop (tooltip), Drop (toast), Hold (card), Stamp (badge), Frame (avatar), Fill (progress), Gauge (meter).
---

# Clay UI

Clay elements give ui-sdk's web components a clay body. The ui-sdk part inside keeps the behaviour, the name and the events; the clay element only adds the material and the motion.

## Non-negotiable rules

1. **Wrap, don't redraw.** Put the ui-sdk part inside the clay element, with the part's own markup exactly as the ui-sdk docs show. Never imitate the clay with `box-shadow`, gradients, canvas or SVG: the elements draw it with WebGL2 and fall back to CSS on their own.
2. **Import what you use.** `import "@ui-sdk/core/web.css"` and `import "claymorph-ui/clay.css"` once, then each element's entry, like `import "claymorph-ui/select"`, which defines it and the ui-sdk parts it wraps. `import "claymorph-ui"` defines them all.
3. **Don't edit Clay's source** to restyle one screen. Colour with the `color` attribute (a preset or any CSS colour) or the `--clay-*` variables; tune the material with the `CLAY` object.
4. **Listen on the ui-sdk part.** `action` on `<ui-button>` and `<ui-menu>`, `pressedchange` on `<ui-toggle>`, `checkedchange` on `<ui-switch>`, `valuechange` on `<ui-segmented-control>`, `<ui-tabs>`, `<ui-radio-group>` and `<ui-slider>`. Name every control, as ui-sdk requires.
5. **Don't nest clay to restyle.** A clay element never takes another's colour: `color` belongs to the element it's on. Put controls inside a `clay-card` freely.

## Which element

| Verb | Need | Element | Wraps |
| --- | --- | --- | --- |
| Press | One action | `<clay-button>` | `ui-button` (or any ui-sdk trigger or close button) |
| Roll | An action that takes a moment | `<clay-action-button>` | `ui-button`; set `.action` |
| Latch | An on or off action: like, shuffle | `<clay-toggle>` | `ui-toggle` |
| Fuse | Two to five related actions | `<clay-button-group>` | `ui-button` / `ui-toggle` buttons |
| Drag | A deliberate action: delete, pay | `<clay-slide-confirm>` | `ui-slider`; set `.action` |
| Type | Free text | `<clay-input>` | `ui-input`, `ui-input-group`, `textarea` |
| Slide | One of 2–5 visible options | `<clay-segmented>` | `ui-segmented-control` |
| Flip | A setting that applies at once | `<clay-switch>` | `ui-switch` |
| Tick | An option in a form | `<clay-checkbox>` | `ui-checkbox` |
| Pick | One of 2–7 options in a form | `<clay-radio>` | `ui-radio-group` |
| Stretch | A value by feel | `<clay-slider>` | `ui-slider` |
| Pour | One of many options | `<clay-select>` | `ui-select` |
| Shift | Views of the same thing | `<clay-tabs>` | `ui-tabs` |
| Spill | Several actions on one thing | `<clay-menu>` | `ui-menu` |
| Unfold | A short task by its button | `<clay-popover>` | `ui-popover` |
| Lift | A decision that needs attention | `<clay-dialog>` | `ui-dialog` |
| Pop | A hint or a name for an icon button | `<clay-tooltip>` | `ui-tooltip` |
| Drop | News that an action finished | `<clay-toast-region>` + `toast()` | `ui-toast-region` |
| Hold | Grouped content | `<clay-card>` | nothing |
| Stamp | A status label | `<clay-badge>` | nothing |
| Frame | Who someone is | `<clay-avatar>` | `ui-avatar` |
| Fill | A task under way | `<clay-progress>` | `ui-progress` |
| Gauge | A measured amount, or a bar chart | `<clay-meter>` | `ui-meter` |

## Essentials

```html
<clay-button color="teal">
  <ui-button><button>Save</button></ui-button>
</clay-button>

<clay-action-button color="lilac" pending-label="Sending…" success-label="Sent">
  <ui-button><button>Send invite</button></ui-button>
</clay-action-button>

<label>
  Notifications
  <clay-switch>
    <ui-switch default-checked><ui-switch-thumb></ui-switch-thumb></ui-switch>
  </clay-switch>
</label>
```

```html
<clay-toggle icon color="rose">
  <ui-toggle><button aria-label="Like"><svg aria-hidden="true">…</svg></button></ui-toggle>
</clay-toggle>

<clay-menu icon>
  <ui-menu>
    <ui-menu-trigger><button aria-label="More">…</button></ui-menu-trigger>
    <ui-menu-content>
      <ui-menu-item value="share">Share</ui-menu-item>
      <ui-menu-item value="delete" variant="danger">Delete</ui-menu-item>
    </ui-menu-content>
  </ui-menu>
</clay-menu>
```

```ts
import "claymorph-ui/action-button"
import { toast } from "claymorph-ui/toast"

document.querySelector("clay-action-button")!.action = () => fetch("/api/invite", { method: "POST" })
toast.success("Invite sent")
```

- **Roll** keeps its idle label as its accessible name in every state and announces success or error. Return a promise from `action`; a rejection shows the error state.
- **Pour**: the list grows from the trigger. Don't put a `clay-card` inside it.
- **Pop** around an icon button: put the `<clay-button>` inside `<ui-tooltip>` and the `<ui-tooltip-trigger><button aria-label=…>` inside the `<clay-button>`.
- **Hold** is a container, not a control. Put real controls inside it for actions; `interactive` only adds the swell.
- **Attached** (`attached` on `<clay-input>`, `<clay-select>`, `<clay-menu>`, `<clay-popover>`, `<clay-tooltip>` and `<clay-toast-region>`): parts squeeze out of their body like Roll's bead, stay melted onto it, and tuck back in when they leave. Type draws the `ui-field-label` and `ui-field-description` placed inside it as beads on its rim; Pour, Spill, Unfold and Pop grow their popup out of the trigger; Drop's toasts each pull out of the one before.
- **Type** shows focus as its rim glowing, so don't add your own focus outline to it.
- **Lift**: put `<clay-button>` around each `<ui-dialog-close>`, and the buttons in a `.clay-actions` row. The slab doesn't scroll, so keep dialogs short.
- **Drop**: place one `<clay-toast-region>` per page (a second region needs its own `createToaster()` set as its `toaster`), and put a `<button>` inside `<ui-toast-action>` in its template, or the action renders as plain text.
- **Gauge** upright (`orientation="vertical"`) needs a height; a row of them with `role="group"` and a name is a bar chart.
- `size` (`sm`, `md`, `lg`, `xl`) and `icon` (square) work on buttons, toggles, groups and the triggers of menus, popovers and dialogs.
- Shadows draw a little outside each element: give `html, body` `overflow-x: clip` if an edge element makes the page scroll sideways.
- `data-clay-ready` appears once WebGL2 drew the first frame; `data-tone="dark"` tells text to turn light.

## Reference

Every element's attributes, properties, events, demos and accessibility notes are in [references/components.md](references/components.md), generated from the docs site. The site also serves `/llms.txt`, `/llms-full.txt` and `/docs/<page>.md`.
