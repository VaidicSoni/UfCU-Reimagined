import { useState } from 'react'
import { useOnboarding } from '../context/OnboardingContext.jsx'
import { Button } from './Button.jsx'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001'

export function DemoLogin({ lang }) {
  const { signInDemo } = useOnboarding()
  const [open, setOpen] = useState(false)
  const [email, setEmail] = useState('alex.student@demo.ufcu.org')
  const [password, setPassword] = useState('demo123')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const isSpanish = lang === 'es'

  const submit = async (event) => {
    event.preventDefault()
    setBusy(true)
    setError('')
    try {
      const response = await fetch(`${API_BASE}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Login failed')
      signInDemo(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded-full border-2 border-white/30 px-5 py-2.5 text-sm font-bold text-white transition hover:border-white/60 hover:bg-white/10"
      >
        {isSpanish ? 'Iniciar sesión demo' : 'Demo login'}
      </button>

      {open && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-navy-darkest/70 p-5 backdrop-blur-sm">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="demo-login-title"
            className="u-card w-full max-w-md bg-white p-6 shadow-card sm:p-8"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-orange-darker">
                  {isSpanish ? 'Solo para demostración' : 'Local demo only'}
                </p>
                <h2 id="demo-login-title" className="mt-2 text-2xl font-extrabold text-navy">
                  {isSpanish ? 'Iniciar sesión' : 'Sign in'}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label={isSpanish ? 'Cerrar' : 'Close'}
                className="text-2xl leading-none text-navy-lighter hover:text-navy"
              >
                ×
              </button>
            </div>

            <p className="mt-3 text-sm leading-relaxed text-navy-lighter">
              {isSpanish
                ? 'Usa una cuenta sembrada para abrir un panel poblado.'
                : 'Use a seeded account to open a populated dashboard.'}
            </p>

            <form onSubmit={submit} className="mt-6 space-y-4">
              <label className="block">
                <span className="mb-1 block text-sm font-bold text-navy">Email</span>
                <input
                  type="email"
                  autoComplete="username"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="w-full rounded-xl border-2 border-navy-subtle bg-white px-4 py-3 text-sm text-navy outline-none focus:border-orange"
                  required
                />
              </label>
              <label className="block">
                <span className="mb-1 block text-sm font-bold text-navy">Password</span>
                <input
                  type="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="w-full rounded-xl border-2 border-navy-subtle bg-white px-4 py-3 text-sm text-navy outline-none focus:border-orange"
                  required
                />
              </label>

              <p className="rounded-xl bg-navy-subtle/40 px-3 py-2 text-xs text-navy-lighter">
                {isSpanish ? 'Contraseña demo para las tres cuentas: ' : 'Demo password for all three accounts: '}
                <strong className="text-navy">demo123</strong>
              </p>

              {error && <p role="alert" className="text-sm font-semibold text-orange-darker">{error}</p>}

              <div className="flex gap-3 pt-2">
                <Button type="button" variant="ghost" onClick={() => setOpen(false)} className="flex-1">
                  {isSpanish ? 'Cancelar' : 'Cancel'}
                </Button>
                <Button type="submit" disabled={busy} className="flex-1">
                  {busy ? (isSpanish ? 'Entrando...' : 'Signing in...') : (isSpanish ? 'Continuar' : 'Continue')}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
