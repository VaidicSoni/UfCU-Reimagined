import { useOnboarding } from '../context/OnboardingContext.jsx'
import { t } from '../lib/i18n.js'
import { GOALS } from '../lib/mockApi.js'
import { Button } from '../components/Button.jsx'
import { Icon } from '../components/Icons.jsx'
import { BundleCard } from '../components/BundleCard.jsx'

// Goals-first: we ask *why* they're here before asking for anything sensitive.
export function Goals() {
  const { goals, toggleGoal, go, lang } = useOnboarding()

  return (
    <div className="space-y-7">
      <header>
        <h1 className="text-3xl font-extrabold leading-tight text-navy">{t(lang, 's1Title')}</h1>
        <p className="mt-2 text-base text-navy-lighter">{t(lang, 's1Sub')}</p>
      </header>

      <div className="grid gap-3 sm:grid-cols-2">
        {GOALS.map((goal) => {
          const selected = goals.includes(goal.id)
          const Glyph = Icon[goal.icon]
          return (
            <button
              key={goal.id}
              onClick={() => toggleGoal(goal.id)}
              aria-pressed={selected}
              className={`u-chip flex items-center gap-3.5 border-2 p-4 text-left transition ${
                selected
                  ? 'border-orange bg-orange-subtle'
                  : 'border-navy-subtle bg-white hover:border-navy-lighter'
              }`}
            >
              <Glyph className={`h-6 w-6 shrink-0 ${selected ? 'text-orange-darker' : 'text-navy-lighter'}`} />
              <span className="flex-1 text-base font-semibold text-navy">{goal[lang]}</span>
              <span
                aria-hidden="true"
                className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 text-sm font-bold ${
                  selected ? 'border-orange bg-orange text-white' : 'border-navy-subtle text-transparent'
                }`}
              >
                ✓
              </span>
            </button>
          )
        })}
      </div>

      <BundleCard />

      <div className="flex gap-3">
        <Button variant="ghost" onClick={() => go('welcome')}>{t(lang, 'back')}</Button>
        <Button onClick={() => go('about')} disabled={goals.length === 0} className="flex-1">
          {t(lang, 's1Cta')}
        </Button>
      </div>
    </div>
  )
}
