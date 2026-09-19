import { useEffect, useState } from 'react'
import { useOnboarding } from '../context/OnboardingContext.jsx'
import { t } from '../lib/i18n.js'
import { KYC_STEPS, GOALS } from '../lib/mockApi.js'

// The Productive Waiting Room. The dead time of a KYC check becomes a
// goal-aware cross-sell instead of a spinner.
export function Waiting() {
  const { go, lang, form, goals } = useOnboarding()
  const [done, setDone] = useState(0)
  const [loan, setLoan] = useState(18000)

  useEffect(() => {
    const timers = KYC_STEPS.map((_, i) =>
      setTimeout(() => setDone(i + 1), (i + 1) * 1300)
    )
    const finish = setTimeout(() => go('secure'), KYC_STEPS.length * 1300 + 900)
    return () => {
      timers.forEach(clearTimeout)
      clearTimeout(finish)
    }
  }, [go])

  const pct = Math.round((done / KYC_STEPS.length) * 100)
  const showAutoWidget = goals.includes('auto')
  const offers = GOALS.filter((g) => goals.includes(g.id) && g.offer)

  // Illustrative only: ~1.1 percentage points saved over 60 months.
  const savings = Math.round((loan * 0.011 * 60) / 12)

  return (
    <div className="space-y-7">
      <h1 className="text-3xl font-extrabold leading-tight text-navy">
        {t(lang, 's5Title', form.firstName || 'friend')}
      </h1>

      <div>
        <div className="mb-2 flex justify-between text-sm font-semibold text-navy-lighter">
          <span>{t(lang, 'verifying')}</span>
          <span>{pct}%</span>
        </div>
        <div className="h-2.5 w-full overflow-hidden rounded-full bg-navy-subtle">
          <div
            className="h-full rounded-full bg-orange transition-all duration-700"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      <ul className="space-y-3" aria-live="polite">
        {KYC_STEPS.map((step, i) => (
          <li key={step} className="flex items-center gap-3 text-base">
            <span
              aria-hidden="true"
              className={`flex h-6 w-6 items-center justify-center rounded-full text-sm font-bold ${
                i < done ? 'bg-emerald-500 text-white' : 'bg-navy-subtle text-navy-lighter'
              }`}
            >
              {i < done ? '✓' : i + 1}
            </span>
            <span className={i < done ? 'text-navy' : 'text-navy-lighter'}>{t(lang, step)}</span>
          </li>
        ))}
      </ul>

      {showAutoWidget ? (
        <div className="rounded-2xl bg-navy p-5 text-white">
          <p className="text-base font-bold">
            {lang === 'es'
              ? 'Los miembros de UFCU ahorran en préstamos de auto.'
              : 'UFCU members save on auto loans.'}
          </p>
          <p className="mt-1 text-sm text-navy-subtle">
            {lang === 'es' ? 'Mueva el control para ver su ahorro.' : 'Slide to see your estimate.'}
          </p>
          <input
            type="range"
            min="5000"
            max="60000"
            step="1000"
            value={loan}
            onChange={(e) => setLoan(Number(e.target.value))}
            aria-label={lang === 'es' ? 'Monto del préstamo' : 'Loan amount'}
            className="mt-4 w-full accent-orange"
          />
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-sm text-navy-subtle">${loan.toLocaleString()}</span>
            <span className="text-2xl font-extrabold text-orange-lighter">
              ~${savings.toLocaleString()}
            </span>
          </div>
          <p className="mt-1 text-xs text-navy-subtle">
            {lang === 'es' ? 'Ahorro estimado. Solo ilustrativo.' : 'Estimated savings. Illustrative only.'}
          </p>
        </div>
      ) : (
        <div className="rounded-2xl bg-navy p-5 text-white">
          <p className="text-base leading-relaxed">
            {offers.length > 0
              ? offers[0].offer[lang]
              : lang === 'es'
                ? 'Su cuenta corriente gratuita no tiene cargos mensuales ni saldo mínimo.'
                : 'Your Free Checking has no monthly fee and no minimum balance.'}
          </p>
        </div>
      )}
    </div>
  )
}
