import { DEMO_TRANSACTIONS, formatMoney } from '../lib/mockApi.js'

export function RecentActivity({ persona, hidden, lang }) {
  const rows = DEMO_TRANSACTIONS[persona] || DEMO_TRANSACTIONS.personal
  const isSpanish = lang === 'es'

  return (
    <section className="u-card border-2 border-navy-subtle bg-white p-5 sm:p-6">
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <div>
          <h2 className="text-sm font-extrabold uppercase tracking-[0.14em] text-navy">
            {isSpanish ? 'Actividad reciente' : 'Recent activity'}
          </h2>
          <p className="mt-1 text-xs text-navy-lighter">
            {isSpanish ? 'Movimientos publicados y pendientes' : 'Posted and pending transactions'}
          </p>
        </div>
        <span className="rounded-full bg-navy-subtle/50 px-3 py-1 text-xs font-bold text-navy">
          {rows.length} {isSpanish ? 'movimientos' : 'transactions'}
        </span>
      </div>

      <ul className="mt-4 divide-y divide-navy-subtle/60">
        {rows.slice(0, 8).map((row) => {
          const income = row.amount > 0
          return (
            <li key={row.id} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
              <span
                aria-hidden="true"
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-extrabold ${
                  income ? 'bg-emerald-50 text-emerald-700' : row.status === 'pending' ? 'bg-amber-subtle text-amber-darkest' : 'bg-navy-subtle/50 text-navy'
                }`}
              >
                {income ? '+' : row.transfer ? '↔' : '−'}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold text-navy">{row.merchant}</p>
                <p className="text-xs text-navy-lighter">
                  {row.date} · {row.status === 'pending' ? (isSpanish ? 'Pendiente' : 'Pending') : row.category}
                </p>
              </div>
              <span className={`shrink-0 text-sm font-extrabold tabular-nums ${income ? 'text-emerald-700' : 'text-navy'}`}>
                {hidden ? '••••' : `${income ? '+' : '−'}${formatMoney(Math.abs(row.amount), lang)}`}
              </span>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
