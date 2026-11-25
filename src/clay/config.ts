const CLAY = {
  pillow: 0.9,
  steep: 0.85,
  wrap: 0.45,
  subsurface: 0.42,
  ambient: 0.36,
  sheen: 0.14,
  sheenPower: 12,
  rim: 0.16,
  grain: 0.05,
  shadow: 0.32,
  shadowBlur: 16,
  shadowOffset: 9,
  contact: 0.3,
  lightX: -0.45,
  lightY: -0.7,
  lightZ: 0.95,
  pointerLean: 0.4,
  pointerSheen: 0.7,
  glow: 0.22,
  hoverSwell: 0.03,
  pressSquash: 0.07,
}

const SPRINGS = {
  hover: { omega: 17, zeta: 0.42 },
  press: { omega: 16, zeta: 0.55 },
  travel: { omega: 15, zeta: 0.6 },
  morph: { omega: 13, zeta: 0.62 },
  settle: { omega: 9, zeta: 0.75 },
}

type ClayConfig = typeof CLAY

const CLAY_DEFAULTS: ClayConfig = { ...CLAY }

export { CLAY, CLAY_DEFAULTS, SPRINGS, type ClayConfig }
