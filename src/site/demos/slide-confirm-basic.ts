import type { ClaySlideConfirm } from "claymorph-ui/slide-confirm"

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export default function setup(root: HTMLElement) {
  root.querySelector<ClaySlideConfirm>("clay-slide-confirm")!.action = () => wait(1400)
}
