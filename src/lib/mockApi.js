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
      { en: 'Free Checking', es: 'Cuenta corriente gratuita',
        valueEn: 'No monthly fee, no minimum balance', valueEs: 'Sin cuota mensual ni saldo mínimo' },
      { en: 'High-Yield Savings', es: 'Ahorros de alto rendimiento',
        valueEn: 'Earns from your first dollar', valueEs: 'Rinde desde el primer dólar' },
    ],
  },
  {
    id: 'auto', icon: 'consumer', product: 'Consumer Lending', qualifies: true,
    en: 'Planning to buy a car', es: 'Planeo comprar un auto',
    bundle: [
      { en: 'Auto Loan pre-qualification', es: 'Precalificación de préstamo de auto',
        valueEn: 'Rates from 5.24% APR, held for 30 days', valueEs: 'Tasas desde 5.24% APR, por 30 días' },
    ],
    offer: { en: 'Pre-qualified auto rate from 5.24% APR', es: 'Tasa de auto precalificada desde 5.24% APR' },
  },
  {
    id: 'credit', icon: 'credit', product: 'Consumer Lending', qualifies: true,
    en: 'Building my credit', es: 'Construir mi crédito',
    bundle: [
      { en: 'Starter Credit Card', es: 'Tarjeta de crédito inicial',
        valueEn: 'No annual fee; reports to all three bureaus', valueEs: 'Sin cuota anual; reporta a las tres agencias' },
    ],
    offer: { en: 'Starter Credit Card with no annual fee', es: 'Tarjeta inicial sin cuota anual' },
  },
  {
    id: 'home', icon: 'mortgage', product: 'Mortgage Lending', qualifies: true,
    en: 'Buying a home someday', es: 'Comprar una casa algún día',
    bundle: [
      { en: 'Mortgage rate watch', es: 'Monitor de tasas hipotecarias',
        valueEn: 'First-time buyer guidance, no obligation', valueEs: 'Guía para primer comprador, sin compromiso' },
    ],
    offer: { en: 'First-time buyer guidance and rate watch', es: 'Guía para primer comprador' },
  },
  {
    id: 'business', icon: 'business', product: 'Business Banking', qualifies: true,
    en: 'Banking for my business', es: 'Banca para mi negocio',
    bundle: [
      { en: 'Business Checking', es: 'Cuenta corriente empresarial',
        valueEn: 'Built for sole traders and small teams', valueEs: 'Para autónomos y equipos pequeños' },
    ],
  },
  {
    id: 'invest', icon: 'invest', product: 'Investments', qualifies: false,
    en: 'Growing my savings', es: 'Hacer crecer mis ahorros',
    bundle: [
      { en: '12-month Certificate', es: 'Certificado a 12 meses',
        valueEn: 'Fixed return, federally insured', valueEs: 'Retorno fijo, asegurado federalmente' },
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

export const BANKS = [
  { id: 'chase', name: 'Chase', color: '#117ACA' },
  { id: 'bofa', name: 'Bank of America', color: '#E31837' },
  { id: 'wells', name: 'Wells Fargo', color: '#D71E28' },
  { id: 'usaa', name: 'USAA', color: '#00447C' },
  { id: 'frost', name: 'Frost Bank', color: '#00416B' },
  { id: 'other', name: 'Another bank', color: '#23335D' },
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
