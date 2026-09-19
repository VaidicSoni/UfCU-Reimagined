import { useState } from 'react'
import { useOnboarding } from '../context/OnboardingContext.jsx'
import { t } from '../lib/i18n.js'
import { suggestAddresses } from '../lib/mockApi.js'
import { Field } from '../components/Field.jsx'
import { Button } from '../components/Button.jsx'

// Split out from the blueprint's screen 3 so the flow actually honours
// One Question Per Screen instead of stacking address + SSN + ID scan together.
export function Address() {
  const { form, update, go, lang } = useOnboarding()
  const [suggestions, setSuggestions] = useState([])
  const ready = form.address && form.city && form.zip.length === 5

  const onAddressChange = (value) => {
    update({ address: value })
    setSuggestions(suggestAddresses(value))
  }

  const choose = (a) => {
    update({ address: a.line, city: a.city, state: a.state, zip: a.zip })
    setSuggestions([])
  }

  return (
    <div className="space-y-7">
      <h1 className="text-3xl font-extrabold leading-tight text-navy">{t(lang, 's3Title')}</h1>

      <div className="space-y-4">
        <div className="relative">
          <Field
            label={t(lang, 'address')}
            value={form.address}
            onChange={onAddressChange}
            valid={form.address.length > 4}
            autoComplete="street-address"
            fieldId="address"
          />
          {suggestions.length > 0 && (
            <ul className="absolute z-20 mt-2 w-full overflow-hidden rounded-2xl border-2 border-navy-subtle bg-white shadow-card">
              {suggestions.map((a) => (
                <li key={a.line}>
                  <button
                    onClick={() => choose(a)}
                    className="w-full px-4 py-3 text-left text-base text-navy transition hover:bg-navy-subtle/40"
                  >
                    <span className="font-semibold">{a.line}</span>
                    <span className="text-navy-lighter"> — {a.city}, {a.state} {a.zip}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <Field label={t(lang, 'city')} value={form.city} onChange={(v) => update({ city: v })} valid={!!form.city} fieldId="city" />
          <Field label={t(lang, 'state')} value={form.state} onChange={(v) => update({ state: v })} valid={!!form.state} fieldId="state" />
          <Field
            label={t(lang, 'zip')}
            inputMode="numeric"
            value={form.zip}
            onChange={(v) => update({ zip: v.replace(/\D/g, '').slice(0, 5) })}
            valid={form.zip.length === 5}
            fieldId="zip"
          />
        </div>
      </div>

      <div className="flex gap-3">
        <Button variant="ghost" onClick={() => go('about')}>{t(lang, 'back')}</Button>
        <Button onClick={() => go('identity')} disabled={!ready} className="flex-1">
          {t(lang, 's1Cta')}
        </Button>
      </div>
    </div>
  )
}
