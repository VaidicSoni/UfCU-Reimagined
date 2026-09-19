import { useCallback, useEffect, useRef, useState } from 'react'
import { useOnboarding } from '../context/OnboardingContext.jsx'
import { t } from '../lib/i18n.js'
import { Icon } from './Icons.jsx'

// Requested cadence. Fast for reading a caption, so each carries a short title
// with the body secondary — and hover, focus or any interaction pauses it.
const SLIDE_MS = 2000
const SWIPE_PX = 50

// Photo slides fall back to the drawn panel if the file is missing, so the
// carousel works whether or not the images are present.
const SLIDES = [
  { id: 'community', copy: 'slide1', image: '/slides/community.png' },
  { id: 'cards', copy: 'slide2', art: 'cards' },
  { id: 'campus', copy: 'slide3', image: '/slides/branch.png' },
  { id: 'anyone', copy: 'slide4', image: '/slides/service.png' },
]

// School colours only — no logos or marks. UFCU really does offer collegiate
// card designs; the actual artwork is licensed, so these are our own shapes in
// the schools' palettes.
const CARDS = [
  { id: 'ut', bg: '#BF5700', accent: '#FFFFFF', chip: '#F6C177', label: 'UT AUSTIN' },
  { id: 'txst', bg: '#501214', accent: '#B2A169', chip: '#D8C48A', label: 'TXST' },
  { id: 'acc', bg: '#14566B', accent: '#7FC6A4', chip: '#A7D8C2', label: 'ACC' },
]

function CardFan() {
  return (
    <div className="flex h-full items-center justify-center" aria-hidden="true">
      {CARDS.map((c, i) => (
        <div
          key={c.id}
          // Overlapping rather than spaced: three full-width cards side by side
          // are wider than the hero column and the last one gets clipped.
          className={`relative h-24 w-36 shrink-0 overflow-hidden rounded-xl shadow-card sm:h-28 sm:w-40 ${
            i > 0 ? '-ml-8' : ''
          }`}
          style={{
            background: c.bg,
            transform: `rotate(${(i - 1) * 6}deg) translateY(${i === 1 ? -10 : 0}px)`,
            zIndex: i === 1 ? 2 : 1,
          }}
        >
          <div className="absolute inset-x-0 top-0 h-1.5" style={{ background: c.accent }} />
          <div className="absolute left-3 top-5 h-5 w-7 rounded" style={{ background: c.chip }} />
          <div className="absolute bottom-8 left-3 right-3 h-1.5 rounded bg-white/25" />
          <div className="absolute bottom-3 left-3 text-[0.55rem] font-extrabold tracking-wider text-white/85">
            {c.label}
          </div>
          <span className="absolute bottom-2.5 right-3 text-[0.6rem] font-extrabold lowercase text-white/80">
            ufcu
          </span>
        </div>
      ))}
    </div>
  )
}

export function HeroCarousel({ compact = false }) {
  const { lang } = useOnboarding()
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const [broken, setBroken] = useState({})
  const drag = useRef(null)

  const count = SLIDES.length
  const go = useCallback((n) => setIndex(((n % count) + count) % count), [count])

  useEffect(() => {
    if (paused) return
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return
    const id = setInterval(() => setIndex((i) => (i + 1) % count), SLIDE_MS)
    return () => clearInterval(id)
    // `index` is a dependency on purpose: any manual change restarts the timer,
    // so tapping a dot gives you a full interval instead of being bumped off
    // your own choice a moment later.
  }, [paused, count, index])

  const onPointerDown = (e) => {
    drag.current = e.clientX
    setPaused(true)
  }
  const onPointerUp = (e) => {
    if (drag.current === null) return
    const dx = e.clientX - drag.current
    if (Math.abs(dx) > SWIPE_PX) go(index + (dx < 0 ? 1 : -1))
    drag.current = null
    setPaused(false)
  }

  const height = compact ? 'h-[360px]' : 'h-[320px] sm:h-[380px]'

  return (
    <section
      aria-roledescription="carousel"
      aria-label={t(lang, 'carAria')}
      className="u-card relative overflow-hidden bg-navy-darkest ring-1 ring-white/10"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
      onKeyDown={(e) => {
        if (e.key === 'ArrowRight') go(index + 1)
        if (e.key === 'ArrowLeft') go(index - 1)
      }}
    >
      <div
        className="flex touch-pan-y transition-transform duration-500 ease-[cubic-bezier(.16,1,.3,1)]"
        style={{ transform: `translateX(-${index * 100}%)` }}
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        onPointerCancel={() => (drag.current = null)}
      >
        {SLIDES.map((slide, i) => {
          const showPhoto = slide.image && !broken[slide.id]
          return (
            <div
              key={slide.id}
              role="group"
              aria-roledescription="slide"
              aria-label={`${i + 1} / ${count}`}
              aria-hidden={i !== index}
              className={`relative w-full shrink-0 ${height}`}
            >
              {/* Photography reads far better full-bleed under a scrim than
                  boxed beside the text, which is what looked off before. */}
              {showPhoto ? (
                <img
                  src={slide.image}
                  alt=""
                  className="absolute inset-0 h-full w-full object-cover"
                  draggable="false"
                  onError={() => setBroken((b) => ({ ...b, [slide.id]: true }))}
                />
              ) : (
                <div className="absolute inset-0 bottom-32">
                  <CardFan />
                </div>
              )}

              {/* Weighted to the bottom so the caption stays legible while the
                  photograph still reads. A uniform scrim flattened both. */}
              <div
                aria-hidden="true"
                className="absolute inset-0"
                style={{
                  background:
                    'linear-gradient(to top, rgba(2,3,50,0.96) 0%, rgba(2,3,50,0.88) 30%, rgba(2,3,50,0.35) 58%, rgba(2,3,50,0.05) 100%)',
                }}
              />

              <div className="absolute inset-x-0 bottom-0 p-6 pb-10 sm:p-7 sm:pb-11">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-orange-lighter">
                  {t(lang, `${slide.copy}Kicker`)}
                </p>
                <h2
                  className={`display mt-2 font-extrabold text-white ${
                    compact ? 'text-xl' : 'text-xl sm:text-2xl'
                  }`}
                >
                  {t(lang, `${slide.copy}Title`)}
                </h2>
                <p className="mt-2 max-w-lg text-sm leading-relaxed text-navy-subtle">
                  {t(lang, `${slide.copy}Body`)}
                </p>
              </div>
            </div>
          )
        })}
      </div>

      <button
        onClick={() => go(index - 1)}
        aria-label={t(lang, 'carPrev')}
        className="absolute left-3 top-1/2 hidden -translate-y-1/2 rounded-full bg-navy-darkest/80 p-2.5 text-white ring-1 ring-white/20 transition hover:bg-navy-darker sm:block"
      >
        <Icon.chevron className="h-4 w-4 rotate-180" aria-hidden="true" />
      </button>
      <button
        onClick={() => go(index + 1)}
        aria-label={t(lang, 'carNext')}
        className="absolute right-3 top-1/2 hidden -translate-y-1/2 rounded-full bg-navy-darkest/80 p-2.5 text-white ring-1 ring-white/20 transition hover:bg-navy-darker sm:block"
      >
        <Icon.chevron className="h-4 w-4" aria-hidden="true" />
      </button>

      <div className="absolute inset-x-0 bottom-3 flex justify-center gap-2">
        {SLIDES.map((s, i) => (
          <button
            key={s.id}
            onClick={() => go(i)}
            aria-label={t(lang, 'carGoTo', i + 1)}
            aria-current={i === index}
            className={`h-2 rounded-full transition-all ${
              i === index ? 'w-6 bg-orange' : 'w-2 bg-white/35 hover:bg-white/60'
            }`}
          />
        ))}
      </div>
    </section>
  )
}
