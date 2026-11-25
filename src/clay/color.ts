type RGB = [number, number, number]

const cache = new Map<string, RGB>()
let probe: CanvasRenderingContext2D | null | undefined

function resolveColor(css: string, fallback: RGB = [0.8, 0.84, 0.88]): RGB {
  const key = css.trim()
  if (!key) return fallback
  const hit = cache.get(key)
  if (hit) return hit
  if (probe === undefined) {
    const canvas = document.createElement("canvas")
    canvas.width = canvas.height = 1
    probe = canvas.getContext("2d", { willReadFrequently: true })
  }
  if (!probe) return fallback
  probe.clearRect(0, 0, 1, 1)
  probe.fillStyle = "#000"
  probe.fillStyle = key
  probe.fillRect(0, 0, 1, 1)
  const [r, g, b] = probe.getImageData(0, 0, 1, 1).data
  const rgb: RGB = [r! / 255, g! / 255, b! / 255]
  if (cache.size > 300) cache.clear()
  cache.set(key, rgb)
  return rgb
}

const luminance = ([r, g, b]: RGB) => {
  const lin = (c: number) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4)
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b)
}

const mix = (a: RGB, b: RGB, t: number): RGB => [
  a[0] + (b[0] - a[0]) * t,
  a[1] + (b[1] - a[1]) * t,
  a[2] + (b[2] - a[2]) * t,
]

export { luminance, mix, resolveColor, type RGB }
