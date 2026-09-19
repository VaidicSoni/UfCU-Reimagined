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
  dateOfBirth: '',
  phone: '',
  address: '',
  city: '',
  state: '',
  zip: '',
  ssn: '',
  university: 'none',
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
  const [form, setForm] = useState(() => {
    // ?university=UT%20Austin seeds the student persona, so the student
    // dashboard can be shown without walking the whole flow.
    const uni = new URLSearchParams(window.location.search).get('university')
    return uni ? { ...INITIAL_FORM, university: uni } : INITIAL_FORM
  })
  const [idScanned, setIdScanned] = useState(false)
  const [taxIdType, setTaxIdType] = useState('ssn')
  // 'document' | 'bank' — how identity was actually established.
  const [identityVia, setIdentityVia] = useState(null)
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

  // Every step change is a history entry, so the browser's Back button and the
  // trackpad swipe move through the flow instead of leaving the app. Other
  // query params are preserved — ?goals= seeds the selection and ?scan=fail is
  // read on every scan, so dropping them mid-flow would change behaviour.
  const pushStep = useCallback((next, replace) => {
    const url = new URL(window.location.href)
    url.searchParams.set('step', next)
    window.history[replace ? 'replaceState' : 'pushState']({ step: next }, '', url)
  }, [])

  const go = useCallback(
    (next) => {
      setStep(next)
      pushStep(next, false)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    },
    [pushStep]
  )

  // The first entry needs step state attached, or the first Back has nothing
  // to return to and drops out of the app.
  useEffect(() => {
    pushStep(initialStep, true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const onPop = (event) => {
      const previous = event.state?.step
      // setStep directly: pushing again here would fight the history stack.
      if (previous && STEPS.includes(previous)) {
        setStep(previous)
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
    }
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])

  const reset = useCallback(() => {
    setGoals([])
    setForm(INITIAL_FORM)
    setIdScanned(false)
    setTaxIdType('ssn')
    setIdentityVia(null)
    setConsent(false)
    setPasskey(null)
    setFunded(false)
    setLinkedBank(null)
    setStep('welcome')
    // Keep history in step with the reset, or Back would return to a screen
    // whose data has just been cleared.
    pushStep('welcome', false)
  }, [pushStep])

  const signInDemo = useCallback((user) => {
    const [firstName = '', ...lastParts] = (user.name || '').split(' ')
    const profile = user.profile || {}
    const demoGoals = user.type === 'student'
      ? ['everyday', 'credit']
      : user.type === 'business'
        ? ['everyday', 'business']
        : ['everyday']

    setGoals(demoGoals)
    setForm((current) => ({
      ...current,
      firstName,
      lastName: lastParts.join(' '),
      email: profile.email || '',
      phone: profile.phone || '',
      address: profile.address || '',
      university: profile.university || 'none',
    }))
    setFunded(true)
    setStep('dashboard')
    pushStep('dashboard', false)
  }, [pushStep])

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
    step, go, reset, signInDemo, progress,
    goals, toggleGoal,
    form, update,
    idScanned, setIdScanned,
    taxIdType, setTaxIdType,
    identityVia, setIdentityVia,
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
