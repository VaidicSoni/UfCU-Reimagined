import { useState } from 'react'
import { useOnboarding } from '../context/OnboardingContext.jsx'
import { CONSENTS, CIP_FIELDS } from '../lib/compliance.js'
import { Icon } from './Icons.jsx'
import { Disclosures } from './Disclosures.jsx'

// Consent, unbundled.
//
// The old version was one checkbox covering the Membership Agreement, the
// Privacy Notice and electronic disclosures at once — the exact pattern
// regulators keep pushing back on, because agreeing to the thing you must
// agree to also silently agrees to the thing you could have declined.
//
// Here each obligation stands on its own, names the rule behind it, and says
// why it is being asked. The one optional item ships switched off.
export function Consent() {
  const { lang, consents, toggleConsent } = useOnboarding()
  const [showDocs, setShowDocs] = useState(false)
  const [showCollected, setShowCollected] = useState(false)

  const es = lang === 'es'

  return (
    <section className="u-chip border-2 border-navy-subtle bg-navy-subtle/20 p-5">
      <div className="flex items-start gap-3">
        <Icon.shield className="mt-0.5 h-5 w-5 shrink-0 text-navy" aria-hidden="true" />
        <div className="flex-1">
          <h3 className="text-sm font-extrabold uppercase tracking-wide text-navy">
            {es ? 'Antes de verificarlo' : 'Before we verify you'}
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-navy-lighter">
            {es
              ? 'En lenguaje claro: verificamos su identidad porque la ley federal lo exige. Puede aceptar cada punto por separado.'
              : 'In plain language: we verify your identity because federal law requires it. You agree to each item separately.'}
          </p>

          {/* The four CIP data points, named. "We need some details" is vague;
              "these four, because §326" is something a member can check. */}
          <button
            onClick={() => setShowCollected((v) => !v)}
            aria-expanded={showCollected}
            className="mt-3 text-sm font-bold text-navy underline"
          >
            {es ? 'Qué recopilamos exactamente' : 'Exactly what we collect'}
          </button>

          {showCollected && (
            <div className="mt-3 rounded-xl bg-white p-4">
              <p className="text-xs font-bold uppercase tracking-wide text-orange-darker">
                USA PATRIOT Act §326 · 31 CFR 1020.220
              </p>
              <ul className="mt-3 space-y-1.5">
                {CIP_FIELDS.map((f) => (
                  <li key={f.id} className="flex gap-2 text-sm text-navy">
                    <span aria-hidden="true" className="text-orange">·</span>
                    {es ? f.es : f.en}
                  </li>
                ))}
              </ul>
              <p className="mt-3 border-t border-navy-subtle pt-3 text-sm font-semibold text-navy">
                {es
                  ? 'Nada más. No vendemos su información personal.'
                  : 'Nothing beyond these. We never sell your personal information.'}
              </p>
            </div>
          )}
        </div>
      </div>

      <ul className="mt-4 space-y-3 border-t border-navy-subtle pt-4">
        {CONSENTS.map((c) => {
          const granted = consents.includes(c.id)
          return (
            <li key={c.id}>
              <label className="flex cursor-pointer items-start gap-3">
                <input
                  type="checkbox"
                  checked={granted}
                  onChange={() => toggleConsent(c.id)}
                  className="mt-0.5 h-5 w-5 shrink-0 accent-orange"
                />
                <span className="flex-1">
                  <span className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-semibold leading-snug text-navy">
                      {es ? c.es : c.en}
                    </span>
                    <span
                      className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${
                        c.required
                          ? 'bg-navy text-white'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {c.required ? (es ? 'Requerido' : 'Required') : es ? 'Opcional' : 'Optional'}
                    </span>
                  </span>
                  <span className="mt-1 block text-xs leading-relaxed text-navy-lighter">
                    {es ? c.whyEs : c.whyEn}
                  </span>
                  <span className="mt-0.5 block text-[11px] font-semibold uppercase tracking-wide text-orange-darker">
                    {c.reg}
                  </span>
                </span>
              </label>
            </li>
          )
        })}
      </ul>

      <button
        onClick={() => setShowDocs(true)}
        className="mt-4 w-full rounded-xl border-2 border-navy-subtle bg-white px-4 py-3 text-sm font-bold text-navy transition hover:border-navy-lighter"
      >
        {es ? 'Leer las divulgaciones completas' : 'Read the full disclosures'}
      </button>

      <Disclosures open={showDocs} onClose={() => setShowDocs(false)} />
    </section>
  )
}
