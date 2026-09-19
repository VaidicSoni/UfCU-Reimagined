import { useState } from 'react'
import { useOnboarding } from '../context/OnboardingContext.jsx'
import { t } from '../lib/i18n.js'
import { createPasskey } from '../lib/mockApi.js'
import { Button } from '../components/Button.jsx'
import { Mascot } from '../components/Mascot.jsx'

// The one genuinely real integration in the prototype: a WebAuthn passkey.
// On a supporting laptop this raises the actual Touch ID / Windows Hello sheet.
export function Secure() {
  const { go, lang, form, passkey, setPasskey } = useOnboarding()
  const [busy, setBusy] = useState(false)
  const [note, setNote] = useState('')

  const enroll = async () => {
    setBusy(true)
    setNote('')
    const result = await createPasskey(`${form.firstName} ${form.lastName}`.trim())
    setBusy(false)
    if (result.ok) {
      setPasskey('webauthn')
      setTimeout(() => go('funding'), 700)
    } else {
      // Never a dead end — fall back to the magic-link path.
      setNote(
        result.reason === 'unsupported'
          ? lang === 'es'
            ? 'Este dispositivo no admite claves de acceso. Use el enlace mágico.'
            : "This device doesn't support passkeys. Use the magic link instead."
          : lang === 'es'
            ? 'No se completó. Puede intentarlo de nuevo o usar el enlace mágico.'
            : 'Not completed. You can try again or use the magic link.'
      )
    }
  }

  const useMagicLink = () => {
    setPasskey('magiclink')
    go('funding')
  }

  return (
    <div className="space-y-7">
      <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 text-sm font-bold text-emerald-700">
        <span aria-hidden="true">✓</span>
        {lang === 'es' ? 'Identidad verificada' : 'Identity verified'}
      </div>

      <h1 className="text-3xl font-extrabold leading-tight text-navy">{t(lang, 's6Title')}</h1>

      <div className="rounded-2xl border-2 border-navy-subtle bg-white p-6 text-center">
        <Mascot
          brightness={1}
          size={110}
          state={passkey ? 'celebrate' : 'idle'}
          className="mx-auto"
        />
        <p className="mt-3 text-base text-navy-lighter">
          {passkey
            ? t(lang, 'passkeyDone')
            : lang === 'es'
              ? 'Sin contraseñas. Su rostro o huella es la llave.'
              : 'No passwords. Your face or fingerprint is the key.'}
        </p>
      </div>

      {note && (
        <p className="rounded-xl bg-amber-subtle px-4 py-3 text-sm text-amber-darkest" role="alert">
          {note}
        </p>
      )}

      <div className="space-y-3">
        <Button onClick={enroll} disabled={busy || !!passkey} className="w-full">
          {busy ? '…' : t(lang, 'passkeyCta')}
        </Button>
        <button
          onClick={useMagicLink}
          className="w-full text-sm font-semibold text-navy-lighter underline"
        >
          {t(lang, 'magicFallback')}
        </button>
      </div>
    </div>
  )
}
