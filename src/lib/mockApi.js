// Every "backend" in this prototype is simulated. The prompt explicitly states
// teams are not required to build real identity verification or banking
// integrations. Nothing here leaves the browser.

// Goal chips on screen 1. `product` maps each goal to the prompt's product
// areas; `qualifies` marks the paths that actually confer UFCU membership
// (deposit account, loan, or mortgage) — Investments notably does not.
// `bundle` is what the goal actually opens, with the value line we show the
// member so the recommendation is never just a product name.
export const GOALS = [
  {
    id: 'everyday', icon: 'everyday', product: 'Everyday Banking', qualifies: true,
    en: 'Everyday checking & savings', es: 'Cuenta corriente y ahorros',
    bundle: [
      { en: 'Free Checking', es: 'Cuenta corriente gratuita', kind: 'deposit',
        valueEn: 'No monthly fee, no minimum balance', valueEs: 'Sin cuota mensual ni saldo mínimo', balance90: 2418.63 },
      { en: 'High-Yield Savings', es: 'Ahorros de alto rendimiento', kind: 'deposit',
        valueEn: 'Earns from your first dollar', valueEs: 'Rinde desde el primer dólar', balance90: 1250.00 },
    ],
  },
  {
    id: 'auto', icon: 'consumer', product: 'Consumer Lending', qualifies: true,
    en: 'Planning to buy a car', es: 'Planeo comprar un auto',
    bundle: [
      { en: 'Auto Loan pre-qualification', es: 'Precalificación de préstamo de auto', kind: 'offer',
        valueEn: 'Rates from 5.24% APR, held for 30 days', valueEs: 'Tasas desde 5.24% APR, por 30 días', owed90: 18240.00 },
    ],
    offer: { en: 'Pre-qualified auto rate from 5.24% APR', es: 'Tasa de auto precalificada desde 5.24% APR' },
  },
  {
    id: 'credit', icon: 'credit', product: 'Consumer Lending', qualifies: true,
    en: 'Building my credit', es: 'Construir mi crédito',
    bundle: [
      { en: 'Starter Credit Card', es: 'Tarjeta de crédito inicial', kind: 'card',
        valueEn: 'No annual fee; reports to all three bureaus', valueEs: 'Sin cuota anual; reporta a las tres agencias', owed90: 312.45 },
    ],
    offer: { en: 'Starter Credit Card with no annual fee', es: 'Tarjeta inicial sin cuota anual' },
  },
  {
    id: 'home', icon: 'mortgage', product: 'Mortgage Lending', qualifies: true,
    en: 'Buying a home someday', es: 'Comprar una casa algún día',
    bundle: [
      { en: 'Mortgage rate watch', es: 'Monitor de tasas hipotecarias', kind: 'offer',
        valueEn: 'First-time buyer guidance, no obligation', valueEs: 'Guía para primer comprador, sin compromiso' },
    ],
    offer: { en: 'First-time buyer guidance and rate watch', es: 'Guía para primer comprador' },
  },
  {
    id: 'business', icon: 'business', product: 'Business Banking', qualifies: true,
    en: 'Banking for my business', es: 'Banca para mi negocio',
    bundle: [
      { en: 'Business Checking', es: 'Cuenta corriente empresarial', kind: 'deposit',
        valueEn: 'Built for sole traders and small teams', valueEs: 'Para autónomos y equipos pequeños', balance90: 640.25 },
    ],
  },
  {
    id: 'invest', icon: 'invest', product: 'Investments', qualifies: false,
    en: 'Growing my savings', es: 'Hacer crecer mis ahorros',
    bundle: [
      { en: '12-month Certificate', es: 'Certificado a 12 meses', kind: 'deposit',
        valueEn: 'Fixed return, federally insured', valueEs: 'Retorno fijo, asegurado federalmente', balance90: 1000.00 },
    ],
  },
]

// The bundle the selected goals add up to, de-duplicated.
export function bundleFor(goalIds) {
  const seen = new Set()
  return GOALS.filter((g) => goalIds.includes(g.id)).flatMap((g) =>
    (g.bundle || []).filter((item) => {
      if (seen.has(item.en)) return false
      seen.add(item.en)
      return true
    })
  )
}

// Rough member-segment read, used to tailor the bundle summary. Real onboarding
// would infer this from far more signal; here the selected goals are enough to
// show the journey adapting to who the member is.
export function inferSegment(goalIds) {
  if (goalIds.includes('business')) return { en: 'a business owner', es: 'un dueño de negocio' }
  if (goalIds.includes('home')) return { en: 'planning ahead', es: 'planificando a futuro' }
  if (goalIds.includes('credit') && !goalIds.includes('auto'))
    return { en: 'just starting out', es: 'empezando' }
  if (goalIds.includes('invest')) return { en: 'growing what you have', es: 'haciendo crecer su dinero' }
  return { en: 'keeping it simple', es: 'manteniéndolo simple' }
}

// Screen 5 — the checks that animate in the Productive Waiting Room.
export const KYC_STEPS = ['checkId', 'checkIdentity', 'checkOfac', 'checkAccount']

export const BANKS = [
  { id: 'chase', name: 'Chase', color: '#117ACA', logo: '/logos/chaseLogo.jpg' },
  { id: 'bofa', name: 'Bank of America', color: '#E31837', logo: '/logos/boaLogo.png' },
  { id: 'wells', name: 'Wells Fargo', color: '#D71E28', logo: '/logos/wellFargoLogo.webp' },
  { id: 'usaa', name: 'USAA', color: '#00447C', logo: '/logos/USAALogo.png' },
  { id: 'frost', name: 'Frost Bank', color: '#00416B', logo: '/logos/frostLogo.png' },
  { id: 'sofi', name: 'SoFi', color: '#23335D', logo: '/logos/sofiLogo.png' },
]

// Mock address autocomplete — Austin-flavored, no network call.
const ADDRESSES = [
  { line: '2244 Guadalupe St', city: 'Austin', state: 'TX', zip: '78705' },
  { line: '1101 Red River St', city: 'Austin', state: 'TX', zip: '78701' },
  { line: '4700 Lamar Blvd', city: 'Austin', state: 'TX', zip: '78751' },
  { line: '600 Congress Ave', city: 'Austin', state: 'TX', zip: '78701' },
  { line: '2001 Speedway', city: 'Austin', state: 'TX', zip: '78712' },
]

export function suggestAddresses(query) {
  const q = query.trim().toLowerCase()
  if (q.length < 2) return []
  return ADDRESSES.filter((a) => a.line.toLowerCase().includes(q)).slice(0, 4)
}

export const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

// Real WebAuthn call. On a supporting device this raises the genuine Touch ID /
// Face ID / Windows Hello sheet — the one moment of the demo that is not faked.
// Falls back cleanly when unsupported or dismissed.
export async function createPasskey(displayName) {
  if (!window.PublicKeyCredential || !navigator.credentials?.create) {
    return { ok: false, reason: 'unsupported' }
  }
  try {
    await navigator.credentials.create({
      publicKey: {
        challenge: crypto.getRandomValues(new Uint8Array(32)),
        rp: { name: 'UFCU' },
        user: {
          id: crypto.getRandomValues(new Uint8Array(16)),
          name: displayName || 'new.member@ufcu.demo',
          displayName: displayName || 'New UFCU Member',
        },
        pubKeyCredParams: [
          { type: 'public-key', alg: -7 },
          { type: 'public-key', alg: -257 },
        ],
        authenticatorSelection: {
          authenticatorAttachment: 'platform',
          userVerification: 'preferred',
        },
        timeout: 60000,
        attestation: 'none',
      },
    })
    return { ok: true }
  } catch (err) {
    return { ok: false, reason: err?.name || 'dismissed' }
  }
}

export function formatSSN(value) {
  const digits = value.replace(/\D/g, '').slice(0, 9)
  if (digits.length <= 3) return digits
  if (digits.length <= 5) return `${digits.slice(0, 3)}-${digits.slice(3)}`
  return `${digits.slice(0, 3)}-${digits.slice(3, 5)}-${digits.slice(5)}`
}

export function formatPhone(value) {
  const digits = value.replace(/\D/g, '').slice(0, 10)
  if (digits.length <= 3) return digits
  if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`
}

// Recurring payments the dashboard's subscription tracker plots. Simulated.
export const SUBSCRIPTIONS = [
  { id: 'phone', en: 'Mobile plan', es: 'Plan móvil', amount: 65.0 },
  { id: 'gym', en: 'Gym membership', es: 'Gimnasio', amount: 42.0 },
  { id: 'stream', en: 'Streaming', es: 'Streaming', amount: 15.49 },
  { id: 'music', en: 'Music', es: 'Música', amount: 11.99 },
  { id: 'cloud', en: 'Cloud storage', es: 'Almacenamiento', amount: 2.99 },
]

// $3,668.63 rather than $3668.63 — grouping is what makes a balance scannable.
export const formatMoney = (n, lang = 'en') =>
  `$${Number(n || 0).toLocaleString(lang === 'es' ? 'es-US' : 'en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`

// Simulated 90-day activity for the spending and goal panels.
export const SPEND_CATEGORIES = [
  { id: 'bills', icon: '⚡', en: 'Bills & utilities', es: 'Servicios', amount: 412.47, color: '#23335D' },
  { id: 'grocery', icon: '🛒', en: 'Groceries', es: 'Supermercado', amount: 318.9, color: '#EF6820' },
  { id: 'transport', icon: '🚗', en: 'Transport', es: 'Transporte', amount: 164.2, color: '#8182B1' },
  { id: 'dining', icon: '🍽️', en: 'Dining', es: 'Restaurantes', amount: 121.75, color: '#F2780C' },
  { id: 'health', icon: '🏥', en: 'Health', es: 'Salud', amount: 84.0, color: '#F49A6A' },
  { id: 'other', icon: '✨', en: 'Everything else', es: 'Otros', amount: 58.3, color: '#CDCDE0' },
]

// Income vs spend, most recent month last.
export const MONTHLY = [
  { key: 'apr', en: 'Apr', es: 'Abr', income: 2380, spend: 1910 },
  { key: 'may', en: 'May', es: 'May', income: 2380, spend: 2040 },
  { key: 'jun', en: 'Jun', es: 'Jun', income: 2650, spend: 1780 },
  { key: 'jul', en: 'Jul', es: 'Jul', income: 2380, spend: 2210 },
  { key: 'aug', en: 'Aug', es: 'Ago', income: 2380, spend: 1640 },
  { key: 'sep', en: 'Sep', es: 'Sep', income: 2650, spend: 1159.62 },
]

export const GOAL = { en: 'Emergency fund', es: 'Fondo de emergencia', target: 1800, saved: 1250 }

// Sourced from UFCU's live "Open an Account" form. The last option is the one
// that matters: anyone can join through the American Consumer Council, free,
// and UFCU enrols you. Their own site hides that behind a modal.
export const AFFILIATIONS = [
  'Ascension/Seton',
  'Austin Community College (ACC)',
  'Concordia University (CTX)',
  'Foundation Communities',
  'Galveston College',
  'Goodwill',
  'Huston-Tillotson University (HT)',
  'Indeed',
  "St. Edward's University (SEU)",
  'Southwestern University (SU)',
  'Temple College (TC)',
  'Texas State University (TXST)',
  'TX A&M at Galveston (TAMUG)',
  'TX A&M HSC',
  'University of Texas at Austin (UT Austin)',
  'University of Texas Medical Branch (UTMB)',
  'UTHealth-Houston',
  'YMCA',
]

export const UNIVERSITIES = [
  { id: 'none', en: 'None / Not a student', es: 'Ninguno / No soy estudiante', theme: 'default' },
  { id: 'ut', en: 'University of Texas at Austin (UT Austin)', es: 'Universidad de Texas en Austin', theme: 'ut', color: '#BF5700', cardBg: 'bg-[#BF5700]' },
  { id: 'txst', en: 'Texas State University (TXST)', es: 'Texas State University', theme: 'txst', color: '#501214', cardBg: 'bg-[#501214]' },
  { id: 'acc', en: 'Austin Community College (ACC)', es: 'Austin Community College (ACC)', theme: 'acc', color: '#4B306A', cardBg: 'bg-[#4B306A]' }
]
// Quick append

// ── Identity edge cases ─────────────────────────────────────────────────

// Accepted documents. UFCU's own form asks for a driver licence or state ID;
// a passport matters for international students, who are a large slice of the
// UT/Texas State population and the group most likely to have neither.
export const ID_TYPES = [
  { id: 'license', en: "Driver's licence", es: 'Licencia de conducir', placeholder: 'TX DRIVER LICENCE' },
  { id: 'state', en: 'State ID', es: 'Identificación estatal', placeholder: 'TX STATE ID' },
  { id: 'passport', en: 'Passport', es: 'Pasaporte', placeholder: 'PASSPORT' },
]

// SSNs are never issued starting with 9; ITINs always are. That single rule
// catches the most common mistake — entering one in the other's field.
export function validateTaxId(value, type) {
  // Neither number to hand is a legitimate state, not a failed entry.
  if (type === 'none') return { valid: false, reason: null }
  const digits = (value || '').replace(/\D/g, '')
  if (digits.length !== 9) return { valid: false, reason: null }
  if (type === 'itin' && digits[0] !== '9') return { valid: false, reason: 'taxErrItin' }
  if (type === 'ssn' && digits[0] === '9') return { valid: false, reason: 'taxErrSsn' }
  return { valid: true, reason: null }
}

// Succeeds first time so the demo runs straight through. The failure path is
// still worth showing — a failed scan is the biggest single drop-off point in
// account opening — so ?scan=fail forces the first attempt to fail and the
// retry to succeed. Same demo-shortcut pattern as ?step= and ?goals=.
export function scanOutcome(attempt) {
  const forced =
    typeof window !== 'undefined' &&
    new URLSearchParams(window.location.search).get('scan') === 'fail'
  if (forced && attempt === 0) return { ok: false, reason: 'scanGlare' }
  return { ok: true }
}
