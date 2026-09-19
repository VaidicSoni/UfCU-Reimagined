import { useMemo, useRef, useState } from 'react'
import { useOnboarding } from '../context/OnboardingContext.jsx'
import { t } from '../lib/i18n.js'
import { formatPhone } from '../lib/mockApi.js'
import { birthDateRange, formatDate, maskDate, parseDate } from '../lib/date.js'
import { Field } from '../components/Field.jsx'
import { DatePicker } from '../components/DatePicker.jsx'
import { Icon } from '../components/Icons.jsx'
import { Button } from '../components/Button.jsx'
import { UniversityDropdown } from '../components/UniversityDropdown.jsx'

export function About() {
  const { form, update, go, lang } = useOnboarding()
  const [pickerOpen, setPickerOpen] = useState(false)
  const pickerButtonRef = useRef(null)
  const { min, max } = useMemo(() => birthDateRange(), [])

  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)
  const dateOfBirth = parseDate(form.dateOfBirth)
  const dateOfBirthValid = Boolean(dateOfBirth && dateOfBirth >= min && dateOfBirth <= max)
  const phoneValid = form.phone.replace(/\D/g, '').length === 10
  const ready = form.firstName && form.lastName && emailValid && dateOfBirthValid && phoneValid

  const closePicker = ({ restoreFocus = true } = {}) => {
    setPickerOpen(false)
    if (restoreFocus) pickerButtonRef.current?.focus()
  }

  const pickDate = (date) => {
    update({ dateOfBirth: formatDate(date) })
    closePicker()
  }

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
            fieldId="firstName"
          />
          <Field
            label={t(lang, 'lastName')}
            value={form.lastName}
            onChange={(v) => update({ lastName: v })}
            valid={form.lastName.length > 1}
            autoComplete="family-name"
            fieldId="lastName"
          />
        </div>
        <div className="grid min-w-0 gap-4 sm:grid-cols-2">
          <Field
            label={t(lang, 'email')}
            type="email"
            value={form.email}
            onChange={(v) => update({ email: v })}
            valid={emailValid}
            autoComplete="email"
            fieldId="email"
          />
          {/* Relative wrapper rather than the Field itself: the popover has to
              escape the input's rounded box, the way the address suggestions do. */}
          <div className="relative min-w-0">
            <Field
              label={t(lang, 'dateOfBirth')}
              value={form.dateOfBirth}
              onChange={(v) => update({ dateOfBirth: maskDate(v) })}
              valid={dateOfBirthValid}
              placeholder={t(lang, 'dateOfBirthPlaceholder')}
              inputMode="numeric"
              autoComplete="bday"
              fieldId="dateOfBirth"
              trailing={
                <button
                  ref={pickerButtonRef}
                  type="button"
                  onClick={() => setPickerOpen((open) => !open)}
                  aria-expanded={pickerOpen}
                  aria-label={t(lang, 'dobOpenPicker')}
                  className="flex h-11 w-11 items-center justify-center rounded-full text-navy-lighter transition hover:bg-navy-subtle/40 hover:text-navy"
                >
                  <Icon.calendar className="h-5 w-5" aria-hidden="true" />
                </button>
              }
            />
            {pickerOpen && (
              <DatePicker
                value={dateOfBirth}
                onSelect={pickDate}
                onClose={closePicker}
                triggerRef={pickerButtonRef}
                lang={lang}
                min={min}
                max={max}
              />
            )}
          </div>
        </div>
        <Field
          label={t(lang, 'phone')}
          type="tel"
          inputMode="numeric"
          value={form.phone}
          onChange={(v) => update({ phone: formatPhone(v) })}
          valid={phoneValid}
          autoComplete="tel"
          fieldId="phone"
        />
        <UniversityDropdown
          value={form.university}
          onChange={(v) => update({ university: v })}
          lang={lang}
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
