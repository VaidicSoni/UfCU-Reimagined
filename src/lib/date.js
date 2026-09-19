// Date of birth can be typed or picked from the calendar popover, so both paths
// share one string shape: mm/dd/yyyy. The four-digit year is what makes that
// round trip lossless — a two-digit year has to guess the century, which puts
// the earliest birth years out of reach.

export function maskDate(value) {
  const digits = value.replace(/\D/g, '').slice(0, 8)
  if (digits.length < 3) return digits
  if (digits.length < 5) return `${digits.slice(0, 2)}/${digits.slice(2)}`
  return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`
}

// Returns a Date only for a complete, real calendar date — null otherwise.
export function parseDate(value) {
  const match = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(value ?? '')
  if (!match) return null
  const month = Number(match[1])
  const day = Number(match[2])
  const year = Number(match[3])
  const date = new Date(year, month - 1, day)
  // The Date constructor rolls 02/31 over into March, so compare the parts back.
  const real =
    date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day
  return real ? date : null
}

export function formatDate(date) {
  const pad = (n) => String(n).padStart(2, '0')
  return `${pad(date.getMonth() + 1)}/${pad(date.getDate())}/${date.getFullYear()}`
}

export const startOfDay = (date) =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate())

export const daysInMonth = (year, month) => new Date(year, month + 1, 0).getDate()

export const sameDay = (a, b) =>
  Boolean(a) && Boolean(b) &&
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate()

export const addDays = (date, n) =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate() + n)

// Clamps the day so stepping off the end of a long month lands on the last day
// of the short one rather than spilling into the next.
export function addMonths(date, n) {
  const target = new Date(date.getFullYear(), date.getMonth() + n, 1)
  const day = Math.min(date.getDate(), daysInMonth(target.getFullYear(), target.getMonth()))
  return new Date(target.getFullYear(), target.getMonth(), day)
}

export function clampDate(date, min, max) {
  if (min && date < min) return min
  if (max && date > max) return max
  return date
}

// The landing copy already states you must be 18 to join, so the calendar stops
// there rather than offering dates the form would only reject later.
export const MIN_AGE = 18
export const OLDEST_YEARS = 120

export function birthDateRange(today = new Date()) {
  const base = startOfDay(today)
  return {
    max: new Date(base.getFullYear() - MIN_AGE, base.getMonth(), base.getDate()),
    min: new Date(base.getFullYear() - OLDEST_YEARS, base.getMonth(), base.getDate()),
  }
}
