import { useState } from 'react'
import { useOnboarding } from '../context/OnboardingContext.jsx'
import { t } from '../lib/i18n.js'
import { SUBSCRIPTIONS, formatMoney } from '../lib/mockApi.js'

export function SubscriptionTracker({ active, hidden }) {
  const { lang, form } = useOnboarding()
  const [off, setOff] = useState([])
  const [menuOpen, setMenuOpen] = useState(null)

  const isStudent = form?.university && form.university !== 'none'
  const isDark = isStudent // Use dark Apple-style theme for students

  if (!active) {
    return null
  }

  const kept = SUBSCRIPTIONS.filter((s) => !off.includes(s.id))
  const monthly = kept.reduce((a, s) => a + s.amount, 0)
  const yearly = monthly * 12

  const cancelSub = (id) => {
    setOff(o => [...o, id])
    setMenuOpen(null)
  }

  // Dark Apple-style layout for students
  if (isDark) {
    return (
      <section className="bg-[#1C1C1E] rounded-2xl p-5 shadow-card border border-[#3A3A3C]">
        <div className="flex justify-between items-center mb-6 text-white">
          <h2 className="text-lg font-bold">Recurring</h2>
          <button className="h-8 w-8 rounded-full bg-[#2C2C2E] flex items-center justify-center text-xl font-light hover:bg-[#3A3A3C] transition">+</button>
        </div>

        <div className="bg-[#99C8FF] rounded-xl p-4 mb-6 relative overflow-hidden flex gap-4">
          <div className="text-4xl shrink-0 drop-shadow-sm">💡</div>
          <div className="pr-6">
            <p className="text-[#1A3B66] text-sm font-semibold">
              To cancel subscriptions or lower your bills, tap ⋮ on any of the rows to see your options.
            </p>
          </div>
          <button className="absolute top-3 right-3 text-[#1A3B66]/60 hover:text-[#1A3B66]">✕</button>
        </div>

        <div className="flex justify-between items-end mb-4">
          <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400">{kept.length} SUBSCRIPTIONS</h3>
          <p className="text-sm font-semibold text-gray-300">{hidden ? '••••' : `$${yearly.toFixed(2)} per year`}</p>
        </div>

        <div className="bg-[#2C2C2E] rounded-2xl overflow-hidden">
          {SUBSCRIPTIONS.map((s, i) => {
            const isCancelled = off.includes(s.id)
            if (isCancelled) return null

            return (
              <div key={s.id} className="relative group border-b border-[#3A3A3C] last:border-0 p-4 flex items-center gap-4 transition hover:bg-[#3A3A3C]/50">
                <div className="h-10 w-10 shrink-0 rounded-full bg-black flex items-center justify-center text-white font-bold overflow-hidden shadow-inner">
                  {/* Fake logo placeholder based on ID */}
                  {s.id === 'phone' ? '📱' : s.id === 'gym' ? '💪' : s.id === 'stream' ? 'N' : s.id === 'music' ? '♫' : '☁️'}
                </div>
                
                <div className="flex-1 min-w-0">
                  <h4 className="text-base font-semibold text-white truncate">{lang === 'es' ? s.es : s.en}</h4>
                  <p className="text-sm text-gray-400 mt-0.5">{s.id === 'gym' ? 'Tap to set schedule' : s.id === 'stream' ? 'Annual' : 'Monthly'}</p>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-base font-semibold text-white">{hidden ? '••••' : formatMoney(s.amount, lang)}</span>
                  <button 
                    onClick={() => setMenuOpen(menuOpen === s.id ? null : s.id)}
                    className="h-8 w-8 flex items-center justify-center text-gray-400 hover:text-white hover:bg-[#3A3A3C] rounded-full transition"
                  >
                    ⋮
                  </button>
                </div>

                {menuOpen === s.id && (
                  <div className="absolute right-12 top-10 w-48 bg-[#3A3A3C] rounded-xl shadow-xl z-20 border border-gray-600 overflow-hidden animate-in fade-in zoom-in-95">
                    <button className="w-full text-left px-4 py-3 text-sm text-white font-semibold hover:bg-[#4A4A4C] transition">Update Payment</button>
                    <div className="h-px bg-gray-600"></div>
                    <button onClick={() => cancelSub(s.id)} className="w-full text-left px-4 py-3 text-sm text-red-400 font-bold hover:bg-red-400/10 transition">Cancel Subscription</button>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </section>
    )
  }

  // Fallback for non-students (the original UFCU styled list with toggles)
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

      <div className="mt-4 flex h-3 w-full overflow-hidden rounded-full bg-navy-subtle/60" aria-hidden="true">
        {kept.map((s, i) => (
          <div key={s.id} className="h-full transition-all duration-500" style={{ width: `${(s.amount / (total || 1)) * 100}%`, background: ['#23335D', '#EF6820', '#8182B1', '#F2780C', '#CDCDE0'][i % 5] }} />
        ))}
      </div>

      <ul className="mt-4 space-y-2">
        {SUBSCRIPTIONS.map((s, i) => {
          const on = !off.includes(s.id)
          return (
            <li key={s.id}>
              <button
                onClick={() => setOff(o => o.includes(s.id) ? o.filter(x => x !== s.id) : [...o, s.id])}
                aria-pressed={on}
                className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition ${on ? 'hover:bg-navy-subtle/30' : 'opacity-50 hover:opacity-70'}`}
              >
                <span aria-hidden="true" className="h-3 w-3 shrink-0 rounded-full" style={{ background: ['#23335D', '#EF6820', '#8182B1', '#F2780C', '#CDCDE0'][i % 5] }} />
                <span className="flex-1 truncate text-sm font-semibold text-navy">{lang === 'es' ? s.es : s.en}</span>
                <span className="shrink-0 text-sm font-bold tabular-nums text-navy">{hidden ? '••••' : formatMoney(s.amount, lang)}</span>
                <span aria-hidden="true" className={`flex h-5 w-9 shrink-0 items-center rounded-full p-0.5 transition ${on ? 'bg-orange' : 'bg-navy-subtle'}`}>
                  <span className={`h-4 w-4 rounded-full bg-white transition-transform ${on ? 'translate-x-4' : 'translate-x-0'}`} />
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
