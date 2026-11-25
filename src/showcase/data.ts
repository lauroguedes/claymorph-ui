import { covers } from "../assets/covers"

interface Track {
  id: string
  title: string
  artist: string
  cover: string
  length: number
  liked?: boolean
}

const tracks: Track[] = [
  { id: "sunset-drive", title: "Sunset Drive", artist: "Lofi Chill", cover: covers.sunsetDrive, length: 194, liked: true },
  { id: "golden-hour", title: "Golden Hour", artist: "JVKE", cover: covers.goldenHour, length: 209 },
  { id: "coffee-shop", title: "Coffee Shop", artist: "Beabadoobee", cover: covers.coffeeShop, length: 176, liked: true },
  { id: "night-swim", title: "Night Swim", artist: "Chill Vibes", cover: covers.chillVibes, length: 222 },
]

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

const listening: Record<string, number[]> = {
  week: [2.6, 4.2, 3.4, 4.9, 3.4, 4.6, 3.4],
  last: [3.1, 2.4, 4.4, 3.6, 5.2, 2.8, 4.1],
  average: [3.4, 3.6, 3.2, 4.1, 3.9, 4.8, 4.4],
}

const genres = [
  { label: "Pop", share: 45, color: "sky" },
  { label: "Lo-fi", share: 25, color: "teal" },
  { label: "Hip hop", share: 15, color: "lilac" },
  { label: "Rock", share: 10, color: "peach" },
  { label: "Other", share: 5, color: "mint" },
]

const playlists = [
  { title: "Chill Vibes", count: 80, cover: covers.chillVibes, color: "sky" },
  { title: "Road Trip", count: 42, cover: covers.sunsetDrive, color: "peach" },
  { title: "Focus Flow", count: 64, cover: covers.coffeeShop, color: "mint" },
  { title: "Late Night", count: 27, cover: covers.goldenHour, color: "lilac" },
]

const time = (seconds: number) => `${Math.floor(seconds / 60)}:${String(Math.floor(seconds % 60)).padStart(2, "0")}`

export { days, genres, listening, playlists, time, tracks, type Track }
