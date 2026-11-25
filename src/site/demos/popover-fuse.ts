export default function setup(root: HTMLElement) {
  const popover = root.querySelector("clay-popover")!
  root.querySelector("ui-slider")!.addEventListener("valuechange", (event) => {
    popover.setAttribute("fuse", String((event as CustomEvent<{ value: number }>).detail.value))
  })
}
