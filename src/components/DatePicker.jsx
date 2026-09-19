import { useEffect, useMemo, useRef, useState } from 'react'
import { t } from '../lib/i18n.js'
import { Icon } from './Icons.jsx'
import { addDays, addMonths, clampDate, daysInMonth, sameDay, startOfDay } from '../lib/date.js'

// Calendar popover for the date-of-birth field. Typing stays the primary path —
// this is the affordance for people who don't want to work out the digits.
//
// The month and year in the header are buttons that swap the body for a month
// grid and a year grid. A birth year is decades back, and stepping there one
// month at a time with the chevrons is not a real option.

const YEARS_PER_PAGE = 12

const localeOf = (lang) => (lang === 'es' ? 'es-ES' : 'en-US')

// August 1 2021 was a Sunday, so seven days from there names the whole week.
const weekdayNames = (locale) => {
  const fmt = new Intl.DateTimeFormat(locale, { weekday: 'short' })
  return Array.from({ length: 7 }, (_, i) => fmt.format(new Date(2021, 7, 1 + i)))
}

const monthNames = (locale) => {
  const fmt = new Intl.DateTimeFormat(locale, { month: 'long' })
  return Array.from({ length: 12 }, (_, m) => fmt.format(new Date(2021, m, 1)))
}

// Always six rows, so the popover keeps its height as the month changes.
function monthGrid(year, month) {
  const lead = new Date(year, month, 1).getDay()
  const first = new Date(year, month, 1 - lead)
  return Array.from({ length: 6 }, (_, row) =>
    Array.from({ length: 7 }, (_, col) => addDays(first, row * 7 + col)),
  )
}

const navButton =
  'flex h-10 w-10 items-center justify-center rounded-full text-navy transition ' +
  'hover:bg-navy-subtle/40 disabled:opacity-30 disabled:hover:bg-transparent'

const cellBase =
  'flex h-10 w-10 items-center justify-center rounded-full text-sm transition ' +
  'focus:outline-none focus-visible:ring-2 focus-visible:ring-navy'

export function DatePicker({ value, onSelect, onClose, lang, min, max, triggerRef }) {
  const locale = localeOf(lang)
  const rootRef = useRef(null)
  const cursorRef = useRef(null)
  const [view, setView] = useState('day')
  const [cursor, setCursor] = useState(() => clampDate(startOfDay(value ?? new Date()), min, max))

  const months = useMemo(() => monthNames(locale), [locale])
  const weekdays = useMemo(() => weekdayNames(locale), [locale])
  const dayLabel = useMemo(() => new Intl.DateTimeFormat(locale, { dateStyle: 'long' }), [locale])
  const weeks = useMemo(() => monthGrid(cursor.getFullYear(), cursor.getMonth()), [cursor])

  const outOfRange = (date) => (min && date < min) || (max && date > max)
  const moveTo = (date) => setCursor(clampDate(startOfDay(date), min, max))

  // Keeps the roving focus on the cursor cell as it moves through the grid.
  useEffect(() => {
    if (view === 'day') cursorRef.current?.focus()
  }, [cursor, view])

  useEffect(() => {
    const onPointerDown = (e) => {
      if (rootRef.current?.contains(e.target)) return
      // The trigger toggles on click; closing here first would just reopen it.
      if (triggerRef?.current?.contains(e.target)) return
      // The click already moved focus somewhere deliberate — don't yank it back.
      onClose({ restoreFocus: false })
    }
    document.addEventListener('mousedown', onPointerDown)
    return () => document.removeEventListener('mousedown', onPointerDown)
  }, [onClose, triggerRef])

  const onKeyDown = (e) => {
    if (e.key === 'Escape') {
      e.stopPropagation()
      onClose({ restoreFocus: true })
      return
    }
    if (view !== 'day') return
    const step = {
      ArrowLeft: () => addDays(cursor, -1),
      ArrowRight: () => addDays(cursor, 1),
      ArrowUp: () => addDays(cursor, -7),
      ArrowDown: () => addDays(cursor, 7),
      Home: () => addDays(cursor, -cursor.getDay()),
      End: () => addDays(cursor, 6 - cursor.getDay()),
      PageUp: () => addMonths(cursor, e.shiftKey ? -12 : -1),
      PageDown: () => addMonths(cursor, e.shiftKey ? 12 : 1),
    }[e.key]
    if (step) {
      e.preventDefault()
      moveTo(step())
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      if (!outOfRange(cursor)) onSelect(cursor)
    }
  }

  const inSameMonth = (bound) =>
    Boolean(bound) &&
    cursor.getFullYear() === bound.getFullYear() &&
    cursor.getMonth() === bound.getMonth()

  const minYear = min ? min.getFullYear() : cursor.getFullYear() - 100
  const maxYear = max ? max.getFullYear() : cursor.getFullYear()
  const pageStart =
    Math.floor((cursor.getFullYear() - minYear) / YEARS_PER_PAGE) * YEARS_PER_PAGE + minYear
  const years = Array.from({ length: YEARS_PER_PAGE }, (_, i) => pageStart + i)
    .filter((y) => y >= minYear && y <= maxYear)

  // Clamped so Feb 29 doesn't roll into March on the way to a non-leap year.
  const withYearMonth = (year, month) =>
    new Date(year, month, Math.min(cursor.getDate(), daysInMonth(year, month)))

  const jumpYears = (delta) =>
    moveTo(withYearMonth(
      Math.min(maxYear, Math.max(minYear, cursor.getFullYear() + delta)),
      cursor.getMonth(),
    ))

  return (
    <div
      ref={rootRef}
      role="dialog"
      aria-label={t(lang, 'dobPickerLabel')}
      onKeyDown={onKeyDown}
      className="absolute right-0 z-30 mt-2 w-[19rem] rounded-2xl border-2 border-navy-subtle bg-white p-3 shadow-card"
    >
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => setView(view === 'month' ? 'day' : 'month')}
          aria-expanded={view === 'month'}
          className="rounded-full px-3 py-2 text-sm font-bold text-navy transition hover:bg-navy-subtle/40"
        >
          {months[cursor.getMonth()]}
        </button>
        <button
          type="button"
          onClick={() => setView(view === 'year' ? 'day' : 'year')}
          aria-expanded={view === 'year'}
          className="rounded-full px-3 py-2 text-sm font-bold text-navy transition hover:bg-navy-subtle/40"
        >
          {cursor.getFullYear()}
        </button>
        <div className="ml-auto flex items-center">
          <button
            type="button"
            onClick={() => moveTo(addMonths(cursor, -1))}
            disabled={inSameMonth(min)}
            aria-label={t(lang, 'dobPrevMonth')}
            className={navButton}
          >
            <Icon.chevron className="h-4 w-4 rotate-180" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => moveTo(addMonths(cursor, 1))}
            disabled={inSameMonth(max)}
            aria-label={t(lang, 'dobNextMonth')}
            className={navButton}
          >
            <Icon.chevron className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </div>

      {view === 'day' && (
        <div role="grid" className="mt-1">
          <div role="row" className="flex">
            {weekdays.map((d) => (
              <div
                key={d}
                role="columnheader"
                aria-label={d}
                className="flex h-8 w-10 items-center justify-center text-xs font-semibold text-navy-lighter"
              >
                {d.slice(0, 2)}
              </div>
            ))}
          </div>
          {weeks.map((week) => (
            <div role="row" key={week[0].toISOString()} className="flex">
              {week.map((date) => {
                const isCursor = sameDay(date, cursor)
                const isSelected = sameDay(date, value)
                const outside = date.getMonth() !== cursor.getMonth()
                const disabled = outOfRange(date)
                return (
                  <button
                    key={date.toISOString()}
                    ref={isCursor ? cursorRef : null}
                    type="button"
                    role="gridcell"
                    tabIndex={isCursor ? 0 : -1}
                    disabled={disabled}
                    aria-selected={isSelected}
                    aria-label={dayLabel.format(date)}
                    onClick={() => onSelect(date)}
                    className={`${cellBase} ${
                      isSelected
                        ? 'bg-navy font-bold text-white'
                        : disabled
                          ? 'cursor-not-allowed text-navy-subtle'
                          : outside
                            ? 'text-navy-lighter hover:bg-navy-subtle/40'
                            : 'text-navy hover:bg-navy-subtle/40'
                    }`}
                  >
                    {date.getDate()}
                  </button>
                )
              })}
            </div>
          ))}
        </div>
      )}

      {view === 'month' && (
        <div className="mt-1 grid grid-cols-3 gap-1">
          {months.map((name, m) => {
            const monthStart = new Date(cursor.getFullYear(), m, 1)
            const monthEnd = new Date(cursor.getFullYear(), m, daysInMonth(cursor.getFullYear(), m))
            const disabled = (min && monthEnd < min) || (max && monthStart > max)
            return (
              <button
                key={name}
                type="button"
                disabled={Boolean(disabled)}
                aria-pressed={m === cursor.getMonth()}
                onClick={() => {
                  moveTo(withYearMonth(cursor.getFullYear(), m))
                  setView('day')
                }}
                className={`rounded-xl px-2 py-3 text-sm transition disabled:cursor-not-allowed disabled:text-navy-subtle ${
                  m === cursor.getMonth()
                    ? 'bg-navy font-bold text-white'
                    : 'text-navy hover:bg-navy-subtle/40'
                }`}
              >
                {name.slice(0, 3)}
              </button>
            )
          })}
        </div>
      )}

      {view === 'year' && (
        <div className="mt-1">
          <div className="flex items-center justify-between">
            <button
              type="button"
              disabled={pageStart <= minYear}
              onClick={() => jumpYears(-YEARS_PER_PAGE)}
              aria-label={t(lang, 'dobPrevYears')}
              className={navButton}
            >
              <Icon.chevron className="h-4 w-4 rotate-180" aria-hidden="true" />
            </button>
            <span className="text-sm font-bold text-navy">
              {years[0]} – {years[years.length - 1]}
            </span>
            <button
              type="button"
              disabled={pageStart + YEARS_PER_PAGE > maxYear}
              onClick={() => jumpYears(YEARS_PER_PAGE)}
              aria-label={t(lang, 'dobNextYears')}
              className={navButton}
            >
              <Icon.chevron className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
          <div className="mt-1 grid grid-cols-3 gap-1">
            {years.map((year) => (
              <button
                key={year}
                type="button"
                aria-pressed={year === cursor.getFullYear()}
                onClick={() => {
                  moveTo(withYearMonth(year, cursor.getMonth()))
                  setView('day')
                }}
                className={`rounded-xl px-2 py-3 text-sm transition ${
                  year === cursor.getFullYear()
                    ? 'bg-navy font-bold text-white'
                    : 'text-navy hover:bg-navy-subtle/40'
                }`}
              >
                {year}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
