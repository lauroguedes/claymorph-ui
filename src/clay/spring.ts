interface SpringConfig {
  omega: number
  zeta: number
}

class Spring {
  x: number
  v = 0
  target: number

  constructor(value = 0) {
    this.x = value
    this.target = value
  }

  set(value: number) {
    this.x = value
    this.target = value
    this.v = 0
  }

  get moving() {
    return this.x !== this.target || this.v !== 0
  }

  step(dt: number, { omega, zeta }: SpringConfig, still = false) {
    if (still) {
      this.set(this.target)
      return false
    }
    const x0 = this.x - this.target
    const v0 = this.v
    if (zeta < 1) {
      const a = zeta * omega
      const wd = omega * Math.sqrt(1 - zeta * zeta)
      const e = Math.exp(-a * dt)
      const c = Math.cos(wd * dt)
      const s = Math.sin(wd * dt)
      const b = (v0 + a * x0) / wd
      this.x = this.target + e * (x0 * c + b * s)
      this.v = e * (v0 * c - (x0 * wd + a * b) * s)
    } else {
      const e = Math.exp(-omega * dt)
      const b = v0 + omega * x0
      this.x = this.target + (x0 + b * dt) * e
      this.v = (v0 - omega * b * dt) * e
    }
    const scale = Math.max(Math.abs(this.target), 1) * 1e-4
    if (Math.abs(this.x - this.target) < scale && Math.abs(this.v) < scale * 20) {
      this.set(this.target)
      return false
    }
    return true
  }
}

export { Spring, type SpringConfig }
