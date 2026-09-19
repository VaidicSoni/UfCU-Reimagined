import { createContext, useContext, useMemo, useState, useEffect, useCallback } from 'react'

const OnboardingContext = createContext(null)

export const STEPS = [
  'welcome',
  'goals',
  'about',
  'address',
  'identity',
  'waiting',
  'secure',
  'funding',
  'done',
  'dashboard',
]

// Screens that count toward the visible progress bar (waiting/done are not
// user-input steps, so counting them would make the bar feel dishonest).
const PROGRESS_STEPS = ['goals', 'about', 'address', 'identity', 'secure', 'funding']

// Obvious dummy values. These are pre-filled on purpose: a demo laptop on a
// projector should never tempt anyone into typing a real SSN or a real bank
// login. Nothing in this object is ever persisted or transmitted.
const INITIAL_FORM = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  address: '',
  city: '',
  state: '',
  zip: '',
  ssn: '',
}

const PREFS_KEY = 'ufcu.demo.prefs'

function loadPrefs() {
  try {
    const raw = localStorage.getItem(PREFS_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

export function OnboardingProvider({ children }) {
  const prefs = loadPrefs()

  // Demo shortcut: ?step=identity jumps straight to a screen, so any single
  // screen can be re-shown during Q&A without replaying the whole flow.
  const initialStep = (() => {
    const requested = new URLSearchParams(window.location.search).get('step')
    return STEPS.includes(requested) ? requested : 'welcome'
  })()

  const [step, setStep] = useState(initialStep)
  // ?goals=everyday,auto,credit seeds the selection, so a populated portal can
  // be re-shown during Q&A without replaying the whole flow.
  const [goals, setGoals] = useState(() => {
    const raw = new URLSearchParams(window.location.search).get('goals')
    return raw ? raw.split(',').map((g) => g.trim()).filter(Boolean) : []
  })
  const [form, setForm] = useState(INITIAL_FORM)
  const [idScanned, setIdScanned] = useState(false)
  const [consent, setConsent] = useState(false)
  const [passkey, setPasskey] = useState(null)
  const [funded, setFunded] = useState(false)
  const [linkedBank, setLinkedBank] = useState(null)

  // Which form field the user is currently focused on — drives context-aware
  // Lumi suggestions so she asks about SSN when you're in the SSN field, etc.
  const [focusedField, setFocusedField] = useState(null)

  // Accessibility preferences — the only thing we persist.
  const [lang, setLang] = useState(prefs.lang === 'es' ? 'es' : 'en')
  const [fontScale, setFontScale] = useState(prefs.fontScale || 1)
  const [readAloud, setReadAloud] = useState(prefs.readAloud === true)

  useEffect(() => {
    document.documentElement.style.setProperty('--font-scale', fontScale)
    document.documentElement.lang = lang
    try {
      localStorage.setItem(PREFS_KEY, JSON.stringify({ lang, fontScale, readAloud }))
    } catch {
      /* private browsing — preferences simply don't persist */
    }
  }, [lang, fontScale, readAloud])

  const update = useCallback((patch) => setForm((f) => ({ ...f, ...patch })), [])

  const toggleGoal = useCallback((id) => {
    setGoals((g) => (g.includes(id) ? g.filter((x) => x !== id) : [...g, id]))
  }, [])

  const go = useCallback((next) => {
    setStep(next)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  const reset = useCallback(() => {
    setGoals([])
    setForm(INITIAL_FORM)
    setIdScanned(false)
    setConsent(false)
    setPasskey(null)
    setFunded(false)
    setLinkedBank(null)
    setStep('welcome')
  }, [])

  const progress = useMemo(() => {
    const index = PROGRESS_STEPS.indexOf(step)
    if (index === -1) {
      // Waiting sits between identity and secure; done is complete.
      return step === 'done'
        ? { current: PROGRESS_STEPS.length, total: PROGRESS_STEPS.length }
        : { current: 4, total: PROGRESS_STEPS.length }
    }
    return { current: index + 1, total: PROGRESS_STEPS.length }
  }, [step])

  const value = {
    step, go, reset, progress,
    goals, toggleGoal,
    form, update,
    idScanned, setIdScanned,
    consent, setConsent,
    passkey, setPasskey,
    funded, setFunded,
    linkedBank, setLinkedBank,
    focusedField, setFocusedField,
    lang, setLang,
    fontScale, setFontScale,
    readAloud, setReadAloud,
  }

  return <OnboardingContext.Provider value={value}>{children}</OnboardingContext.Provider>
}

export function useOnboarding() {
  const ctx = useContext(OnboardingContext)
  if (!ctx) throw new Error('useOnboarding must be used inside OnboardingProvider')
  return ctx
}
