import { toast } from "claymorph-ui/toast"

export default function setup(root: HTMLElement) {
  const messages: Record<string, () => void> = {
    saved: () => toast.success("Playlist saved", { description: "Chill Vibes · 80 songs" }),
    info: () =>
      toast("Added to queue", {
        description: "Golden Hour plays next",
        action: { label: "Undo", onAction: () => toast("Removed from queue") },
      }),
    error: () => toast.error("Couldn't sync", { description: "Check your connection and try again." }),
  }
  root.querySelectorAll<HTMLButtonElement>("[data-toast]").forEach((button) =>
    button.addEventListener("click", () => messages[button.dataset.toast!]!())
  )
}
