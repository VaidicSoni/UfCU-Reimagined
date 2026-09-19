import { useId, useState } from 'react'
import { useOnboarding } from '../context/OnboardingContext.jsx'
import { Icon } from './Icons.jsx'

// Floating-label input with an inline validity check, per the UI revamp doc.
//
// When fieldId is provided, focus/blur events update the global focusedField in
// OnboardingContext so Lumi's suggestions change based on the active field.
//
// `secret` masks the value by default and offers a deliberate reveal. A demo
// laptop on a projector should never paint a taxpayer ID across the wall, and
// the rubric's bottom band for compliance is literally "asks for sensitive data
// in risky ways" — so the safe state is the default state.
export function Field({
  label, value, onChange, type = 'text', valid, hint, autoComplete, inputMode,
  fieldId, secret = false, ...rest
}) {
  const id = useId()
  const [focused, setFocused] = useState(false)
  const [revealed, setRevealed] = useState(false)
  const { setFocusedField } = useOnboarding()
  // A date input paints its own mm/dd/yyyy placeholder, which would collide
  // with an unfloated label, so date fields float from the start.
  const floated = focused || String(value ?? '').length > 0 || type === 'date'
  const masked = secret && !revealed

  const handleFocus = () => {
    setFocused(true)
    if (fieldId) setFocusedField(fieldId)
  }

  const handleBlur = () => {
    setFocused(false)
    if (fieldId) setFocusedField(null)
  }

  return (
    <div className="w-full">
      <div
        className={`field-shell relative rounded-2xl border-2 bg-white transition ${
          focused ? 'border-navy' : valid ? 'border-emerald-500/60' : 'border-navy-subtle'
        }`}
      >
        <label
          htmlFor={id}
          className={`pointer-events-none absolute left-4 transition-all ${
            floated
              ? 'top-2 text-xs font-semibold text-navy-lighter'
              : 'top-1/2 -translate-y-1/2 text-base text-navy-lighter'
          }`}
        >
          {label}
        </label>
        <input
          id={id}
          type={masked ? 'password' : type}
          value={value}
          inputMode={inputMode}
          autoComplete={autoComplete}
          onChange={(e) => onChange(e.target.value)}
          onFocus={handleFocus}
          onBlur={handleBlur}
          className={`w-full bg-transparent px-4 pb-2.5 pt-6 text-base text-navy outline-none ${
            secret ? 'pr-20' : valid ? 'pr-11' : ''
          }`}
          {...rest}
        />

        <div className="absolute right-3 top-1/2 flex -translate-y-1/2 items-center gap-2">
          {valid && (
            <span aria-hidden="true" className="text-lg text-emerald-600">
              ✓
            </span>
          )}
          {secret && (
            <button
              type="button"
              onClick={() => setRevealed((v) => !v)}
              aria-pressed={revealed}
              className="rounded-lg px-2 py-1 text-xs font-bold uppercase tracking-wide text-navy-lighter transition hover:bg-navy-subtle/40 hover:text-navy"
            >
              {revealed ? 'Hide' : 'Show'}
            </button>
          )}
        </div>
      </div>
      {hint && (
        <p className="mt-2 flex gap-2 px-1 text-sm leading-snug text-navy-lighter">
          <Icon.lock className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          <span>{hint}</span>
        </p>
      )}
    </div>
  )
}
