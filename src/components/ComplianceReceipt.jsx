import { useState } from 'react'
import { useOnboarding } from '../context/OnboardingContext.jsx'
import { CONSENTS, DATA_RIGHTS } from '../lib/compliance.js'
import { Icon } from './Icons.jsx'
import { Disclosures } from './Disclosures.jsx'

function formatStamp(iso, lang) {
  if (!iso) return ''
  try {
    return new Date(iso).toLocaleString(lang === 'es' ? 'es-US' : 'en-US', {
      dateStyle: 'medium',
      timeStyle: 'short',
    })
  } catch {
    return iso
  }
}

// What the member agreed to, when, and under which reference — shown back to
// them at the end rather than buried in an email they have not received yet.
// Declines are listed too: a consent record that only shows the yeses is not a
// record, it is marketing.
export function ConsentReceipt() {
  const { lang, consentRecord } = useOnboarding()
  const [showDocs, setShowDocs] = useState(false)
  if (!consentRecord) return null

  const es = lang === 'es'
  const granted = CONSENTS.filter((c) => consentRecord.granted.includes(c.id))
  const declined = CONSENTS.filter((c) => !consentRecord.granted.includes(c.id))

  return (
    <section className="u-chip border-2 border-navy-subtle bg-white p-5">
      <div className="flex items-start gap-3">
        <Icon.shield className="mt-0.5 h-5 w-5 shrink-0 text-navy" aria-hidden="true" />
        <div className="min-w-0 flex-1">
          <h3 className="text-sm font-extrabold uppercase tracking-wide text-navy">
            {es ? 'Registro de consentimiento' : 'Consent receipt'}
          </h3>
          <p className="mt-1 text-xs text-navy-lighter">
            {formatStamp(consentRecord.at, lang)} · {es ? 'Ref.' : 'Ref'} {consentRecord.ref}
          </p>
        </div>
      </div>

      <ul className="mt-4 space-y-2">
        {granted.map((c) => (
          <li key={c.id} className="flex gap-2 text-sm leading-snug text-navy">
            <span aria-hidden="true" className="font-bold text-emerald-600">✓</span>
            <span>{es ? c.es : c.en}</span>
          </li>
        ))}
        {declined.map((c) => (
          <li key={c.id} className="flex gap-2 text-sm leading-snug text-navy-lighter">
            <span aria-hidden="true" className="font-bold">—</span>
            <span>
              {es ? c.es : c.en}{' '}
              <em className="not-italic font-semibold">({es ? 'rechazado' : 'declined'})</em>
            </span>
          </li>
        ))}
      </ul>

      <button
        onClick={() => setShowDocs(true)}
        className="mt-4 text-sm font-bold text-navy underline"
      >
        {es ? 'Ver las divulgaciones de nuevo' : 'View your disclosures again'}
      </button>

      <Disclosures open={showDocs} onClose={() => setShowDocs(false)} />
    </section>
  )
}

// Data privacy expressed as rights the member holds, not policy they are
// subject to. Rubric E's top band asks the solution to "clearly balance
// experience with safety" — this is the safety half, stated in one screen.
export function DataRights() {
  const { lang } = useOnboarding()
  const es = lang === 'es'

  return (
    <section className="u-chip border-2 border-navy-subtle bg-navy-subtle/25 p-5">
      <div className="flex items-start gap-3">
        <Icon.lock className="mt-0.5 h-5 w-5 shrink-0 text-navy" aria-hidden="true" />
        <div className="flex-1">
          <h3 className="text-sm font-extrabold uppercase tracking-wide text-navy">
            {es ? 'Sus datos, sus derechos' : 'Your data, your rights'}
          </h3>
          <ul className="mt-3 space-y-3">
            {DATA_RIGHTS.map((r) => (
              <li key={r.id}>
                <p className="text-sm font-bold text-navy">{es ? r.es : r.en}</p>
                <p className="text-sm leading-snug text-navy-lighter">
                  {es ? r.detailEs : r.detailEn}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
