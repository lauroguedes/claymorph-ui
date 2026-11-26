export default function setup(root: HTMLElement) {
  const dialog = root.querySelector("ui-dialog") as HTMLElement & { open: boolean }
  // Running a command closes the palette, which hands focus back to its button.
  root.querySelector("ui-command")!.addEventListener("action", () => {
    dialog.open = false
  })
}
