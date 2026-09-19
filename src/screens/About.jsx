import { useOnboarding } from '../context/OnboardingContext.jsx'
import { t } from '../lib/i18n.js'
import { formatPhone } from '../lib/mockApi.js'
import { isEligibleAge, ageFrom, MIN_AGE } from '../lib/compliance.js'
import { Field } from '../components/Field.jsx'
import { Button } from '../components/Button.jsx'

export function About() {
  const { form, update, go, lang } = useOnboarding()
  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)
  const phoneValid = form.phone.replace(/\D/g, '').length === 10

  // Date of birth is one of the four CIP data points a credit union must
  // collect (31 CFR 1020.220), and it is also what proves signing age.
  const age = ageFrom(form.dob)
  const ageOk = isEligibleAge(form.dob)
  const tooYoung = age !== null && age < MIN_AGE
  const ready = form.firstName && form.lastName && ageOk && emailValid && phoneValid

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
          label={lang === 'es' ? 'Fecha de nacimiento' : 'Date of birth'}
          type="date"
          value={form.dob}
          onChange={(v) => update({ dob: v })}
          valid={ageOk}
          autoComplete="bday"
          hint={
            lang === 'es'
              ? 'Requerido por la ley federal para verificar su identidad.'
              : 'Required by federal law to verify your identity.'
          }
        />

        {/* No dead ends: an under-18 applicant is told the actual route in,
            not just refused. */}
        {tooYoung && (
          <div className="rounded-xl bg-amber-subtle px-4 py-3 text-sm leading-relaxed text-amber-darkest" role="alert">
            {lang === 'es'
              ? `Debe tener ${MIN_AGE} años para abrir una cuenta por su cuenta. Un padre o tutor puede abrir una cuenta conjunta con usted en cualquier sucursal de UFCU.`
              : `You need to be ${MIN_AGE} to open an account on your own. A parent or guardian can open a joint account with you at any UFCU branch.`}
          </div>
        )}

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
