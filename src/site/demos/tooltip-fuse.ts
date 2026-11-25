export default function setup(root: HTMLElement) {
  const tooltips = [...root.querySelectorAll<HTMLElement>("clay-tooltip")]
  const tips = [...root.querySelectorAll<HTMLElement & { open: boolean }>("ui-tooltip")]
  // The tags stay out while the demo is on screen, so you can try the levels; off screen they close,
  // or they'd float over the page in the top layer.
  let shown = false
  for (const tip of tips) {
    tip.addEventListener("openchange", (event) => {
      if (shown && !(event as CustomEvent<{ value: boolean }>).detail.value) event.preventDefault()
    })
  }
  new IntersectionObserver(([entry]) => {
    shown = entry!.isIntersecting
    for (const tip of tips) tip.open = shown
  }).observe(root.querySelector(".tooltip-fuse-row")!)
  root.querySelector("ui-slider")!.addEventListener("valuechange", (event) => {
    const fuse = String((event as CustomEvent<{ value: number }>).detail.value)
    for (const tooltip of tooltips) tooltip.setAttribute("fuse", fuse)
  })
}
