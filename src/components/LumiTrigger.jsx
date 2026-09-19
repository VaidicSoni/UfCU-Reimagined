import { useOnboarding } from '../context/OnboardingContext.jsx'
import { SUGGESTED } from '../lib/concierge.js'
import { Mascot } from './Mascot.jsx'

// Where the chips sit relative to Lumi — an arc sweeping up and out from the
// corner. Offsets are in px from the dock's bottom-left origin.
const CHIP_SPOTS = [
  { bottom: 116, left: 96 },
  { bottom: 178, left: 60 },
  { bottom: 238, left: 8 },
]

// The collapsed corner dock. Lumi bounces and shakes on her own via CSS; the
// open chat lives in the page layout, not here.
export function LumiTrigger({ open, onOpen, onAsk, mood = 'idle' }) {
  const { lang, progress } = useOnboarding()

  return (
    <div className={`dock-anchor fixed bottom-6 left-6 z-40 ${open ? 'dock-anchor--hidden' : ''}`}>
      <div className="relative">
        {SUGGESTED[lang].slice(0, 3).map((q, i) => (
          <button
            key={q}
            onClick={() => onAsk(q)}
            style={{
              bottom: CHIP_SPOTS[i].bottom,
              left: CHIP_SPOTS[i].left,
              animationDelay: `${260 + i * 110}ms, ${1400 + i * 400}ms`,
            }}
            className="dock-chip absolute hidden whitespace-nowrap rounded-full border border-white/25 bg-navy-darkest/80 px-4 py-2 text-sm font-semibold text-white shadow-card backdrop-blur hover:bg-navy-darker lg:block"
          >
            {q}
          </button>
        ))}

        <button
          onClick={onOpen}
          aria-label={lang === 'es' ? 'Preguntar a Lumi' : 'Ask Lumi a question'}
          className="relative flex items-end rounded-full"
        >
          <span className="dock-lumi-inner block">
            <Mascot
              brightness={0.32 + 0.68 * (progress.current / progress.total)}
              state={mood}
              size={96}
              face={false}
            />
          </span>
          <span className="pointer-events-none absolute -right-3 -top-2 rounded-full bg-orange px-3 py-1 text-xs font-extrabold text-white shadow-card lg:hidden">
            {lang === 'es' ? 'Ayuda' : 'Help'}
          </span>
        </button>
      </div>
    </div>
  )
}
