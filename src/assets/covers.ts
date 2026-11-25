const svg = (body: string) =>
  `data:image/svg+xml,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80">${body}</svg>`
  )}`

const sunsetDrive = svg(`
  <defs>
    <linearGradient id="s" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#6d6fb1"/><stop offset=".45" stop-color="#e88fa0"/><stop offset=".7" stop-color="#f7b98a"/>
    </linearGradient>
    <linearGradient id="w" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#c9789a"/><stop offset="1" stop-color="#4b4f8c"/>
    </linearGradient>
  </defs>
  <rect width="80" height="80" fill="url(#s)"/>
  <circle cx="40" cy="52" r="12" fill="#ffe0b0"/>
  <path d="M0 22c14-4 22 4 34 0s22-6 30-2 12 2 16 0v6H0z" fill="#fff" opacity=".35"/>
  <rect y="54" width="80" height="26" fill="url(#w)"/>
  <path d="M26 60h28M20 66h40M30 72h20" stroke="#ffd8b6" stroke-width="2" stroke-linecap="round" opacity=".7"/>
`)

const goldenHour = svg(`
  <defs>
    <radialGradient id="g" cx="50%" cy="60%" r="70%">
      <stop offset="0" stop-color="#ffd08a"/><stop offset=".5" stop-color="#d98a4c"/><stop offset="1" stop-color="#6b3c2a"/>
    </radialGradient>
  </defs>
  <rect width="80" height="80" fill="url(#g)"/>
  <circle cx="40" cy="46" r="14" fill="#fff1c9" opacity=".85"/>
  <rect y="58" width="80" height="22" fill="#4a2b22"/>
  <path d="M18 58V36m0 6-6-4m6 10 6-5" stroke="#3a211b" stroke-width="3" stroke-linecap="round"/>
  <circle cx="54" cy="44" r="4" fill="#3a211b"/><path d="M54 48v10m-5-6h10" stroke="#3a211b" stroke-width="3" stroke-linecap="round"/>
  <circle cx="61" cy="47" r="3.2" fill="#3a211b"/><path d="M61 50v8" stroke="#3a211b" stroke-width="3" stroke-linecap="round"/>
`)

const coffeeShop = svg(`
  <defs>
    <linearGradient id="c" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#f6e6d2"/><stop offset="1" stop-color="#d9b896"/>
    </linearGradient>
    <linearGradient id="m" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="#d7d2cc"/>
    </linearGradient>
  </defs>
  <rect width="80" height="80" fill="url(#c)"/>
  <ellipse cx="40" cy="60" rx="24" ry="6" fill="#b88d6c" opacity=".55"/>
  <path d="M22 36h32v14c0 8-7 12-16 12s-16-4-16-12z" fill="url(#m)"/>
  <path d="M54 40c8 0 8 12-1 12" stroke="#d7d2cc" stroke-width="4" fill="none"/>
  <ellipse cx="38" cy="36" rx="16" ry="4" fill="#8a5636"/>
  <path d="M33 34c2 2 8 2 10 0" stroke="#f3dcc0" stroke-width="1.6" fill="none"/>
  <path d="M32 26c-3-4 3-6 0-10M40 26c-3-4 3-6 0-10M48 26c-3-4 3-6 0-10" stroke="#fff" stroke-width="2" stroke-linecap="round" fill="none" opacity=".8"/>
`)

const chillVibes = `data:image/svg+xml,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 220" preserveAspectRatio="xMidYMid slice">
  <defs>
    <linearGradient id="wall" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#b97a55"/><stop offset=".55" stop-color="#e3b083"/><stop offset="1" stop-color="#a7694a"/>
    </linearGradient>
    <radialGradient id="glow" cx="78%" cy="36%" r="45%">
      <stop offset="0" stop-color="#fff2c8" stop-opacity=".95"/><stop offset="1" stop-color="#ffcf8a" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="floor" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#9a6346"/><stop offset="1" stop-color="#5a3626"/>
    </linearGradient>
    <linearGradient id="chair" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#3d4f86"/><stop offset="1" stop-color="#1b244a"/>
    </linearGradient>
    <linearGradient id="seat" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#4c5e98"/><stop offset="1" stop-color="#232e5c"/>
    </linearGradient>
  </defs>
  <rect width="320" height="220" fill="url(#wall)"/>
  <rect x="190" y="30" width="56" height="44" rx="3" fill="#7b4c36" opacity=".55"/>
  <rect x="196" y="36" width="44" height="32" rx="2" fill="#d79a6c" opacity=".7"/>
  <rect x="254" y="44" width="34" height="40" rx="3" fill="#7b4c36" opacity=".5"/>
  <rect width="320" height="220" fill="url(#glow)"/>
  <rect y="168" width="320" height="52" fill="url(#floor)"/>
  <path d="M14 168c0-40 6-72 18-96 6 30 6 64 0 96z" fill="#4f7a52"/>
  <path d="M30 168c4-34 18-64 40-80-4 30-18 60-40 80z" fill="#3d6544"/>
  <rect x="16" y="150" width="30" height="30" rx="4" fill="#6d4a3a"/>
  <path d="M70 186V110c0-24 20-36 50-36s50 12 50 36v76z" fill="url(#chair)"/>
  <path d="M120 112c-8-14-30-10-28 6 2 14 28 26 28 26s26-12 28-26c2-16-20-20-28-6z" fill="#2b3a72"/>
  <rect x="56" y="122" width="34" height="62" rx="16" fill="url(#seat)"/>
  <rect x="150" y="122" width="34" height="62" rx="16" fill="url(#seat)"/>
  <rect x="80" y="146" width="80" height="34" rx="12" fill="url(#seat)"/>
  <path d="M76 186h-2l-2 10M164 186h2l2 10" stroke="#3a2218" stroke-width="5" stroke-linecap="round"/>
  <rect x="206" y="130" width="80" height="10" rx="3" fill="#8b5a3c"/>
  <rect x="212" y="140" width="68" height="36" fill="#6f4430"/>
  <rect x="218" y="148" width="56" height="8" rx="2" fill="#a46e4c"/>
  <ellipse cx="236" cy="122" rx="22" ry="5" fill="#e9c9a6"/>
  <ellipse cx="236" cy="121" rx="14" ry="3.2" fill="#2a1e1a"/>
  <rect x="226" y="122" width="22" height="8" fill="#d8b590"/>
  <path d="M268 130V82" stroke="#5a3a2a" stroke-width="3"/>
  <path d="M254 82h28l-6-22h-16z" fill="#fff0d0"/>
  <ellipse cx="268" cy="82" rx="16" ry="4" fill="#ffe6b0"/>
</svg>`)}`

const covers = { sunsetDrive, goldenHour, coffeeShop, chillVibes }

export { covers }
