import type { ClayActionButton } from "claymorph-ui/action-button"

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export default function setup(root: HTMLElement) {
  const send = root.querySelector<ClayActionButton>("clay-action-button")!
  send.action = async () => {
    await wait(1200)
    throw new Error("The server is unreachable")
  }
}
