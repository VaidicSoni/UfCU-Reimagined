import { useState } from 'react'
import { useOnboarding } from '../context/OnboardingContext.jsx'
import { t } from '../lib/i18n.js'
import { formatTaxId, delay, ID_TYPES, validateTaxId, scanOutcome } from '../lib/mockApi.js'
import { Field } from '../components/Field.jsx'
import { Button } from '../components/Button.jsx'
import { Icon } from '../components/Icons.jsx'
import { Consent } from '../components/Consent.jsx'
import { MockPlaid } from '../components/MockPlaid.jsx'

export function Identity() {
  const {
    goals, form, update, go, lang,
    idScanned, setIdScanned,
    consent, setConsent,
    taxIdType, setTaxIdType,
    identityVia, setIdentityVia,
  } = useOnboarding()

  const [scanning, setScanning] = useState(false)
  const [attempts, setAttempts] = useState(0)
  const [scanError, setScanError] = useState(null)
  const [docType, setDocType] = useState('license')
  const [bankModal, setBankModal] = useState(false)
  // Chosen route when there's no taxpayer number yet.
  const [noTaxRoute, setNoTaxRoute] = useState(null)

  const tax = validateTaxId(form.ssn, taxIdType)
  const noTax = taxIdType === 'none'
  const ready = (noTax ? noTaxRoute !== null : tax.valid) && idScanned && consent
  const doc = ID_TYPES.find((d) => d.id === docType)

  const scan = async () => {
    setScanning(true)
    setScanError(null)
    await delay(2000)
    const result = scanOutcome(attempts)
    setScanning(false)
    setAttempts((a) => a + 1)
    if (result.ok) {
      setIdScanned(true)
      setIdentityVia('document')
    } else {
      setScanError(result.reason)
    }
  }

  // Uploading always works — someone who has already failed a live scan should
  // not be sent round the same loop again.
  const upload = async () => {
    setScanning(true)
    setScanError(null)
    await delay(1400)
    setScanning(false)
    setIdScanned(true)
    setIdentityVia('document')
  }

  const switchDoc = (id) => {
    setDocType(id)
    setScanError(null)
    setIdScanned(false)
    setAttempts(0)
  }

  return (
    <div className="space-y-7">
      <h1 className="text-3xl font-extrabold leading-tight text-navy">{t(lang, 's4Title')}</h1>

      {/* SSN or ITIN. Without this, anyone without an SSN simply cannot open an
          account — and international students are a large share of UT and
          Texas State. */}
      <div>
        <p className="mb-2 text-sm font-bold text-navy">{t(lang, 'taxIdType')}</p>
        <div className="flex gap-2" role="group" aria-label={t(lang, 'taxIdType')}>
          {(goals.includes('business')
            ? [['ssn', 'taxSsn'], ['itin', 'taxItin'], ['ein', 'taxEin'], ['none', 'taxNone']]
            : [['ssn', 'taxSsn'], ['itin', 'taxItin'], ['none', 'taxNone']]
          ).map(([id, label]) => (
            <button
              key={id}
              onClick={() => {
                setTaxIdType(id)
                setNoTaxRoute(null)
              }}
              aria-pressed={taxIdType === id}
              className={`flex-1 rounded-full px-4 py-2.5 text-sm font-bold transition ${
                taxIdType === id
                  ? 'bg-navy text-white'
                  : 'bg-navy-subtle/50 text-navy hover:bg-navy-subtle'
              }`}
            >
              {t(lang, label)}
            </button>
          ))}
        </div>
      </div>

      {/* UFCU's own page says to call or visit a branch if you lack the
          documents. That's the honest answer, so it's one of the two routes —
          alongside actually helping with the ITIN application. */}
      {noTax ? (
        <section className="u-chip border-2 border-navy-subtle bg-navy-subtle/25 p-5">
          <p className="text-base font-extrabold text-navy">{t(lang, 'noTaxTitle')}</p>
          <p className="mt-1 text-sm leading-relaxed text-navy-lighter">{t(lang, 'noTaxBody')}</p>

          <div className="mt-4 space-y-2">
            {[
              ['itin', 'noTaxItin', 'noTaxItinBody'],
              ['branch', 'noTaxBranch', 'noTaxBranchBody'],
            ].map(([id, title, body]) => (
              <button
                key={id}
                onClick={() => setNoTaxRoute(id)}
                aria-pressed={noTaxRoute === id}
                className={`u-chip flex w-full items-start gap-3 border-2 p-4 text-left transition ${
                  noTaxRoute === id
                    ? 'border-orange bg-orange-subtle'
                    : 'border-navy-subtle bg-white hover:border-navy-lighter'
                }`}
              >
                <span
                  aria-hidden="true"
                  className={`mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 text-xs font-bold ${
                    noTaxRoute === id ? 'border-orange bg-orange text-white' : 'border-navy-subtle text-transparent'
                  }`}
                >
                  ✓
                </span>
                <span>
                  <span className="block text-sm font-bold text-navy">{t(lang, title)}</span>
                  <span className="block text-sm text-navy-lighter">{t(lang, body)}</span>
                </span>
              </button>
            ))}
          </div>

          {noTaxRoute && (
            <p role="status" className="mt-3 text-sm font-semibold text-emerald-700">
              {t(lang, noTaxRoute === 'itin' ? 'noTaxChosen' : 'noTaxBranchChosen')}
            </p>
          )}
        </section>
      ) : (
      <div>
        <Field
          label={t(lang, taxIdType === 'itin' ? 'itinLabel' : taxIdType === 'ein' ? 'einLabel' : 'ssnLabel')}
          inputMode="numeric"
          value={form.ssn}
          onChange={(v) => update({ ssn: formatTaxId(v, taxIdType) })}
          valid={tax.valid}
          hint={t(lang, taxIdType === 'itin' ? 'itinWhy' : taxIdType === 'ein' ? 'einWhy' : 'ssnWhy')}
          fieldId="ssn"
        />
        {tax.reason && (
          <p role="alert" className="mt-2 px-1 text-sm font-semibold text-orange-darker">
            {t(lang, tax.reason)}
          </p>
        )}
      </div>
      )}

      {/* Document capture */}
      <div className="rounded-2xl border-2 border-dashed border-navy-subtle bg-navy-subtle/20 p-5">
        <p className="mb-2 text-sm font-bold text-navy">{t(lang, 'docType')}</p>
        <div className="mb-4 flex flex-wrap gap-2" role="group" aria-label={t(lang, 'docType')}>
          {ID_TYPES.map((d) => (
            <button
              key={d.id}
              onClick={() => switchDoc(d.id)}
              aria-pressed={docType === d.id}
              className={`rounded-full px-3.5 py-2 text-xs font-bold transition ${
                docType === d.id
                  ? 'bg-orange text-white'
                  : 'bg-white text-navy ring-1 ring-navy-subtle hover:bg-navy-subtle/40'
              }`}
            >
              {lang === 'es' ? d.es : d.en}
            </button>
          ))}
        </div>

        <div className="relative mx-auto flex h-40 w-full max-w-xs items-center justify-center overflow-hidden rounded-xl bg-navy">
          {idScanned ? (
            <div className="px-4 text-center text-white">
              <Icon.shield className="mx-auto h-8 w-8 text-emerald-300" aria-hidden="true" />
              <p className="mt-2 text-sm font-semibold">
                {identityVia === 'bank' ? t(lang, 'altVerifyDone') : t(lang, 'scanned')}
              </p>
            </div>
          ) : (
            <>
              <p className="px-6 text-center text-sm text-navy-subtle">
                {scanning ? t(lang, 'scanning') : doc.placeholder}
              </p>
              {scanning && (
                <div className="absolute inset-x-0 top-0 h-1 animate-scanline bg-orange shadow-[0_0_18px_4px_rgba(239,104,32,0.8)]" />
              )}
            </>
          )}
        </div>

        {/* A failed scan is the single biggest drop-off point in account
            opening, so it gets a reason and three ways forward, not an error. */}
        {scanError && !idScanned && (
          <div role="alert" className="mt-4 rounded-xl bg-amber-subtle p-4">
            <p className="text-sm font-extrabold text-amber-darkest">{t(lang, 'scanFailTitle')}</p>
            <p className="mt-1 text-sm leading-relaxed text-amber-darkest">{t(lang, scanError)}</p>
          </div>
        )}

        {!idScanned && (
          <div className="mt-4 space-y-2">
            <Button onClick={scan} disabled={scanning} variant="secondary" className="w-full">
              <Icon.camera className="h-5 w-5" aria-hidden="true" />
              {scanning
                ? t(lang, 'scanning')
                : scanError
                  ? t(lang, 'scanRetryCta')
                  : t(lang, 'scanDoc', lang === 'es' ? doc.es : doc.en)}
            </Button>
            <button
              onClick={upload}
              disabled={scanning}
              className="w-full text-sm font-semibold text-navy-lighter underline disabled:opacity-50"
            >
              {t(lang, 'scanUploadCta')}
            </button>
          </div>
        )}
      </div>

      {/* Bank-based verification: the way through for anyone whose documents
          won't scan, or who doesn't have one to hand. */}
      {!idScanned && (
        <section className="u-chip border-2 border-navy-subtle bg-white p-5">
          <p className="text-sm font-extrabold text-navy">{t(lang, 'altVerifyTitle')}</p>
          <p className="mt-1 text-sm leading-relaxed text-navy-lighter">{t(lang, 'altVerifyBody')}</p>
          <Button onClick={() => setBankModal(true)} variant="secondary" className="mt-3 w-full">
            {t(lang, 'altVerifyCta')}
          </Button>
          <p className="mt-3 flex gap-2 text-xs leading-snug text-navy-lighter">
            <Icon.lock className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            {t(lang, 'altVerifyNote')}
          </p>
        </section>
      )}

      {bankModal && (
        <MockPlaid
          mode="identity"
          lang={lang}
          onClose={() => setBankModal(false)}
          onSuccess={() => {
            setBankModal(false)
            setIdScanned(true)
            setIdentityVia('bank')
            setScanError(null)
          }}
        />
      )}

      <Consent agreed={consent} onChange={setConsent} />

      <div className="flex gap-3">
        <Button variant="ghost" onClick={() => go('address')}>{t(lang, 'back')}</Button>
        <Button onClick={() => go('waiting')} disabled={!ready} className="flex-1">
          {t(lang, 'verifyCta')}
        </Button>
      </div>
    </div>
  )
}
