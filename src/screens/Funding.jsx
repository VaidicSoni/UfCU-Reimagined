import { useState } from 'react'
import { useOnboarding } from '../context/OnboardingContext.jsx'
import { t } from '../lib/i18n.js'
import { BANKS, delay } from '../lib/mockApi.js'
import { Button } from '../components/Button.jsx'
import { Icon } from '../components/Icons.jsx'
import { MockPlaid } from '../components/MockPlaid.jsx'

// Plaid stand-in. Credentials are never collected: picking a bank is enough to
// tell the story, and it keeps real logins off a demo laptop entirely.
export function Funding() {
  const { go, lang, linkedBank, setLinkedBank, setFunded } = useOnboarding()
  const [plaidBank, setPlaidBank] = useState(null)
  const [transferring, setTransferring] = useState(false)
  const [noAccount, setNoAccount] = useState(false)

  const handleBankClick = (bank) => {
    setPlaidBank(bank)
  }

  const handlePlaidSuccess = () => {
    setLinkedBank(plaidBank)
    setPlaidBank(null)
  }

  const transfer = async () => {
    setTransferring(true)
    await delay(1400)
    setFunded(true)
    go('done')
  }

  return (
    <div className="space-y-7">
      <h1 className="text-3xl font-extrabold leading-tight text-navy">{t(lang, 's7Title')}</h1>

      {plaidBank && (
        <MockPlaid 
          bank={plaidBank} 
          lang={lang} 
          onSuccess={handlePlaidSuccess} 
          onClose={() => setPlaidBank(null)} 
        />
      )}

      {/* Being unbanked is the reason to join a credit union, not a reason to
          be turned away — so it gets real routes rather than only "later". */}
      {noAccount && !linkedBank ? (
        <div className="space-y-4">
          <div className="u-chip border-2 border-navy-subtle bg-navy-subtle/25 p-5">
            <p className="text-base font-extrabold text-navy">{t(lang, 'noAccountTitle')}</p>
            <p className="mt-1 text-sm text-navy-lighter">{t(lang, 'noAccountBody')}</p>
          </div>

          <ul className="space-y-3">
            {[
              ['altDirectDeposit', 'altDirectDepositBody', 'everyday'],
              ['altBranch', 'altBranchBody', 'business'],
              ['altLater', 'altLaterBody', 'mortgage'],
            ].map(([title, body, icon]) => {
              const Glyph = Icon[icon]
              return (
                <li key={title}>
                  <button
                    onClick={() => go('done')}
                    className="u-chip flex w-full items-center gap-3 border-2 border-navy-subtle bg-white p-4 text-left transition hover:border-navy-lighter"
                  >
                    <Glyph className="h-6 w-6 shrink-0 text-navy-lighter" aria-hidden="true" />
                    <span className="flex-1">
                      <span className="block text-base font-bold text-navy">{t(lang, title)}</span>
                      <span className="block text-sm text-navy-lighter">{t(lang, body)}</span>
                    </span>
                    <Icon.chevron className="h-4 w-4 shrink-0 text-navy-lighter" aria-hidden="true" />
                  </button>
                </li>
              )
            })}
          </ul>

          <button
            onClick={() => setNoAccount(false)}
            className="w-full text-sm font-semibold text-navy-lighter underline"
          >
            {t(lang, 'backToBanks')}
          </button>
        </div>
      ) : !linkedBank ? (
        <div className="grid gap-3 sm:grid-cols-2">
          {BANKS.map((bank) => (
            <button
              key={bank.id}
              onClick={() => handleBankClick(bank)}
              className="flex items-center gap-3 rounded-2xl border-2 border-navy-subtle bg-white p-4 text-left transition hover:border-navy-lighter disabled:opacity-50"
            >
              {bank.logo ? (
                <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-white border border-black/5 shadow-sm">
                  <img src={bank.logo} alt="" className="h-full w-full object-cover" />
                </div>
              ) : (
                <span
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-sm font-extrabold text-white"
                  style={{ background: bank.color }}
                  aria-hidden="true"
                >
                  {bank.name.charAt(0)}
                </span>
              )}
              <span className="flex-1 text-base font-semibold text-navy">{bank.name}</span>
            </button>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border-2 border-emerald-500/50 bg-emerald-50 p-5">
          <p className="flex items-center gap-2 text-base font-bold text-emerald-800">
            <span aria-hidden="true">✓</span> {linkedBank.name}{' '}
            {lang === 'es' ? 'vinculado' : 'linked'}
          </p>
          <p className="mt-1 text-sm text-emerald-700">
            {lang === 'es' ? 'Listo para transferir.' : 'Ready to transfer your opening deposit.'}
          </p>
        </div>
      )}

      <div className="space-y-3">
        {/* Nothing to transfer from in the no-account view, so the CTA goes
            rather than sitting there greyed out. */}
        {!noAccount && (
          <div className="flex gap-3">
            <Button variant="ghost" onClick={() => go('secure')}>{t(lang, 'back')}</Button>
            <Button onClick={transfer} disabled={!linkedBank || transferring} className="flex-1">
              {transferring ? '…' : t(lang, 'transferCta')}
            </Button>
          </div>
        )}
        {!noAccount && !linkedBank && (
          <button
            onClick={() => setNoAccount(true)}
            className="w-full text-sm font-semibold text-navy underline"
          >
            {t(lang, 'noAccountCta')}
          </button>
        )}
        <button
          onClick={() => go('done')}
          className="w-full text-sm font-semibold text-navy-lighter underline"
        >
          {t(lang, 'skipFunding')}
        </button>
      </div>
    </div>
  )
}
