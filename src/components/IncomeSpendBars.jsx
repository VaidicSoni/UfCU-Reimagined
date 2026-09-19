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
    <section className="border-2 border-transparent bg-[#1C1C1E] rounded-2xl p-5 sm:p-6 shadow-card">
      <div className="flex flex-col items-center gap-4">
        <div className="relative flex items-center rounded-full bg-[#1C1C1E] p-1 w-full max-w-sm justify-between shadow-inner">
          <div 
            className="absolute h-8 rounded-full bg-[#3A3A3C] transition-all duration-300 ease-in-out shadow-sm"
            style={{
              width: `${100 / 4}%`,
              left: `${['week', 'month', 'quarter', 'year'].indexOf(grain) * (100 / 4)}%`
            }}
          />
          {['week', 'month', 'quarter', 'year'].map((value) => (
            <button
              key={value}
              onClick={() => {
                setGrain(value)
                setSelected(value === 'month' ? MONTHLY.length - 1 : 0)
              }}
              aria-pressed={grain === value}
              className={`relative z-10 flex-1 rounded-full py-1.5 text-xs font-bold capitalize transition-colors duration-200 ${
                grain === value ? 'text-white' : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              {value === 'month' ? (lang === 'es' ? 'Mes' : 'Month') : 
               value === 'week' ? (lang === 'es' ? 'Sem' : 'Week') : 
               value === 'quarter' ? (lang === 'es' ? 'Trim' : 'Quarter') :
               (lang === 'es' ? 'Año' : 'Year')}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-5 flex items-end justify-between gap-2 h-32">
        {periods.map((p, i) => {
          const on = i === index
          return (
            <button
              key={p.key}
              onClick={() => setSelected(i)}
              aria-pressed={on}
              aria-label={`${lang === 'es' ? p.es : p.en}: ${formatMoney(p.income, lang)} in, ${formatMoney(p.spend, lang)} out`}
              className={`relative flex flex-1 flex-col justify-end items-center gap-2 rounded-xl px-1 py-2 transition-all duration-300 ${
                on ? 'bg-[#2C2C2E] shadow-sm border border-[#3A3A3C]' : 'border border-transparent hover:bg-[#1C1C1E]'
              }`}
            >
              <span className="flex h-20 items-end justify-center w-full relative">
                {/* Income Bar (Back) */}
                <span
                  className="absolute w-3 rounded-t-sm bg-[#5E5CE6] transition-all duration-500"
                  style={{ height: `${Math.max((p.income / max) * 100, 4)}%`, opacity: on ? 1 : 0.6 }}
                />
                {/* Spend Bar (Front, textured via mask in real life, but using dotted background here) */}
                <span
                  className="absolute w-3 rounded-t-sm bg-[#32D74B] transition-all duration-500 bg-[radial-gradient(circle_at_center,_white_1px,_transparent_1px)] bg-[length:4px_4px]"
                  style={{ height: `${Math.max((p.spend / max) * 100, 4)}%`, opacity: on ? 1 : 0.6 }}
                />
              </span>
              <span className="text-[0.65rem] font-bold text-gray-400">
                {lang === 'es' ? p.es : p.en}
              </span>
            </button>
          )
        })}
      </div>

      <div className="mt-5 flex justify-center gap-6 text-xs text-gray-400">
        <div className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-[#5E5CE6]" /> {t(lang, 'flowIncome')}
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-[#32D74B]" /> {t(lang, 'flowSpend')}
        </div>
      </div>

      <dl className="mt-5 space-y-2 border-t-2 border-[#3A3A3C] pt-4">
        {[
          ['flowIncome', current.income, 'text-white', '#5E5CE6'],
          ['flowSpend', current.spend, 'text-white', '#32D74B'],
        ].map(([key, value, tone, dot]) => (
          <div key={key} className="flex items-center justify-between gap-3">
            <dt className="flex items-center gap-2 text-sm text-gray-400">
              <span aria-hidden="true" className="h-2.5 w-2.5 rounded-full" style={{ background: dot }} />
              {t(lang, key)}
            </dt>
            <dd className={`text-sm font-bold tabular-nums ${tone}`}>
              {hidden ? '••••' : formatMoney(value, lang)}
            </dd>
          </div>
        ))}
        <div className="flex items-center justify-between gap-3 border-t border-[#3A3A3C] pt-2">
          <dt className="text-sm font-bold text-white">{t(lang, 'flowNet')}</dt>
          <dd
            className={`text-base font-extrabold tabular-nums ${
              net < 0 ? 'text-red-400' : 'text-emerald-400'
            }`}
          >
            {hidden ? '••••' : `${net < 0 ? '−' : '+'}${formatMoney(Math.abs(net), lang)}`}
          </dd>
        </div>
      </dl>
    </section>
  )
}
