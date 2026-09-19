import { useId, useState } from 'react'
import { useOnboarding } from '../context/OnboardingContext.jsx'
import { Icon } from './Icons.jsx'

// Floating-label input with an inline validity check, per the UI revamp doc.
// When fieldId is provided, focus/blur events update the global focusedField
// in OnboardingContext so Lumi's suggestions change based on the active field.
export function Field({
  label, value, onChange, type = 'text', valid, hint, autoComplete, inputMode, fieldId,
  placeholder, trailing, ...rest
}) {
  const id = useId()
  const [focused, setFocused] = useState(false)
  const { setFocusedField } = useOnboarding()
  const floated = focused || String(value ?? '').length > 0

  const handleFocus = () => {
    setFocused(true)
    if (fieldId) setFocusedField(fieldId)
  }

  const handleBlur = () => {
    setFocused(false)
    if (fieldId) setFocusedField(null)
  }

  return (
    <div className="w-full min-w-0">
      <div
        className={`relative min-w-0 ${valid ? 'rounded-xl' : 'rounded-2xl'} border-2 bg-white transition ${
          focused
            ? 'border-navy ring-[3px] ring-orange ring-offset-2 ring-offset-white'
            : valid
              ? 'border-emerald-500/60'
              : 'border-navy-subtle'
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
          type={type}
          value={value}
          // Held back until the label floats, otherwise the placeholder sits
          // underneath the centred label and the two overlap.
          placeholder={floated ? placeholder : undefined}
          inputMode={inputMode}
          autoComplete={autoComplete}
          onChange={(e) => onChange(e.target.value)}
          onFocus={handleFocus}
          onBlur={handleBlur}
          className={`field-input w-full min-w-0 bg-transparent px-4 pb-2.5 pt-6 text-base text-navy outline-none placeholder:text-navy-lighter ${
            trailing ? 'pr-[4.75rem]' : 'pr-12'
          }`}
          {...rest}
        />
        <div
          className={`absolute top-1/2 flex -translate-y-1/2 items-center gap-1 ${
            trailing ? 'right-2' : 'right-4'
          }`}
        >
          {valid && <span aria-hidden="true" className="text-lg text-emerald-600">✓</span>}
          {trailing}
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
