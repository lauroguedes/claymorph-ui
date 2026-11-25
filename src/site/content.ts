interface Row {
  name: string
  type: string
  default?: string
  description: string
}

type Block =
  | { type: "p"; text: string }
  | { type: "h"; text: string }
  | { type: "list"; items: string[] }
  | { type: "note"; text: string }
  | { type: "demo"; id: string; title: string }
  | { type: "code"; title: string; code: string }
  | { type: "install" }
  | { type: "when"; use: string[]; avoid: string[] }
  | { type: "api"; title: string; rows: Row[] }
  | { type: "tokens" }
  | { type: "index" }

const SECTIONS = ["Actions", "Inputs", "Views and popups", "Display"] as const

interface DocPage {
  slug: string
  group: "start" | "components"
  section?: (typeof SECTIONS)[number]
  title: string
  description: string
  tag?: string
  verb?: string
  signature?: string
  hero?: string
  blocks: Block[]
}

interface Release {
  version: string
  date: string
  title: string
  changes: Array<{ kind: "new" | "improved" | "fixed"; page?: string; text: string }>
}

const SITE = {
  name: "Claymorph UI",
  tagline: "Clay that gives when you press it.",
  summary:
    "Claymorph UI is a set of web components with a soft clay body drawn by one WebGL2 shader, with behaviour from ui-sdk. Each is named for the one thing it does. Without WebGL2 the same clay is drawn with CSS shadows.",
  source: "https://github.com/lauroguedes/claymorph-ui",
  /** Where the site is published: canonical links, the sitemap and social cards start here. */
  url: "https://claymorph-ui.lauroguedes.dev",
  /** The npm package the site and its code samples import. */
  package: "claymorph-ui",
  npm: "https://www.npmjs.com/package/claymorph-ui",
  author: "Lauro Guedes",
}

const COMMON_API: Row[] = [
  {
    name: "color",
    type: "neutral | teal | lilac | sky | peach | mint | butter | rose | slate | ink | <color>",
    description: "The clay's colour: a preset, or any CSS colour. It sets `--clay-color` on the element.",
  },
]

const STATE_ROWS: Row[] = [
  {
    name: "data-clay-ready",
    type: "attribute",
    description: "Set once the first WebGL2 frame is drawn. Until then the CSS clay shows.",
  },
  {
    name: "data-tone",
    type: '"light" | "dark"',
    description: "Set from the clay colour's luminance so text can pick a readable colour.",
  },
]

const PAGES: DocPage[] = [
  {
    slug: "introduction",
    group: "start",
    title: "Introduction",
    description:
      "Soft clay web components. One WebGL2 shader draws every surface, ui-sdk does the behaviour, and CSS draws the same clay when WebGL2 isn't there.",
    blocks: [
      {
        type: "p",
        text: "Claymorph UI gives ui-sdk's web components a clay body. You keep writing the ui-sdk parts you know, like `<ui-button>` or `<ui-switch>`, and wrap them in a clay element. The wrapper adds the material and the motion; the keyboard, focus, ARIA and form behaviour stay in ui-sdk.",
      },
      {
        type: "p",
        text: "Every component is named for **one verb**, so picking one takes a second:",
      },
      { type: "index" },
      { type: "h", text: "How the clay is drawn" },
      {
        type: "list",
        items: [
          "**One WebGL2 context** draws every surface on the page, then copies each into its own small canvas. Browsers cap WebGL contexts, so the page never runs out.",
          "**Shapes are signed distance fields**: rounded rectangles with a pillow-shaped height profile. Wells are the same shape pressed in. Shapes can melt into each other with a smooth union, like the Roll button's bead.",
          "**Clay shading**: wrap lighting, a subsurface tint near the terminator, a broad matte sheen, fine fingerprint grain and a shadow tinted with the clay's own colour.",
          "**Springs, not keyframes**: an analytic damped spring drives hover swell, press squash and every knob, bead and ball. It runs only while something moves.",
          "**It degrades to CSS**: before the first frame, without WebGL2, on context loss or in forced colours, the same clay is drawn with layered `box-shadow`.",
        ],
      },
    ],
  },
  {
    slug: "installation",
    group: "start",
    title: "Installation",
    description: "Install the package, load the styles once, import the elements you use.",
    blocks: [
      { type: "install" },
      {
        type: "p",
        text: "`@ui-sdk/web` and `@ui-sdk/core` are peer dependencies, so your app and Clay share one copy. Load ui-sdk's styles and Clay's once, then import each element you use.",
      },
      {
        type: "code",
        title: "main.ts",
        code: `import "@ui-sdk/core/web.css"
import "claymorph-ui/clay.css"
import "claymorph-ui/button"
import "claymorph-ui/select"`,
      },
      {
        type: "p",
        text: "Every element has its own entry, named for its tag without `clay-`: `claymorph-ui/button`, `claymorph-ui/select`, `claymorph-ui/toast`. Each one registers its element and the ui-sdk parts it wraps, so `<ui-button>` and friends are defined too, and your bundler leaves out the elements you don't import. `claymorph-ui/toast` also exports `toast` and `createToaster`.",
      },
      {
        type: "code",
        title: "main.ts",
        code: `// Or register every element at once.
import "claymorph-ui"`,
      },
      {
        type: "code",
        title: "index.html",
        code: `<clay-button color="teal">
  <ui-button><button>Get started</button></ui-button>
</clay-button>`,
      },
      {
        type: "p",
        text: "Types ship with the package. Each entry adds its element to `HTMLElementTagNameMap`, so `document.querySelector(\"clay-select\")` is typed as `ClaySelect`.",
      },
      {
        type: "note",
        text: "Each surface draws its shadow a little outside its element. If a page scrolls sideways because of an element at its edge, give `html` and `body` `overflow-x: clip`.",
      },
      {
        type: "note",
        text: "With Tailwind CSS, start the global stylesheet with `@layer ui-sdk;` above `@import \"tailwindcss\";`, and import `@ui-sdk/core/web.css` into `layer(components)`, so Tailwind's base styles don't reset it.",
      },
    ],
  },
  {
    slug: "theming",
    group: "start",
    title: "Theming",
    description: "Colour with CSS variables, tune the material with one config object.",
    blocks: [
      {
        type: "p",
        text: "Every colour the shader uses is read from CSS custom properties on the element, so presets, themes and your own colours all go through CSS. Light and dark follow `prefers-color-scheme`, or `data-theme` on `<html>`.",
      },
      { type: "tokens" },
      {
        type: "p",
        text: "Each element wears its own `--clay-color`, so a coloured card doesn't recolour the controls inside it. The other tokens come from where a part sits: set `--clay-surface` or `--clay-text` on a dark card and the grooves and labels of the controls in it follow.",
      },
      { type: "h", text: "Your own colour" },
      {
        type: "code",
        title: "index.html",
        code: `<clay-button color="oklch(0.72 0.12 30)">
  <ui-button><button>Coral</button></ui-button>
</clay-button>`,
      },
      { type: "h", text: "The material" },
      {
        type: "p",
        text: "`CLAY` holds the shader's material and light: pillow, steepness, wrap, subsurface, sheen, grain, shadows and the light direction. Change it at startup, or tune it live in the [Playground](/playground) and paste the values it copies.",
      },
      {
        type: "code",
        title: "main.ts",
        code: `import { CLAY, getClayEngine } from "claymorph-ui"

Object.assign(CLAY, { pillow: 0.7, grain: 0.08 })
getClayEngine()?.invalidateAll()`,
      },
    ],
  },
  {
    slug: "ai",
    group: "start",
    title: "For AI",
    description: "Machine-readable docs, a skill, and an agent bridge.",
    blocks: [
      {
        type: "list",
        items: [
          "`/llms.txt`: the rules and an index of every page.",
          "`/llms-full.txt`: every page in one file.",
          "`/docs/<page>.md`: each page as Markdown, demos inlined.",
          "`skills/clay-ui/SKILL.md`: tells an agent which element to use and to wrap ui-sdk parts instead of drawing clay by hand.",
        ],
      },
      { type: "h", text: "Agents on the page" },
      {
        type: "p",
        text: "Clay elements only add a body; the ui-sdk parts inside them stay what an agent sees. `createAgent` from `@ui-sdk/web/agent` lists and operates every Claymorph UI control by its name, and `registerTools` publishes the same tools over WebMCP. This site registers them, so a browser agent can press the demos.",
      },
      {
        type: "code",
        title: "agent.ts",
        code: `import { createAgent, registerTools } from "@ui-sdk/web/agent"

const agent = createAgent()
registerTools(agent, { allow: () => true })`,
      },
      { type: "h", text: "A prompt that works" },
      {
        type: "code",
        title: "prompt",
        code: `Read /llms.txt. Build a settings panel with Claymorph UI: a Slide for the theme,
a Flip for notifications, a Stretch for volume and a Roll to save.`,
      },
    ],
  },
  {
    slug: "button",
    group: "components",
    section: "Actions",
    title: "Button",
    tag: "clay-button",
    verb: "Press",
    signature: "Swells under the pointer, squashes when pressed.",
    description:
      "A clay button. It swells toward the pointer, squashes and glows when pressed, and springs back. Wraps `ui-button`.",
    hero: "button-colors",
    blocks: [
      {
        type: "when",
        use: ["One action: Save, Continue, Open.", "A row of actions with different weights, by colour."],
        avoid: [
          "An action that takes time and should show it: use **Roll**.",
          "Choosing one of a few options: use **Slide**.",
        ],
      },
      { type: "install" },
      { type: "h", text: "Usage" },
      {
        type: "code",
        title: "index.html",
        code: `<clay-button color="teal">
  <ui-button><button>Save</button></ui-button>
</clay-button>`,
      },
      {
        type: "p",
        text: "Listen for `action` on `<ui-button>`, as with any ui-sdk button. `event.detail.waitUntil(promise)` keeps it pending.",
      },
      { type: "h", text: "Examples" },
      { type: "demo", id: "button-sizes", title: "Sizes and shapes" },
      {
        type: "p",
        text: "`size` is `sm`, `md`, `lg` or `xl`. `shape=\"rounded\"` trades the pill for soft corners.",
      },
      { type: "h", text: "API reference" },
      {
        type: "api",
        title: "Attributes",
        rows: [
          ...COMMON_API,
          { name: "size", type: "sm | md | lg | xl", default: "md", description: "Height: 36, 44, 52 or 64 px." },
          { name: "shape", type: "pill | rounded", default: "pill", description: "Pill ends or soft corners." },
          { name: "icon", type: "boolean", description: "Makes it square, for an icon-only button. Give the button an `aria-label`." },
        ],
      },
      { type: "api", title: "State", rows: STATE_ROWS },
      { type: "h", text: "Accessibility" },
      {
        type: "list",
        items: [
          "The real element is the `<button>` inside `<ui-button>`: its text is its name, and Enter and Space press it.",
          "The canvas is `aria-hidden` and ignores the pointer.",
          "Under reduced motion, every spring jumps to its end.",
        ],
      },
    ],
  },
  {
    slug: "action-button",
    group: "components",
    section: "Actions",
    title: "Action Button",
    tag: "clay-action-button",
    verb: "Roll",
    signature: "Its bead melts in while the action runs.",
    description:
      "An async action. A clay bead sits beside the body; pressing it melts the bead in, it stays melted while the action runs, then turns into a check (or a cross) and rolls back out.",
    hero: "action-button-basic",
    blocks: [
      {
        type: "when",
        use: ["Saving, sending or deploying: one action that takes a moment.", "When the result should be seen on the button itself."],
        avoid: ["An instant action: use **Press**.", "A destructive action: confirm it first."],
      },
      { type: "install" },
      { type: "h", text: "Usage" },
      {
        type: "code",
        title: "index.html",
        code: `<clay-action-button color="teal" pending-label="Deploying…" success-label="Deployed">
  <ui-button><button>Deploy</button></ui-button>
</clay-action-button>`,
      },
      {
        type: "code",
        title: "main.ts",
        code: `const deploy = document.querySelector("clay-action-button")!
deploy.action = () => fetch("/api/deploy", { method: "POST" })`,
      },
      {
        type: "p",
        text: "`action` runs on press. While its promise is pending the button is busy and announces the pending label; when it resolves the bead turns into a check, when it rejects into a cross.",
      },
      { type: "h", text: "The flow" },
      {
        type: "list",
        items: [
          "**Idle**: the bead sits apart, with an arrow.",
          "**Pending**: the bead melts into the body; the label and a spinner change.",
          "**Success**: the bead swells, turns mint and shows a check.",
          "**Error**: the body shakes, the bead turns rose and shows a cross.",
          "After `reset-after` ms it rolls back to idle.",
        ],
      },
      { type: "h", text: "Examples" },
      { type: "demo", id: "action-button-error", title: "When it fails" },
      { type: "h", text: "API reference" },
      {
        type: "api",
        title: "Attributes",
        rows: [
          ...COMMON_API,
          { name: "size", type: "sm | md | lg", default: "md", description: "Height: 40, 48 or 56 px." },
          { name: "pending-label", type: "string", default: "Working…", description: "Shown and announced while the action runs." },
          { name: "success-label", type: "string", default: "Done", description: "Shown and announced when it resolves." },
          { name: "error-label", type: "string", default: "Try again", description: "Shown and announced when it rejects." },
          { name: "reset-after", type: "number (ms)", default: "2400", description: "When to roll back to idle. `0` stays." },
        ],
      },
      {
        type: "api",
        title: "Properties",
        rows: [
          { name: "action", type: "() => unknown", description: "Runs on press. Return a promise to show pending." },
          { name: "actionState", type: '"idle" | "pending" | "success" | "error"', description: "Read only." },
        ],
      },
      {
        type: "api",
        title: "Events",
        rows: [{ name: "statechange", type: "CustomEvent<{ state }>", description: "Fires on every state change." }],
      },
      { type: "h", text: "Accessibility" },
      {
        type: "list",
        items: [
          "The button keeps its idle label as its name in every state; visible labels are `aria-hidden`.",
          "ui-button marks it busy and announces the pending label; a `role=status` region announces success or error.",
          "It ignores presses while pending, so an action never runs twice.",
        ],
      },
    ],
  },
  {
    slug: "segmented",
    group: "components",
    section: "Inputs",
    title: "Segmented Control",
    tag: "clay-segmented",
    verb: "Slide",
    signature: "A bead rolls along a groove to the choice.",
    description:
      "Pick one of a few options. The selection is a clay bead that rolls along a groove, stretching with its speed. Wraps `ui-segmented-control`.",
    hero: "segmented-basic",
    blocks: [
      {
        type: "when",
        use: ["Two to five short options, all visible: Day, Week, Month.", "Switching a view."],
        avoid: ["More options than fit: use **Pour**.", "On or off: use **Flip**."],
      },
      { type: "install" },
      { type: "h", text: "Usage" },
      {
        type: "code",
        title: "index.html",
        code: `<clay-segmented>
  <ui-segmented-control aria-label="Range" default-value="week">
    <ui-segmented-control-indicator></ui-segmented-control-indicator>
    <ui-segmented-control-item value="day">Day</ui-segmented-control-item>
    <ui-segmented-control-item value="week">Week</ui-segmented-control-item>
    <ui-segmented-control-item value="month">Month</ui-segmented-control-item>
  </ui-segmented-control>
</clay-segmented>`,
      },
      {
        type: "p",
        text: "Read and set `value` on `<ui-segmented-control>` and listen for `valuechange`. The bead follows every change, including ones made from code or by an agent.",
      },
      { type: "h", text: "API reference" },
      {
        type: "api",
        title: "Attributes",
        rows: [{ ...COMMON_API[0]!, default: "knob", description: "The bead's colour." }],
      },
      { type: "api", title: "State", rows: STATE_ROWS.slice(0, 1) },
      { type: "h", text: "Accessibility" },
      {
        type: "list",
        items: [
          "A radio group from ui-sdk: arrow keys move and select, and it needs `aria-label`.",
          "The CSS indicator stays in the markup and shows without WebGL2.",
        ],
      },
    ],
  },
  {
    slug: "switch",
    group: "components",
    section: "Inputs",
    title: "Switch",
    tag: "clay-switch",
    verb: "Flip",
    signature: "The knob rolls across; the groove fills.",
    description: "On or off. The knob rolls across a groove that fills with colour, and squashes as it travels. Wraps `ui-switch`.",
    hero: "switch-basic",
    blocks: [
      {
        type: "when",
        use: ["A setting that applies at once: Wi-Fi, notifications."],
        avoid: ["A choice that's submitted later with a form: use **Tick**."],
      },
      { type: "install" },
      { type: "h", text: "Usage" },
      {
        type: "code",
        title: "index.html",
        code: `<label>
  Notifications
  <clay-switch>
    <ui-switch default-checked><ui-switch-thumb></ui-switch-thumb></ui-switch>
  </clay-switch>
</label>`,
      },
      { type: "h", text: "API reference" },
      {
        type: "api",
        title: "Attributes",
        rows: [
          { ...COMMON_API[0]!, default: "teal", description: "The colour the groove fills with." },
          { name: "size", type: "sm | md | lg", default: "md", description: "46×26, 56×32 or 68×38 px." },
        ],
      },
      { type: "h", text: "Accessibility" },
      {
        type: "list",
        items: [
          "`<ui-switch>` has the switch role and takes its name from the label around it.",
          "Space toggles it; the knob follows `checked` however it changes.",
        ],
      },
    ],
  },
  {
    slug: "checkbox",
    group: "components",
    section: "Inputs",
    title: "Checkbox",
    tag: "clay-checkbox",
    verb: "Tick",
    signature: "A dent pushes up into a filled bump.",
    description:
      "A checkbox whose dent pushes up into a filled clay bump when checked, while the check draws in. Wraps `ui-checkbox`.",
    hero: "checkbox-basic",
    blocks: [
      {
        type: "when",
        use: ["Independent options in a form.", "Agreeing to something."],
        avoid: ["A setting that applies at once: use **Flip**."],
      },
      { type: "install" },
      { type: "h", text: "Usage" },
      {
        type: "code",
        title: "index.html",
        code: `<label>
  <clay-checkbox>
    <ui-checkbox name="updates">
      <ui-checkbox-indicator aria-hidden="true">
        <svg viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7" /></svg>
      </ui-checkbox-indicator>
    </ui-checkbox>
  </clay-checkbox>
  Product updates
</label>`,
      },
      { type: "h", text: "API reference" },
      {
        type: "api",
        title: "Attributes",
        rows: [{ ...COMMON_API[0]!, default: "teal", description: "The colour of the checked bump." }],
      },
      { type: "h", text: "Accessibility" },
      {
        type: "list",
        items: [
          "`<ui-checkbox>` has the checkbox role, takes its name from the label and submits with its form.",
          "Indeterminate shows the bump half raised.",
        ],
      },
    ],
  },
  {
    slug: "slider",
    group: "components",
    section: "Inputs",
    title: "Slider",
    tag: "clay-slider",
    verb: "Stretch",
    signature: "The ball stretches with speed.",
    description:
      "A slider with a clay ball that stretches with its speed, swells while held and drags a filled groove behind it. Wraps `ui-slider`.",
    hero: "slider-basic",
    blocks: [
      {
        type: "when",
        use: ["A value where the exact number matters less than the feel: volume, size."],
        avoid: ["An exact number: use a number input."],
      },
      { type: "install" },
      { type: "h", text: "Usage" },
      {
        type: "code",
        title: "index.html",
        code: `<clay-slider>
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
</clay-slider>`,
      },
      { type: "h", text: "API reference" },
      {
        type: "api",
        title: "Attributes",
        rows: [{ ...COMMON_API[0]!, default: "teal", description: "The fill's colour." }],
      },
      { type: "h", text: "Accessibility" },
      {
        type: "list",
        items: [
          "Each thumb renders a hidden `<input type=range>`: arrows, Page Up/Down, Home and End work, and phones adjust it with their own gestures.",
          "Show the name with a `ui-field-label` inside a `ui-field`, and repeat it as `aria-label` on `<ui-slider>`: the agent bridge reads the slider's name from there. `ui-slider-value` shows the formatted value.",
        ],
      },
    ],
  },
  {
    slug: "select",
    group: "components",
    section: "Inputs",
    title: "Select",
    tag: "clay-select",
    verb: "Pour",
    signature: "The list pours out of the button.",
    description:
      "A select whose list pours out of its clay button: it grows from the trigger on a spring while the options drop in one by one, and the chosen value is wiped in out of a blur. Wraps `ui-select`.",
    hero: "select-basic",
    blocks: [
      {
        type: "when",
        use: ["One choice from a list longer than a few options."],
        avoid: ["Two to five short options: use **Slide**.", "Searching a long list: use a combobox."],
      },
      { type: "install" },
      { type: "h", text: "Usage" },
      {
        type: "code",
        title: "index.html",
        code: `<clay-select>
  <ui-select default-value="week">
    <ui-select-label>Period</ui-select-label>
    <ui-select-trigger><button><ui-select-value></ui-select-value></button></ui-select-trigger>
    <ui-select-content>
      <ui-select-item value="day">Today</ui-select-item>
      <ui-select-item value="week">This week</ui-select-item>
      <ui-select-item value="month">This month</ui-select-item>
    </ui-select-content>
  </ui-select>
</clay-select>`,
      },
      { type: "h", text: "Attached" },
      {
        type: "p",
        text: "With `attached`, the list squeezes out of the trigger like Roll's bead and stays melted onto it, their colours blending across the joint. Closing eases it back in, the trigger gives a little bounce, and only then does the new value show.",
      },
      { type: "demo", id: "select-attached", title: "Attached" },
      { type: "h", text: "Fuse" },
      {
        type: "p",
        text: "The joint is always smooth: the trigger's edge never shades a line across it, only their colours blend. `fuse` sets how far the list melts in, from `0`, a slight waist with a small gap, to `1`, where it sits right on the trigger and the two read as one body. Menus, popovers and tooltips take it too. Set it with the slider, then open the list.",
      },
      { type: "demo", id: "select-fuse", title: "Fuse" },
      { type: "h", text: "API reference" },
      {
        type: "api",
        title: "Attributes",
        rows: [
          { ...COMMON_API[0]!, default: "neutral", description: "The trigger's colour. The list uses `--clay-popup`." },
          { name: "attached", type: "boolean", description: "Grows the list out of the trigger and keeps them melted together while it's open." },
          { name: "fuse", type: "number", default: "0", description: "With `attached`, how far the list melts into the trigger, from 0 to 1. The gap between them closes as it rises; the joint itself is always smooth." },
        ],
      },
      { type: "h", text: "Accessibility" },
      {
        type: "list",
        items: [
          "A ui-sdk select: a combobox trigger, a listbox, typeahead, and the value submitted with its form.",
          "The list's opening is CSS on `data-starting-style`, so it's off under reduced motion.",
        ],
      },
    ],
  },
  {
    slug: "card",
    group: "components",
    section: "Display",
    title: "Card",
    tag: "clay-card",
    verb: "Hold",
    signature: "A soft slab that holds content.",
    description: "A clay slab that holds content. Flatter than a button, with a deeper shadow. `interactive` makes it swell.",
    hero: "card-basic",
    blocks: [
      {
        type: "when",
        use: ["Grouping related content: a stat, a summary, a settings group."],
        avoid: ["The whole card as one action: put a **Press** inside, or use `interactive` with a link inside."],
      },
      { type: "install" },
      { type: "h", text: "Usage" },
      {
        type: "code",
        title: "index.html",
        code: `<clay-card color="mint" elevation="2">
  <h3>Songs played</h3>
  <p>1,248</p>
</clay-card>`,
      },
      { type: "h", text: "API reference" },
      {
        type: "api",
        title: "Attributes",
        rows: [
          ...COMMON_API,
          { name: "elevation", type: "1 | 2 | 3", default: "2", description: "How far it floats: the shadow's size and offset." },
          { name: "radius", type: "number (px)", default: "28", description: "Corner radius of the clay." },
          { name: "interactive", type: "boolean", description: "Swells and squashes like a button. Read once, when it connects." },
        ],
      },
      { type: "h", text: "Accessibility" },
      { type: "list", items: ["A plain container: give it a heading, and put real controls inside for actions."] },
    ],
  },
  {
    slug: "badge",
    group: "components",
    section: "Display",
    title: "Badge",
    tag: "clay-badge",
    verb: "Stamp",
    signature: "A small pressed label.",
    description: "A small clay label that stamps in when it appears.",
    hero: "badge-colors",
    blocks: [
      {
        type: "when",
        use: ["A status or a count next to something: New, Beta, 3."],
        avoid: ["Anything clickable: use **Press** with `size=\"sm\"`."],
      },
      { type: "install" },
      { type: "h", text: "Usage" },
      { type: "code", title: "index.html", code: `<clay-badge color="mint">New</clay-badge>` },
      { type: "h", text: "API reference" },
      { type: "api", title: "Attributes", rows: COMMON_API },
      { type: "h", text: "Accessibility" },
      { type: "list", items: ["Plain text, read where it sits. Don't rely on its colour alone to carry meaning."] },
    ],
  },
  {
    slug: "tooltip",
    group: "components",
    section: "Views and popups",
    title: "Tooltip",
    tag: "clay-tooltip",
    verb: "Pop",
    signature: "A small clay tag pops out.",
    description: "Names a control or adds a short hint, as a small clay tag that pops out of its side. Wraps `ui-tooltip`.",
    hero: "tooltip-basic",
    blocks: [
      {
        type: "when",
        use: ["Naming an icon-only button.", "A short hint on hover and focus."],
        avoid: ["Anything interactive: tooltips can't be focused."],
      },
      { type: "install" },
      { type: "h", text: "Usage" },
      {
        type: "code",
        title: "index.html",
        code: `<clay-tooltip>
  <ui-tooltip>
    <clay-button icon color="rose">
      <ui-tooltip-trigger><button aria-label="Like">…</button></ui-tooltip-trigger>
    </clay-button>
    <ui-tooltip-content>Add to favorites</ui-tooltip-content>
  </ui-tooltip>
</clay-tooltip>`,
      },
      { type: "h", text: "Attached" },
      {
        type: "p",
        text: "With `attached`, the tag squeezes out of its button like Roll's bead, stays melted onto it while it's open, and tucks back in when it closes. It takes the button's colour unless you give it a `color`.",
      },
      { type: "demo", id: "tooltip-attached", title: "Attached" },
      { type: "h", text: "Fuse" },
      {
        type: "p",
        text: "`fuse` sets how far an attached tag melts into its button, from `0`, joined at a slight waist, to `1`, where the tag sits right on the button and the two read as one body. The joint is smooth at every level. Drag the slider to try them.",
      },
      { type: "demo", id: "tooltip-fuse", title: "Fuse" },
      { type: "h", text: "API reference" },
      {
        type: "api",
        title: "Attributes",
        rows: [
          { ...COMMON_API[0]!, default: "ink", description: "The tag's colour. Attached tags take the button's colour when this is left out." },
          { name: "attached", type: "boolean", description: "Grows the tag out of its clay button and keeps them joined while it's open." },
          { name: "fuse", type: "number", default: "0", description: "With `attached`, how far the tag fuses with its button, from 0 to 1. The gap between them closes as it rises; the joint itself is always smooth." },
        ],
      },
      { type: "h", text: "Accessibility" },
      {
        type: "list",
        items: [
          "The content has the tooltip role and names or describes its trigger before focus reaches it.",
          "Escape closes it while focus stays on the trigger.",
        ],
      },
    ],
  },
  {
    slug: "toggle",
    group: "components",
    section: "Actions",
    title: "Toggle",
    tag: "clay-toggle",
    verb: "Latch",
    signature: "It stays pressed in.",
    description:
      "A toggle button whose clay sinks into a coloured well while it's on, and pops back out when it's off. Wraps `ui-toggle`.",
    hero: "toggle-basic",
    blocks: [
      {
        type: "when",
        use: ["An on or off action on a button: like, shuffle, mute, bold."],
        avoid: [
          "A setting that applies at once and reads as a sentence: use a switch.",
          "One of several options: use a segmented control.",
        ],
      },
      { type: "install" },
      { type: "h", text: "Usage" },
      {
        type: "code",
        title: "index.html",
        code: `<clay-toggle icon color="rose">
  <ui-toggle>
    <button aria-label="Like"><svg class="icon" aria-hidden="true">…</svg></button>
  </ui-toggle>
</clay-toggle>`,
      },
      {
        type: "p",
        text: "Start it on with `default-pressed` on `<ui-toggle>`, and listen for `pressedchange` there. A text toggle needs no `icon`.",
      },
      { type: "h", text: "API reference" },
      {
        type: "api",
        title: "Attributes",
        rows: [
          { ...COMMON_API[0]!, default: "teal", description: "The colour of the well while it's on." },
          { name: "size", type: "sm | md | lg | xl", default: "md", description: "36, 44, 52 or 64 px tall." },
          { name: "icon", type: "boolean", description: "Makes it square, for an icon-only toggle." },
          { name: "shape", type: "pill | rounded", default: "pill", description: "Fully round ends, or soft corners." },
        ],
      },
      { type: "api", title: "State", rows: [{ name: "data-pressed", type: '"true" | "false"', description: "Mirrors the toggle, so the text can take the well's tone." }, ...STATE_ROWS] },
      { type: "h", text: "Accessibility" },
      {
        type: "list",
        items: [
          "The button reports its state with `aria-pressed`. Keep its label the same in both states: screen readers say whether it's pressed.",
          "An icon-only toggle needs an `aria-label` on the button.",
        ],
      },
    ],
  },
  {
    slug: "button-group",
    group: "components",
    section: "Actions",
    title: "Button group",
    tag: "clay-button-group",
    verb: "Fuse",
    signature: "Buttons fused into one body.",
    description:
      "Related buttons fused into one clay body. Each part swells and squashes on its own, and a pressed toggle inside sinks into a well. Wraps `ui-button` or `ui-toggle` buttons.",
    hero: "button-group-basic",
    blocks: [
      {
        type: "when",
        use: ["Two to five related actions that belong together: playback, text style, message actions."],
        avoid: ["Choosing one option: use a segmented control.", "Unrelated actions: space out separate buttons."],
      },
      { type: "install" },
      { type: "h", text: "Usage" },
      {
        type: "code",
        title: "index.html",
        code: `<clay-button-group aria-label="Playback" color="sky">
  <ui-button><button aria-label="Previous track">…</button></ui-button>
  <ui-button><button aria-label="Play">…</button></ui-button>
  <ui-button><button aria-label="Next track">…</button></ui-button>
</clay-button-group>`,
      },
      { type: "h", text: "Toggles" },
      { type: "p", text: "Put `ui-toggle` buttons in the group and the pressed ones sink into wells of the same body." },
      { type: "demo", id: "button-group-toggles", title: "Text style" },
      { type: "h", text: "API reference" },
      {
        type: "api",
        title: "Attributes",
        rows: [
          { ...COMMON_API[0]!, default: "neutral" },
          { name: "size", type: "sm | md | lg | xl", default: "md", description: "The height of every part." },
          { name: "aria-label", type: "string", description: 'Names the group. The element gets `role="group"` unless it has a role.' },
        ],
      },
      { type: "h", text: "Accessibility" },
      {
        type: "list",
        items: [
          "Each part is its own button in the tab order, with its own name. Give icon-only parts an `aria-label`.",
          "Toggles report their state with `aria-pressed`.",
          "Up to 16 buttons fuse; more stay plain.",
        ],
      },
    ],
  },
  {
    slug: "slide-confirm",
    group: "components",
    section: "Actions",
    title: "Slide to confirm",
    tag: "clay-slide-confirm",
    verb: "Drag",
    signature: "Drag the ball to the end.",
    description:
      "A deliberate action: drag a clay ball along its groove to the end. Let go early and it rolls back; at the end it runs `.action`, then shows pending, success or error. Wraps `ui-slider`.",
    hero: "slide-confirm-basic",
    blocks: [
      {
        type: "when",
        use: ["An action that should be deliberate: delete, send money, publish to everyone."],
        avoid: ["Everyday actions: use a button.", "Choosing a value: use a slider."],
      },
      { type: "install" },
      { type: "h", text: "Usage" },
      {
        type: "code",
        title: "index.html",
        code: `<clay-slide-confirm color="rose" pending-label="Deleting…" success-label="History deleted">
  <ui-slider aria-label="Slide to delete history">
    <ui-slider-control>
      <ui-slider-track>
        <ui-slider-indicator></ui-slider-indicator>
        <ui-slider-thumb></ui-slider-thumb>
      </ui-slider-track>
    </ui-slider-control>
  </ui-slider>
</clay-slide-confirm>`,
      },
      {
        type: "code",
        title: "main.ts",
        code: `document.querySelector("clay-slide-confirm")!.action = () =>
  fetch("/api/history", { method: "DELETE" })`,
      },
      { type: "h", text: "API reference" },
      {
        type: "api",
        title: "Attributes",
        rows: [
          { ...COMMON_API[0]!, default: "teal", description: "The fill the ball pulls behind it." },
          { name: "threshold", type: "number", default: "0.9", description: "Share of the groove the ball must pass for letting go to confirm." },
          { name: "pending-label", type: "string", default: "Working…", description: "Written in the groove while `action` runs." },
          { name: "success-label", type: "string", default: "Done", description: "Written once it succeeds, and announced." },
          { name: "error-label", type: "string", default: "Try again", description: "Written after a failure, and announced." },
          { name: "reset-after", type: "number", default: "0", description: "Milliseconds after a success before the ball rolls home. `0` stays confirmed. An error always resets after 2400 ms." },
        ],
      },
      {
        type: "api",
        title: "Properties and events",
        rows: [
          { name: "action", type: "() => unknown", description: "Runs once the ball reaches the end. A rejected promise shows the error state." },
          { name: "actionState", type: '"idle" | "pending" | "success" | "error"', description: "The current state, also on `data-state`." },
          { name: "statechange", type: "CustomEvent<{ state }>", description: "Fires on the element whenever the state changes." },
        ],
      },
      { type: "h", text: "Accessibility" },
      {
        type: "list",
        items: [
          "It's a real `ui-slider`: arrows, Page Up/Down, Home and End move the ball, and End confirms.",
          "The slider's `aria-label` is both its name and the text written in the groove, so write it as an instruction.",
          "While pending the slider has `aria-busy`; success and error are announced by a status region.",
        ],
      },
    ],
  },
  {
    slug: "tabs",
    group: "components",
    section: "Views and popups",
    title: "Tabs",
    tag: "clay-tabs",
    verb: "Shift",
    signature: "The bead rolls to the view.",
    description:
      "Tabs whose selection is a clay bead rolling along a groove, stretching as it travels. The panel slides in from the side the bead moved. Wraps `ui-tabs`.",
    hero: "tabs-basic",
    blocks: [
      {
        type: "when",
        use: ["Switching between views of the same thing, in place."],
        avoid: ["Choosing a value for a form or a filter: use a segmented control.", "Going to another page: use links."],
      },
      { type: "install" },
      { type: "h", text: "Usage" },
      {
        type: "code",
        title: "index.html",
        code: `<clay-tabs>
  <ui-tabs default-value="songs">
    <ui-tabs-list aria-label="Library">
      <ui-tabs-tab value="songs"><button type="button">Songs</button></ui-tabs-tab>
      <ui-tabs-tab value="albums"><button type="button">Albums</button></ui-tabs-tab>
    </ui-tabs-list>
    <ui-tabs-panel value="songs">…</ui-tabs-panel>
    <ui-tabs-panel value="albums">…</ui-tabs-panel>
  </ui-tabs>
</clay-tabs>`,
      },
      { type: "h", text: "Vertical" },
      { type: "p", text: "Set `orientation=\"vertical\"` on `<ui-tabs>`. The list becomes a column and Up and Down move between tabs." },
      { type: "demo", id: "tabs-vertical", title: "Vertical" },
      { type: "h", text: "API reference" },
      {
        type: "api",
        title: "Attributes",
        rows: [{ ...COMMON_API[0]!, default: "knob", description: "The bead's colour. Text on it takes its tone." }],
      },
      { type: "h", text: "Accessibility" },
      {
        type: "list",
        items: [
          "Arrow keys move between tabs, Home and End jump to the ends, and Tab moves into the panel.",
          "Name the list with `aria-label`. A tab can be a link with `<a href>` when choosing it should navigate.",
        ],
      },
    ],
  },
  {
    slug: "menu",
    group: "components",
    section: "Views and popups",
    title: "Menu",
    tag: "clay-menu",
    verb: "Spill",
    signature: "The list spills out of the button.",
    description:
      "A menu of actions that spills out of its clay button as a soft slab, its items rolling in one after another. Wraps `ui-menu`.",
    hero: "menu-basic",
    blocks: [
      {
        type: "when",
        use: ["Several actions on one thing that don't fit as buttons."],
        avoid: ["Choosing a value: use a select.", "Going to other pages: use links."],
      },
      { type: "install" },
      { type: "h", text: "Usage" },
      {
        type: "code",
        title: "index.html",
        code: `<clay-menu>
  <ui-menu>
    <ui-menu-trigger><button>Track options</button></ui-menu-trigger>
    <ui-menu-content>
      <ui-menu-item value="rename">Rename</ui-menu-item>
      <ui-menu-separator></ui-menu-separator>
      <ui-menu-item value="delete" variant="danger">Delete</ui-menu-item>
    </ui-menu-content>
  </ui-menu>
</clay-menu>`,
      },
      {
        type: "code",
        title: "main.ts",
        code: `document.querySelector("ui-menu")!.addEventListener("action", (event) => {
  run((event as CustomEvent<{ value: string }>).detail.value)
})`,
      },
      { type: "h", text: "Attached" },
      {
        type: "p",
        text: "With `attached`, the menu squeezes out of its button like Roll's bead, stays melted onto it while it's open, and tucks back in when it closes.",
      },
      { type: "demo", id: "menu-attached", title: "Attached" },
      { type: "h", text: "Fuse" },
      {
        type: "p",
        text: "`fuse` sets how far the menu melts into its button, from `0`, a slight waist with a small gap, to `1`, where it sits right on the button and the two read as one body. The joint is smooth at every level. Set it with the slider, then open the menu.",
      },
      { type: "demo", id: "menu-fuse", title: "Fuse" },
      { type: "h", text: "API reference" },
      {
        type: "api",
        title: "Attributes",
        rows: [
          { ...COMMON_API[0]!, default: "neutral", description: "The trigger's colour. The list is always `--clay-popup`." },
          { name: "attached", type: "boolean", description: "Grows the menu out of its button and keeps them melted together while it's open." },
          { name: "fuse", type: "number", default: "0", description: "With `attached`, how far the menu fuses with its button, from 0 to 1. The gap between them closes as it rises; the joint itself is always smooth." },
          { name: "size", type: "sm | md | lg | xl", default: "md", description: "The trigger's height." },
          { name: "icon", type: "boolean", description: "A square trigger, for an icon button with an `aria-label`." },
          { name: "variant", type: '"danger"', description: "On a `<ui-menu-item>`: writes it in the danger colour." },
        ],
      },
      { type: "h", text: "Accessibility" },
      {
        type: "list",
        items: [
          "The trigger opens it with Enter, Space or the arrow keys; arrows move between items, typing jumps to one, and Escape closes it and returns focus.",
          "Checkbox and radio items report their state, and separators aren't focus stops.",
        ],
      },
    ],
  },
  {
    slug: "popover",
    group: "components",
    section: "Views and popups",
    title: "Popover",
    tag: "clay-popover",
    verb: "Unfold",
    signature: "A card unfolds from the button.",
    description: "A small clay card that unfolds from its button, for a few controls or a short message. Wraps `ui-popover`.",
    hero: "popover-basic",
    blocks: [
      {
        type: "when",
        use: ["A short task next to its button: share, a quick setting, a note."],
        avoid: ["A name or a hint: use a tooltip.", "A task that needs full attention: use a dialog."],
      },
      { type: "install" },
      { type: "h", text: "Usage" },
      {
        type: "code",
        title: "index.html",
        code: `<clay-popover color="teal">
  <ui-popover>
    <ui-popover-trigger><button>Share</button></ui-popover-trigger>
    <ui-popover-content>
      <ui-popover-title>Share this playlist</ui-popover-title>
      <ui-popover-description>Anyone with the link can listen.</ui-popover-description>
      <clay-button size="sm" color="teal">
        <ui-popover-close><button>Copy link</button></ui-popover-close>
      </clay-button>
    </ui-popover-content>
  </ui-popover>
</clay-popover>`,
      },
      { type: "h", text: "Attached" },
      {
        type: "p",
        text: "With `attached`, the card squeezes out of its button like Roll's bead, stays melted onto it while it's open, and tucks back in when it closes.",
      },
      { type: "demo", id: "popover-attached", title: "Attached" },
      { type: "h", text: "Fuse" },
      {
        type: "p",
        text: "`fuse` sets how far the card melts into its button, from `0`, a slight waist with a small gap, to `1`, where it sits right on the button and the two read as one body. The joint is smooth at every level. Set it with the slider, then open the card.",
      },
      { type: "demo", id: "popover-fuse", title: "Fuse" },
      { type: "h", text: "API reference" },
      {
        type: "api",
        title: "Attributes",
        rows: [
          { ...COMMON_API[0]!, default: "neutral", description: "The trigger's colour. The card is always `--clay-popup`." },
          { name: "attached", type: "boolean", description: "Grows the card out of its button and keeps them melted together while it's open." },
          { name: "fuse", type: "number", default: "0", description: "With `attached`, how far the card fuses with its button, from 0 to 1. The gap between them closes as it rises; the joint itself is always smooth." },
          { name: "size", type: "sm | md | lg | xl", default: "md", description: "The trigger's height." },
          { name: "icon", type: "boolean", description: "A square trigger, for an icon button with an `aria-label`." },
        ],
      },
      { type: "h", text: "Accessibility" },
      {
        type: "list",
        items: [
          "The card has the dialog role, named by its title and described by its description.",
          "Focus moves into it when it opens; Escape or a press outside closes it and focus returns to the trigger.",
        ],
      },
    ],
  },
  {
    slug: "dialog",
    group: "components",
    section: "Views and popups",
    title: "Dialog",
    tag: "clay-dialog",
    verb: "Lift",
    signature: "A slab lifted off the page.",
    description:
      "A modal dialog: a thick clay slab that drops onto a blurred page and settles with a squash. Wraps `ui-dialog`.",
    hero: "dialog-basic",
    blocks: [
      {
        type: "when",
        use: ["A decision or a short form that needs full attention."],
        avoid: ["News someone can ignore: use a toast.", "A small task by its button: use a popover."],
      },
      { type: "install" },
      { type: "h", text: "Usage" },
      {
        type: "code",
        title: "index.html",
        code: `<clay-dialog>
  <ui-dialog>
    <ui-dialog-trigger><button>Clear history</button></ui-dialog-trigger>
    <ui-dialog-backdrop hidden></ui-dialog-backdrop>
    <ui-dialog-content hidden>
      <ui-dialog-title>Clear listening history?</ui-dialog-title>
      <ui-dialog-description>This can't be undone.</ui-dialog-description>
      <div class="clay-actions">
        <clay-button><ui-dialog-close><button>Keep it</button></ui-dialog-close></clay-button>
        <clay-button color="rose"><ui-dialog-close><button>Clear</button></ui-dialog-close></clay-button>
      </div>
    </ui-dialog-content>
  </ui-dialog>
</clay-dialog>`,
      },
      {
        type: "p",
        text: "`.clay-actions` lines the buttons up at the end. Each close part wraps its own button, so put a `<clay-button>` around it.",
      },
      { type: "h", text: "API reference" },
      {
        type: "api",
        title: "Attributes",
        rows: [
          { ...COMMON_API[0]!, default: "neutral", description: "The trigger's colour. The slab is always `--clay-popup`." },
          { name: "size", type: "sm | md | lg | xl", default: "md", description: "The trigger's height." },
          { name: "icon", type: "boolean", description: "A square trigger, for an icon button with an `aria-label`." },
        ],
      },
      { type: "h", text: "Accessibility" },
      {
        type: "list",
        items: [
          "Focus moves in and stays inside until it closes; Escape closes it and focus returns to the trigger.",
          "The title names it and the description is read with it.",
          "The slab doesn't scroll, so keep the content short.",
        ],
      },
    ],
  },
  {
    slug: "toast",
    group: "components",
    section: "Views and popups",
    title: "Toast",
    tag: "clay-toast-region",
    verb: "Drop",
    signature: "It drops in and squashes.",
    description:
      "Toasts that drop in as clay slabs and squash as they land, tinted by their type. Wraps `ui-toast-region`; call `toast()` from anywhere.",
    hero: "toast-basic",
    blocks: [
      {
        type: "when",
        use: ["Saying that something finished, with an undo if it helps."],
        avoid: ["A question that needs an answer: use a dialog.", "Errors in a form: show them by the field."],
      },
      { type: "install" },
      { type: "h", text: "Usage" },
      { type: "p", text: "Place one region near the root of the page:" },
      {
        type: "code",
        title: "index.html",
        code: `<clay-toast-region>
  <ui-toast-region>
    <template>
      <ui-toast>
        <ui-toast-title></ui-toast-title>
        <ui-toast-description></ui-toast-description>
        <ui-toast-action><button></button></ui-toast-action>
      </ui-toast>
    </template>
  </ui-toast-region>
</clay-toast-region>`,
      },
      {
        type: "code",
        title: "main.ts",
        code: `import { toast } from "claymorph-ui/toast"

toast.success("Playlist saved", { description: "Chill Vibes · 80 songs" })
toast("Added to queue", { action: { label: "Undo", onAction: undo } })`,
      },
      { type: "p", text: "A toast leaves the way it came: it lifts back off and drops toward the edge it came from." },
      { type: "h", text: "Attached stack" },
      {
        type: "p",
        text: "With `attached`, the stack is one body of clay. Each new toast pulls out of the one before it and stays joined by a neck, like Roll's bead; a toast that leaves tucks back into its neighbour along the same path.",
      },
      { type: "demo", id: "toast-attached", title: "Attached stack" },
      {
        type: "note",
        text: "One region per page shows `toast()`. This demo gives its region a queue of its own with `createToaster()`, so it doesn't share toasts with the one above.",
      },
      { type: "h", text: "API reference" },
      {
        type: "api",
        title: "Element attributes",
        rows: [{ name: "attached", type: "boolean", description: "On `<clay-toast-region>`: draws the stack as one body, each toast pulled out of the one before it." }],
      },
      {
        type: "api",
        title: "Functions",
        rows: [
          { name: "toast(title, options?)", type: "string", description: "Shows a toast and returns its id. `options` takes `description`, `action`, `cancel`, `duration` and `type`." },
          { name: "toast.success / error / warning / info", type: "string", description: "The same, with a type. Success, error and warning tint the clay." },
          { name: "toast.dismiss(id?)", type: "void", description: "Closes one toast, or all of them." },
          { name: "createToaster()", type: "Toaster", description: "A queue of its own, for a second region: set it as the region's `toaster`." },
        ],
      },
      {
        type: "api",
        title: "Region attributes",
        rows: [
          { name: "side", type: "top | bottom", default: "bottom", description: "On `<ui-toast-region>`: the edge the toasts drop from." },
          { name: "align", type: "start | center | end", default: "end", description: "On `<ui-toast-region>`: where along that edge." },
        ],
      },
      { type: "h", text: "Accessibility" },
      {
        type: "list",
        items: [
          "Toasts are announced politely; errors interrupt.",
          "F6 moves focus into the region and back. Timers pause while it's hovered or focused.",
        ],
      },
    ],
  },
  {
    slug: "input",
    group: "components",
    section: "Inputs",
    title: "Input",
    tag: "clay-input",
    verb: "Type",
    signature: "Carved into the clay.",
    description:
      "A text field carved into the clay. The well deepens while it's focused, gives a little as you type, and its rim turns red once the value is invalid. Wraps `ui-input`, `ui-input-group` or a `<textarea>`.",
    hero: "input-basic",
    blocks: [
      {
        type: "when",
        use: ["Free text: a search, a name, an email."],
        avoid: ["One of a few options: use radios or a select.", "A value by feel: use a slider."],
      },
      { type: "install" },
      { type: "h", text: "Usage" },
      {
        type: "code",
        title: "index.html",
        code: `<ui-field>
  <ui-field-label>Email</ui-field-label>
  <clay-input>
    <ui-input><input type="email" required /></ui-input>
  </clay-input>
</ui-field>`,
      },
      { type: "p", text: "An icon placed before the input sits inside the well. A search field can wrap `ui-input-group` with a `ui-input-clear` button. While the field has focus, its rim glows in the input's colour." },
      { type: "h", text: "Attached label and hint" },
      {
        type: "p",
        text: "With `attached`, put the `ui-field-label` and `ui-field-description` inside `<clay-input>`. They become small beads melted onto the rim, like the status bead on an avatar. Focus pulls them a little further out. The third field in the demo above shows it.",
      },
      {
        type: "code",
        title: "index.html",
        code: `<ui-field>
  <clay-input attached>
    <ui-field-label>Display name</ui-field-label>
    <ui-input><input value="Aryan" required /></ui-input>
    <ui-field-description>Shown on mixes you share.</ui-field-description>
  </clay-input>
</ui-field>`,
      },
      { type: "h", text: "API reference" },
      {
        type: "api",
        title: "Attributes",
        rows: [
          { ...COMMON_API[0]!, default: "teal", description: "The colour the rim glows while focused." },
          { name: "size", type: "sm | md | lg", default: "md", description: "40, 48 or 56 px tall." },
          { name: "attached", type: "boolean", description: "Draws the `ui-field-label` and `ui-field-description` inside it as beads joined to the rim. Leaves room above and below." },
        ],
      },
      { type: "api", title: "State", rows: [{ name: "data-invalid", type: "attribute", description: "Set while the field matches `:user-invalid` or has `aria-invalid=\"true\"`." }, ...STATE_ROWS] },
      { type: "h", text: "Accessibility" },
      {
        type: "list",
        items: [
          "Name the field with a `ui-field-label`, or with `aria-label` on the input when there's no visible label.",
          "Focus shows as the whole rim glowing. Without WebGL2, and in forced colours, an outline goes around the field instead.",
          "Attached labels and hints are still the field's `ui-field-label` and `ui-field-description`, so they name and describe the input as usual.",
        ],
      },
    ],
  },
  {
    slug: "radio",
    group: "components",
    section: "Inputs",
    title: "Radio group",
    tag: "clay-radio",
    verb: "Pick",
    signature: "A bead hops into the dent.",
    description: "Radios carved as dents in the clay. A bead hops into the one you pick. Wraps `ui-radio-group`.",
    hero: "radio-basic",
    blocks: [
      {
        type: "when",
        use: ["One of two to seven options in a form, all visible at once."],
        avoid: ["Many options: use a select.", "Switching views: use tabs."],
      },
      { type: "install" },
      { type: "h", text: "Usage" },
      {
        type: "code",
        title: "index.html",
        code: `<ui-field>
  <ui-field-label>Audio quality</ui-field-label>
  <clay-radio>
    <ui-radio-group default-value="high">
      <label><ui-radio value="normal"><ui-radio-indicator></ui-radio-indicator></ui-radio>Normal</label>
      <label><ui-radio value="high"><ui-radio-indicator></ui-radio-indicator></ui-radio>High</label>
    </ui-radio-group>
  </clay-radio>
</ui-field>`,
      },
      { type: "h", text: "API reference" },
      {
        type: "api",
        title: "Attributes",
        rows: [
          { ...COMMON_API[0]!, default: "teal", description: "The bead's colour." },
          { name: "orientation", type: "vertical | horizontal", default: "vertical", description: "Lays the options out in a column or a row." },
        ],
      },
      { type: "h", text: "Accessibility" },
      {
        type: "list",
        items: [
          "The group is one tab stop; arrow keys move and check. Wrap each radio with its text in a `<label>`.",
          "A `ui-field-label` names the group; without one, give `<ui-radio-group>` an `aria-label`.",
          "Up to seven radios get dents; more stay plain.",
        ],
      },
    ],
  },
  {
    slug: "progress",
    group: "components",
    section: "Display",
    title: "Progress",
    tag: "clay-progress",
    verb: "Fill",
    signature: "The groove fills with clay.",
    description:
      "A progress bar whose groove fills with a worm of clay. Without a value, a lump rolls back and forth. Wraps `ui-progress`.",
    hero: "progress-basic",
    blocks: [
      {
        type: "when",
        use: ["A task under way: a download, an upload, an install."],
        avoid: ["An amount that isn't a task, like storage used: use a meter."],
      },
      { type: "install" },
      { type: "h", text: "Usage" },
      {
        type: "code",
        title: "index.html",
        code: `<clay-progress>
  <ui-progress value="35">
    <ui-progress-label>Downloading</ui-progress-label>
    <ui-progress-value></ui-progress-value>
    <ui-progress-track><ui-progress-indicator></ui-progress-indicator></ui-progress-track>
  </ui-progress>
</clay-progress>`,
      },
      { type: "p", text: "Set `value` on `<ui-progress>` as the task moves. Leave it out, or set it to `null`, while how far is unknown." },
      { type: "h", text: "API reference" },
      { type: "api", title: "Attributes", rows: [{ ...COMMON_API[0]!, default: "teal", description: "The fill's colour." }] },
      { type: "h", text: "Accessibility" },
      {
        type: "list",
        items: [
          "It's a `progressbar` named by its label, and its value is read from the bar itself.",
          "With reduced motion, an unknown amount shows a still, full groove instead of a rolling lump.",
        ],
      },
    ],
  },
  {
    slug: "meter",
    group: "components",
    section: "Display",
    title: "Meter",
    tag: "clay-meter",
    verb: "Gauge",
    signature: "A level set in clay.",
    description:
      "A meter for a value in a known range, across or upright. Upright meters in a row make a clay bar chart. Wraps `ui-meter`.",
    hero: "meter-basic",
    blocks: [
      {
        type: "when",
        use: ["A measured amount: storage used, battery, hours listened."],
        avoid: ["How far a task has got: use a progress bar."],
      },
      { type: "install" },
      { type: "h", text: "Usage" },
      {
        type: "code",
        title: "index.html",
        code: `<clay-meter color="sky">
  <ui-meter value="72">
    <ui-meter-label>Storage used</ui-meter-label>
    <ui-meter-value></ui-meter-value>
    <ui-meter-track><ui-meter-indicator></ui-meter-indicator></ui-meter-track>
  </ui-meter>
</clay-meter>`,
      },
      {
        type: "p",
        text: "`orientation=\"vertical\"` stands it upright: give the element a height, and the label goes under the groove. Group a row of them with `role=\"group\"` and a name.",
      },
      { type: "h", text: "API reference" },
      {
        type: "api",
        title: "Attributes",
        rows: [
          { ...COMMON_API[0]!, default: "teal", description: "The fill's colour." },
          { name: "orientation", type: "horizontal | vertical", default: "horizontal", description: "Lies across, or stands upright and fills from the bottom." },
        ],
      },
      { type: "h", text: "Accessibility" },
      {
        type: "list",
        items: [
          "Each is a `meter` named by its label, with its value and range.",
          "Charts of meters need a name on the group that says what's measured.",
        ],
      },
    ],
  },
  {
    slug: "avatar",
    group: "components",
    section: "Display",
    title: "Avatar",
    tag: "clay-avatar",
    verb: "Frame",
    signature: "A face set in a clay ring.",
    description: "An avatar set in a clay ring, with an optional status bead melted onto it. Wraps `ui-avatar`.",
    hero: "avatar-basic",
    blocks: [
      {
        type: "when",
        use: ["Showing who someone is, next to their name or what they made."],
        avoid: ["Decorative pictures: use a plain `<img>`."],
      },
      { type: "install" },
      { type: "h", text: "Usage" },
      {
        type: "code",
        title: "index.html",
        code: `<clay-avatar size="lg" status="online">
  <ui-avatar>
    <img src="/mia.png" alt="Mia, online" />
    <ui-avatar-fallback>MI</ui-avatar-fallback>
  </ui-avatar>
</clay-avatar>`,
      },
      { type: "h", text: "API reference" },
      {
        type: "api",
        title: "Attributes",
        rows: [
          { ...COMMON_API[0]!, default: "neutral", description: "The ring's colour." },
          { name: "size", type: "sm | md | lg | xl", default: "md", description: "36, 48, 64 or 96 px across." },
          { name: "status", type: "online | away | busy | offline", description: "Melts a coloured bead onto the ring." },
        ],
      },
      { type: "h", text: "Accessibility" },
      {
        type: "list",
        items: [
          "The image's `alt` names the person. With only a fallback, give `<ui-avatar>` `role=\"img\"` and an `aria-label`.",
          "The status bead is drawn, not read: say the status in the name too.",
        ],
      },
    ],
  },
]

const RELEASES: Release[] = [
  {
    version: "0.4.0",
    date: "2026-11-25",
    title: "Packaged",
    changes: [
      { kind: "new", text: "Claymorph UI installs from npm as `claymorph-ui`, MIT licensed, with `@ui-sdk/web` and `@ui-sdk/core` as peer dependencies." },
      { kind: "new", text: "One entry per element, like `claymorph-ui/select`: it registers that element and the ui-sdk parts it wraps, and bundlers leave out the rest. `claymorph-ui` still registers everything." },
      { kind: "new", text: "Types ship with the package, and each entry adds its element to `HTMLElementTagNameMap`." },
      { kind: "improved", text: "The stylesheet is its own import, `claymorph-ui/clay.css`: importing the elements no longer loads it." },
    ],
  },
  {
    version: "0.3.3",
    date: "2026-11-25",
    title: "Slipped back in",
    changes: [
      { kind: "improved", page: "select", text: "Attached popups squeeze out of a sliver at the trigger's edge in their own colour and only grow outward, so nothing shows through the button or climbs up beside it." },
      { kind: "improved", page: "select", text: "Closing slips the popup into its trigger at a steady pace, and the trigger bounces once it's really back in, not while part of it still shows." },
      { kind: "fixed", page: "menu", text: "A line showed down the trigger's right side while an attached popup was open: the popup kept the button's hover size after the button settled. It follows the button now." },
      { kind: "fixed", page: "popover", text: "A band as wide as the trigger showed along the top of an attached card: the trigger drew its own copy of the card's edge under it." },
      { kind: "fixed", page: "tooltip", text: "An attached tag showed a dark ring where it met its button: the button never drew its side of the joint, because it hadn't set up yet when the tooltip looked for it." },
      { kind: "new", page: "select", text: "`fuse` on attached Pour, Spill, Unfold and Pop, from 0 to 1: how far the popup melts into its trigger, from a slight waist to one body." },
      { kind: "new", text: "Shapes can be a `flatten` patch: it smooths the crease where two melted parts meet without changing their outline." },
      { kind: "improved", page: "select", text: "Attached joints are always smooth in Pour, Spill, Unfold and Pop: the trigger's edge no longer shades a line where the popup meets it, at any `fuse`." },
      { kind: "fixed", page: "tooltip", text: "A dark line flickered at the joint while a tag came out or went back in, and closing soon after opening hid the tag before its clay had tucked in." },
      { kind: "improved", page: "select", text: "Every attached part melts deeper into what it's attached to, as Pop's tag does: Pour, Spill and Unfold flow out of their trigger, an attached toast stack reads as one slab, and Type's label and hint flow into its rim, instead of a shaded line between them." },
      { kind: "fixed", page: "menu", text: "The option highlight fades out whole when the pointer leaves the list, instead of flattening to a rim that popped away." },
      { kind: "fixed", page: "toast", text: "Toasts glide to their new place when one arrives or leaves, instead of jumping, and an attached stack no longer clips the toast that's left once its neighbour has tucked in." },
    ],
  },
  {
    version: "0.3.2",
    date: "2026-11-25",
    title: "Tucked in",
    changes: [
      { kind: "improved", page: "select", text: "Attached popups blend their colour into the trigger's across the joint, so a teal button and a gray list melt into each other instead of meeting at a line." },
      { kind: "improved", page: "select", text: "Closing eases the popup all the way back into its trigger, which gives a little bounce as it lands." },
      { kind: "improved", page: "select", text: "Pour shows the chosen value once the list has gone, on the trigger's bounce." },
      { kind: "new", page: "select", text: "A well slides between options under the pointer in Pour and Spill, instead of the highlight jumping." },
      { kind: "fixed", page: "menu", text: "The trigger no longer shifts under an open attached popup as the pointer leaves it: it holds still while the popup is out." },
      { kind: "fixed", page: "toast", text: "A new attached toast dulled its neighbour while it came out of it, and the first toast of a stack showed its CSS look for a moment." },
    ],
  },
  {
    version: "0.3.1",
    date: "2026-11-25",
    title: "Melted on",
    changes: [
      { kind: "new", page: "select", text: "`attached` on Pour, Spill and Unfold: the popup squeezes out of its trigger like Roll's bead and tucks back in." },
      { kind: "improved", page: "tooltip", text: "Attached parts melt straight into their body like a button group's parts, and the trigger melts into the popup too, so the joint has no ridge and no seam." },
      { kind: "improved", page: "menu", text: "Tucking back in settles without overshooting, so the clay can't flicker as a popup or toast closes." },
      { kind: "improved", page: "select", text: "The chosen value is wiped in out of a blur, starting before the new text is ever painted." },
      { kind: "fixed", page: "dialog", text: "The backdrop flashed back for a frame as a dialog finished closing; popups did the same." },
      { kind: "fixed", page: "select", text: "Attached popups: the trigger kept a lump after closing, showed a hole while the popup came out, and bulged in its own colour for a few frames before the popup's clay drew." },
      { kind: "fixed", page: "popover", text: "Unfold's card faded and slid its own clay along with its text, so it showed late and faint." },
      { kind: "fixed", page: "select", text: "A popup no longer flashes its CSS clay for the frame it first opens on." },
    ],
  },
  {
    version: "0.3.0",
    date: "2026-11-25",
    title: "Attached",
    changes: [
      { kind: "new", page: "input", text: "`attached` on Type: the label and hint become beads pulled out of the rim, joined by a neck." },
      { kind: "new", page: "toast", text: "`attached` on Drop: the stack is one body, each toast pulled out of the one before it." },
      { kind: "new", page: "tooltip", text: "`attached` on Pop: the tag grows out of its button and tucks back in." },
      { kind: "improved", page: "input", text: "Type's focus is its own rim glowing instead of an outline." },
      { kind: "improved", page: "toast", text: "Toasts leave the way they came in." },
      { kind: "improved", page: "select", text: "The chosen value rolls into Pour's button instead of swapping at once." },
      { kind: "fixed", page: "dialog", text: "Lift's slab stayed at the top of the page when it was opened from further down." },
    ],
  },
  {
    version: "0.2.0",
    date: "2026-11-25",
    title: "More clay",
    changes: [
      { kind: "new", page: "toggle", text: "Latch, Fuse and Drag: toggles, fused button groups and slide to confirm." },
      { kind: "new", page: "tabs", text: "Shift, Spill, Unfold, Lift and Drop: tabs, menus, popovers, dialogs and toasts." },
      { kind: "new", page: "input", text: "Type and Pick: text fields carved into the clay, and radios a bead hops between." },
      { kind: "new", page: "avatar", text: "Frame, Fill and Gauge: avatars, progress bars and meters, upright meters make bar charts." },
      { kind: "improved", text: "Shapes melted into one body now blend their height too, so one part can dent while the rest stays raised. Up to 16 shapes per surface." },
      { kind: "improved", text: "The showcase is rebuilt from the components alone." },
    ],
  },
  {
    version: "0.1.0",
    date: "2026-11-24",
    title: "First clay",
    changes: [
      { kind: "new", text: "One shared WebGL2 engine with clay shading, melting shapes and a CSS fallback." },
      { kind: "new", page: "button", text: "Press, Roll, Slide, Flip, Tick, Stretch, Pour, Hold, Stamp and Pop." },
      { kind: "new", text: "Docs with live demos, a Playground for the material, llms.txt and a skill." },
    ],
  },
]

const ORDER = [
  "button", "action-button", "toggle", "button-group", "slide-confirm",
  "input", "segmented", "switch", "checkbox", "radio", "slider", "select",
  "tabs", "menu", "popover", "dialog", "tooltip", "toast",
  "card", "badge", "avatar", "progress", "meter",
]

const componentPages = () =>
  PAGES.filter((page) => page.group === "components").sort((a, b) => ORDER.indexOf(a.slug) - ORDER.indexOf(b.slug))

/** Every page in reading order: the guides, then the components by section. */
const orderedPages = () => [...PAGES.filter((page) => page.group === "start"), ...componentPages()]

export { componentPages, orderedPages, PAGES, RELEASES, SECTIONS, SITE, type Block, type DocPage, type Release, type Row }
