import { useState } from 'react'
import { useOnboarding } from '../context/OnboardingContext.jsx'
import { t } from '../lib/i18n.js'
import { formatMoney } from '../lib/mockApi.js'

// Horizontal bars rather than a pie: the question people actually ask is
// "which account has the most in it", and length is far easier to compare than
// angle. Assets and debts are separate groups so a balance is never visually
// netted against a loan.
function Group({ title, rows, tone, hidden, selected, onSelect, lang }) {
  const max = Math.max(...rows.map((r) => r.amount), 1)
  const bar = tone === 'owe' ? 'bg-orange' : 'bg-navy'
  const barMuted = tone === 'owe' ? 'bg-orange/35' : 'bg-navy/30'

  return (
    <div>
      <p className="text-xs font-bold uppercase tracking-[0.14em] text-navy-lighter">{title}</p>
      <ul className="mt-3 space-y-2.5">
        {rows.map((row) => {
          const active = selected === row.key
          const pct = Math.max(2, Math.round((row.amount / max) * 100))
          return (
            <li key={row.key}>
              <button
                onClick={() => onSelect(active ? null : row.key)}
                aria-pressed={active}
                aria-label={`${row.label}: ${formatMoney(row.amount, lang)}`}
                className={`w-full rounded-xl px-2 py-2 text-left transition ${
                  active ? 'bg-navy-subtle/50' : 'hover:bg-navy-subtle/30'
                }`}
              >
                <div className="flex items-baseline justify-between gap-3">
                  <span className="truncate text-sm font-semibold text-navy">{row.label}</span>
                  <span className="shrink-0 text-sm font-extrabold tabular-nums text-navy">
                    {hidden ? '••••' : formatMoney(row.amount, lang)}
                  </span>
                </div>
                <div className="mt-1.5 h-2.5 w-full overflow-hidden rounded-full bg-navy-subtle/60">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${active ? bar : barMuted}`}
                    style={{ width: hidden ? '20%' : `${pct}%` }}
                  />
                </div>
                {active && !hidden && (
                  <p className="mt-1.5 text-xs text-navy-lighter">{row.hint}</p>
                )}
              </button>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export function AccountChart({ assets, debts, hidden }) {
  const { lang } = useOnboarding()
  const [selected, setSelected] = useState(null)

  const totalAssets = assets.reduce((a, r) => a + r.amount, 0)
  const totalDebts = debts.reduce((a, r) => a + r.amount, 0)
  const net = totalAssets - totalDebts
  const empty = totalAssets === 0 && totalDebts === 0

  return (
    <section className="u-card border-2 border-navy-subtle bg-white p-5 sm:p-6">
      <h2 className="text-sm font-extrabold uppercase tracking-[0.14em] text-navy">
        {t(lang, 'chartTitle')}
      </h2>

      {empty ? (
        <p className="mt-4 text-sm text-navy-lighter">{t(lang, 'chartEmpty')}</p>
      ) : (
        <div className="mt-5 space-y-6">
          {assets.length > 0 && (
            <Group
              title={t(lang, 'chartHave')}
              rows={assets}
              tone="have"
              hidden={hidden}
              selected={selected}
              onSelect={setSelected}
              lang={lang}
            />
          )}
          {debts.length > 0 ? (
            <Group
              title={t(lang, 'chartOwe')}
              rows={debts}
              tone="owe"
              hidden={hidden}
              selected={selected}
              onSelect={setSelected}
              lang={lang}
            />
          ) : (
            <p className="text-sm text-navy-lighter">{t(lang, 'chartNothing')}</p>
          )}

          <div className="flex items-baseline justify-between border-t-2 border-navy-subtle pt-4">
            <span className="text-xs font-bold uppercase tracking-[0.14em] text-navy-lighter">
              {t(lang, 'chartNet')}
            </span>
            <span
              className={`text-xl font-extrabold tabular-nums ${
                net < 0 ? 'text-orange-darker' : 'text-navy'
              }`}
            >
              {hidden ? '••••' : `${net < 0 ? '−' : ''}${formatMoney(Math.abs(net), lang)}`}
            </span>
          </div>
        </div>
      )}
    </section>
  )
}
