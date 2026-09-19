import { useState } from 'react'
import { useOnboarding } from '../context/OnboardingContext.jsx'
import { t } from '../lib/i18n.js'
import { GOAL, formatMoney } from '../lib/mockApi.js'

// The slider is the point: seeing the completion date move as you change the
// monthly amount is what makes a target feel reachable.
export function SavingsGoal({ hidden }) {
  const { lang } = useOnboarding()
  const [monthly, setMonthly] = useState(80)

  const remaining = Math.max(GOAL.target - GOAL.saved, 0)
  const months = remaining === 0 ? 0 : Math.ceil(remaining / monthly)
  const done = new Date()
  done.setMonth(done.getMonth() + months)
  const when = done.toLocaleDateString(lang === 'es' ? 'es-US' : 'en-US', {
    month: 'short',
    year: 'numeric',
  })
  const pct = Math.min(Math.round((GOAL.saved / GOAL.target) * 100), 100)

  return (
    <section className="u-card border-2 border-navy-subtle bg-white p-5 sm:p-6">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="text-sm font-extrabold uppercase tracking-[0.14em] text-navy">
          {t(lang, 'goalTitle')}
        </h2>
        <span className="text-xs font-semibold text-navy-lighter">
          {lang === 'es' ? GOAL.es : GOAL.en}
        </span>
      </div>

      <p className="mt-4 text-3xl font-extrabold tabular-nums text-navy">
        {hidden ? '••••' : formatMoney(GOAL.saved, lang)}
        <span className="ml-2 text-sm font-semibold text-navy-lighter">
          / {hidden ? '••••' : formatMoney(GOAL.target, lang)}
        </span>
      </p>

      {/* Progress against the target line */}
      <div className="relative mt-4">
        <div className="h-3 w-full overflow-hidden rounded-full bg-navy-subtle/60">
          <div
            className="h-full rounded-full bg-orange transition-all duration-500"
            style={{ width: `${pct}%` }}
          />
        </div>
        <p className="mt-1.5 text-xs font-semibold text-navy-lighter">
          {pct}% · {t(lang, 'goalTarget')} {hidden ? '••••' : formatMoney(GOAL.target, lang)}
        </p>
      </div>

      <label className="mt-5 block">
        <span className="mb-2 flex items-baseline justify-between gap-2">
          <span className="text-xs font-bold text-navy-lighter">{t(lang, 'goalAdjust')}</span>
          <span className="text-lg font-extrabold tabular-nums text-navy">
            {formatMoney(monthly, lang)}{' '}
            <span className="text-xs font-semibold text-navy-lighter">
              {t(lang, 'goalPerMonth')}
            </span>
          </span>
        </span>
        <input
          type="range"
          min="25"
          max="300"
          step="5"
          value={monthly}
          onChange={(e) => setMonthly(Number(e.target.value))}
          className="w-full accent-orange"
        />
      </label>

      <p className="mt-4 rounded-xl bg-navy-subtle/40 px-4 py-3 text-sm text-navy">
        {remaining === 0 ? (
          <span className="font-bold">{t(lang, 'goalReached')}</span>
        ) : (
          <>
            {t(lang, 'goalDone')} <span className="font-extrabold">{when}</span>
          </>
        )}
      </p>
    </section>
  )
}
