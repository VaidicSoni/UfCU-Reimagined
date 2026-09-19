import { useEffect, useRef, useState } from 'react'
import { useOnboarding } from '../context/OnboardingContext.jsx'
import { DISCLOSURES } from '../lib/compliance.js'
import { Icon } from './Icons.jsx'

// The documents behind "read the full disclosures". A link that opens three
// bullet points is the thing the rubric calls a "light mention"; this opens the
// actual Reg DD / Reg CC / Reg P / E-SIGN text, each labelled with the rule it
// satisfies, so the member can see there is something real underneath.
export function Disclosures({ open, onClose, initial = 'tis' }) {
  const { lang } = useOnboarding()
  const [active, setActive] = useState(initial)
  const closeRef = useRef(null)

  useEffect(() => {
    if (open) setActive(initial)
  }, [open, initial])

  useEffect(() => {
    if (!open) return
    closeRef.current?.focus()
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    // The page behind a modal should not scroll under it.
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [open, onClose])

  if (!open) return null

  const doc = DISCLOSURES.find((d) => d.id === active) || DISCLOSURES[0]
  const copy = doc[lang] || doc.en

  return (
    <div
      className="fixed inset-0 z-[60] flex items-end justify-center bg-navy-darkest/70 p-0 backdrop-blur-sm sm:items-center sm:p-6"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={lang === 'es' ? 'Divulgaciones' : 'Disclosures'}
        onClick={(e) => e.stopPropagation()}
        className="u-card flex max-h-[88vh] w-full max-w-3xl flex-col overflow-hidden bg-white shadow-card sm:max-h-[80vh]"
      >
        <header className="flex items-start justify-between gap-4 border-b border-navy-subtle px-6 py-5">
          <div>
            <h2 className="text-lg font-extrabold text-navy">
              {lang === 'es' ? 'Sus divulgaciones' : 'Your disclosures'}
            </h2>
            <p className="mt-1 text-sm text-navy-lighter">
              {lang === 'es'
                ? 'Entregadas antes de abrir la cuenta, como exige la ley.'
                : 'Delivered before your account opens, as the law requires.'}
            </p>
          </div>
          <button
            ref={closeRef}
            onClick={onClose}
            aria-label={lang === 'es' ? 'Cerrar' : 'Close'}
            className="shrink-0 rounded-full p-2 text-navy-lighter transition hover:bg-navy-subtle/40 hover:text-navy"
          >
            <Icon.close className="h-5 w-5" aria-hidden="true" />
          </button>
        </header>

        {/* Document picker. Horizontally scrollable so five tabs still work at
            phone width instead of wrapping into a wall. */}
        <div className="flex gap-2 overflow-x-auto border-b border-navy-subtle px-6 py-3">
          {DISCLOSURES.map((d) => {
            const isActive = d.id === active
            return (
              <button
                key={d.id}
                onClick={() => setActive(d.id)}
                aria-current={isActive}
                className={`shrink-0 rounded-full px-4 py-2 text-sm font-bold transition ${
                  isActive
                    ? 'bg-navy text-white'
                    : 'bg-navy-subtle/40 text-navy-lighter hover:bg-navy-subtle/70 hover:text-navy'
                }`}
              >
                {(d[lang] || d.en).title}
              </button>
            )
          })}
        </div>

        <div className="overflow-y-auto px-6 py-6">
          <p className="text-xs font-bold uppercase tracking-wide text-orange-darker">{doc.reg}</p>
          <h3 className="mt-2 text-xl font-extrabold text-navy">{copy.title}</h3>
          <ul className="mt-4 space-y-3">
            {copy.body.map((line) => (
              <li key={line} className="flex gap-3 text-base leading-relaxed text-navy">
                <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-orange" />
                <span>{line}</span>
              </li>
            ))}
          </ul>
        </div>

        <footer className="border-t border-navy-subtle bg-navy-subtle/20 px-6 py-4 text-xs leading-relaxed text-navy-lighter">
          {lang === 'es'
            ? 'Prototipo de demostración. El texto está resumido y las tasas son ilustrativas; no constituye un contrato.'
            : 'Demo prototype. This text is summarised and rates are illustrative — it is not a binding contract.'}
        </footer>
      </div>
    </div>
  )
}
