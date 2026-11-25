import { createToaster } from "claymorph-ui/toast"

export default function setup(root: HTMLElement) {
  const toast = createToaster()
  root.querySelector<HTMLElement & { toaster: unknown }>("ui-toast-region")!.toaster = toast
  const messages: Record<string, () => void> = {
    saved: () => toast.success("Playlist saved", { description: "Chill Vibes · 80 songs" }),
    queue: () => toast("Added to queue", { description: "Golden Hour plays next" }),
    error: () => toast.error("Couldn't sync", { description: "Check your connection and try again." }),
  }
  root.querySelectorAll<HTMLButtonElement>("[data-toast]").forEach((button) =>
    button.addEventListener("click", () => messages[button.dataset.toast!]!())
  )
}
