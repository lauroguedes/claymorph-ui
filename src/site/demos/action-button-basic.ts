import type { ClayActionButton } from "claymorph-ui/action-button"

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export default function setup(root: HTMLElement) {
  const deploy = root.querySelector<ClayActionButton>("clay-action-button")!
  deploy.action = () => wait(1600)
}
