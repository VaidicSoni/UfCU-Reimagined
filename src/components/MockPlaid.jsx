import { useState } from 'react'
import { t } from '../lib/i18n.js'
import { delay, BANKS } from '../lib/mockApi.js'
import { Button } from './Button.jsx'

// Two jobs, one flow. `funding` links an account to move an opening deposit;
// `identity` uses the same bank sign-in to establish who someone is, which is
// the way through for anyone whose documents won't scan or who has none.
export function MockPlaid({ bank: initialBank, mode = 'funding', lang, onSuccess, onClose }) {
  const identity = mode === 'identity'
  const [bank, setBank] = useState(initialBank || null)
  // pick, intro, credentials, failed, manual, verifying, success, success_manual
  const [step, setStep] = useState(initialBank ? 'intro' : 'pick')
  const [user, setUser] = useState('')
  const [pass, setPass] = useState('')
  const [attempts, setAttempts] = useState(0)

  const handleCredSubmit = async (e) => {
    e.preventDefault()
    setStep('verifying')
    await delay(1500)
    // The first attempt fails on purpose: banks routinely reject the first
    // sign-in, and a flow that only ever succeeds never shows the way out.
    if (attempts === 0) {
      setAttempts(1)
      setStep('failed')
      return
    }
    setStep('success')
    await delay(1000)
    onSuccess()
  }

  const handleManualSubmit = async (e) => {
    e.preventDefault()
    setStep('verifying')
    await delay(1500)
    setStep('success_manual')
    await delay(2000)
    onSuccess()
  }

  const headerColor = bank?.color || '#23335D'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy/80 p-4 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-card">
        <div className="flex items-center justify-between p-4 text-white" style={{ backgroundColor: headerColor }}>
          <div className="flex items-center gap-2 font-bold">
            <span className="opacity-70">Secured by</span>
            <img src="/logos/plaidLogo.png" alt="Plaid" className="h-5 brightness-0 invert" />
          </div>
          <button onClick={onClose} aria-label="Close" className="opacity-70 hover:opacity-100">✕</button>
        </div>

        <div className="p-6">
          {/* Identity mode opens without a bank chosen */}
          {step === 'pick' && (
            <div className="space-y-5">
              <div>
                <h2 className="text-xl font-bold text-navy">{t(lang, 'altVerifyCta')}</h2>
                <p className="mt-1 text-sm text-navy-lighter">{t(lang, 'altVerifyBody')}</p>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {BANKS.map((b) => (
                  <button
                    key={b.id}
                    onClick={() => {
                      setBank(b)
                      setStep('intro')
                    }}
                    className="flex items-center gap-2 rounded-xl border-2 border-navy-subtle p-3 text-left transition hover:border-navy-lighter"
                  >
                    {b.logo ? (
                      <img src={b.logo} alt="" className="h-7 w-7 shrink-0 rounded-lg object-cover" />
                    ) : (
                      <span
                        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-xs font-bold text-white"
                        style={{ background: b.color }}
                      >
                        {b.name.charAt(0)}
                      </span>
                    )}
                    <span className="truncate text-sm font-semibold text-navy">{b.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 'intro' && bank && (
            <div className="space-y-6 text-center">
              <div className="flex justify-center">
                {bank.logo ? (
                  <img src={bank.logo} alt={bank.name} className="h-16 w-16 rounded-xl border border-black/5 object-cover shadow-sm" />
                ) : (
                  <div className="flex h-16 w-16 items-center justify-center rounded-xl text-2xl font-bold text-white" style={{ background: bank.color }}>
                    {bank.name.charAt(0)}
                  </div>
                )}
              </div>
              <div>
                <h2 className="text-xl font-bold text-navy">Connect to {bank.name}</h2>
                <p className="mt-2 text-sm text-navy-lighter">
                  {identity
                    ? t(lang, 'altVerifyNote')
                    : "UFCU uses Plaid to link your account. Choose how you'd like to verify your account to fund your opening deposit."}
                </p>
              </div>
              <div className="space-y-3">
                <Button onClick={() => setStep('credentials')} className="w-full">
                  Electronic Verification (Instant)
                </Button>
                {!identity && (
                  <button onClick={() => setStep('manual')} className="w-full text-sm font-semibold text-navy underline">
                    Manual Verification (1-2 Days)
                  </button>
                )}
              </div>
            </div>
          )}

          {step === 'credentials' && (
            <form onSubmit={handleCredSubmit} className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-navy">Enter your credentials</h2>
                <p className="mt-1 text-sm text-navy-lighter">Your credentials are encrypted and never shared with UFCU.</p>
              </div>
              <div className="space-y-4">
                <input
                  type="text"
                  required
                  placeholder="User ID"
                  value={user}
                  onChange={(e) => setUser(e.target.value)}
                  className="w-full rounded-xl border-2 border-navy-subtle p-3 outline-none focus:border-orange"
                />
                <input
                  type="password"
                  required
                  placeholder="Password"
                  value={pass}
                  onChange={(e) => setPass(e.target.value)}
                  className="w-full rounded-xl border-2 border-navy-subtle p-3 outline-none focus:border-orange"
                />
              </div>
              <Button type="submit" disabled={!user || !pass} className="w-full">Submit</Button>
            </form>
          )}

          {/* A refused sign-in is common and must not be a dead end */}
          {step === 'failed' && (
            <div className="space-y-5">
              <div role="alert" className="rounded-xl bg-amber-subtle p-4">
                <p className="text-sm font-extrabold text-amber-darkest">{t(lang, 'plaidFailTitle')}</p>
                <p className="mt-1 text-sm leading-relaxed text-amber-darkest">{t(lang, 'plaidFailBody')}</p>
              </div>
              <div className="space-y-3">
                <Button onClick={() => setStep('credentials')} className="w-full">
                  {t(lang, 'plaidRetry')}
                </Button>
                {identity ? (
                  <button onClick={() => setStep('pick')} className="w-full text-sm font-semibold text-navy underline">
                    Choose a different bank
                  </button>
                ) : (
                  <button onClick={() => setStep('manual')} className="w-full text-sm font-semibold text-navy underline">
                    {t(lang, 'plaidUseManual')}
                  </button>
                )}
              </div>
            </div>
          )}

          {step === 'manual' && bank && (
            <form onSubmit={handleManualSubmit} className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-navy">Manual Verification</h2>
                <p className="mt-2 text-sm text-navy-lighter">
                  We'll make two small deposits into your {bank.name} account. In 1-2 business days,
                  you'll need to enter the first four characters of the reference code to verify it.
                </p>
              </div>
              <div className="space-y-4">
                <input type="text" required placeholder="Routing Number" className="w-full rounded-xl border-2 border-navy-subtle p-3 outline-none focus:border-orange" />
                <input type="text" required placeholder="Account Number" className="w-full rounded-xl border-2 border-navy-subtle p-3 outline-none focus:border-orange" />
              </div>
              <Button type="submit" className="w-full">Authorize Deposits</Button>
            </form>
          )}

          {step === 'verifying' && (
            <div className="flex flex-col items-center justify-center space-y-4 py-8">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-navy-subtle border-t-orange" />
              <p className="font-semibold text-navy">Verifying with {bank?.name}...</p>
            </div>
          )}

          {step === 'success' && (
            <div className="flex flex-col items-center justify-center space-y-4 py-8 text-emerald-600">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-3xl">✓</div>
              <p className="font-bold text-navy">
                {identity ? t(lang, 'altVerifyDone') : 'Account Successfully Linked'}
              </p>
            </div>
          )}

          {step === 'success_manual' && bank && (
            <div className="flex flex-col items-center justify-center space-y-4 py-8 text-navy">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-navy/10 text-3xl">✉</div>
              <p className="font-bold">Deposits Sent</p>
              <p className="text-center text-sm text-navy-lighter">
                Check your {bank.name} account in 1-2 days for the verification codes.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
