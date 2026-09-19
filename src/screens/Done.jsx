import { useOnboarding } from '../context/OnboardingContext.jsx'
import { t } from '../lib/i18n.js'

import { Button } from '../components/Button.jsx'
import { Mascot } from '../components/Mascot.jsx'
import { Icon } from '../components/Icons.jsx'
import { BundleCard } from '../components/BundleCard.jsx'
import { ConsentReceipt, DataRights } from '../components/ComplianceReceipt.jsx'

// Decorative stand-in for the web-to-app handoff code. Deterministic pattern,
// not a scannable QR — labelled as a placeholder so nobody tries to scan it.
function QrPlaceholder() {
  const cells = []
  for (let r = 0; r < 11; r++) {
    for (let c = 0; c < 11; c++) {
      const corner = (r < 3 && c < 3) || (r < 3 && c > 7) || (r > 7 && c < 3)
      if (corner || (r * 7 + c * 5) % 3 === 0) {
        cells.push(<rect key={`${r}-${c}`} x={c * 9} y={r * 9} width="8" height="8" rx="1.5" fill="#23335D" />)
      }
    }
  }
  return (
    <svg viewBox="0 0 99 99" className="h-36 w-36" role="img" aria-label="Demo app download code placeholder">
      <rect width="99" height="99" fill="white" />
      {cells}
    </svg>
  )
}

export function Done() {
  const { lang, funded, reset, form, passkey } = useOnboarding()

  return (
    <div className="space-y-7">
      <div>
        <Mascot brightness={1} size={92} state="celebrate" face />
        <h1 className="mt-3 text-3xl font-extrabold leading-tight text-navy">{t(lang, 's8Title')}</h1>
      </div>

      <BundleCard showMemberNote={false} />

      <div className="u-chip border-2 border-navy-subtle bg-white p-5">
        <div className="flex items-baseline justify-between">
          <span className="text-sm text-navy-lighter">{t(lang, 'balance')}</span>
          <span className="text-2xl font-extrabold text-navy">{funded ? '$25.00' : '$0.00'}</span>
        </div>
        {passkey && (
          <p className="mt-3 border-t border-navy-subtle pt-3 text-sm text-navy-lighter">
            {passkey === 'webauthn'
              ? lang === 'es' ? 'Protegido con clave de acceso' : 'Secured with a passkey'
              : lang === 'es' ? 'Enlace mágico enviado' : 'Magic link sent'}
          </p>
        )}
      </div>

      <ConsentReceipt />

      <DataRights />

      <div className="flex flex-col items-center gap-4 rounded-2xl bg-navy p-6 text-center text-white sm:flex-row sm:text-left">
        <div className="shrink-0 rounded-xl bg-white p-2">
          <QrPlaceholder />
        </div>
        <div>
          <p className="text-base font-bold">
            {lang === 'es' ? 'Continúe en la app' : 'Pick up in the app'}
          </p>
          <p className="mt-1 text-sm text-navy-subtle">
            {lang === 'es'
              ? `Enviamos un enlace a ${form.phone || 'su teléfono'}. Ya estará conectado.`
              : `We texted a link to ${form.phone || 'your phone'}. You'll already be signed in.`}
          </p>
        </div>
      </div>

      <div className="space-y-3">
        <Button className="w-full">
          <Icon.phone className="h-5 w-5" aria-hidden="true" /> {t(lang, 'textApp')}
        </Button>
        <button onClick={reset} className="w-full text-sm font-semibold text-navy-lighter underline">
          {t(lang, 'startOver')}
        </button>
      </div>
    </div>
  )
}
