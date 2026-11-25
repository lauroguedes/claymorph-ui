const scripts = import.meta.glob<(root: HTMLElement) => void>("./demos/*.ts", { import: "default", eager: true })

/** Runs each demo's script on its stage, in the browser. */
function mountDemos(root: ParentNode) {
  for (const stage of root.querySelectorAll<HTMLElement>("[data-demo]")) {
    scripts[`./demos/${stage.dataset.demo}.ts`]?.(stage)
  }
}

export { mountDemos }
