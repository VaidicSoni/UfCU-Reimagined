import { useState } from 'react'
import { useOnboarding } from '../context/OnboardingContext.jsx'
import { t } from '../lib/i18n.js'
import { Icon } from './Icons.jsx'

// Consent, handled as a conversation rather than a wall of text: the
// plain-language summary is always visible, the specific uses are one tap away,
// and the agreement is an explicit opt-in that gates verification.
export function Consent({ agreed, onChange }) {
  const { lang } = useOnboarding()
  const [open, setOpen] = useState(false)

  return (
    <section className="u-chip border-2 border-navy-subtle bg-navy-subtle/20 p-5">
      <div className="flex items-start gap-3">
        <Icon.shield className="mt-0.5 h-5 w-5 shrink-0 text-navy" aria-hidden="true" />
        <div className="flex-1">
          <h3 className="text-sm font-extrabold uppercase tracking-wide text-navy">
            {t(lang, 'consentTitle')}
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-navy-lighter">
            {t(lang, 'consentPlain')}
          </p>

          <button
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            className="mt-3 text-sm font-bold text-navy underline"
          >
            {open ? t(lang, 'consentUses') : t(lang, 'consentRead')}
          </button>

          {open && (
            <div className="mt-3 rounded-xl bg-white p-4">
              <p className="text-xs font-bold uppercase tracking-wide text-navy-lighter">
                {t(lang, 'consentUses')}
              </p>
              <ul className="mt-2 space-y-1.5">
                {['consentUse1', 'consentUse2', 'consentUse3'].map((key) => (
                  <li key={key} className="flex gap-2 text-sm text-navy">
                    <span aria-hidden="true" className="text-orange">·</span>
                    {t(lang, key)}
                  </li>
                ))}
              </ul>
              <p className="mt-3 border-t border-navy-subtle pt-3 text-sm font-semibold text-navy">
                {t(lang, 'consentNever')}
              </p>
            </div>
          )}
        </div>
      </div>

      <label className="mt-4 flex cursor-pointer items-start gap-3 border-t border-navy-subtle pt-4">
        <input
          type="checkbox"
          checked={agreed}
          onChange={(e) => onChange(e.target.checked)}
          className="mt-0.5 h-5 w-5 shrink-0 accent-orange"
        />
        <span className="text-sm leading-snug text-navy">{t(lang, 'consentCheck')}</span>
      </label>
    </section>
  )
}
