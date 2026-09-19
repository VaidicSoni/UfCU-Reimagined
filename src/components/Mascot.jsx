import { useEffect, useRef, useState } from 'react'

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
const LETTER_U = [46, 36, 46, 56, 14, 14, 74, 56, 74, 36]
const SMILE    = [48, 57, 48, 57, 12,  8, 72, 57, 72, 57]
// Same endpoints and rx as the smile, only deeper — so the mouth opens like a
// jaw instead of squeezing inwards, which is what looked wrong before.
const TALK     = [48, 55, 48, 55, 12, 13, 72, 55, 72, 55]
// Reaction mouths. FLAT reads as bored, WIDE as delighted.
const FLAT     = [48, 59, 48, 59, 12,  1, 72, 59, 72, 59]
const WIDE     = [46, 52, 46, 52, 14, 17, 74, 52, 74, 52]

// Glass shoulders taper into a neck before the screw base — a circle on a stand
// doesn't read as a bulb. One closed path, so the outline has no seams.
const BULB =
  'M45 86 L45 84 C45 81 43.5 79.5 43 77.44 A34 34 0 1 1 77 77.44 C76.5 79.5 75 81 75 84 L75 86 Z'
const NAVY = '#23335D'
const RIM = 'rgba(214, 216, 234, 0.72)'

const DRAW_MS = 620    // the "u" strokes itself on
const HOLD_MS = 360    // and holds, legible as the wordmark
const MORPH_MS = 780   // letterform <-> face
const TALK_HZ = 2.2    // mouth cycles per second while speaking
const LOOP_FACE_MS = 3600  // how long she holds the face when cycling
const LOOP_LETTER_MS = 1900 // and the letterform
const TRACK_RADIUS = 260   // px within which she notices the cursor
const REACTION_MS = 5200   // how often an idle reaction fires

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
  speechTick = 0,
  intro = true,
  loop = false,
  // Set by whatever she's reacting to — hovering a suggested question, say.
  excited = false,
  // Follow the pointer and pull faces when idle. Only worth it where she sits
  // persistently on screen, so the corner dock opts in and nothing else does.
  alive = false,
  className = '',
}) {
  const filamentRef = useRef(null)
  const glowRef = useRef(null)
  const eyesRef = useRef(null)
  const eyeLRef = useRef(null)
  const eyeRRef = useRef(null)
  const tiltRef = useRef(null)
  const tongueRef = useRef(null)
  const blinkRef = useRef(false)
  // 'wink' | 'tongue' | 'bored' | null — a passing reaction, not a mode.
  const reactionRef = useRef(null)
  const excitedRef = useRef(excited)
  const nearRef = useRef(0)
  
  const [randomFace, setRandomFace] = useState(false)
  // Cursor within reach. Hysteresis on the two thresholds so a pointer hovering
  // right at the boundary doesn't flicker her in and out.
  const [nearby, setNearby] = useState(false)
  // She needs a face to react with, so anything that provokes a reaction also
  // brings one out.
  const effectiveFace = face || randomFace || excited || nearby

  // Live values the animation loop reads, so changing props never restarts it.
  const morph = useRef(intro ? 0 : effectiveFace ? 1 : 0)
  const tween = useRef(null)
  const talkEnv = useRef(0)
  const faceRef = useRef(effectiveFace)
  const speakingRef = useRef(speaking)
  const pulseRef = useRef(0)
  const targetX = useRef(0)
  const targetY = useRef(0)
  const curX = useRef(0)
  const curY = useRef(0)
  const mascotRef = useRef(null)

  // Random idle face animation when hanging out in the corner
  useEffect(() => {
    if (prefersReducedMotion() || face || loop) return
    let timeoutId
    let revertId
    const schedule = () => {
      timeoutId = setTimeout(() => {
        setRandomFace(true)
        revertId = setTimeout(() => setRandomFace(false), 2500 + Math.random() * 1500)
        schedule()
      }, 10000 + Math.random() * 15000)
    }
    schedule()
    return () => {
      clearTimeout(timeoutId)
      clearTimeout(revertId)
    }
  }, [face, loop])

  // Mouse tracking listener
  useEffect(() => {
    if (prefersReducedMotion()) return
    const onMove = (e) => {
      if (!mascotRef.current) return
      const rect = mascotRef.current.getBoundingClientRect()
      const cx = rect.left + rect.width / 2
      const cy = rect.top + rect.height / 2
      const dx = e.clientX - cx
      const dy = e.clientY - cy
      const dist = Math.hypot(dx, dy)

      if (dist < TRACK_RADIUS) {
        // 0 at the edge of her attention, 1 right on top of her.
        const near = 1 - dist / TRACK_RADIUS
        nearRef.current = near
        targetX.current = Math.max(-1, Math.min(1, dx / TRACK_RADIUS))
        targetY.current = Math.max(-1, Math.min(1, dy / TRACK_RADIUS))
        if (near > 0.45) setNearby(true)
        else if (near < 0.25) setNearby(false)
      } else {
        nearRef.current = 0
        targetX.current = 0
        targetY.current = 0
        setNearby(false)
      }
    }
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  useEffect(() => {
    excitedRef.current = excited
  }, [excited])

  // Idle reactions. Only where she lives on screen persistently, and never
  // while she's mid-sentence or being pointed at — a wink mid-answer reads as
  // a glitch rather than personality.
  useEffect(() => {
    if (!alive || prefersReducedMotion()) return
    let timer
    const pick = () => ['wink', 'tongue', 'bored'][Math.floor(Math.random() * 3)]
    const schedule = () => {
      timer = setTimeout(() => {
        if (!speakingRef.current && nearRef.current < 0.2) {
          reactionRef.current = pick()
          setRandomFace(true)
          setTimeout(() => {
            reactionRef.current = null
            setRandomFace(false)
          }, 1600)
        }
        schedule()
      }, REACTION_MS + Math.random() * 4000)
    }
    schedule()
    return () => clearTimeout(timer)
  }, [alive])

  // Retarget the morph when the face/letter state flips.
  useEffect(() => {
    if (faceRef.current === effectiveFace) return
    faceRef.current = effectiveFace
    if (prefersReducedMotion()) {
      morph.current = effectiveFace ? 1 : 0
      return
    }
    tween.current = { from: morph.current, to: effectiveFace ? 1 : 0, start: performance.now() }
  }, [effectiveFace])

  useEffect(() => {
    speakingRef.current = speaking
  }, [speaking])

  // Each word boundary kicks the mouth open; it decays in the loop below, so
  // movement follows the speech instead of a metronome.
  useEffect(() => {
    if (speechTick > 0) pulseRef.current = 1
  }, [speechTick])

  useEffect(() => {
    const paint = (draw, m, talk) => {
      const base = mix(LETTER_U, SMILE, m)
      // Reactions bend the resting mouth before any speech is layered on.
      const reaction = reactionRef.current
      let shaped = base
      if (m > 0.9 && !speakingRef.current) {
        if (reaction === 'bored') shaped = mix(base, FLAT, 0.85)
        else if (reaction === 'tongue') shaped = mix(base, WIDE, 0.45)
        else if (excitedRef.current) shaped = mix(base, WIDE, 0.7)
      }
      // Mouth only opens once there's a mouth to open.
      const d = filamentPath(talk > 0 ? mix(shaped, TALK, talk * m) : shaped)
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
        // Pupils drift a few units toward the pointer.
        eyesRef.current.style.transform = `translate(${curX.current * 3.2}px, ${curY.current * 2.6}px)`
        eyesRef.current.style.transformOrigin = '60px 41px'
      }
      // Eyes are scaled individually so one can close on its own.
      const lid = blinkRef.current ? 0.12 : reaction === 'bored' ? 0.45 : eyeOpen
      if (eyeLRef.current) {
        eyeLRef.current.style.transformOrigin = '50px 41px'
        eyeLRef.current.style.transform = `scaleY(${lid})`
      }
      if (eyeRRef.current) {
        eyeRRef.current.style.transformOrigin = '70px 41px'
        eyeRRef.current.style.transform = `scaleY(${reaction === 'wink' ? 0.1 : lid})`
      }
      if (tongueRef.current) {
        tongueRef.current.setAttribute('opacity', reaction === 'tongue' ? eyeOpen : 0)
      }
      // Head tilt: leans toward the pointer and lifts when it's above her.
      if (tiltRef.current) {
        const lean = curX.current * 5
        const lift = -Math.max(0, -curY.current) * 3.5
        tiltRef.current.setAttribute('transform', `translate(0 ${lift}) rotate(${lean} 60 76)`)
      }
    }

    if (prefersReducedMotion()) {
      paint(1, effectiveFace ? 1 : 0, 0)
      return
    }

    const start = performance.now()
    let introSettled = !intro
    let raf

    const tick = (now) => {
      const elapsed = now - start
      const draw = intro ? clamp01(elapsed / DRAW_MS) : 1

      // Ease the pupil target
      curX.current += (targetX.current - curX.current) * 0.1
      curY.current += (targetY.current - curY.current) * 0.1

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
      // Two detuned sines as a base — a single one reads as a metronome — with
      // the word pulse layered on top where the browser reports boundaries.
      const tsec = now / 1000
      const w1 = Math.sin(tsec * TALK_HZ * 2 * Math.PI)
      const w2 = Math.sin(tsec * TALK_HZ * 1.73 * 2 * Math.PI + 1.1)
      const wave = clamp01(0.5 + 0.34 * w1 + 0.16 * w2)
      pulseRef.current *= 0.88
      const shaped = clamp01(wave * 0.55 + pulseRef.current * 0.75)
      const talk = talkEnv.current * (0.18 + 0.82 * shaped)

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
  const initial = filamentPath(intro ? LETTER_U : effectiveFace ? SMILE : LETTER_U)

  return (
    <div
      ref={mascotRef}
      className={`lumi lumi--${state} ${className}`}
      style={{ width: size, height: size * 0.98 }}
      aria-hidden="true"
    >
      <svg viewBox="0 0 120 118" className="h-full w-full overflow-visible">
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

        {/* One group so the bulb, face and base lean together */}
        <g ref={tiltRef}>

        {/* A pale rim is drawn first, a couple of pixels wider than each shape.
            The navy outline alone has nowhere to go against a navy page; this
            gives the whole silhouette an edge without changing its colour. */}
        <g fill="none" stroke={RIM} strokeLinejoin="round">
          <path d={BULB} strokeWidth="9" />
          <rect x="45.5" y="87" width="29" height="10" rx="5" strokeWidth="7.5" />
          <rect x="49.5" y="100" width="21" height="10" rx="5" strokeWidth="7.5" />
        </g>

        <path d={BULB} fill="url(#lumi-glass)" stroke={NAVY} strokeWidth="5" strokeLinejoin="round" />

        {/* Screw base: two bars stepping down in width, outlined and filled
            like the glass so the bottom doesn't dissolve into the page. */}
        <rect x="45.5" y="87" width="29" height="10" rx="5" fill="url(#lumi-glass)" stroke={NAVY} strokeWidth="4" />
        <rect x="49.5" y="100" width="21" height="10" rx="5" fill="url(#lumi-glass)" stroke={NAVY} strokeWidth="4" />

        <path
          ref={filamentRef}
          d={initial}
          pathLength="100"
          fill="none"
          stroke={filamentColor}
          strokeWidth={intro || !effectiveFace ? 9 : 7}
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
          strokeWidth={intro || !effectiveFace ? 9 : 7}
          strokeLinecap="round"
          strokeDasharray="100"
          strokeDashoffset={intro ? 100 : 0}
          opacity={brightness * 0.9}
          style={{ filter: 'blur(3px)' }}
        />

        {/* Tongue sits under the mouth and is revealed by the reaction. */}
        <path
          ref={tongueRef}
          d="M54 62 Q60 74 66 62 Z"
          fill="#F49A6A"
          stroke={NAVY}
          strokeWidth="2.5"
          strokeLinejoin="round"
          opacity="0"
        />

        <g ref={eyesRef} className="lumi-eyes" opacity={intro ? 0 : effectiveFace ? 1 : 0}>
          <ellipse ref={eyeLRef} cx="50" cy="41" rx="3.2" ry="4.2" fill={NAVY} />
          <ellipse ref={eyeRRef} cx="70" cy="41" rx="3.2" ry="4.2" fill={NAVY} />
        </g>

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
