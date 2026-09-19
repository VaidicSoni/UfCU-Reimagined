import { useState } from 'react'
import { useOnboarding } from '../context/OnboardingContext.jsx'
import { getSuggestions } from '../lib/concierge.js'
import { Mascot } from './Mascot.jsx'

// The collapsed corner dock. Lumi bounces and shakes on her own via CSS; the
// open chat lives in the page layout, not here.
// Chips are now context-aware: they change based on the current screen + focused field.
export function LumiTrigger({ open, onOpen, onAsk, mood = 'idle' }) {
  const [hoveredChip, setHoveredChip] = useState(false)
  const { lang, step, progress, fontScale, focusedField } = useOnboarding()
  const suggestions = getSuggestions(step, focusedField, lang)

  // A flex column rather than absolute offsets: questions vary in length, and
  // fixed positions made long ones wrap into each other.
  const showChips = fontScale === 1 && step !== 'dashboard'

  return (
    <div className={`dock-anchor fixed bottom-6 left-6 z-40 ${open ? 'dock-anchor--hidden' : ''}`}>
      <div className="flex flex-col items-start gap-2">
        {/* Hidden below xl, where the card leaves no clear gutter, and at the
            larger text settings, where the card grows to fill it. Lumi herself
            is always tappable, and the same questions sit inside the chat. */}
        {showChips && (
          <div className="mb-2 hidden flex-col items-start gap-2 xl:flex">
            {suggestions.slice(0, 3).map((q, i) => (
              <button
                key={q}
                onClick={() => onAsk(q)}
                onMouseEnter={() => setHoveredChip(true)}
                onMouseLeave={() => setHoveredChip(false)}
                style={{ animationDelay: `${260 + i * 110}ms, ${1400 + i * 400}ms` }}
                className="dock-chip max-w-[14rem] rounded-2xl border border-white/25 bg-navy-darkest/85 px-4 py-2 text-left text-sm font-semibold leading-snug text-white shadow-card backdrop-blur transition hover:bg-navy-darker"
              >
                {q}
              </button>
            ))}
          </div>
        )}

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
            />
          </span>
          <span className="pointer-events-none absolute -right-3 -top-2 rounded-full bg-orange px-3 py-1 text-xs font-extrabold text-white shadow-card xl:hidden">
            {lang === 'es' ? 'Ayuda' : 'Help'}
          </span>
        </button>
      </div>
    </div>
  )
}
