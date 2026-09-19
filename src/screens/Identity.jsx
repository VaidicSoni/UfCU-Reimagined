import { useState } from 'react'
import { useOnboarding } from '../context/OnboardingContext.jsx'
import { t } from '../lib/i18n.js'
import { formatSSN, delay } from '../lib/mockApi.js'
import { Field } from '../components/Field.jsx'
import { Button } from '../components/Button.jsx'
import { Icon } from '../components/Icons.jsx'
import { Consent } from '../components/Consent.jsx'

export function Identity() {
  const { form, update, go, lang, idScanned, setIdScanned, consentComplete, recordConsent } =
    useOnboarding()
  const [scanning, setScanning] = useState(false)
  const ssnValid = form.ssn.replace(/\D/g, '').length === 9
  const ready = ssnValid && idScanned && consentComplete

  const scan = async () => {
    setScanning(true)
    await delay(2200)
    setScanning(false)
    setIdScanned(true)
  }

  return (
    <div className="space-y-7">
      <h1 className="text-3xl font-extrabold leading-tight text-navy">{t(lang, 's4Title')}</h1>

      <Field
        label={t(lang, 'ssn')}
        inputMode="numeric"
        value={form.ssn}
        onChange={(v) => update({ ssn: formatSSN(v) })}
        valid={ssnValid}
        secret
        hint={t(lang, 'ssnWhy')}
      />

      {/* Mock ID capture. No camera is opened and no image is stored. */}
      <div className="rounded-2xl border-2 border-dashed border-navy-subtle bg-navy-subtle/20 p-5">
        <div className="relative mx-auto flex h-40 w-full max-w-xs items-center justify-center overflow-hidden rounded-xl bg-navy">
          {idScanned ? (
            <div className="text-center text-white">
              <p className="text-4xl" aria-hidden="true">✅</p>
              <p className="mt-2 text-sm font-semibold">{t(lang, 'scanned')}</p>
            </div>
          ) : (
            <>
              <p className="px-6 text-center text-sm text-navy-subtle">
                {scanning ? t(lang, 'scanning') : 'TX DRIVER LICENSE'}
              </p>
              {scanning && (
                <div className="absolute inset-x-0 top-0 h-1 animate-scanline bg-orange shadow-[0_0_18px_4px_rgba(239,104,32,0.8)]" />
              )}
            </>
          )}
        </div>

        {!idScanned && (
          <Button onClick={scan} disabled={scanning} variant="secondary" className="mt-4 w-full">
            <Icon.camera className="h-5 w-5" aria-hidden="true" />
            {scanning ? t(lang, 'scanning') : t(lang, 'scanId')}
          </Button>
        )}

        {/* No dead ends: an alternative path is always visible. */}
        <button className="mt-3 w-full text-sm font-semibold text-navy-lighter underline">
          {t(lang, 'uploadInstead')}
        </button>
      </div>

      <Consent />

      <div className="flex gap-3">
        <Button variant="ghost" onClick={() => go('address')}>{t(lang, 'back')}</Button>
        <Button
          onClick={() => {
            recordConsent()
            go('waiting')
          }}
          disabled={!ready}
          className="flex-1"
        >
          {t(lang, 'verifyCta')}
        </Button>
      </div>
    </div>
  )
}
