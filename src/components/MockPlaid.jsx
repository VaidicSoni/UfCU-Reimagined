import { useState } from 'react'
import { t } from '../lib/i18n.js'
import { delay } from '../lib/mockApi.js'
import { Button } from './Button.jsx'

export function MockPlaid({ bank, lang, onSuccess, onClose }) {
  const [step, setStep] = useState('intro') // intro, credentials, manual, verifying, success
  const [user, setUser] = useState('')
  const [pass, setPass] = useState('')

  const handleCredSubmit = async (e) => {
    e.preventDefault()
    setStep('verifying')
    await delay(1500)
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
    onSuccess() // We'll just succeed for the sake of the demo
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy/80 p-4 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-card">
        {/* Plaid Header */}
        <div className="bg-navy p-4 flex items-center justify-between text-white">
          <div className="flex items-center gap-2 font-bold">
            <span className="opacity-70">Secured by</span> Plaid
          </div>
          <button onClick={onClose} className="opacity-70 hover:opacity-100">✕</button>
        </div>

        <div className="p-6">
          {step === 'intro' && (
            <div className="space-y-6 text-center">
              <div className="flex justify-center">
                {bank.logo ? (
                  <img src={bank.logo} alt={bank.name} className="h-16 w-16 rounded-xl object-contain shadow-sm border border-black/5 p-2" />
                ) : (
                  <div className="flex h-16 w-16 items-center justify-center rounded-xl text-2xl font-bold text-white" style={{ background: bank.color }}>
                    {bank.name.charAt(0)}
                  </div>
                )}
              </div>
              <div>
                <h2 className="text-xl font-bold text-navy">Connect to {bank.name}</h2>
                <p className="mt-2 text-sm text-navy-lighter">
                  UFCU uses Plaid to link your account. Choose how you'd like to verify your account to fund your opening deposit.
                </p>
              </div>
              <div className="space-y-3">
                <Button onClick={() => setStep('credentials')} className="w-full">
                  Electronic Verification (Instant)
                </Button>
                <button onClick={() => setStep('manual')} className="w-full text-sm font-semibold text-navy underline">
                  Manual Verification (1-2 Days)
                </button>
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

          {step === 'manual' && (
            <form onSubmit={handleManualSubmit} className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-navy">Manual Verification</h2>
                <p className="mt-2 text-sm text-navy-lighter">
                  We'll make two small deposits into your {bank.name} account. 
                  In 1-2 business days, you'll need to enter the first four characters of the reference code to verify it.
                </p>
              </div>
              <div className="space-y-4">
                <input
                  type="text"
                  required
                  placeholder="Routing Number"
                  className="w-full rounded-xl border-2 border-navy-subtle p-3 outline-none focus:border-orange"
                />
                <input
                  type="text"
                  required
                  placeholder="Account Number"
                  className="w-full rounded-xl border-2 border-navy-subtle p-3 outline-none focus:border-orange"
                />
              </div>
              <Button type="submit" className="w-full">Authorize Deposits</Button>
            </form>
          )}

          {step === 'verifying' && (
            <div className="flex flex-col items-center justify-center space-y-4 py-8">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-navy-subtle border-t-orange"></div>
              <p className="font-semibold text-navy">Verifying with {bank.name}...</p>
            </div>
          )}

          {step === 'success' && (
            <div className="flex flex-col items-center justify-center space-y-4 py-8 text-emerald-600">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-3xl">✓</div>
              <p className="font-bold text-navy">Account Successfully Linked</p>
            </div>
          )}
          
          {step === 'success_manual' && (
            <div className="flex flex-col items-center justify-center space-y-4 py-8 text-navy">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-navy/10 text-3xl">✉</div>
              <p className="font-bold">Deposits Sent</p>
              <p className="text-center text-sm text-navy-lighter">Check your {bank.name} account in 1-2 days for the verification codes.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
