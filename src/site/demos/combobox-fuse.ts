export default function setup(root: HTMLElement) {
  const combobox = root.querySelector("clay-combobox")!
  root.querySelector("ui-slider")!.addEventListener("valuechange", (event) => {
    combobox.setAttribute("fuse", String((event as CustomEvent<{ value: number }>).detail.value))
  })
}
