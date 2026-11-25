import {
  Bell,
  ChartColumn,
  Crown,
  Download,
  Ellipsis,
  Heart,
  House,
  Library,
  ListMusic,
  LogOut,
  Moon,
  Pause,
  Play,
  Repeat,
  Search,
  Settings,
  Share2,
  Shuffle,
  SkipBack,
  SkipForward,
  Sparkles,
  Trash2,
  User,
  Volume2,
  createElement,
  type IconNode,
} from "lucide"
import listener from "../assets/listener.svg"
import plant from "../assets/plant.svg"
import { days, genres, listening, playlists, time, tracks, type Track } from "./data"

const icon = (node: IconNode, className = "") =>
  createElement(node, { "aria-hidden": "true", class: `icon ${className}`.trim() }).outerHTML

const sections = [
  { id: "home", label: "Home", icon: House },
  { id: "library", label: "Library", icon: Library },
  { id: "favorites", label: "Favorites", icon: Heart },
  { id: "settings", label: "Settings", icon: Settings },
]

const checkMark = '<svg viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7" /></svg>'

const playPause = `${icon(Play, "when-paused")}${icon(Pause, "when-playing")}`

function trackRow(track: Track) {
  return `
    <li class="track" data-track="${track.id}">
      <img class="cover" src="${track.cover}" alt="" />
      <div class="track-text">
        <p class="track-title">${track.title}</p>
        <p class="track-artist">${track.artist}</p>
      </div>
      <span class="track-length">${time(track.length)}</span>
      <clay-toggle icon size="sm" color="rose">
        <ui-toggle ${track.liked ? "default-pressed" : ""}>
          <button aria-label="Like ${track.title}" data-like="${track.id}">${icon(Heart)}</button>
        </ui-toggle>
      </clay-toggle>
      <clay-button icon size="sm" color="teal">
        <ui-button><button aria-label="Play ${track.title}" data-play="${track.id}">${icon(Play)}</button></ui-button>
      </clay-button>
      <clay-menu icon size="sm" attached>
        <ui-menu data-track-menu="${track.id}">
          <ui-menu-trigger><button aria-label="More for ${track.title}">${icon(Ellipsis)}</button></ui-menu-trigger>
          <ui-menu-content>
            <ui-menu-item value="queue">${icon(ListMusic)}Add to queue</ui-menu-item>
            <ui-menu-item value="share">${icon(Share2)}Copy link</ui-menu-item>
            <ui-menu-separator></ui-menu-separator>
            <ui-menu-item value="remove" variant="danger">${icon(Trash2)}Remove from history</ui-menu-item>
          </ui-menu-content>
        </ui-menu>
      </clay-menu>
    </li>`
}

const meter = (label: string, value: number, max: number, extra = "") => `
  <clay-meter orientation="vertical" ${extra}>
    <ui-meter value="${value}" max="${max}" data-day="${label}">
      <ui-meter-label>${label}</ui-meter-label>
      <ui-meter-track><ui-meter-indicator></ui-meter-indicator></ui-meter-track>
    </ui-meter>
  </clay-meter>`

const home = () => `
  <section class="hero" aria-labelledby="hero-title">
    <clay-card color="sky" radius="34" class="hero-card">
      <img class="hero-art" src="${listener}" alt="" />
      <div class="hero-copy">
        <h2 id="hero-title">Good evening, Aryan</h2>
        <p>Your mix picked up where you left off.</p>
        <div class="row">
          <clay-button color="teal" size="lg">
            <ui-button><button data-play="sunset-drive">${icon(Play)}Play something</button></ui-button>
          </clay-button>
          <clay-popover attached>
            <ui-popover>
              <ui-popover-trigger><button>${icon(Share2)}Share mix</button></ui-popover-trigger>
              <ui-popover-content>
                <ui-popover-title>Share your evening mix</ui-popover-title>
                <ui-popover-description>Anyone with the link can listen.</ui-popover-description>
                <clay-input size="sm">
                  <ui-input><input aria-label="Mix link" value="clay.fm/mix/aryan-evening" readonly /></ui-input>
                </clay-input>
                <div class="clay-actions">
                  <clay-button size="sm" color="teal">
                    <ui-popover-close><button data-copy-link>Copy link</button></ui-popover-close>
                  </clay-button>
                </div>
              </ui-popover-content>
            </ui-popover>
          </clay-popover>
        </div>
      </div>
      <img class="hero-plant" src="${plant}" alt="" />
    </clay-card>
  </section>

  <section class="stats" aria-label="Your week">
    ${[
      { color: "teal", title: "Songs played", value: "1,248", note: "+16%" },
      { color: "neutral", title: "Favorites", value: "128", note: "+8" },
      { color: "peach", title: "Hours listened", value: "34.6", note: "+6.2" },
      { color: "lilac", title: "Day streak", value: "7", note: "Best yet" },
    ]
      .map(
        (stat) => `
      <clay-card class="stat" color="${stat.color}" radius="26" elevation="1">
        <h3>${stat.title}</h3>
        <p class="stat-value">${stat.value}</p>
        <clay-badge>${stat.note}</clay-badge>
      </clay-card>`
      )
      .join("")}
  </section>

  <div class="split">
    <clay-card class="panel" radius="30">
      <header class="panel-head">
        <h2 id="overview-title">${icon(ChartColumn)}Listening</h2>
        <clay-segmented>
          <ui-segmented-control aria-label="Listening period" default-value="week" data-period>
            <ui-segmented-control-indicator></ui-segmented-control-indicator>
            <ui-segmented-control-item value="week">This week</ui-segmented-control-item>
            <ui-segmented-control-item value="last">Last week</ui-segmented-control-item>
            <ui-segmented-control-item value="average">Average</ui-segmented-control-item>
          </ui-segmented-control>
        </clay-segmented>
      </header>
      <div class="chart" role="group" aria-labelledby="overview-title" data-chart>
        ${listening.week!.map((hours, index) => meter(days[index]!, hours, 6)).join("")}
      </div>
    </clay-card>

    <clay-card class="panel" radius="30">
      <header class="panel-head"><h2>Top genres</h2></header>
      <div class="genres">
        ${genres
          .map(
            (genre) => `
          <clay-meter color="${genre.color}">
            <ui-meter value="${genre.share}">
              <ui-meter-label>${genre.label}</ui-meter-label>
              <ui-meter-value></ui-meter-value>
              <ui-meter-track><ui-meter-indicator></ui-meter-indicator></ui-meter-track>
            </ui-meter>
          </clay-meter>`
          )
          .join("")}
      </div>
    </clay-card>
  </div>

  <div class="split">
    <clay-card class="panel" radius="30">
      <header class="panel-head"><h2 id="recent-title">Recently played</h2></header>
      <ul class="tracks" aria-labelledby="recent-title" data-recent>${tracks.map(trackRow).join("")}</ul>
      <p class="empty" data-empty hidden>Nothing matches your search.</p>
    </clay-card>

    <clay-card class="panel mix" radius="30" color="peach">
      <header class="panel-head"><h2>Daily mix</h2><clay-badge color="butter">${icon(Sparkles)}New</clay-badge></header>
      <img class="mix-cover" src="${playlists[0]!.cover}" alt="" />
      <div class="mix-foot">
        <div>
          <p class="mix-name">Chill Vibes</p>
          <p class="mix-count">80 songs · 4 h 12 min</p>
        </div>
        <clay-toggle icon size="lg" color="teal">
          <ui-toggle><button aria-label="Play Chill Vibes mix" data-mix>${playPause}</button></ui-toggle>
        </clay-toggle>
      </div>
    </clay-card>
  </div>`

const library = () => `
  <div class="playlists">
    ${playlists
      .map(
        (list) => `
      <clay-card class="playlist" color="${list.color}" radius="28" interactive>
        <img src="${list.cover}" alt="" />
        <h3>${list.title}</h3>
        <p>${list.count} songs</p>
        <clay-button size="sm" color="neutral">
          <ui-button><button data-play="${tracks[playlists.indexOf(list)]!.id}">${icon(Play)}Play<span class="clay-sr"> ${list.title}</span></button></ui-button>
        </clay-button>
      </clay-card>`
      )
      .join("")}
  </div>

  <div class="split">
    <clay-card class="panel" radius="30">
      <header class="panel-head"><h2>${icon(Download)}Downloads</h2></header>
      <div class="downloads">
        <clay-progress color="sky">
          <ui-progress value="64">
            <ui-progress-label>Focus Flow</ui-progress-label>
            <ui-progress-value></ui-progress-value>
            <ui-progress-track><ui-progress-indicator></ui-progress-indicator></ui-progress-track>
          </ui-progress>
        </clay-progress>
        <clay-progress color="peach" data-road-trip>
          <ui-progress value="0">
            <ui-progress-label>Road Trip</ui-progress-label>
            <ui-progress-value></ui-progress-value>
            <ui-progress-track><ui-progress-indicator></ui-progress-indicator></ui-progress-track>
          </ui-progress>
        </clay-progress>
        <clay-action-button color="peach" pending-label="Downloading…" success-label="Downloaded" data-download>
          <ui-button><button>Download Road Trip</button></ui-button>
        </clay-action-button>
      </div>
    </clay-card>

    <clay-card class="panel" radius="30">
      <header class="panel-head"><h2>Storage</h2></header>
      <clay-meter color="lilac">
        <ui-meter value="7.2" max="10" data-storage>
          <ui-meter-label>Offline songs</ui-meter-label>
          <ui-meter-value></ui-meter-value>
          <ui-meter-track><ui-meter-indicator></ui-meter-indicator></ui-meter-track>
        </ui-meter>
      </clay-meter>
      <p class="muted">7.2 of 10 GB used on this device.</p>
    </clay-card>
  </div>`

const favorites = () => `
  <clay-card class="panel" radius="30">
    <header class="panel-head">
      <h2 id="liked-title">Liked songs</h2>
      <clay-button-group aria-label="Liked songs playback" color="rose">
        <ui-button><button data-play-liked>${icon(Play)}Play all</button></ui-button>
        <ui-toggle><button aria-label="Shuffle liked songs">${icon(Shuffle)}</button></ui-toggle>
      </clay-button-group>
    </header>
    <ul class="tracks" aria-labelledby="liked-title" data-liked></ul>
    <p class="empty" data-liked-empty hidden>Tap a heart to keep a song here.</p>
  </clay-card>`

const settings = () => `
  <div class="split">
    <clay-card class="panel form" radius="30">
      <header class="panel-head"><h2>Profile and playback</h2></header>
      <ui-field>
        <clay-input attached>
          <ui-field-label>Display name</ui-field-label>
          ${icon(User)}
          <ui-input><input value="Aryan" required data-name /></ui-input>
          <ui-field-description>Shown on mixes you share.</ui-field-description>
        </clay-input>
      </ui-field>
      <ui-field>
        <ui-field-label>Audio quality</ui-field-label>
        <clay-radio orientation="horizontal">
          <ui-radio-group default-value="high">
            <label><ui-radio value="normal"><ui-radio-indicator></ui-radio-indicator></ui-radio>Normal</label>
            <label><ui-radio value="high"><ui-radio-indicator></ui-radio-indicator></ui-radio>High</label>
            <label><ui-radio value="lossless"><ui-radio-indicator></ui-radio-indicator></ui-radio>Lossless</label>
          </ui-radio-group>
        </clay-radio>
      </ui-field>
      <clay-select attached>
        <ui-select default-value="en">
          <ui-select-label>Language</ui-select-label>
          <ui-select-trigger><button><ui-select-value></ui-select-value></button></ui-select-trigger>
          <ui-select-content>
            <ui-select-item value="en">English</ui-select-item>
            <ui-select-item value="pt">Português</ui-select-item>
            <ui-select-item value="es">Español</ui-select-item>
          </ui-select-content>
        </ui-select>
      </clay-select>
      <clay-slider>
        <ui-field>
          <ui-slider default-value="4" max="12" aria-label="Crossfade">
            <div class="clay-slider-head">
              <ui-field-label>Crossfade</ui-field-label>
              <ui-slider-value></ui-slider-value>
            </div>
            <ui-slider-control>
              <ui-slider-track><ui-slider-indicator></ui-slider-indicator><ui-slider-thumb></ui-slider-thumb></ui-slider-track>
            </ui-slider-control>
          </ui-slider>
        </ui-field>
      </clay-slider>
      <div class="clay-actions">
        <clay-action-button color="teal" pending-label="Saving…" success-label="Saved" data-save>
          <ui-button><button>Save changes</button></ui-button>
        </clay-action-button>
      </div>
    </clay-card>

    <div class="stack">
      <clay-card class="panel form" radius="30">
        <header class="panel-head"><h2>Notifications and privacy</h2></header>
        <label class="setting">New releases from artists you follow
          <clay-switch><ui-switch default-checked><ui-switch-thumb></ui-switch-thumb></ui-switch></clay-switch>
        </label>
        <label class="setting">Show what I'm listening to
          <clay-switch color="lilac"><ui-switch><ui-switch-thumb></ui-switch-thumb></ui-switch></clay-switch>
        </label>
        <label class="setting check">
          <clay-checkbox>
            <ui-checkbox default-checked>
              <ui-checkbox-indicator aria-hidden="true">${checkMark}</ui-checkbox-indicator>
            </ui-checkbox>
          </clay-checkbox>
          Allow explicit content
        </label>
      </clay-card>

      <clay-card class="panel form" radius="30">
        <header class="panel-head"><h2>Danger zone</h2></header>
        <p class="muted">Your recommendations start from scratch once the history is gone.</p>
        <clay-slide-confirm color="rose" pending-label="Deleting…" success-label="History deleted" reset-after="2600" data-wipe>
          <ui-slider aria-label="Slide to delete history">
            <ui-slider-control>
              <ui-slider-track><ui-slider-indicator></ui-slider-indicator><ui-slider-thumb></ui-slider-thumb></ui-slider-track>
            </ui-slider-control>
          </ui-slider>
        </clay-slide-confirm>
      </clay-card>
    </div>
  </div>`

const player = (track: Track) => `
  <clay-card class="player" color="ink" radius="30" elevation="3" aria-label="Player" role="region">
    <img class="player-cover" src="${track.cover}" alt="" data-now-cover />
    <div class="now">
      <p class="now-title" data-now-title>${track.title}</p>
      <p class="now-artist" data-now-artist>${track.artist}</p>
    </div>
    <clay-button-group aria-label="Playback" color="teal" class="transport">
      <ui-button><button aria-label="Previous track" data-prev>${icon(SkipBack)}</button></ui-button>
      <ui-toggle data-playing><button aria-label="Play">${playPause}</button></ui-toggle>
      <ui-button><button aria-label="Next track" data-next>${icon(SkipForward)}</button></ui-button>
    </clay-button-group>
    <div class="position">
      <span class="clock" data-elapsed>0:00</span>
      <clay-slider>
        <ui-slider default-value="0" max="${track.length}" aria-label="Track position" data-position>
          <ui-slider-control>
            <ui-slider-track><ui-slider-indicator></ui-slider-indicator><ui-slider-thumb></ui-slider-thumb></ui-slider-track>
          </ui-slider-control>
        </ui-slider>
      </clay-slider>
      <span class="clock" data-total>${time(track.length)}</span>
    </div>
    <div class="extras">
      <clay-toggle icon size="sm" color="sky"><ui-toggle><button aria-label="Shuffle">${icon(Shuffle)}</button></ui-toggle></clay-toggle>
      <clay-toggle icon size="sm" color="lilac"><ui-toggle><button aria-label="Repeat">${icon(Repeat)}</button></ui-toggle></clay-toggle>
      <clay-slider class="volume">
        <ui-slider default-value="70" aria-label="Volume">
          <ui-slider-control>
            <ui-slider-track><ui-slider-indicator></ui-slider-indicator><ui-slider-thumb></ui-slider-thumb></ui-slider-track>
          </ui-slider-control>
        </ui-slider>
      </clay-slider>
      ${icon(Volume2, "volume-icon")}
    </div>
  </clay-card>`

function markup(dark: boolean) {
  return `
  <clay-tabs class="shell" color="teal">
    <ui-tabs default-value="home" orientation="vertical">
      <aside class="side">
        <clay-card class="side-card" color="slate" radius="34">
          <div class="profile">
            <clay-avatar size="xl" color="sky" status="online">
              <ui-avatar><img src="${listener}" alt="Aryan, online" /><ui-avatar-fallback>AR</ui-avatar-fallback></ui-avatar>
            </clay-avatar>
            <p class="hello">Hi, Aryan!</p>
            <clay-badge color="butter" data-plan>Free plan</clay-badge>
          </div>
          <ui-tabs-list aria-label="Sections">
            ${sections
              .map((s) => `<ui-tabs-tab value="${s.id}"><button type="button">${icon(s.icon)}${s.label}</button></ui-tabs-tab>`)
              .join("")}
          </ui-tabs-list>
          <clay-card class="premium" color="lilac" radius="26" elevation="1" data-premium>
            ${icon(Crown, "crown")}
            <div class="premium-copy">
              <h2>Go Premium</h2>
              <p>Ad-free music, offline mixes and lossless audio.</p>
            </div>
            <clay-action-button color="butter" size="sm" pending-label="Upgrading…" success-label="Welcome!" reset-after="0" data-upgrade>
              <ui-button><button>Upgrade</button></ui-button>
            </clay-action-button>
          </clay-card>
        </clay-card>
      </aside>

      <main class="main">
        <header class="topbar">
          <h1 data-title>Home</h1>
          <clay-input class="search">
            ${icon(Search)}
            <ui-input-group>
              <ui-input><input type="search" aria-label="Search songs and artists" placeholder="Search songs, artists…" data-search /></ui-input>
              <ui-input-clear><button type="button" aria-label="Clear search"></button></ui-input-clear>
            </ui-input-group>
          </clay-input>
          <div class="top-actions">
            <clay-toggle icon color="slate">
              <ui-toggle ${dark ? "default-pressed" : ""} data-theme-toggle><button aria-label="Dark theme">${icon(Moon)}</button></ui-toggle>
            </clay-toggle>
            <clay-tooltip attached>
              <ui-tooltip>
                <clay-button icon class="bell">
                  <ui-tooltip-trigger><button aria-label="Notifications, 3 new" data-bell>${icon(Bell)}</button></ui-tooltip-trigger>
                  <clay-badge color="rose" class="count" aria-hidden="true">3</clay-badge>
                </clay-button>
                <ui-tooltip-content side="bottom">3 new releases</ui-tooltip-content>
              </ui-tooltip>
            </clay-tooltip>
            <clay-menu icon color="teal" attached>
              <ui-menu data-account>
                <ui-menu-trigger><button aria-label="Account">${icon(User)}</button></ui-menu-trigger>
                <ui-menu-content>
                  <ui-menu-group-label>Aryan</ui-menu-group-label>
                  <ui-menu-item value="settings">${icon(Settings)}Settings</ui-menu-item>
                  <ui-menu-item value="premium">${icon(Crown)}Go Premium</ui-menu-item>
                  <ui-menu-separator></ui-menu-separator>
                  <ui-menu-item value="sign-out" variant="danger">${icon(LogOut)}Sign out</ui-menu-item>
                </ui-menu-content>
              </ui-menu>
            </clay-menu>
          </div>
        </header>

        <ui-tabs-panel value="home">${home()}</ui-tabs-panel>
        <ui-tabs-panel value="library">${library()}</ui-tabs-panel>
        <ui-tabs-panel value="favorites">${favorites()}</ui-tabs-panel>
        <ui-tabs-panel value="settings">${settings()}</ui-tabs-panel>

        ${player(tracks[0]!)}
      </main>
    </ui-tabs>
  </clay-tabs>

  <clay-dialog>
    <ui-dialog data-sign-out>
      <ui-dialog-backdrop hidden></ui-dialog-backdrop>
      <ui-dialog-content hidden>
        <ui-dialog-title>Sign out of Clay Tunes?</ui-dialog-title>
        <ui-dialog-description>Your downloads stay on this device. You can sign back in at any time.</ui-dialog-description>
        <div class="clay-actions">
          <clay-button><ui-dialog-close><button>Stay</button></ui-dialog-close></clay-button>
          <clay-button color="rose"><ui-dialog-close><button data-confirm-sign-out>Sign out</button></ui-dialog-close></clay-button>
        </div>
      </ui-dialog-content>
    </ui-dialog>
  </clay-dialog>

  <clay-toast-region attached>
    <ui-toast-region>
      <template>
        <ui-toast>
          <ui-toast-title></ui-toast-title>
          <ui-toast-description></ui-toast-description>
          <ui-toast-action><button></button></ui-toast-action>
        </ui-toast>
      </template>
    </ui-toast-region>
  </clay-toast-region>`
}

export { icon, markup, sections, trackRow }
