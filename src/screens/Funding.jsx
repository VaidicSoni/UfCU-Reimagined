import { useState } from 'react'
import { useOnboarding } from '../context/OnboardingContext.jsx'
import { t } from '../lib/i18n.js'
import { BANKS, delay } from '../lib/mockApi.js'
import { Button } from '../components/Button.jsx'

// Plaid stand-in. Credentials are never collected: picking a bank is enough to
// tell the story, and it keeps real logins off a demo laptop entirely.
export function Funding() {
  const { go, lang, linkedBank, setLinkedBank, setFunded } = useOnboarding()
  const [linking, setLinking] = useState(null)
  const [transferring, setTransferring] = useState(false)

  const link = async (bank) => {
    setLinking(bank.id)
    await delay(1600)
    setLinking(null)
    setLinkedBank(bank)
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

      {!linkedBank ? (
        <div className="grid gap-3 sm:grid-cols-2">
          {BANKS.map((bank) => (
            <button
              key={bank.id}
              onClick={() => link(bank)}
              disabled={!!linking}
              className="flex items-center gap-3 rounded-2xl border-2 border-navy-subtle bg-white p-4 text-left transition hover:border-navy-lighter disabled:opacity-50"
            >
              <span
                className="flex h-10 w-10 items-center justify-center rounded-xl text-sm font-extrabold text-white"
                style={{ background: bank.color }}
                aria-hidden="true"
              >
                {bank.name.charAt(0)}
              </span>
              <span className="flex-1 text-base font-semibold text-navy">{bank.name}</span>
              {linking === bank.id && <span className="text-sm text-navy-lighter">…</span>}
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
        <Button onClick={transfer} disabled={!linkedBank || transferring} className="w-full">
          {transferring ? '…' : t(lang, 'transferCta')}
        </Button>
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
