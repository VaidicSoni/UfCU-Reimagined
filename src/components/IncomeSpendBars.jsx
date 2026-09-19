import { useState } from 'react'
import { useOnboarding } from '../context/OnboardingContext.jsx'
import { t } from '../lib/i18n.js'
import { MONTHLY, formatMoney } from '../lib/mockApi.js'

// Paired bars per period, income against spend. The quarter view is a real
// aggregation of the same rows, not a relabelled month.
export function IncomeSpendBars({ hidden }) {
  const { lang } = useOnboarding()
  const [grain, setGrain] = useState('month')
  const [selected, setSelected] = useState(MONTHLY.length - 1)

  const periods =
    grain === 'month'
      ? MONTHLY
      : [0, 3].map((start) => {
          const chunk = MONTHLY.slice(start, start + 3)
          return {
            key: `q${start / 3 + 1}`,
            en: `Q${start / 3 + 1}`,
            es: `T${start / 3 + 1}`,
            income: chunk.reduce((a, m) => a + m.income, 0),
            spend: chunk.reduce((a, m) => a + m.spend, 0),
          }
        })

  const index = Math.min(selected, periods.length - 1)
  const current = periods[index]
  const max = Math.max(...periods.flatMap((p) => [p.income, p.spend]))
  const net = current.income - current.spend

  return (
    <section className="u-card border-2 border-navy-subtle bg-white p-5 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-sm font-extrabold uppercase tracking-[0.14em] text-navy">
          {t(lang, 'flowTitle')}
        </h2>
        <div className="flex items-center gap-1 rounded-full bg-navy-subtle/50 p-1">
          {[
            ['month', 'timelineDay1'],
            ['quarter', 'timelineDay1'],
          ].map(([value]) => (
            <button
              key={value}
              onClick={() => setSelected(periods.length - 1) || setGrain(value)}
              aria-pressed={grain === value}
              className={`rounded-full px-3 py-1 text-xs font-bold capitalize transition ${
                grain === value ? 'bg-navy text-white' : 'text-navy hover:bg-navy-subtle'
              }`}
            >
              {value === 'month'
                ? lang === 'es' ? 'Mes' : 'Month'
                : lang === 'es' ? 'Trimestre' : 'Quarter'}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-5 flex items-end justify-between gap-2">
        {periods.map((p, i) => {
          const on = i === index
          return (
            <button
              key={p.key}
              onClick={() => setSelected(i)}
              aria-pressed={on}
              aria-label={`${lang === 'es' ? p.es : p.en}: ${formatMoney(p.income, lang)} in, ${formatMoney(p.spend, lang)} out`}
              className={`flex flex-1 flex-col items-center gap-2 rounded-xl px-1 py-2 transition ${
                on ? 'bg-navy-subtle/50' : 'hover:bg-navy-subtle/30'
              }`}
            >
              <span className="flex h-24 items-end gap-1">
                <span
                  className="w-2.5 rounded-t bg-navy transition-all duration-500"
                  style={{ height: `${Math.max((p.income / max) * 96, 4)}px`, opacity: on ? 1 : 0.45 }}
                />
                <span
                  className="w-2.5 rounded-t bg-orange transition-all duration-500"
                  style={{ height: `${Math.max((p.spend / max) * 96, 4)}px`, opacity: on ? 1 : 0.45 }}
                />
              </span>
              <span className="text-xs font-bold text-navy-lighter">
                {lang === 'es' ? p.es : p.en}
              </span>
            </button>
          )
        })}
      </div>

      <dl className="mt-5 space-y-2 border-t-2 border-navy-subtle pt-4">
        {[
          ['flowIncome', current.income, 'text-navy', '#23335D'],
          ['flowSpend', current.spend, 'text-navy', '#EF6820'],
        ].map(([key, value, tone, dot]) => (
          <div key={key} className="flex items-center justify-between gap-3">
            <dt className="flex items-center gap-2 text-sm text-navy-lighter">
              <span aria-hidden="true" className="h-2.5 w-2.5 rounded-full" style={{ background: dot }} />
              {t(lang, key)}
            </dt>
            <dd className={`text-sm font-bold tabular-nums ${tone}`}>
              {hidden ? '••••' : formatMoney(value, lang)}
            </dd>
          </div>
        ))}
        <div className="flex items-center justify-between gap-3 border-t border-navy-subtle pt-2">
          <dt className="text-sm font-bold text-navy">{t(lang, 'flowNet')}</dt>
          <dd
            className={`text-base font-extrabold tabular-nums ${
              net < 0 ? 'text-orange-darker' : 'text-emerald-600'
            }`}
          >
            {hidden ? '••••' : `${net < 0 ? '−' : '+'}${formatMoney(Math.abs(net), lang)}`}
          </dd>
        </div>
      </dl>
    </section>
  )
}
