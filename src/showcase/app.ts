import { toast, type ClayActionButton, type ClaySlideConfirm } from "../clay"
import { days, listening, time, tracks } from "./data"
import { markup, sections, trackRow } from "./markup"

type Detail<T> = CustomEvent<{ value: T }>
type Toggle = HTMLElement & { pressed: boolean }
type Valued = HTMLElement & { value: number | number[] | null }

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

const copy = (text: string) => navigator.clipboard?.writeText(text).catch(() => undefined)

/** Renders the music app into `root` and wires it up. Returns a function that stops its timers. */
function renderShowcase(root: HTMLElement, { dark = false } = {}) {
  root.innerHTML = markup(dark)
  const $ = <T extends HTMLElement = HTMLElement>(selector: string) => root.querySelector<T>(selector)!
  const $$ = <T extends HTMLElement = HTMLElement>(selector: string, scope: ParentNode = root) => [
    ...scope.querySelectorAll<T>(selector),
  ]
  const stops: Array<() => void> = []

  const tabs = $<HTMLElement & { value: string }>("ui-tabs")
  const title = $("[data-title]")
  const show = (id: string) => {
    tabs.value = id
    title.textContent = sections.find((section) => section.id === id)?.label ?? ""
  }
  tabs.addEventListener("valuechange", (event) => show((event as Detail<string>).detail.value))

  if (typeof matchMedia === "function") {
    const narrow = matchMedia("(max-width: 960px)")
    const orient = () => tabs.setAttribute("orientation", narrow.matches ? "horizontal" : "vertical")
    narrow.addEventListener("change", orient)
    stops.push(() => narrow.removeEventListener("change", orient))
    orient()
  }

  // The player.
  const playing = $<Toggle>("[data-playing]")
  const position = $<Valued>("[data-position]")
  const mix = $("[data-mix]").closest<Toggle>("ui-toggle")!
  const [shuffle, repeat] = $$<Toggle>(".extras ui-toggle")
  let current = 0
  let elapsed = 0
  let timer = 0

  const paint = () => {
    $("[data-elapsed]").textContent = time(elapsed)
    if (!position.hasAttribute("data-dragging")) position.value = elapsed
  }

  const run = (on: boolean) => {
    clearInterval(timer)
    root.toggleAttribute("data-is-playing", on)
    mix.pressed = on && tracks[current]!.id === "night-swim"
    if (!on) return
    timer = window.setInterval(() => {
      elapsed += 1
      if (elapsed >= tracks[current]!.length) next()
      else paint()
    }, 1000)
  }

  const setPlaying = (on: boolean) => {
    playing.pressed = on
    run(on)
  }

  const load = (index: number, autoplay = true) => {
    current = (index + tracks.length) % tracks.length
    const track = tracks[current]!
    $<HTMLImageElement>("[data-now-cover]").src = track.cover
    $("[data-now-title]").textContent = track.title
    $("[data-now-artist]").textContent = track.artist
    $("[data-total]").textContent = time(track.length)
    position.setAttribute("max", String(track.length))
    elapsed = 0
    paint()
    if (autoplay) setPlaying(true)
  }

  const next = () => {
    if (repeat?.pressed) return load(current)
    if (shuffle?.pressed) return load(current + 1 + Math.floor(Math.random() * (tracks.length - 1)))
    load(current + 1)
  }

  playing.addEventListener("pressedchange", (event) => run((event as Detail<boolean>).detail.value))
  position.addEventListener("valuechange", (event) => {
    const value = (event as Detail<number>).detail.value
    elapsed = Array.isArray(value) ? value[0]! : value
    $("[data-elapsed]").textContent = time(elapsed)
  })
  $("[data-prev]").addEventListener("click", () => (elapsed > 3 ? load(current) : load(current - 1)))
  $("[data-next]").addEventListener("click", next)
  mix.addEventListener("pressedchange", (event) => {
    if ((event as Detail<boolean>).detail.value) load(tracks.findIndex((track) => track.id === "night-swim"))
    else setPlaying(false)
  })
  root.addEventListener("click", (event) => {
    const button = (event.target as Element).closest<HTMLElement>("[data-play]")
    if (button) load(tracks.findIndex((track) => track.id === button.dataset.play))
  })
  stops.push(() => clearInterval(timer))

  // Listening chart and genres.
  const meters = $$<Valued>("[data-chart] ui-meter")
  $("[data-period]").addEventListener("valuechange", (event) => {
    const hours = listening[(event as Detail<string>).detail.value]
    hours?.forEach((value, index) => {
      meters[index]!.value = value
      meters[index]!.setAttribute("aria-label", `${days[index]}: ${value} hours`)
    })
  })
  meters.forEach((meter, index) => meter.setAttribute("aria-label", `${days[index]}: ${listening.week![index]} hours`))

  // Tracks: likes, menus, the liked list and search.
  const recent = $("[data-recent]")
  const liked = $("[data-liked]")

  const renderLiked = () => {
    const list = tracks.filter((track) => track.liked)
    liked.innerHTML = list.map(trackRow).join("")
    $("[data-liked-empty]").hidden = list.length > 0
    wire(liked)
  }

  const like = (id: string, on: boolean) => {
    const track = tracks.find((item) => item.id === id)
    if (!track || track.liked === on) return
    track.liked = on
    for (const button of $$(`[data-like="${id}"]`)) {
      const toggle = button.closest<Toggle>("ui-toggle")!
      if (toggle.pressed !== on) toggle.pressed = on
    }
    renderLiked()
    toast(on ? "Added to Liked songs" : "Removed from Liked songs", { description: track.title })
  }

  function wire(scope: HTMLElement) {
    for (const button of $$("[data-like]", scope)) {
      button.closest("ui-toggle")!.addEventListener("pressedchange", (event) =>
        like(button.dataset.like!, (event as Detail<boolean>).detail.value)
      )
    }
    for (const menu of $$("[data-track-menu]", scope)) {
      menu.addEventListener("action", (event) => {
        const track = tracks.find((item) => item.id === menu.dataset.trackMenu)!
        const value = (event as Detail<string>).detail.value
        if (value === "queue") toast("Added to queue", { description: `${track.title} plays next` })
        if (value === "share") {
          copy(`https://clay.fm/t/${track.id}`)
          toast.success("Link copied", { description: track.title })
        }
        if (value === "remove") {
          const row = menu.closest("li")!
          const after = row.nextElementSibling
          const list = row.parentElement!
          row.remove()
          filter()
          toast("Removed from history", {
            description: track.title,
            action: { label: "Undo", onAction: () => (list.insertBefore(row, after), filter()) },
          })
        }
      })
    }
  }
  wire(recent)
  renderLiked()

  const search = $<HTMLInputElement>("[data-search]")
  const filter = () => {
    const query = search.value.trim().toLowerCase()
    let shown = 0
    for (const row of $$("li", recent)) {
      const match = !query || row.textContent!.toLowerCase().includes(query)
      row.hidden = !match
      if (match) shown++
    }
    $("[data-empty]").hidden = shown > 0
  }
  search.addEventListener("input", () => {
    if (tabs.value !== "home") show("home")
    filter()
  })
  search.addEventListener("search", filter)

  $("[data-play-liked]").addEventListener("click", () => {
    const first = tracks.findIndex((track) => track.liked)
    if (first >= 0) load(first)
  })

  // Top bar.
  $("[data-theme-toggle]").addEventListener("pressedchange", (event) => {
    const theme = (event as Detail<boolean>).detail.value ? "dark" : "light"
    document.documentElement.dataset.theme = theme
    try {
      localStorage.setItem("clay-theme", theme)
    } catch {}
  })
  $("[data-bell]").addEventListener("click", () =>
    toast("3 new releases", {
      description: "From JVKE, Beabadoobee and Lofi Chill",
      action: { label: "Open", onAction: () => show("library") },
    })
  )
  const signOut = $<HTMLElement & { open: boolean }>("[data-sign-out]")
  $("[data-account]").addEventListener("action", (event) => {
    const value = (event as Detail<string>).detail.value
    if (value === "settings") show("settings")
    if (value === "premium") $("[data-upgrade] button").focus()
    if (value === "sign-out") signOut.open = true
  })
  $("[data-confirm-sign-out]").addEventListener("click", () =>
    toast("Signed out", { description: "This is a demo, so you're still here." })
  )
  $("[data-copy-link]").addEventListener("click", () => {
    copy("https://clay.fm/mix/aryan-evening")
    toast.success("Link copied", { description: "Your evening mix" })
  })

  // Actions that take a moment.
  $<ClayActionButton>("[data-upgrade]").action = async () => {
    await wait(1500)
    const plan = $("[data-plan]")
    plan.textContent = "Premium"
    plan.setAttribute("color", "mint")
    toast.success("Welcome to Premium", { description: "Lossless audio is on." })
  }

  const roadTrip = $<Valued>("[data-road-trip] ui-progress")
  $<ClayActionButton>("[data-download]").action = async () => {
    for (let value = 0; value <= 100; value += 10) {
      roadTrip.value = value
      await wait(180)
    }
    toast.success("Road Trip downloaded", { description: "42 songs, ready offline" })
  }

  const name = $<HTMLInputElement>("[data-name]")
  $<ClayActionButton>("[data-save]").action = async () => {
    await wait(700)
    if (!name.value.trim()) {
      toast.error("Add a display name", { description: "It shows on your shared mixes." })
      throw new Error("name")
    }
    $(".hello").textContent = `Hi, ${name.value.trim()}!`
    toast.success("Settings saved")
  }

  $<ClaySlideConfirm>("[data-wipe]").action = async () => {
    await wait(1200)
    for (const row of $$("li", recent)) row.remove()
    filter()
    $("[data-empty]").textContent = "Nothing played yet."
    toast("Listening history deleted")
  }

  return () => stops.forEach((stop) => stop())
}

export { renderShowcase }
