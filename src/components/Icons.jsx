// Geometric stroke marks rather than emoji — emoji render differently on every
// OS and pull the page toward a generic template look.
const base = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
}

export const Icon = {
  everyday: (p) => (
    <svg viewBox="0 0 24 24" {...p}>
      <rect x="2.5" y="5.5" width="19" height="13" rx="2.5" {...base} />
      <path d="M2.5 10h19" {...base} />
      <path d="M6 14.5h4" {...base} />
    </svg>
  ),
  consumer: (p) => (
    <svg viewBox="0 0 24 24" {...p}>
      <path d="M3 13.5l1.8-5A2.5 2.5 0 0 1 7.2 7h9.6a2.5 2.5 0 0 1 2.4 1.5l1.8 5" {...base} />
      <path d="M3 13.5h18v4a1 1 0 0 1-1 1h-1.5a1 1 0 0 1-1-1v-1h-11v1a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1z" {...base} />
      <path d="M6.5 16h.01M17.5 16h.01" {...base} />
    </svg>
  ),
  mortgage: (p) => (
    <svg viewBox="0 0 24 24" {...p}>
      <path d="M3.5 10.5L12 4l8.5 6.5" {...base} />
      <path d="M5.5 9.8V19a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1V9.8" {...base} />
      <path d="M10 20v-5.5h4V20" {...base} />
    </svg>
  ),
  business: (p) => (
    <svg viewBox="0 0 24 24" {...p}>
      <path d="M3.5 9.5L5 4.5h14l1.5 5" {...base} />
      <path d="M3.5 9.5a2.5 2.5 0 0 0 5 0 2.5 2.5 0 0 0 5 0 2.5 2.5 0 0 0 5 0 2.5 2.5 0 0 0 2 0" {...base} />
      <path d="M5 11.5V19a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-7.5" {...base} />
      <path d="M9.5 20v-5h5v5" {...base} />
    </svg>
  ),
  invest: (p) => (
    <svg viewBox="0 0 24 24" {...p}>
      <path d="M12 20v-7" {...base} />
      <path d="M12 13c0-3 2-5.5 5.5-6C17 10.5 15 13 12 13z" {...base} />
      <path d="M12 15c0-2.5-1.7-4.6-4.6-5C7.8 12.8 9.5 15 12 15z" {...base} />
    </svg>
  ),
  credit: (p) => (
    <svg viewBox="0 0 24 24" {...p}>
      <path d="M3.5 20h17" {...base} />
      <path d="M6.5 20v-5M11 20v-9M15.5 20v-6M20 20v-12" {...base} />
    </svg>
  ),
  camera: (p) => (
    <svg viewBox="0 0 24 24" {...p}>
      <path d="M4 8h3l1.5-2.5h7L17 8h3a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1z" {...base} />
      <circle cx="12" cy="13" r="3.6" {...base} />
    </svg>
  ),
  lock: (p) => (
    <svg viewBox="0 0 24 24" {...p}>
      <rect x="4.5" y="10.5" width="15" height="9.5" rx="2" {...base} />
      <path d="M8 10.5V7.8a4 4 0 0 1 8 0v2.7" {...base} />
    </svg>
  ),
  sound: (p) => (
    <svg viewBox="0 0 24 24" {...p}>
      <path d="M11 5.5L6.5 9H3.5v6h3L11 18.5z" {...base} />
      <path d="M15 9.5a3.5 3.5 0 0 1 0 5M17.8 6.8a7.2 7.2 0 0 1 0 10.4" {...base} />
    </svg>
  ),
  stop: (p) => (
    <svg viewBox="0 0 24 24" {...p}>
      <rect x="6" y="6" width="12" height="12" rx="2" {...base} />
    </svg>
  ),
  phone: (p) => (
    <svg viewBox="0 0 24 24" {...p}>
      <rect x="6.5" y="2.5" width="11" height="19" rx="2.5" {...base} />
      <path d="M10.5 18.5h3" {...base} />
    </svg>
  ),
  close: (p) => (
    <svg viewBox="0 0 24 24" {...p}>
      <path d="M6.5 6.5l11 11M17.5 6.5l-11 11" {...base} />
    </svg>
  ),
  eye: (p) => (
    <svg viewBox="0 0 24 24" {...p}>
      <path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z" {...base} />
      <circle cx="12" cy="12" r="3.2" {...base} />
    </svg>
  ),
  copy: (p) => (
    <svg viewBox="0 0 24 24" {...p}>
      <rect x="9" y="9" width="11.5" height="11.5" rx="2.5" {...base} />
      <path d="M15 6.5A2.5 2.5 0 0 0 12.5 4h-6A2.5 2.5 0 0 0 4 6.5v6A2.5 2.5 0 0 0 6.5 15" {...base} />
    </svg>
  ),
  chevron: (p) => (
    <svg viewBox="0 0 24 24" {...p}>
      <path d="M9.5 5.5L16 12l-6.5 6.5" {...base} />
    </svg>
  ),
  shield: (p) => (
    <svg viewBox="0 0 24 24" {...p}>
      <path d="M12 3l7 3v5.5c0 4.2-2.9 7.7-7 8.5-4.1-.8-7-4.3-7-8.5V6z" {...base} />
      <path d="M9 12l2 2 4-4" {...base} />
    </svg>
  ),
}
