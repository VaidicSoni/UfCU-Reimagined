import { useEffect, useRef } from 'react'

// "Lumi" — the guide character.
//
// Built from two UFCU symbols rather than invented from scratch: the filament
// is the lowercase "u" of the UFCU wordmark, and the bulb is the lightbulb in
// the DevelopU hackathon mark. The tie-in is UFCU's own purpose statement —
// "brighter futures" — so Lumi's filament brightens as the member progresses.
//
// The filament draws itself as the UFCU "u", then relaxes into a smile as the
// eyes open, and keeps cycling back to the letterform every few seconds so the
// connection reads even if you arrive mid-screen. Both shapes share one path
// grammar — M, L, A, L — so the morph is a numeric interpolation of ten values,
// not a cross-fade between two drawings.
//
//                    [x1, y1,  x2, y2,  rx, ry,  x3, y3,  x4, y4]
const LETTER_U = [44, 36, 44, 58, 16, 16, 76, 58, 76, 36]
const SMILE    = [42, 65, 42, 65, 18,  9, 78, 65, 78, 65]

// Intro, played once on mount.
const DRAW_MS = 620    // the "u" strokes itself on
const HOLD_MS = 340    // it sits there, legible as the wordmark
const MORPH_MS = 1050  // then becomes a face
const INTRO_MS = DRAW_MS + HOLD_MS + MORPH_MS

// Then this repeats forever.
const REST_MS = 4200   // resting as a face
const TO_U_MS = 520    // face lets go, back to the letterform
const HOLD_U_MS = 620  // the "u" holds, readable
const TO_FACE_MS = 720 // and relaxes into a smile again
const CYCLE_MS = REST_MS + TO_U_MS + HOLD_U_MS + TO_FACE_MS

const filamentPath = (v) =>
  `M ${v[0]} ${v[1]} L ${v[2]} ${v[3]} A ${v[4]} ${v[5]} 0 0 0 ${v[6]} ${v[7]} L ${v[8]} ${v[9]}`

// Slow at both ends so the letterform reads before it relaxes.
const easeInOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)
const clamp01 = (n) => Math.max(0, Math.min(1, n))

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

export function Mascot({
  brightness = 0.35,
  size = 96,
  state = 'idle',
  intro = true,
  loop = true,
  className = '',
}) {
  const filamentRef = useRef(null)
  const glowRef = useRef(null)
  const eyesRef = useRef(null)
  const blinkRef = useRef(false)
  const morphRef = useRef(0)

  // The animation writes SVG attributes directly. Driving a permanent loop
  // through React state would re-render the tree on every frame.
  useEffect(() => {
    const paint = (draw, morph) => {
      morphRef.current = morph
      const d = filamentPath(LETTER_U.map((from, i) => from + (SMILE[i] - from) * morph))
      const offset = 100 - draw * 100
      for (const node of [filamentRef.current, glowRef.current]) {
        if (!node) continue
        node.setAttribute('d', d)
        node.setAttribute('stroke-dashoffset', offset)
      }
      // Eyes open in the back half of the morph, and blink only once open.
      const eyeOpen = clamp01((morph - 0.4) / 0.5)
      if (eyesRef.current) {
        eyesRef.current.setAttribute('opacity', eyeOpen)
        eyesRef.current.style.transform = `scaleY(${blinkRef.current ? 0.12 : eyeOpen})`
      }
    }

    if (prefersReducedMotion()) {
      paint(1, 1)
      return
    }

    const start = performance.now()
    let raf

    const tick = (now) => {
      const elapsed = now - start
      let draw = 1
      let morph

      if (intro && elapsed < INTRO_MS) {
        if (elapsed < DRAW_MS) {
          draw = elapsed / DRAW_MS
          morph = 0
        } else if (elapsed < DRAW_MS + HOLD_MS) {
          morph = 0
        } else {
          morph = easeInOut((elapsed - DRAW_MS - HOLD_MS) / MORPH_MS)
        }
      } else if (!loop) {
        morph = 1
      } else {
        const p = (elapsed - (intro ? INTRO_MS : 0)) % CYCLE_MS
        if (p < REST_MS) {
          morph = 1
        } else if (p < REST_MS + TO_U_MS) {
          morph = 1 - easeInOut((p - REST_MS) / TO_U_MS)
        } else if (p < REST_MS + TO_U_MS + HOLD_U_MS) {
          morph = 0
        } else {
          morph = easeInOut((p - REST_MS - TO_U_MS - HOLD_U_MS) / TO_FACE_MS)
        }
      }

      paint(draw, morph)
      raf = requestAnimationFrame(tick)
    }

    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [intro, loop])

  // Irregular blink timing — a fixed interval reads as mechanical. Skipped
  // whenever the face is mid-morph or showing as the letterform.
  useEffect(() => {
    if (prefersReducedMotion()) return
    let timeout
    const schedule = () => {
      timeout = setTimeout(() => {
        if (morphRef.current > 0.92) {
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
  const initial = filamentPath(intro ? LETTER_U : SMILE)

  return (
    <div
      className={`lumi lumi--${state} ${className}`}
      style={{ width: size, height: size * 1.16 }}
      aria-hidden="true"
    >
      <svg viewBox="0 0 120 140" className="h-full w-full overflow-visible">
        <defs>
          <radialGradient id="lumi-glow">
            <stop offset="0%" stopColor="#F2780C" stopOpacity={glow} />
            <stop offset="55%" stopColor="#F2780C" stopOpacity={glow * 0.28} />
            <stop offset="100%" stopColor="#F2780C" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="lumi-glass" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.96" />
            <stop offset="100%" stopColor="#FDEBDB" stopOpacity="0.86" />
          </linearGradient>
        </defs>

        <circle className="lumi-halo" cx="60" cy="56" r="58" fill="url(#lumi-glow)" />

        <circle cx="60" cy="56" r="40" fill="url(#lumi-glass)" />
        <circle cx="60" cy="56" r="40" fill="none" stroke="#23335D" strokeWidth="4" />

        <ellipse cx="45" cy="40" rx="10" ry="13" fill="#FFFFFF" opacity="0.85" transform="rotate(-22 45 40)" />

        {/* Filament: the UFCU "u" cycling into a smile and back.
            pathLength normalises the stroke reveal at any morph position. */}
        <path
          ref={filamentRef}
          d={initial}
          pathLength="100"
          fill="none"
          stroke={filamentColor}
          strokeWidth="7"
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
          strokeWidth="7"
          strokeLinecap="round"
          strokeDasharray="100"
          strokeDashoffset={intro ? 100 : 0}
          opacity={brightness * 0.9}
          style={{ filter: 'blur(3px)' }}
        />

        <g ref={eyesRef} className="lumi-eyes" opacity={intro ? 0 : 1}>
          <ellipse cx="49" cy="48" rx="3.6" ry="4.6" fill="#23335D" />
          <ellipse cx="71" cy="48" rx="3.6" ry="4.6" fill="#23335D" />
        </g>

        <path d="M45 94 L75 94 L72 106 L48 106 Z" fill="#23335D" />
        <rect x="47" y="107" width="26" height="5" rx="2.5" fill="#8182B1" />
        <rect x="48" y="114" width="24" height="5" rx="2.5" fill="#8182B1" />
        <rect x="50" y="121" width="20" height="6" rx="3" fill="#23335D" />

        <g className="lumi-sparks">
          <circle cx="16" cy="40" r="3.5" fill="#F2780C" />
          <circle cx="104" cy="34" r="2.8" fill="#F49A6A" />
          <circle cx="100" cy="78" r="3.2" fill="#F2780C" />
        </g>
      </svg>
    </div>
  )
}
