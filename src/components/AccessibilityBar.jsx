import { useOnboarding } from '../context/OnboardingContext.jsx'
import { t } from '../lib/i18n.js'
import { stopSpeaking } from '../lib/speech.js'

// The prompt's bar for "good" is explicit: simple, and accessible across
// boomer / gen x / millennial / gen z / alpha. These controls are that answer.
export function AccessibilityBar() {
  const { lang, setLang, fontScale, setFontScale } = useOnboarding()

  const sizes = [
    { value: 1, label: 'A', title: 'Standard text size' },
    { value: 1.15, label: 'A+', title: 'Large text size' },
    { value: 1.3, label: 'A++', title: 'Largest text size' },
  ]

  return (
    <div className="flex items-center gap-3">
      <div
        className="flex items-center gap-1 rounded-full bg-white/15 p-1"
        role="group"
        aria-label={t(lang, 'textSize')}
      >
        {sizes.map((s) => (
          <button
            key={s.value}
            onClick={() => setFontScale(s.value)}
            title={s.title}
            aria-pressed={fontScale === s.value}
            className={`h-8 min-w-8 rounded-full px-2 text-sm font-bold transition ${
              fontScale === s.value
                ? 'bg-white text-navy'
                : 'text-white/80 hover:bg-white/15 hover:text-white'
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      <button
        onClick={() => {
          stopSpeaking()
          setLang(lang === 'en' ? 'es' : 'en')
        }}
        className="rounded-full bg-white/15 px-4 py-1.5 text-sm font-bold text-white transition hover:bg-white/25"
      >
        {t(lang, 'langToggle')}
      </button>
    </div>
  )
}
