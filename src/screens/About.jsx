import { useOnboarding } from '../context/OnboardingContext.jsx'
import { t } from '../lib/i18n.js'
import { formatPhone } from '../lib/mockApi.js'
import { Field } from '../components/Field.jsx'
import { Button } from '../components/Button.jsx'

export function About() {
  const { form, update, go, lang } = useOnboarding()
  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)
  const phoneValid = form.phone.replace(/\D/g, '').length === 10
  const ready = form.firstName && form.lastName && emailValid && phoneValid

  return (
    <div className="space-y-7">
      <h1 className="text-3xl font-extrabold leading-tight text-navy">{t(lang, 's2Title')}</h1>

      <div className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field
            label={t(lang, 'firstName')}
            value={form.firstName}
            onChange={(v) => update({ firstName: v })}
            valid={form.firstName.length > 1}
            autoComplete="given-name"
          />
          <Field
            label={t(lang, 'lastName')}
            value={form.lastName}
            onChange={(v) => update({ lastName: v })}
            valid={form.lastName.length > 1}
            autoComplete="family-name"
          />
        </div>
        <Field
          label={t(lang, 'email')}
          type="email"
          value={form.email}
          onChange={(v) => update({ email: v })}
          valid={emailValid}
          autoComplete="email"
        />
        <Field
          label={t(lang, 'phone')}
          type="tel"
          inputMode="numeric"
          value={form.phone}
          onChange={(v) => update({ phone: formatPhone(v) })}
          valid={phoneValid}
          autoComplete="tel"
        />
      </div>

      <div className="flex gap-3">
        <Button variant="ghost" onClick={() => go('goals')}>{t(lang, 'back')}</Button>
        <Button onClick={() => go('address')} disabled={!ready} className="flex-1">
          {t(lang, 's1Cta')}
        </Button>
      </div>
    </div>
  )
}
