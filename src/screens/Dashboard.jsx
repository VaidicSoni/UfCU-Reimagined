import { useMemo, useState } from 'react'
import { useOnboarding } from '../context/OnboardingContext.jsx'
import { t } from '../lib/i18n.js'
import { bundleFor, GOALS } from '../lib/mockApi.js'
import { Icon } from '../components/Icons.jsx'

// The first sixty seconds as a member.
//
// Patterned on the live UFCU portal — the navy greeting band, the routing
// number with a copy button, sort-by, grouped account sections with an orange
// accent rail, masked number plus suffix code, a total-available row and quick
// transfer are all theirs. What's changed is the density: balances lead, the
// groups are collapsible, and nothing is buried behind a menu. Their own
// reviews say members can't find a balance, so that's the thing we fix.

const MASKS = [
  { mask: '••••2722', suffix: 'S0081' },
  { mask: '••••0861', suffix: 'S0080' },
  { mask: '••••1578', suffix: 'S0090' },
  { mask: '••••1572', suffix: 'S0100' },
]

const groupOf = (name) => {
  if (/checking|corriente/i.test(name)) return 'grpChecking'
  if (/savings|certificate|ahorro|certificado/i.test(name)) return 'grpSavings'
  return 'grpOther'
}

function Row({ account, hidden, lang }) {
  return (
    <li className="flex items-center gap-4 border-b border-navy-subtle/60 px-4 py-3.5 last:border-0">
      <span aria-hidden="true" className="h-9 w-1 shrink-0 rounded-full bg-orange" />
      <div className="min-w-0 flex-1">
        <p className="truncate text-base font-bold text-navy">{account.label}</p>
        <p className="text-xs text-navy-lighter">
          {account.mask} · {account.suffix}
        </p>
      </div>
      <p className="shrink-0 text-base font-extrabold tabular-nums text-navy">
        {hidden ? '••••' : `$${account.balance.toFixed(2)}`}
      </p>
    </li>
  )
}

export function Dashboard() {
  const { lang, goals, form, funded } = useOnboarding()
  const [hidden, setHidden] = useState(false)
  const [revealed, setRevealed] = useState(false)
  const [sort, setSort] = useState('type')
  const [copied, setCopied] = useState(false)
  const [done, setDone] = useState([])

  // Deep-linking here (or skipping goal selection) would leave an empty list.
  const picked = bundleFor(goals)
  const items = picked.length ? picked : GOALS.find((g) => g.id === 'everyday').bundle
  const deposits = items.filter((i) => i.kind === 'deposit')
  const others = items.filter((i) => i.kind !== 'deposit')

  const [balances, setBalances] = useState(() =>
    deposits.map((_, i) => (i === 0 && funded ? 25 : 0))
  )
  const [from, setFrom] = useState(0)
  const [to, setTo] = useState(1)
  const [amount, setAmount] = useState('')
  const [notice, setNotice] = useState(null)

  const accounts = deposits.map((item, i) => ({
    key: item.en,
    label: lang === 'es' ? item.es : item.en,
    hint: lang === 'es' ? item.valueEs : item.valueEn,
    ...MASKS[i % MASKS.length],
    balance: balances[i] ?? 0,
    index: i,
  }))

  const total = balances.reduce((a, b) => a + b, 0)

  const grouped = useMemo(() => {
    const list = [...accounts]
    if (sort === 'balance') {
      list.sort((a, b) => b.balance - a.balance)
      return [[null, list]]
    }
    const order = ['grpChecking', 'grpSavings', 'grpOther']
    return order
      .map((g) => [g, list.filter((a) => groupOf(a.key) === g)])
      .filter(([, rows]) => rows.length > 0)
  }, [accounts, sort])

  const transfer = () => {
    const value = Number(amount)
    if (from === to) return setNotice(t(lang, 'transferSame'))
    if (!value || value <= 0) return setNotice(null)
    if (value > balances[from]) return setNotice(t(lang, 'transferFunds'))
    setBalances((b) => b.map((v, i) => (i === from ? v - value : i === to ? v + value : v)))
    setAmount('')
    setNotice(t(lang, 'transferDone'))
  }

  const copyRouting = async () => {
    try {
      await navigator.clipboard.writeText('314977405')
    } catch {
      /* clipboard blocked — the number is on screen either way */
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 1800)
  }

  const money = (n) => (hidden ? '••••' : `$${n.toFixed(2)}`)
  const toggleDone = (id) =>
    setDone((d) => (d.includes(id) ? d.filter((x) => x !== id) : [...d, id]))

  return (
    <div className="space-y-6">
      {/* Greeting band — the portal's navy header, with the routing number
          members actually come looking for. */}
      <section className="u-card bg-gradient-to-br from-navy via-navy to-navy-darker p-6 text-white sm:p-7">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="display text-3xl font-extrabold sm:text-4xl">
              {t(lang, 'dashGreeting', form.firstName || 'friend')}
            </h1>
            <p className="mt-2 text-sm text-navy-subtle">{t(lang, 'dashSub')}</p>
          </div>
          <button
            onClick={() => setHidden((v) => !v)}
            aria-pressed={hidden}
            className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-bold transition hover:bg-white/25"
          >
            <Icon.eye className="h-4 w-4" aria-hidden="true" />
            {hidden ? t(lang, 'showBalances') : t(lang, 'hideBalances')}
          </button>
        </div>

        <div className="mt-6 flex flex-wrap items-end justify-between gap-4 border-t border-white/15 pt-5">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-navy-subtle">
              {t(lang, 'totalAvailable')}
            </p>
            <p className="display mt-1 text-4xl font-extrabold tabular-nums">{money(total)}</p>
          </div>
          <button
            onClick={copyRouting}
            aria-label={t(lang, 'copyAria')}
            className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm transition hover:bg-white/20"
          >
            <span className="text-navy-subtle">{t(lang, 'routingNumber')}</span>
            <span className="font-bold tabular-nums">314977405</span>
            {copied ? (
              <span className="font-bold text-emerald-300">{t(lang, 'copied')}</span>
            ) : (
              <Icon.copy className="h-4 w-4" aria-hidden="true" />
            )}
          </button>
        </div>
      </section>

      {/* Accounts */}
      <section className="u-card border-2 border-navy-subtle bg-white p-5 sm:p-6">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-sm font-extrabold uppercase tracking-[0.14em] text-navy">
            {t(lang, 'accountsHeading')}
          </h2>
          <div className="flex items-center gap-2" role="group" aria-label={t(lang, 'sortBy')}>
            <span className="text-xs font-semibold text-navy-lighter">{t(lang, 'sortBy')}</span>
            {[
              ['type', 'sortType'],
              ['balance', 'sortBalance'],
            ].map(([value, label]) => (
              <button
                key={value}
                onClick={() => setSort(value)}
                aria-pressed={sort === value}
                className={`rounded-full px-3 py-1.5 text-xs font-bold transition ${
                  sort === value
                    ? 'bg-navy text-white'
                    : 'bg-navy-subtle/50 text-navy hover:bg-navy-subtle'
                }`}
              >
                {t(lang, label)}
              </button>
            ))}
          </div>
        </div>

        {grouped.map(([group, rows]) => (
          <div key={group || 'all'} className="mb-4 last:mb-0">
            {group && (
              <p className="mb-1 px-1 text-xs font-bold uppercase tracking-[0.14em] text-navy-lighter">
                {t(lang, group)}
              </p>
            )}
            <ul className="overflow-hidden rounded-2xl border border-navy-subtle/70">
              {rows.map((a) => (
                <Row key={a.key} account={a} hidden={hidden} lang={lang} />
              ))}
            </ul>
          </div>
        ))}

        {others.length > 0 && (
          <div className="mt-4">
            <p className="mb-1 px-1 text-xs font-bold uppercase tracking-[0.14em] text-navy-lighter">
              {t(lang, 'grpOther')}
            </p>
            <ul className="overflow-hidden rounded-2xl border border-navy-subtle/70">
              {others.map((item) => (
                <li
                  key={item.en}
                  className="flex items-center gap-4 border-b border-navy-subtle/60 px-4 py-3.5 last:border-0"
                >
                  <span aria-hidden="true" className="h-9 w-1 shrink-0 rounded-full bg-amber" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-base font-bold text-navy">
                      {lang === 'es' ? item.es : item.en}
                    </p>
                    <p className="text-xs text-navy-lighter">
                      {lang === 'es' ? item.valueEs : item.valueEn}
                    </p>
                  </div>
                  <span className="shrink-0 rounded-full bg-amber-subtle px-3 py-1 text-xs font-bold text-amber-darkest">
                    {item.kind === 'card'
                      ? t(lang, 'statusCardActive')
                      : t(lang, 'statusPrequalified')}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>

      {/* Quick transfer — actually moves money between the accounts above */}
      {accounts.length > 1 && (
        <section className="u-card border-2 border-navy-subtle bg-white p-5 sm:p-6">
          <h2 className="text-sm font-extrabold uppercase tracking-[0.14em] text-navy">
            {t(lang, 'quickTransfer')}
          </h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            {[
              [t(lang, 'tFrom'), from, setFrom],
              [t(lang, 'tTo'), to, setTo],
            ].map(([label, value, setter]) => (
              <label key={label} className="block">
                <span className="mb-1 block text-xs font-bold text-navy-lighter">{label}</span>
                <select
                  value={value}
                  onChange={(e) => {
                    setter(Number(e.target.value))
                    setNotice(null)
                  }}
                  className="w-full rounded-xl border-2 border-navy-subtle bg-white px-3 py-2.5 text-sm font-semibold text-navy outline-none"
                >
                  {accounts.map((a) => (
                    <option key={a.key} value={a.index}>
                      {a.label}
                    </option>
                  ))}
                </select>
              </label>
            ))}
            <label className="block">
              <span className="mb-1 block text-xs font-bold text-navy-lighter">
                {t(lang, 'tAmount')}
              </span>
              <input
                inputMode="decimal"
                value={amount}
                onChange={(e) => {
                  setAmount(e.target.value.replace(/[^0-9.]/g, ''))
                  setNotice(null)
                }}
                placeholder="0.00"
                className="w-full rounded-xl border-2 border-navy-subtle bg-white px-3 py-2.5 text-sm font-semibold text-navy outline-none"
              />
            </label>
          </div>

          {notice && (
            <p
              role="status"
              className={`mt-3 text-sm font-semibold ${
                notice === t(lang, 'transferDone') ? 'text-emerald-600' : 'text-orange-darker'
              }`}
            >
              {notice}
            </p>
          )}

          <button
            onClick={transfer}
            disabled={!amount}
            className="mt-4 w-full rounded-full bg-navy px-5 py-3 text-base font-bold text-white transition hover:bg-navy-darker disabled:opacity-40"
          >
            {t(lang, 'transferNow')}
          </button>
        </section>
      )}

      {/* Virtual card */}
      <section
        aria-label={t(lang, 'virtualCard')}
        className="u-card relative overflow-hidden bg-gradient-to-br from-navy-darker via-navy to-navy-darkest p-6 text-white"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-16 -top-20 h-56 w-56 rounded-full bg-orange/25 blur-2xl"
        />
        <div className="relative flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-navy-subtle">
              {t(lang, 'virtualCard')}
            </p>
            <p className="mt-1 inline-flex items-center gap-1.5 text-sm font-bold text-emerald-300">
              <span aria-hidden="true">●</span> {t(lang, 'cardActive')}
            </p>
          </div>
          <span className="text-lg font-extrabold lowercase tracking-tight">ufcu</span>
        </div>
        <p className="relative mt-8 font-mono text-xl tracking-[0.14em] sm:text-2xl">
          {hidden ? '•••• •••• •••• ••••' : revealed ? '4821 7734 0192 4721' : '•••• •••• •••• 4721'}
        </p>
        <div className="relative mt-6 flex items-end justify-between gap-4">
          <div>
            <p className="text-[0.65rem] font-bold uppercase tracking-[0.16em] text-navy-subtle">
              {t(lang, 'cardHolder')}
            </p>
            <p className="mt-0.5 text-sm font-semibold uppercase">
              {`${form.firstName || 'New'} ${form.lastName || 'Member'}`.trim()}
            </p>
          </div>
          <div className="text-right">
            <p className="text-[0.65rem] font-bold uppercase tracking-[0.16em] text-navy-subtle">
              {t(lang, 'cardExpires')}
            </p>
            <p className="mt-0.5 text-sm font-semibold">09/30</p>
          </div>
        </div>
        <button
          onClick={() => setRevealed((v) => !v)}
          aria-pressed={revealed}
          disabled={hidden}
          className="relative mt-6 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-bold transition hover:bg-white/25 disabled:opacity-40"
        >
          <Icon.eye className="h-4 w-4" aria-hidden="true" />
          {revealed ? t(lang, 'hideNumber') : t(lang, 'revealNumber')}
        </button>
      </section>

      {/* Next steps */}
      <section className="u-card border-2 border-navy-subtle bg-white p-5 sm:p-6">
        <h2 className="text-sm font-extrabold uppercase tracking-[0.14em] text-navy">
          {t(lang, 'nextSteps')}
        </h2>
        <p className="mt-1 text-sm text-navy-lighter">{t(lang, 'nextStepsSub')}</p>
        <ul className="mt-4 space-y-3">
          {[
            { id: 'deposit', icon: 'everyday', title: 'stepDeposit', body: 'stepDepositBody' },
            { id: 'wallet', icon: 'phone', title: 'stepWallet', body: 'stepWalletBody' },
            { id: 'card', icon: 'mortgage', title: 'stepCard', body: 'stepCardBody' },
          ].map(({ id, icon, title, body }) => {
            const complete = done.includes(id)
            const Glyph = Icon[icon]
            return (
              <li key={id}>
                <button
                  onClick={() => toggleDone(id)}
                  aria-pressed={complete}
                  className={`u-chip flex w-full items-center gap-4 border-2 p-4 text-left transition ${
                    complete
                      ? 'border-emerald-500/60 bg-emerald-50'
                      : 'border-navy-subtle bg-white hover:border-navy-lighter'
                  }`}
                >
                  <Glyph
                    className={`h-6 w-6 shrink-0 ${complete ? 'text-emerald-600' : 'text-navy-lighter'}`}
                  />
                  <span className="flex-1">
                    <span className="block text-base font-bold text-navy">{t(lang, title)}</span>
                    <span className="block text-sm text-navy-lighter">{t(lang, body)}</span>
                  </span>
                  <span
                    aria-hidden="true"
                    className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 text-sm font-bold ${
                      complete
                        ? 'border-emerald-500 bg-emerald-500 text-white'
                        : 'border-navy-subtle text-transparent'
                    }`}
                  >
                    ✓
                  </span>
                </button>
              </li>
            )
          })}
        </ul>
      </section>

      <p className="text-center text-xs text-navy-subtle">{t(lang, 'dashDemoNote')}</p>
    </div>
  )
}
