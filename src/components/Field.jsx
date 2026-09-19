import { useId, useState } from 'react'
import { Icon } from './Icons.jsx'

// Floating-label input with an inline validity check, per the UI revamp doc.
export function Field({
  label, value, onChange, type = 'text', valid, hint, autoComplete, inputMode, ...rest
}) {
  const id = useId()
  const [focused, setFocused] = useState(false)
  const floated = focused || String(value ?? '').length > 0

  return (
    <div className="w-full">
      <div
        className={`relative rounded-2xl border-2 bg-white transition ${
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
          type={type}
          value={value}
          inputMode={inputMode}
          autoComplete={autoComplete}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className="w-full bg-transparent px-4 pb-2.5 pt-6 text-base text-navy outline-none"
          {...rest}
        />
        {valid && (
          <span
            aria-hidden="true"
            className="absolute right-4 top-1/2 -translate-y-1/2 text-lg text-emerald-600"
          >
            ✓
          </span>
        )}
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
