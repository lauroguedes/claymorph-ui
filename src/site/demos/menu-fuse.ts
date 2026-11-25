export default function setup(root: HTMLElement) {
  const menu = root.querySelector("clay-menu")!
  root.querySelector("ui-slider")!.addEventListener("valuechange", (event) => {
    menu.setAttribute("fuse", String((event as CustomEvent<{ value: number }>).detail.value))
  })
}
