export default function setup(root: HTMLElement) {
  const select = root.querySelector("clay-select")!
  root.querySelector("ui-slider")!.addEventListener("valuechange", (event) => {
    select.setAttribute("fuse", String((event as CustomEvent<{ value: number }>).detail.value))
  })
}
