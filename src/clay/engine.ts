import { CLAY } from "./config"
import type { RGB } from "./color"

const MAX_SHAPES = 16

interface ClayShape {
  x: number
  y: number
  w: number
  h: number
  radius: number
  color: RGB
  /** Positive bulges out, negative is a pressed-in well, 0 is flat. */
  height: number
  /** Melts into the previous shape with this smoothing radius in px. 0 keeps it separate. */
  melt?: number
  /** Shadow size multiplier; 0 casts none. */
  lift?: number
  /** Width of the rounded edge in px. Defaults to the pillow share of the short side. */
  bevel?: number
  /** Lights the clay from inside and haloes it in its own colour, 0 to 1. */
  glow?: number
  /**
   * Others melt into it but it isn't drawn, and nothing is drawn over it except a solid shape listed
   * before it: for a part that draws itself elsewhere, like the button a popup grows out of.
   */
  ghost?: boolean
  /** False keeps it out of the shadow, for a part whose own surface casts one, like a popup melted into its button. */
  shadow?: boolean
  /** How far its colour and height reach into the shapes melted with it, in px. Defaults to a crisp 3. */
  blend?: number
  /** Fades it, with the shapes melted into it, from 0 to 1. Set on the first shape of a melted group. */
  opacity?: number
  /**
   * Not a part but a soft patch, 0 to 1, that flattens the clay melted under it: where two melted parts
   * meet, it smooths away the crease between them and leaves the colour blend. Give it a melt so it
   * joins their group; its blend softens its edge.
   */
  flatten?: number
}

interface ClayFrame {
  shapes: ClayShape[]
  pointer: { x: number; y: number; strength: number } | null
  glow: number
  light: [number, number, number]
}

interface ClayView {
  canvas: HTMLCanvasElement
  ctx: CanvasRenderingContext2D
  pad: number
  width: number
  height: number
  visible: boolean
  dirty: boolean
  key: string
  tick(dt: number, still: boolean): boolean
  frame(): ClayFrame
  drawn(): void
  lost(): void
}

const VERTEX = `#version 300 es
void main() {
  vec2 p = vec2((gl_VertexID << 1) & 2, gl_VertexID & 2);
  gl_Position = vec4(p * 2.0 - 1.0, 0.0, 1.0);
}`

const FRAGMENT = `#version 300 es
precision highp float;
#define MAX ${MAX_SHAPES}
uniform vec2 uSize;
uniform float uDpr;
uniform float uPad;
uniform int uCount;
uniform vec4 uRect[MAX];
uniform float uRadius[MAX];
uniform vec3 uColor[MAX];
uniform float uHeight[MAX];
uniform float uMelt[MAX];
uniform float uLift[MAX];
uniform float uBevel[MAX];
uniform float uShine[MAX];
uniform float uGhost[MAX];
uniform float uBlend[MAX];
uniform float uOpacity[MAX];
uniform float uFlat[MAX];
uniform vec3 uLight;
uniform vec3 uPointer;
uniform float uGlow;
uniform vec4 uMat;
uniform vec4 uGloss;
uniform vec4 uShade;
uniform float uSteep;
out vec4 outColor;

float hash(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1, 0)), f.x), mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), f.x), f.y);
}

float smin(float a, float b, float k) {
  if (k <= 0.0) return min(a, b);
  float h = clamp(0.5 + 0.5 * (b - a) / k, 0.0, 1.0);
  return mix(b, a, h) - k * h * (1.0 - h);
}

float shape(vec2 p, int i) {
  vec4 r = uRect[i];
  vec2 h = r.zw * 0.5;
  float rr = min(uRadius[i], min(h.x, h.y));
  vec2 q = abs(p - r.xy - h) - h + rr;
  return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - rr;
}

float group(vec2 p, int a, int b) {
  float d = shape(p, a);
  for (int i = 1; i < MAX; i++) {
    if (i <= a) continue;
    if (i > b) break;
    if (uFlat[i] > 0.0) continue;
    d = smin(d, shape(p, i), uMelt[i]);
  }
  return d;
}

float solid(vec2 p, int a, int b) {
  float d = 1e5;
  for (int i = 0; i < MAX; i++) {
    if (i < a) continue;
    if (i > b) break;
    if (uGhost[i] > 0.25 || uFlat[i] > 0.0) continue;
    d = d > 9e4 ? shape(p, i) : smin(d, shape(p, i), uMelt[i]);
  }
  return d;
}

void main() {
  vec2 p = vec2(gl_FragCoord.x, uSize.y - gl_FragCoord.y) / uDpr - uPad;
  vec3 l = normalize(uLight);
  vec4 acc = vec4(0.0);
  int a = 0;
  for (int g = 0; g < MAX; g++) {
    if (a >= uCount) break;
    int b = a;
    for (int j = 1; j < MAX; j++) {
      if (j <= a) continue;
      if (j >= uCount || uMelt[j] <= 0.0) break;
      b = j;
    }
    float bevel = 0.0;
    for (int j = 0; j < MAX; j++) {
      if (j < a) continue;
      if (j > b) break;
      if (uFlat[j] > 0.0) continue;
      vec2 h = uRect[j].zw * 0.5;
      bevel = max(bevel, uBevel[j] > 0.0 ? uBevel[j] : min(h.x, h.y) * uMat.x);
    }
    bevel = max(bevel, 1.0);
    float lift = 0.0;
    float shine = 0.0;
    vec3 shineColor = vec3(0.0);
    for (int j = 0; j < MAX; j++) {
      if (j < a) continue;
      if (j > b) break;
      lift = max(lift, uLift[j]);
      if (uShine[j] > shine) {
        shine = uShine[j];
        shineColor = uColor[j];
      }
    }

    if (uHeight[a] > 0.0 && lift > 0.0) {
      vec2 away = -l.xy / max(length(l.xy), 1e-3);
      vec2 off = away * uShade.z * lift;
      float blur = uShade.y * lift;
      float far = 1.0 - smoothstep(-blur * 0.6, blur, solid(p - off, a, b));
      float near = 1.0 - smoothstep(-1.5, 2.0 + lift * 1.5, solid(p - off * 0.18, a, b));
      float s = clamp(far * uShade.x + near * uShade.w * (1.0 - far * uShade.x), 0.0, 0.9) * uOpacity[a];
      vec3 tint = mix(vec3(0.05, 0.08, 0.14), uColor[a] * 0.35, 0.45);
      acc = vec4(tint * s, s) + acc * (1.0 - s);
    }

    float d = group(p, a, b);
    if (shine > 0.0) {
      float halo = shine * 0.6 * exp(-max(d, 0.0) / 7.0) * smoothstep(-1.0, 1.0, d) * uOpacity[a];
      vec3 hc = mix(shineColor, vec3(1.0), 0.25);
      acc = vec4(hc * halo, halo) + acc * (1.0 - halo);
    }
    float aa = max(fwidth(d), 0.5 / uDpr);
    float alpha = clamp(0.5 - d / aa, 0.0, 1.0) * uOpacity[a];
    if (alpha > 0.0) {
      vec2 e = vec2(0.5, 0.0);
      vec2 grad = vec2(group(p + e.xy, a, b) - group(p - e.xy, a, b), group(p + e.yx, a, b) - group(p - e.yx, a, b));
      grad /= max(length(grad), 1e-4);

      vec3 base = vec3(0.0);
      float height = 0.0;
      float lit = 0.0;
      float total = 0.0;
      float flatness = 0.0;
      for (int j = 0; j < MAX; j++) {
        if (j < a) continue;
        if (j > b) break;
        float w = 1.0 / (1.0 + exp(shape(p, j) / uBlend[j]));
        if (uFlat[j] > 0.0) {
          flatness = max(flatness, uFlat[j] * w);
          continue;
        }
        base += uColor[j] * w;
        height += uHeight[j] * w;
        lit += uShine[j] * w;
        total += w;
      }
      base /= total;
      height = height / total * (1.0 - flatness);
      lit /= total;

      float t = clamp(-d / bevel, 0.0, 1.0);
      float s = 1.0 - t;
      float slope = min(s / sqrt(max(1.0 - s * s, 1e-3)), 6.0);
      vec3 n = vec3(grad * slope * height * uSteep, 1.0);
      n.xy += (vec2(noise(p * 0.35), noise(p * 0.35 + 17.0)) - 0.5) * uGloss.w;
      n = normalize(n);

      float ndl = dot(n, l);
      float wrap = clamp((ndl + uMat.y) / (1.0 + uMat.y), 0.0, 1.0);
      vec3 c = base * (uMat.w + (1.0 - uMat.w) * wrap);
      c += base * base * uMat.z * smoothstep(0.0, 0.75, 1.0 - abs(ndl));
      vec3 hv = normalize(l + vec3(0.0, 0.0, 1.0));
      c += vec3(1.0, 0.98, 0.95) * uGloss.x * pow(max(dot(n, hv), 0.0), uGloss.y);
      c += vec3(0.92, 0.96, 1.0) * uGloss.z * pow(1.0 - n.z, 2.5) * max(dot(n.xy, l.xy) * 0.5 + 0.5, 0.25);
      if (height < 0.0) c *= mix(0.78, 1.0, smoothstep(0.0, 1.0, t));
      c += (base * 0.35 + 0.06) * lit;
      if (uPointer.z > 0.0) {
        float r = bevel * 1.8;
        vec2 dp = p - uPointer.xy;
        c += vec3(1.0) * uPointer.z * exp(-dot(dp, dp) / (r * r)) * n.z * 0.35;
      }
      c = pow(max(c, 0.0), vec3(1.0 / (1.0 + uGlow)));
      acc = vec4(c * alpha, alpha) + acc * (1.0 - alpha);
    }
    a = b + 1;
  }
  // Ghosts cut what's drawn inside them, except where they overlap a solid shape listed before them.
  // They cut a little past their edge, so no rim is left where they meet the copy that draws them, and
  // a solid shape keeps a little more past its own, so the two copies overlap rather than both cut.
  float cut = 0.0;
  float keep = 0.0;
  for (int j = 0; j < MAX; j++) {
    if (j >= uCount) break;
    if (uFlat[j] > 0.0) continue;
    float d = shape(p, j);
    if (uGhost[j] >= 0.75) cut = max(cut, clamp(0.5 - (d - 0.75) * uDpr, 0.0, 1.0) * (1.0 - keep));
    else keep = max(keep, clamp(0.5 - (d - 1.75) * uDpr, 0.0, 1.0));
  }
  outColor = acc * (1.0 - cut);
}`

const UNIFORMS = [
  "uSize", "uDpr", "uPad", "uCount", "uRect", "uRadius", "uColor", "uHeight", "uMelt", "uLift", "uBevel", "uShine", "uGhost", "uBlend", "uOpacity", "uFlat",
  "uLight", "uPointer", "uGlow", "uMat", "uGloss", "uShade", "uSteep",
] as const

type Locations = Record<(typeof UNIFORMS)[number], WebGLUniformLocation | null>

/** 1 melts in but isn't drawn and erases what's under it; 0.5 is drawn but casts no shadow. */
const ghostOf = (s: ClayShape) => (s.ghost ? 1 : s.shadow === false ? 0.5 : 0)

const clampUnit = (value: number) => Math.min(1, Math.max(0, value))

const reducedMotion =
  typeof matchMedia === "function" ? matchMedia("(prefers-reduced-motion: reduce)") : null

class ClayEngine {
  private gl: WebGL2RenderingContext
  private canvas: HTMLCanvasElement
  private program: WebGLProgram | null = null
  private loc = {} as Locations
  private views = new Set<ClayView>()
  private scheduled = false
  private last = 0
  private rect = new Float32Array(MAX_SHAPES * 4)
  private radius = new Float32Array(MAX_SHAPES)
  private color = new Float32Array(MAX_SHAPES * 3)
  private heights = new Float32Array(MAX_SHAPES)
  private melt = new Float32Array(MAX_SHAPES)
  private lift = new Float32Array(MAX_SHAPES)
  private bevel = new Float32Array(MAX_SHAPES)
  private shine = new Float32Array(MAX_SHAPES)
  private ghost = new Float32Array(MAX_SHAPES)
  private blend = new Float32Array(MAX_SHAPES)
  private opacity = new Float32Array(MAX_SHAPES)
  private flat = new Float32Array(MAX_SHAPES)

  constructor(canvas: HTMLCanvasElement, gl: WebGL2RenderingContext) {
    this.canvas = canvas
    this.gl = gl
    canvas.addEventListener("webglcontextlost", (event) => {
      event.preventDefault()
      this.program = null
      for (const view of this.views) view.lost()
    })
    canvas.addEventListener("webglcontextrestored", () => {
      this.compile()
      this.invalidateAll()
    })
  }

  compile() {
    const gl = this.gl
    const make = (type: number, source: string) => {
      const shader = gl.createShader(type)!
      gl.shaderSource(shader, source)
      gl.compileShader(shader)
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.warn("clay:", gl.getShaderInfoLog(shader))
        return null
      }
      return shader
    }
    const vs = make(gl.VERTEX_SHADER, VERTEX)
    const fs = make(gl.FRAGMENT_SHADER, FRAGMENT)
    if (!vs || !fs) return false
    const program = gl.createProgram()!
    gl.attachShader(program, vs)
    gl.attachShader(program, fs)
    gl.linkProgram(program)
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.warn("clay:", gl.getProgramInfoLog(program))
      return false
    }
    this.program = program
    for (const name of UNIFORMS) this.loc[name] = gl.getUniformLocation(program, name)
    return true
  }

  add(view: ClayView) {
    this.views.add(view)
    this.wake()
  }

  remove(view: ClayView) {
    this.views.delete(view)
  }

  invalidateAll() {
    for (const view of this.views) view.dirty = true
    this.wake()
  }

  wake() {
    if (this.scheduled) return
    this.scheduled = true
    requestAnimationFrame(this.frame)
  }

  private frame = (now: number) => {
    this.scheduled = false
    const dt = Math.min(this.last ? (now - this.last) / 1000 : 1 / 60, 1 / 30)
    this.last = now
    const still = reducedMotion?.matches ?? false
    let moving = false
    // Every view moves before any draws: parts drawn on two surfaces, like a popup and its trigger,
    // then show the same frame.
    for (const view of this.views) if (view.tick(dt, still)) moving = true
    for (const view of this.views) if (view.visible) this.draw(view)
    if (moving) this.wake()
    else this.last = 0
  }

  private draw(view: ClayView) {
    if (!this.program || view.width <= 0 || view.height <= 0) return
    const frame = view.frame()
    const dpr = Math.min(devicePixelRatio || 1, 2)
    const cssW = view.width + view.pad * 2
    const cssH = view.height + view.pad * 2
    const devW = Math.max(1, Math.round(cssW * dpr))
    const devH = Math.max(1, Math.round(cssH * dpr))
    const shapes = frame.shapes.slice(0, MAX_SHAPES)
    const key = [
      devW, devH, frame.glow.toFixed(3), frame.light.map((v) => v.toFixed(3)).join(),
      frame.pointer ? `${frame.pointer.x.toFixed(1)},${frame.pointer.y.toFixed(1)},${frame.pointer.strength.toFixed(2)}` : "-",
      ...shapes.map((s) =>
        [s.x, s.y, s.w, s.h, s.radius, s.height, s.melt ?? 0, s.lift ?? 0, s.bevel ?? 0, s.glow ?? 0, ghostOf(s), s.blend ?? 0, s.opacity ?? 1, s.flatten ?? 0, ...s.color]
          .map((v) => v.toFixed(2))
          .join()
      ),
      Object.values(CLAY).join(),
    ].join("|")
    if (!view.dirty && key === view.key) return
    view.key = key
    view.dirty = false

    if (view.canvas.width !== devW || view.canvas.height !== devH) {
      view.canvas.width = devW
      view.canvas.height = devH
    }
    const gl = this.gl
    if (this.canvas.width < devW || this.canvas.height < devH) {
      this.canvas.width = Math.max(this.canvas.width, devW)
      this.canvas.height = Math.max(this.canvas.height, devH)
    }

    this.rect.fill(0)
    shapes.forEach((s, i) => {
      this.rect.set([s.x, s.y, s.w, s.h], i * 4)
      this.radius[i] = s.radius
      this.color.set(s.color, i * 3)
      this.heights[i] = s.height
      this.melt[i] = s.melt ?? 0
      this.lift[i] = s.lift ?? 0
      this.bevel[i] = s.bevel ?? 0
      this.shine[i] = s.glow ?? 0
      this.ghost[i] = ghostOf(s)
      this.blend[i] = Math.max(s.blend ?? 2.86, 0.5)
      this.opacity[i] = clampUnit(s.opacity ?? 1)
      this.flat[i] = clampUnit(s.flatten ?? 0)
    })

    const loc = this.loc
    gl.useProgram(this.program)
    gl.viewport(0, 0, devW, devH)
    gl.enable(gl.SCISSOR_TEST)
    gl.scissor(0, 0, devW, devH)
    gl.clearColor(0, 0, 0, 0)
    gl.clear(gl.COLOR_BUFFER_BIT)
    gl.uniform2f(loc.uSize, devW, devH)
    gl.uniform1f(loc.uDpr, dpr)
    gl.uniform1f(loc.uPad, view.pad)
    gl.uniform1i(loc.uCount, shapes.length)
    gl.uniform4fv(loc.uRect, this.rect)
    gl.uniform1fv(loc.uRadius, this.radius)
    gl.uniform3fv(loc.uColor, this.color)
    gl.uniform1fv(loc.uHeight, this.heights)
    gl.uniform1fv(loc.uMelt, this.melt)
    gl.uniform1fv(loc.uLift, this.lift)
    gl.uniform1fv(loc.uBevel, this.bevel)
    gl.uniform1fv(loc.uShine, this.shine)
    gl.uniform1fv(loc.uGhost, this.ghost)
    gl.uniform1fv(loc.uBlend, this.blend)
    gl.uniform1fv(loc.uOpacity, this.opacity)
    gl.uniform1fv(loc.uFlat, this.flat)
    gl.uniform3f(loc.uLight, ...frame.light)
    gl.uniform3f(
      loc.uPointer,
      frame.pointer?.x ?? 0,
      frame.pointer?.y ?? 0,
      frame.pointer ? frame.pointer.strength * CLAY.pointerSheen : 0
    )
    gl.uniform1f(loc.uGlow, frame.glow)
    gl.uniform4f(loc.uMat, CLAY.pillow, CLAY.wrap, CLAY.subsurface, CLAY.ambient)
    gl.uniform4f(loc.uGloss, CLAY.sheen, CLAY.sheenPower, CLAY.rim, CLAY.grain)
    gl.uniform4f(loc.uShade, CLAY.shadow, CLAY.shadowBlur, CLAY.shadowOffset, CLAY.contact)
    gl.uniform1f(loc.uSteep, CLAY.steep)
    gl.drawArrays(gl.TRIANGLES, 0, 3)

    view.ctx.clearRect(0, 0, devW, devH)
    view.ctx.drawImage(this.canvas, 0, this.canvas.height - devH, devW, devH, 0, 0, devW, devH)
    view.drawn()
  }
}

let engine: ClayEngine | null | undefined

function getClayEngine() {
  if (engine !== undefined) return engine
  engine = null
  if (typeof document === "undefined") return engine
  const canvas = document.createElement("canvas")
  const gl = canvas.getContext("webgl2", { premultipliedAlpha: true, antialias: false, alpha: true })
  if (!gl) return engine
  const created = new ClayEngine(canvas, gl)
  if (!created.compile()) return engine
  engine = created
  const refresh = () => engine?.invalidateAll()
  matchMedia("(prefers-color-scheme: dark)").addEventListener("change", refresh)
  new MutationObserver(refresh).observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-theme", "class", "style"],
  })
  return engine
}

export { getClayEngine, type ClayFrame, type ClayShape, type ClayView }
