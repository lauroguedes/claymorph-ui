import { CLAY, CLAY_DEFAULTS, getClayEngine, type ClayActionButton, type ClayConfig } from "claymorph-ui"
import { escape } from "./code"

interface Knob {
  key: keyof ClayConfig
  label: string
  min: number
  max: number
  step: number
  hint: string
}

const GROUPS: Array<{ title: string; knobs: Knob[] }> = [
  {
    title: "Shape",
    knobs: [
      { key: "pillow", label: "Pillow", min: 0.2, max: 1, step: 0.01, hint: "How much of the shape is rounded edge" },
      { key: "steep", label: "Steepness", min: 0.2, max: 2, step: 0.01, hint: "How sharply the edges fall away" },
    ],
  },
  {
    title: "Light",
    knobs: [
      { key: "lightX", label: "Light from left", min: -1, max: 1, step: 0.01, hint: "Negative is from the left" },
      { key: "lightY", label: "Light from top", min: -1, max: 1, step: 0.01, hint: "Negative is from the top" },
      { key: "lightZ", label: "Light height", min: 0.3, max: 2, step: 0.01, hint: "Lower rakes across the surface" },
      { key: "ambient", label: "Ambient", min: 0, max: 1, step: 0.01, hint: "Light in the shade" },
      { key: "wrap", label: "Wrap", min: 0, max: 1, step: 0.01, hint: "How far light wraps past the edge" },
      { key: "subsurface", label: "Subsurface", min: 0, max: 1, step: 0.01, hint: "Saturated glow at the terminator" },
    ],
  },
  {
    title: "Surface",
    knobs: [
      { key: "sheen", label: "Sheen", min: 0, max: 0.6, step: 0.01, hint: "Broad matte highlight" },
      { key: "sheenPower", label: "Sheen tightness", min: 2, max: 40, step: 1, hint: "Higher is a smaller highlight" },
      { key: "rim", label: "Rim", min: 0, max: 0.6, step: 0.01, hint: "Cool light on the lit edge" },
      { key: "grain", label: "Grain", min: 0, max: 0.3, step: 0.005, hint: "Fingerprint texture" },
    ],
  },
  {
    title: "Shadow",
    knobs: [
      { key: "shadow", label: "Shadow", min: 0, max: 0.8, step: 0.01, hint: "Strength of the cast shadow" },
      { key: "shadowBlur", label: "Softness", min: 2, max: 40, step: 1, hint: "Blur radius in px" },
      { key: "shadowOffset", label: "Distance", min: 0, max: 30, step: 1, hint: "How far it falls, in px" },
      { key: "contact", label: "Contact", min: 0, max: 0.8, step: 0.01, hint: "Dark line where clay meets the ground" },
    ],
  },
  {
    title: "Touch",
    knobs: [
      { key: "hoverSwell", label: "Hover swell", min: 0, max: 0.1, step: 0.005, hint: "Growth under the pointer" },
      { key: "pressSquash", label: "Press squash", min: 0, max: 0.2, step: 0.005, hint: "Flattening when pressed" },
      { key: "glow", label: "Press glow", min: 0, max: 0.8, step: 0.01, hint: "Brightening when pressed" },
      { key: "pointerLean", label: "Light lean", min: 0, max: 1, step: 0.01, hint: "Light leaning toward the pointer" },
      { key: "pointerSheen", label: "Pointer sheen", min: 0, max: 1.5, step: 0.01, hint: "Glow under the pointer" },
    ],
  },
]

const STORE = "clay-playground-v1"

function load() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORE) ?? "{}") as Partial<ClayConfig>
    for (const key of Object.keys(CLAY) as Array<keyof ClayConfig>) {
      if (typeof saved[key] === "number") CLAY[key] = saved[key]!
    }
  } catch {
    // Storage can be unavailable; the defaults stand.
  }
}

function save() {
  try {
    localStorage.setItem(STORE, JSON.stringify(CLAY))
  } catch {
    // Not persisting is fine.
  }
}

const knob = (k: Knob) => `
  <div class="knob" data-key="${k.key}">
    <clay-slider>
      <ui-field>
        <ui-slider default-value="${CLAY[k.key]}" min="${k.min}" max="${k.max}" step="${k.step}" data-knob="${k.key}" aria-label="${escape(k.label)}">
          <div class="clay-slider-head">
            <ui-field-label>${escape(k.label)}</ui-field-label>
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
    <p class="knob-hint">${escape(k.hint)}</p>
  </div>`

function playground() {
  load()
  return `
    <div class="playground">
      <header class="doc-head">
        <p class="eyebrow">Playground</p>
        <h1>Tune the clay</h1>
        <p class="lead">Every knob changes the shader live, for every component on the page. Copy the values and paste them into <code>CLAY</code>.</p>
      </header>
      <div class="playground-body">
        <div class="playground-stage stage">
          <div class="demo-row">
            <clay-button color="teal"><ui-button><button>Press me</button></ui-button></clay-button>
            <clay-button><ui-button><button>Or me</button></ui-button></clay-button>
          </div>
          <div class="demo-row">
            <clay-action-button color="lilac" pending-label="Saving…" success-label="Saved">
              <ui-button><button>Save</button></ui-button>
            </clay-action-button>
            <clay-switch><ui-switch default-checked aria-label="Sample switch"><ui-switch-thumb></ui-switch-thumb></ui-switch></clay-switch>
          </div>
          <clay-segmented>
            <ui-segmented-control aria-label="Sample range" default-value="b">
              <ui-segmented-control-indicator></ui-segmented-control-indicator>
              <ui-segmented-control-item value="a">Day</ui-segmented-control-item>
              <ui-segmented-control-item value="b">Week</ui-segmented-control-item>
              <ui-segmented-control-item value="c">Month</ui-segmented-control-item>
            </ui-segmented-control>
          </clay-segmented>
          <div class="demo-row">
            <clay-card color="mint" class="demo-card"><h3>Hold</h3><p class="demo-stat">34.6</p></clay-card>
            <clay-card color="peach" class="demo-card"><h3>Stamp</h3><p><clay-badge color="butter">New</clay-badge></p></clay-card>
          </div>
        </div>
        <div class="knobs">
          ${GROUPS.map((group) => `<fieldset><legend>${group.title}</legend>${group.knobs.map(knob).join("")}</fieldset>`).join("")}
          <div class="knob-actions">
            <clay-button color="teal" size="sm"><ui-button><button data-action="copy">Copy values</button></ui-button></clay-button>
            <clay-button size="sm"><ui-button><button data-action="reset">Reset all</button></ui-button></clay-button>
          </div>
          <pre class="values"><code data-json></code></pre>
        </div>
      </div>
    </div>`
}

function mountPlayground(root: HTMLElement) {
  const json = root.querySelector<HTMLElement>("[data-json]")!
  const show = () => (json.textContent = JSON.stringify(CLAY, null, 2))
  show()
  const apply = () => {
    getClayEngine()?.invalidateAll()
    save()
    show()
  }
  for (const slider of root.querySelectorAll<HTMLElement & { value: number }>("ui-slider[data-knob]")) {
    const key = slider.dataset.knob as keyof ClayConfig
    slider.addEventListener("valuechange", (event) => {
      const value = (event as CustomEvent<{ value: number }>).detail.value
      CLAY[key] = value
      apply()
    })
  }
  const action = root.querySelector<ClayActionButton>("clay-action-button")
  if (action) action.action = () => new Promise((resolve) => setTimeout(resolve, 1400))
  root.querySelector('[data-action="copy"]')!.closest("ui-button")!.addEventListener("action", async () => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(CLAY, null, 2))
    } catch {
      // The JSON stays visible below to copy by hand.
    }
  })
  root.querySelector('[data-action="reset"]')!.closest("ui-button")!.addEventListener("action", () => {
    Object.assign(CLAY, CLAY_DEFAULTS)
    for (const slider of root.querySelectorAll<HTMLElement & { value: number }>("ui-slider[data-knob]")) {
      const key = slider.dataset.knob as keyof ClayConfig
      slider.value = CLAY[key]
    }
    apply()
  })
}

export { mountPlayground, playground }
