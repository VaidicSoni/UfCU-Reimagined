import { useState } from 'react'
import { useOnboarding } from '../context/OnboardingContext.jsx'
import { t } from '../lib/i18n.js'
import { SUBSCRIPTIONS, formatMoney } from '../lib/mockApi.js'

// Recurring payments, with each one switchable. The point isn't the list — it's
// letting someone see what dropping one actually saves them over a year, which
// is the number that changes behaviour.
export function SubscriptionTracker({ active, hidden }) {
  const { lang } = useOnboarding()
  const [off, setOff] = useState([])

  if (!active) {
    return (
      <section className="u-card border-2 border-navy-subtle bg-white p-5 sm:p-6">
        <h2 className="text-sm font-extrabold uppercase tracking-[0.14em] text-navy">
          {t(lang, 'subsTitle')}
        </h2>
        <p className="mt-3 text-sm text-navy-lighter">{t(lang, 'subsNone')}</p>
      </section>
    )
  }

  const kept = SUBSCRIPTIONS.filter((s) => !off.includes(s.id))
  const monthly = kept.reduce((a, s) => a + s.amount, 0)
  const total = SUBSCRIPTIONS.reduce((a, s) => a + s.amount, 0)
  const toggle = (id) =>
    setOff((o) => (o.includes(id) ? o.filter((x) => x !== id) : [...o, id]))

  return (
    <section className="u-card border-2 border-navy-subtle bg-white p-5 sm:p-6">
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <div>
          <h2 className="text-sm font-extrabold uppercase tracking-[0.14em] text-navy">
            {t(lang, 'subsTitle')}
          </h2>
          <p className="mt-0.5 text-xs font-semibold text-navy-lighter">
            {t(lang, 'subsCount', kept.length)}
          </p>
        </div>
        <p className="text-right">
          <span className="text-2xl font-extrabold tabular-nums text-navy">
            {hidden ? '••••' : formatMoney(monthly, lang)}
          </span>
          <span className="ml-1 text-xs text-navy-lighter">{t(lang, 'subsPerMonth')}</span>
        </p>
      </div>
      <p className="mt-1 text-sm text-navy-lighter">{t(lang, 'subsSub')}</p>

      {/* Proportion bar — one segment per kept subscription */}
      <div
        className="mt-4 flex h-3 w-full overflow-hidden rounded-full bg-navy-subtle/60"
        aria-hidden="true"
      >
        {kept.map((s, i) => (
          <div
            key={s.id}
            className="h-full transition-all duration-500"
            style={{
              width: `${(s.amount / (total || 1)) * 100}%`,
              background: ['#23335D', '#EF6820', '#8182B1', '#F2780C', '#CDCDE0'][i % 5],
            }}
          />
        ))}
      </div>

      <ul className="mt-4 space-y-2">
        {SUBSCRIPTIONS.map((s, i) => {
          const on = !off.includes(s.id)
          return (
            <li key={s.id}>
              <button
                onClick={() => toggle(s.id)}
                aria-pressed={on}
                className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition ${
                  on ? 'hover:bg-navy-subtle/30' : 'opacity-50 hover:opacity-70'
                }`}
              >
                <span
                  aria-hidden="true"
                  className="h-3 w-3 shrink-0 rounded-full"
                  style={{ background: ['#23335D', '#EF6820', '#8182B1', '#F2780C', '#CDCDE0'][i % 5] }}
                />
                <span className="flex-1 truncate text-sm font-semibold text-navy">
                  {lang === 'es' ? s.es : s.en}
                </span>
                <span className="shrink-0 text-sm font-bold tabular-nums text-navy">
                  {hidden ? '••••' : formatMoney(s.amount, lang)}
                </span>
                <span
                  aria-hidden="true"
                  className={`flex h-5 w-9 shrink-0 items-center rounded-full p-0.5 transition ${
                    on ? 'bg-orange' : 'bg-navy-subtle'
                  }`}
                >
                  <span
                    className={`h-4 w-4 rounded-full bg-white transition-transform ${
                      on ? 'translate-x-4' : 'translate-x-0'
                    }`}
                  />
                </span>
              </button>
            </li>
          )
        })}
      </ul>

      <p className="mt-4 border-t-2 border-navy-subtle pt-3 text-sm text-navy-lighter">
        {hidden ? '••••' : formatMoney(monthly * 12, lang)} {t(lang, 'subsPerYear')}
      </p>
    </section>
  )
}
