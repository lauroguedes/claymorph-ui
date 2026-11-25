type Progress = HTMLElement & { value: number | null }

export default function setup(root: HTMLElement) {
  const download = root.querySelector<Progress>("ui-progress[value]")!
  const timer = setInterval(() => {
    if (!download.isConnected) return clearInterval(timer)
    download.value = download.value !== null && download.value < 100 ? Math.min(100, download.value + 7) : 0
  }, 700)
}
