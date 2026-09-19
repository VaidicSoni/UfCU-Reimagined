import { useEffect, useRef } from 'react'

// "Lumi" — the guide character.
//
// Built from two UFCU symbols rather than invented from scratch: the filament
// is the lowercase "u" of the UFCU wordmark, and the bulb is the lightbulb in
// the DevelopU hackathon mark. The tie-in is UFCU's own purpose statement —
// "brighter futures" — so Lumi's filament brightens as the member progresses.
//
// At rest she stays the UFCU "u". She relaxes into a face when she's actually
// in use — on the landing introduction, and whenever the chat is open — and
// while reading aloud the mouth animates against the speech.
//
// All three filament shapes share one path grammar — M, L, A, L — so every
// transition is a numeric interpolation of ten values, never a cross-fade.
//                    [x1, y1,  x2, y2,  rx, ry,  x3, y3,  x4, y4]
// Centred in the glass cavity (y 16..80 inside the stroke): the filament reads
// 27.5..68.5, leaving 11.5 clear above and below.
const LETTER_U = [46, 31, 46, 51, 14, 14, 74, 51, 74, 31]
const SMILE    = [48, 57, 48, 57, 12,  8, 72, 57, 72, 57]
// Same endpoints and rx as the smile, only deeper — so the mouth opens like a
// jaw instead of squeezing inwards, which is what looked wrong before.
const TALK     = [48, 54, 48, 54, 12, 16, 72, 54, 72, 54]

// Glass shoulders taper into a neck before the screw base — a circle on a stand
// doesn't read as a bulb. One closed path, so the outline has no seams.
const BULB =
  'M45 86 L45 84 C45 81 43.5 79.5 43 77.44 A34 34 0 1 1 77 77.44 C76.5 79.5 75 81 75 84 L75 86 Z'
const NAVY = '#23335D'

const DRAW_MS = 620    // the "u" strokes itself on
const HOLD_MS = 360    // and holds, legible as the wordmark
const MORPH_MS = 780   // letterform <-> face
const TALK_HZ = 2.2    // mouth cycles per second while speaking
const LOOP_FACE_MS = 3600  // how long she holds the face when cycling
const LOOP_LETTER_MS = 1900 // and the letterform

const filamentPath = (v) =>
  `M ${v[0]} ${v[1]} L ${v[2]} ${v[3]} A ${v[4]} ${v[5]} 0 0 0 ${v[6]} ${v[7]} L ${v[8]} ${v[9]}`

const easeInOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)
const clamp01 = (n) => Math.max(0, Math.min(1, n))
const mix = (a, b, t) => a.map((from, i) => from + (b[i] - from) * t)

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

export function Mascot({
  brightness = 0.35,
  size = 96,
  state = 'idle',
  face = false,
  speaking = false,
  intro = true,
  loop = false,
  className = '',
}) {
  const filamentRef = useRef(null)
  const glowRef = useRef(null)
  const eyesRef = useRef(null)
  const blinkRef = useRef(false)

  // Live values the animation loop reads, so changing props never restarts it.
  const morph = useRef(intro ? 0 : face ? 1 : 0)
  const tween = useRef(null)
  const talkEnv = useRef(0)
  const faceRef = useRef(face)
  const speakingRef = useRef(speaking)

  // Retarget the morph when the face/letter state flips.
  useEffect(() => {
    if (faceRef.current === face) return
    faceRef.current = face
    if (prefersReducedMotion()) {
      morph.current = face ? 1 : 0
      return
    }
    tween.current = { from: morph.current, to: face ? 1 : 0, start: performance.now() }
  }, [face])

  useEffect(() => {
    speakingRef.current = speaking
  }, [speaking])

  useEffect(() => {
    const paint = (draw, m, talk) => {
      const base = mix(LETTER_U, SMILE, m)
      // Mouth only opens once there's a mouth to open.
      const d = filamentPath(talk > 0 ? mix(base, TALK, talk * m) : base)
      const offset = 100 - draw * 100
      // The letterform carries more weight than the mouth does.
      const width = 9 - 2 * m
      for (const node of [filamentRef.current, glowRef.current]) {
        if (!node) continue
        node.setAttribute('d', d)
        node.setAttribute('stroke-dashoffset', offset)
        node.setAttribute('stroke-width', width)
      }
      const eyeOpen = clamp01((m - 0.4) / 0.5)
      if (eyesRef.current) {
        eyesRef.current.setAttribute('opacity', eyeOpen)
        eyesRef.current.style.transform = `scaleY(${blinkRef.current ? 0.12 : eyeOpen})`
      }
    }

    if (prefersReducedMotion()) {
      paint(1, face ? 1 : 0, 0)
      return
    }

    const start = performance.now()
    let introSettled = !intro
    let raf

    const tick = (now) => {
      const elapsed = now - start
      const draw = intro ? clamp01(elapsed / DRAW_MS) : 1

      // Draw the letterform first, let it read, then relax into the face — but
      // only where she's actually in use. In the corner she stays the "u".
      if (!introSettled && elapsed >= DRAW_MS + HOLD_MS) {
        introSettled = true
        if (faceRef.current) tween.current = { from: morph.current, to: 1, start: now }
      }

      if (tween.current) {
        const p = clamp01((now - tween.current.start) / MORPH_MS)
        const { from, to } = tween.current
        morph.current = from + (to - from) * easeInOut(p)
        if (p >= 1) tween.current = null
      }

      // Ease the talking envelope in and out so speech start/stop isn't abrupt.
      const target = speakingRef.current ? 1 : 0
      talkEnv.current += (target - talkEnv.current) * 0.14
      // Two detuned sines — a single one reads as a metronome, not speech.
      const tsec = now / 1000
      const w1 = Math.sin(tsec * TALK_HZ * 2 * Math.PI)
      const w2 = Math.sin(tsec * TALK_HZ * 1.73 * 2 * Math.PI + 1.1)
      const wave = clamp01(0.5 + 0.34 * w1 + 0.16 * w2)
      const talk = talkEnv.current * (0.2 + 0.8 * wave)

      paint(draw, morph.current, talk < 0.01 ? 0 : talk)
      raf = requestAnimationFrame(tick)
    }

    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [intro])

  // On the landing she cycles between the letterform and the face, so the
  // connection is visible whenever you look rather than only in the first
  // two seconds after load.
  useEffect(() => {
    if (!loop || prefersReducedMotion()) return
    let timer
    let cancelled = false
    const step = (toFace) => {
      if (cancelled) return
      tween.current = { from: morph.current, to: toFace ? 1 : 0, start: performance.now() }
      timer = setTimeout(
        () => step(!toFace),
        MORPH_MS + (toFace ? LOOP_FACE_MS : LOOP_LETTER_MS)
      )
    }
    // Let the intro finish and the face settle before the first cycle.
    timer = setTimeout(() => step(false), DRAW_MS + HOLD_MS + MORPH_MS + LOOP_FACE_MS)
    return () => {
      cancelled = true
      clearTimeout(timer)
    }
  }, [loop])

  // Irregular blink timing — a fixed interval reads as mechanical. Only while
  // she actually has a face, and never mid-sentence.
  useEffect(() => {
    if (prefersReducedMotion()) return
    let timeout
    const schedule = () => {
      timeout = setTimeout(() => {
        if (morph.current > 0.92 && !speakingRef.current) {
          blinkRef.current = true
          setTimeout(() => (blinkRef.current = false), 150)
        }
        schedule()
      }, 2600 + Math.random() * 3200)
    }
    schedule()
    return () => clearTimeout(timeout)
  }, [])

  const glow = 0.18 + brightness * 0.62
  const filamentColor = `rgba(242, 120, 12, ${0.45 + brightness * 0.55})`
  const initial = filamentPath(intro ? LETTER_U : face ? SMILE : LETTER_U)

  return (
    <div
      className={`lumi lumi--${state} ${className}`}
      style={{ width: size, height: size * 1.05 }}
      aria-hidden="true"
    >
      <svg viewBox="0 0 120 126" className="h-full w-full overflow-visible">
        <defs>
          <radialGradient id="lumi-glow">
            <stop offset="0%" stopColor="#F2780C" stopOpacity={glow} />
            <stop offset="55%" stopColor="#F2780C" stopOpacity={glow * 0.28} />
            <stop offset="100%" stopColor="#F2780C" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="lumi-glass" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.97" />
            <stop offset="100%" stopColor="#FDEBDB" stopOpacity="0.9" />
          </linearGradient>
        </defs>

        <circle className="lumi-halo" cx="60" cy="48" r="52" fill="url(#lumi-glow)" />

        <path d={BULB} fill="url(#lumi-glass)" stroke={NAVY} strokeWidth="5" strokeLinejoin="round" />

        {/* Screw base: outlined and filled like the glass, so it reads against
            the navy page instead of dissolving into it. */}
        <rect x="44.5" y="85" width="31" height="29" rx="7" fill="url(#lumi-glass)" stroke={NAVY} strokeWidth="5" />
        <path d="M51 94h18M51 101h18M51 108h18" stroke={NAVY} strokeWidth="4" strokeLinecap="round" />

        <path
          ref={filamentRef}
          d={initial}
          pathLength="100"
          fill="none"
          stroke={filamentColor}
          strokeWidth={intro || !face ? 9 : 7}
          strokeLinecap="round"
          strokeDasharray="100"
          strokeDashoffset={intro ? 100 : 0}
        />
        <path
          ref={glowRef}
          d={initial}
          pathLength="100"
          fill="none"
          stroke="#F2780C"
          strokeWidth={intro || !face ? 9 : 7}
          strokeLinecap="round"
          strokeDasharray="100"
          strokeDashoffset={intro ? 100 : 0}
          opacity={brightness * 0.9}
          style={{ filter: 'blur(3px)' }}
        />

        <g ref={eyesRef} className="lumi-eyes" opacity={intro ? 0 : face ? 1 : 0}>
          <ellipse cx="50" cy="41" rx="3.2" ry="4.2" fill={NAVY} />
          <ellipse cx="70" cy="41" rx="3.2" ry="4.2" fill={NAVY} />
        </g>

        <g className="lumi-sparks">
          <circle cx="14" cy="34" r="3.5" fill="#F2780C" />
          <circle cx="106" cy="28" r="2.8" fill="#F49A6A" />
          <circle cx="102" cy="72" r="3.2" fill="#F2780C" />
        </g>
      </svg>
    </div>
  )
}
