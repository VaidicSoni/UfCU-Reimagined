import { useOnboarding } from '../context/OnboardingContext.jsx'
import { SUGGESTED } from '../lib/concierge.js'
import { Mascot } from './Mascot.jsx'

// The collapsed corner dock. Lumi bounces and shakes on her own via CSS; the
// open chat lives in the page layout, not here.
export function LumiTrigger({ open, onOpen, onAsk, mood = 'idle' }) {
  const { lang, progress } = useOnboarding()

  return (
    <div className={`dock-anchor fixed bottom-6 left-6 z-40 ${open ? 'dock-anchor--hidden' : ''}`}>
      <div className="relative">
        <div className="pointer-events-none absolute bottom-[126px] left-0 hidden w-max flex-col-reverse items-start gap-2 lg:flex">
          {SUGGESTED[lang].slice(0, 3).map((q, i) => (
            <button
              key={q}
              onClick={() => onAsk(q)}
              style={{ animationDelay: `${260 + i * 110}ms, ${1400 + i * 400}ms` }}
              className="dock-chip group pointer-events-auto flex items-center gap-2.5 whitespace-nowrap rounded-full bg-white/[0.08] py-2 pl-3.5 pr-4 text-[13px] font-semibold text-white/90 shadow-lg shadow-navy-darkest/40 ring-1 ring-white/15 backdrop-blur-md transition hover:bg-white/[0.16] hover:text-white hover:ring-white/35"
            >
              <span
                aria-hidden="true"
                className="h-1.5 w-1.5 shrink-0 rounded-full bg-orange transition group-hover:bg-orange-lighter"
              />
              {q}
            </button>
          ))}
        </div>

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
