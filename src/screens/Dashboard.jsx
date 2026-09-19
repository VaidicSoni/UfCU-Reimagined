import { useEffect, useMemo, useState } from 'react'
import { useOnboarding } from '../context/OnboardingContext.jsx'
import { t } from '../lib/i18n.js'
import { Icon } from '../components/Icons.jsx'
import { VirtualCard } from '../components/VirtualCard.jsx'
import { AccountChart } from '../components/AccountChart.jsx'
import { IncomeSpendBars } from '../components/IncomeSpendBars.jsx'
import { SubscriptionTracker } from '../components/SubscriptionTracker.jsx'
import { SavingsGoal } from '../components/SavingsGoal.jsx'
import { SpendingDonut } from '../components/SpendingDonut.jsx'
import { PetalChart } from '../components/PetalChart.jsx'
import { SwipeCategory } from '../components/SwipeCategory.jsx'
import { StudentNextSteps } from '../components/StudentNextSteps.jsx'
import { RecentActivity } from '../components/RecentActivity.jsx'
import { bundleFor, GOALS, formatMoney } from '../lib/mockApi.js'

// The first sixty seconds as a member — and, on the 90-day view, what the
// account looks like once it's actually in use.
//
// Patterned on the live UFCU portal (navy greeting band, routing number with a
// copy button, sort-by, grouped sections with an orange accent rail, masked
// number plus suffix code, total-available, quick transfer) with the panel set
// drawn from modern money apps: a spending donut, income against spend, a goal
// with a completion date, recurring payments.
//
// The panels are laid out as CSS columns rather than a grid. A grid leaves a
// ragged edge whenever one column runs shorter than another; columns pack by
// height, so there are no gaps to look at.

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

// Every panel gets the same wrapper so nothing splits across a column break.
const Panel = ({ children }) => <div className="mb-5 break-inside-avoid">{children}</div>

export function Dashboard({ chatOpen }) {
  const { lang, goals, form, funded, go } = useOnboarding()
  const [hidden, setHidden] = useState(false)
  const [revealed, setRevealed] = useState(false)
  const [sort, setSort] = useState('type')
  const [copied, setCopied] = useState(false)
  const [done, setDone] = useState([])
  const [timeline, setTimeline] = useState('day1')
  const [from, setFrom] = useState(0)
  const [to, setTo] = useState(1)
  const [amount, setAmount] = useState('')
  const [notice, setNotice] = useState(null)

  const isStudent = form.university && form.university !== 'none'
  const isBusiness = goals.includes('business')
  const dashboardTheme = isBusiness ? 'business' : isStudent ? 'student' : 'personal'
  const persona = dashboardTheme
  const radiusClass = dashboardTheme === 'business' ? 'rounded-md' : 'rounded-2xl'

  // Animate stagger wrapper. mb-5 and break-inside-avoid are what stop a panel
  // splitting across a column break — the layout is CSS columns, not a grid.
  const Panel = ({ children }) => (
    <div className={`mb-5 break-inside-avoid animate-in fade-in slide-in-from-bottom-3 ${radiusClass} overflow-hidden`}>
      {children}
    </div>
  )

  // Memoised on `goals`: bundleFor returns a fresh array each call, and an
  // unstable identity here cascades into `seed` and re-sets balances on every
  // render — an infinite loop.
  const items = useMemo(() => {
    const picked = bundleFor(goals)
    // Deep-linking here (or skipping goal selection) would leave an empty list.
    return picked.length ? picked : GOALS.find((g) => g.id === 'everyday').bundle
  }, [goals])
  const deposits = useMemo(() => items.filter((i) => i.kind === 'deposit'), [items])
  const others = useMemo(() => items.filter((i) => i.kind !== 'deposit'), [items])
  const day90 = timeline === 'day90'

  const seed = useMemo(
    () => deposits.map((d, i) => (day90 ? d.balance90 ?? 0 : i === 0 && funded ? 25 : 0)),
    [deposits, day90, funded]
  )
  const [balances, setBalances] = useState(seed)
  // Switching the view resets any transfers made in the other one.
  useEffect(() => setBalances(seed), [seed])


  const accounts = deposits.map((item, i) => ({
    key: item.en,
    label: lang === 'es' ? item.es : item.en,
    hint: lang === 'es' ? item.valueEs : item.valueEn,
    ...MASKS[i % MASKS.length],
    balance: balances[i] ?? 0,
    index: i,
  }))

  const total = balances.reduce((a, b) => a + b, 0)

  const debts = day90
    ? others
        .filter((i) => (i.owed90 ?? 0) > 0)
        .map((i) => ({
          key: i.en,
          label: lang === 'es' ? i.es : i.en,
          hint: lang === 'es' ? i.valueEs : i.valueEn,
          amount: i.owed90,
        }))
    : []

  const grouped = useMemo(() => {
    const list = [...accounts]
    if (sort === 'balance') {
      list.sort((a, b) => b.balance - a.balance)
      return [[null, list]]
    }
    return ['grpChecking', 'grpSavings', 'grpOther']
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

  const money = (n) => (hidden ? '••••' : formatMoney(n, lang))
  const toggleDone = (id) =>
    setDone((d) => (d.includes(id) ? d.filter((x) => x !== id) : [...d, id]))

  // With the chat open the column is half a screen wide; three would crush.
  const columns = chatOpen ? 'columns-1' : 'columns-1 lg:columns-2 xl:columns-3'

  return (
    <div className="space-y-5">
      {/* Greeting band. Solid navy with a brand rule — the old gradient sat
          under the balance and cost it contrast. */}
      <section className="u-card relative overflow-hidden bg-navy p-6 text-white sm:p-8">
        <div aria-hidden="true" className="absolute inset-x-0 top-0 h-1.5 bg-orange" />

        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="display text-3xl font-extrabold sm:text-4xl">
              {t(lang, 'dashGreeting', form.firstName || 'friend')}
            </h1>
            <p className="mt-2 text-sm text-navy-subtle">{t(lang, 'dashSub')}</p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div
              className="flex items-center gap-1 rounded-full bg-white/10 p-1"
              role="group"
              aria-label={t(lang, 'timelineLabel')}
            >
              {[
                ['day1', 'timelineDay1'],
                ['day90', 'timelineDay90'],
              ].map(([value, label]) => (
                <button
                  key={value}
                  onClick={() => setTimeline(value)}
                  aria-pressed={timeline === value}
                  className={`rounded-full px-3.5 py-1.5 text-xs font-bold transition ${
                    timeline === value ? 'bg-white text-navy' : 'text-white/80 hover:bg-white/15'
                  }`}
                >
                  {t(lang, label)}
                </button>
              ))}
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
        </div>

        <div className="mt-6 flex flex-wrap items-end justify-between gap-4 border-t border-white/15 pt-5">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-navy-subtle">
              {t(lang, 'totalAvailable')}
            </p>
            <p className="display mt-1 text-4xl font-extrabold tabular-nums sm:text-5xl">
              {money(total)}
            </p>
            {day90 && <p className="mt-2 text-xs text-navy-subtle">{t(lang, 'timelineNote')}</p>}
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

      <div className={columns}>
        {/* Accounts */}
        <Panel>
          <section className="u-card border-2 border-navy-subtle bg-white p-5 sm:p-6">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-sm font-extrabold uppercase tracking-[0.14em] text-navy">
                {t(lang, 'accountsHeading')}
              </h2>
              <div className="flex items-center gap-2" role="group" aria-label={t(lang, 'sortBy')}>
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
                    <li
                      key={a.key}
                      className="flex items-center gap-4 border-b border-navy-subtle/60 px-4 py-3.5 last:border-0"
                    >
                      <span aria-hidden="true" className="h-9 w-1 shrink-0 rounded-full bg-orange" />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-base font-bold text-navy">{a.label}</p>
                        <p className="text-xs text-navy-lighter">
                          {a.mask} · {a.suffix}
                        </p>
                      </div>
                      <p className="shrink-0 text-base font-extrabold tabular-nums text-navy">
                        {money(a.balance)}
                      </p>
                    </li>
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
                      {day90 && (item.owed90 ?? 0) > 0 ? (
                        <span className="shrink-0 text-base font-extrabold tabular-nums text-orange-darker">
                          {hidden ? '••••' : `−${formatMoney(item.owed90, lang)}`}
                        </span>
                      ) : (
                        <span className="shrink-0 rounded-full bg-amber-subtle px-3 py-1 text-xs font-bold text-amber-darkest">
                          {item.kind === 'card'
                            ? t(lang, 'statusCardActive')
                            : t(lang, 'statusPrequalified')}
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </section>
        </Panel>

        {day90 && (
          <Panel>
            <SpendingDonut hidden={hidden} />
          </Panel>
        )}

        <Panel>
          <VirtualCard
            hidden={hidden}
            revealed={revealed}
            onToggle={() => setRevealed((v) => !v)}
          />
        </Panel>

        <Panel>
          <RecentActivity persona={persona} hidden={hidden} lang={lang} />
        </Panel>

        {day90 && (
          <Panel>
            <SavingsGoal hidden={hidden} />
          </Panel>
        )}

        {isStudent && timeline === 'day90' ? (
          <Panel>
            <PetalChart accounts={accounts} />
          </Panel>
        ) : (
          <Panel>
            <AccountChart
              assets={accounts
                .filter((a) => a.balance > 0)
                .map((a) => ({ key: a.key, label: a.label, hint: a.hint, amount: a.balance }))}
              debts={debts}
              hidden={hidden}
            />
          </Panel>
        )}

        {timeline === 'day90' && (
          <Panel>
            <IncomeSpendBars hidden={hidden} />
          </Panel>
        )}

        {isStudent && timeline === 'day90' && (
          <Panel>
            <SwipeCategory lang={lang} />
          </Panel>
        )}

        {timeline === 'day90' && (
          <Panel>
            <SubscriptionTracker active hidden={hidden} />
          </Panel>
        )}

        {/* Quick transfer */}
        {accounts.length > 1 && (
          <Panel>
            <section className="u-card border-2 border-navy-subtle bg-white p-5 sm:p-6">
              <h2 className="text-sm font-extrabold uppercase tracking-[0.14em] text-navy">
                {t(lang, 'quickTransfer')}
              </h2>
              <div className="mt-4 space-y-3">
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
          </Panel>
        )}

        {/* Finish setting up / Explore Features */}
        {isStudent ? (
          <Panel>
            <StudentNextSteps />
          </Panel>
        ) : (
          <Panel>
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
                      className={`u-chip flex w-full items-center gap-3 border-2 p-3.5 text-left transition ${
                        complete
                          ? 'border-emerald-500/60 bg-emerald-50'
                          : 'border-navy-subtle bg-white hover:border-navy-lighter'
                      }`}
                    >
                      <Glyph
                        className={`h-5 w-5 shrink-0 ${complete ? 'text-emerald-600' : 'text-navy-lighter'}`}
                      />
                      <span className="flex-1">
                        <span className="block text-sm font-bold text-navy">{t(lang, title)}</span>
                        <span className="block text-xs text-navy-lighter">{t(lang, body)}</span>
                      </span>
                      <span
                        aria-hidden="true"
                        className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 text-xs font-bold ${
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
        </Panel>
        )}
      </div>

      <div className="flex flex-col items-center gap-3">
        <button
          onClick={() => go('done')}
          className="text-sm font-semibold text-navy-subtle underline hover:text-white"
        >
          {t(lang, 'back')}
        </button>
        <p className="text-center text-xs text-navy-subtle">{t(lang, 'dashDemoNote')}</p>
      </div>
    </div>
  )
}
