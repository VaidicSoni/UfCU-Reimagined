import { useState } from 'react'
import { useOnboarding } from '../context/OnboardingContext.jsx'
import { t } from '../lib/i18n.js'
import { SPEND_CATEGORIES, formatMoney } from '../lib/mockApi.js'

const R = 54
const C = 2 * Math.PI * R

// A donut earns its place here because the question is "what share went where",
// not "which is biggest" — and the total sits in the middle where it's read
// first. Selecting a category is what gives the exact figure.
export function SpendingDonut({ hidden }) {
  const { lang } = useOnboarding()
  const [selected, setSelected] = useState(null)

  const total = SPEND_CATEGORIES.reduce((a, c) => a + c.amount, 0)
  let offset = 0
  const segments = SPEND_CATEGORIES.map((cat) => {
    const share = cat.amount / total
    const dash = Math.max(share * C - 3, 1)
    const seg = { ...cat, share, dash, offset }
    offset += share * C
    return seg
  })

  const active = segments.find((s) => s.id === selected)

  return (
    <section className="u-card border-2 border-navy-subtle bg-white p-5 sm:p-6">
      <h2 className="text-sm font-extrabold uppercase tracking-[0.14em] text-navy">
        {t(lang, 'spendTitle')}
      </h2>

      <div className="relative mx-auto mt-4 w-full max-w-[220px]">
        <svg viewBox="0 0 140 140" className="w-full -rotate-90">
          <circle cx="70" cy="70" r={R} fill="none" stroke="#EEF0F7" strokeWidth="16" />
          {segments.map((seg) => (
            <circle
              key={seg.id}
              cx="70"
              cy="70"
              r={R}
              fill="none"
              stroke={seg.color}
              strokeWidth={selected === seg.id ? 20 : 16}
              strokeDasharray={`${seg.dash} ${C - seg.dash}`}
              strokeDashoffset={-seg.offset}
              strokeLinecap="butt"
              opacity={selected && selected !== seg.id ? 0.3 : 1}
              className="transition-all duration-300"
            />
          ))}
        </svg>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
          <p className="max-w-[7rem] text-xs leading-tight text-navy-lighter">
            {active ? (lang === 'es' ? active.es : active.en) : t(lang, 'spendTotal', t(lang, 'spendMonth'))}
          </p>
          <p className="mt-1 text-2xl font-extrabold tabular-nums text-navy">
            {hidden ? '••••' : formatMoney(active ? active.amount : total, lang)}
          </p>
        </div>
      </div>

      <ul className="mt-5 space-y-1">
        {segments.map((seg) => (
          <li key={seg.id}>
            <button
              onClick={() => setSelected(selected === seg.id ? null : seg.id)}
              aria-pressed={selected === seg.id}
              className={`flex w-full items-center gap-3 rounded-xl px-2 py-2 text-left transition ${
                selected === seg.id ? 'bg-navy-subtle/50' : 'hover:bg-navy-subtle/30'
              }`}
            >
              <span
                aria-hidden="true"
                className="flex h-8 w-8 items-center justify-center shrink-0 rounded-full text-sm"
                style={{ backgroundColor: `${seg.color}20`, color: seg.color }}
              >
                {seg.icon}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-semibold text-navy">
                  {lang === 'es' ? seg.es : seg.en}
                </span>
                <span className="block text-xs text-navy-lighter">
                  {Math.round(seg.share * 100)}% {t(lang, 'spendOfSpend')}
                </span>
              </span>
              <span className="shrink-0 text-sm font-bold tabular-nums text-navy">
                {hidden ? '••••' : formatMoney(seg.amount, lang)}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </section>
  )
}
