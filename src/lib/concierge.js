// Context-aware concierge with dual-path answers:
// • Suggested chip Q&A: instant hardcoded lookup from KNOWLEDGE (no server call)
// • Custom typed Q&A: async fetch to local RAG server at /api/ask
//
// Suggested questions change based on the current onboarding screen AND which
// text field the user is focused on, so Lumi always feels relevant.

// ── Hardcoded knowledge for instant chip answers ───────────────────────
const KNOWLEDGE = [
  {
    keywords: ['ssn', 'social security', 'social'],
    en: "Federal law requires us to verify your identity before opening an account. Your SSN is encrypted, never shared, and checking it will not affect your credit score.",
    es: "La ley federal exige que verifiquemos su identidad. Su número está cifrado, nunca se comparte y no afecta su crédito.",
  },
  {
    keywords: ['safe', 'secure', 'security', 'encrypt', 'privacy', 'data'],
    en: "Everything you enter is protected with bank-level encryption. We only ask for what the law requires — nothing more.",
    es: "Todo lo que ingresa está protegido con cifrado de nivel bancario. Solo pedimos lo que la ley exige.",
  },
  {
    keywords: ['credit', 'score', 'hurt', 'affect'],
    en: "Opening your account uses a soft check only, so your credit score is untouched.",
    es: "Abrir su cuenta solo usa una verificación suave, así que su puntaje de crédito no se ve afectado.",
  },
  {
    keywords: ['fee', 'fees', 'cost', 'charge', 'minimum'],
    en: "UFCU Free Checking has no monthly maintenance fee and no minimum balance requirement.",
    es: "La cuenta corriente gratuita de UFCU no tiene cuota mensual ni saldo mínimo.",
  },
  {
    keywords: ['long', 'time', 'minutes', 'how long', 'quick'],
    en: "Most members finish in under three minutes. I'll stay with you the whole way.",
    es: "La mayoría de los miembros terminan en menos de tres minutos. Estaré con usted todo el camino.",
  },
  {
    keywords: ['id', 'license', 'passport', 'document', 'photo', 'scan'],
    en: "A driver's license works, and so does a passport or state ID. International students can use a foreign passport with an ITIN.",
    es: "Puede usar licencia de conducir, pasaporte o identificación estatal. Estudiantes internacionales pueden usar pasaporte extranjero con ITIN.",
  },
  {
    keywords: ['password', 'passkey', 'login', 'log in'],
    en: "No password needed. We use a passkey tied to your device — your face or fingerprint unlocks it.",
    es: "No necesita contraseña. Usamos una clave de acceso vinculada a su dispositivo.",
  },
  {
    keywords: ['member', 'membership', 'join', 'eligible', 'qualify'],
    en: "Almost certainly yes. Employees, students and alumni of UFCU's partner schools and employers — UT Austin, Texas State, ACC, St. Edward's, Indeed and others — can join directly. If none apply, we enrol you through the American Consumer Council for free and handle it for you. Opening a deposit account, loan or mortgage then makes you a member-owner.",
    es: "Casi con certeza. Empleados, estudiantes y exalumnos de las escuelas y empleadores asociados de UFCU pueden unirse directamente. Si ninguno aplica, lo inscribimos gratis a través del American Consumer Council. Abrir una cuenta, préstamo o hipoteca lo convierte en miembro-dueño.",
  },
  // ── New context-aware entries ──
  {
    keywords: ['checking', 'checking account', 'accounts', 'offer'],
    en: "We offer four checking options: Teen Checking (ages 13–17), Simply U™ (hassle-free basics), Free Checking (classic with $400 Courtesy Pay), and Plus Checking (premium with up to 2.25% APY dividends and auto rate discounts).",
    es: "Ofrecemos cuatro opciones: Teen Checking (13–17 años), Simply U™ (lo básico), Free Checking (clásica con $400 en Courtesy Pay) y Plus Checking (premium con hasta 2.25% APY).",
  },
  {
    keywords: ['plus checking', 'premium', 'plus'],
    en: "Plus Checking earns up to 2.25% APY on the first $10,000, includes a 0.25% auto loan rate discount, $200 mortgage fee credit, reimbursed international fees, and $1,000 Courtesy Pay. The $10/month fee is waived with $10,000+ balance or $4,000+ in monthly direct deposits.",
    es: "Plus Checking gana hasta 2.25% APY en los primeros $10,000, incluye descuento de 0.25% en préstamos de auto, crédito de $200 en hipoteca, reembolso de cargos internacionales y $1,000 en Courtesy Pay. La cuota de $10/mes se elimina con $10,000+ de saldo o $4,000+ de depósito directo.",
  },
  {
    keywords: ['savings', 'save', 'saving'],
    en: "UFCU Savings accounts start at just $1 to open with no monthly fee. For higher yields, our Money Market earns up to 3.25% APY ($2,500 to open), and Certificates up to 4.10% APY ($1,000 to open, 3–60 month terms).",
    es: "Las cuentas de ahorro UFCU se abren desde $1 sin cuota mensual. Para mejores rendimientos, Money Market gana hasta 3.25% APY ($2,500 para abrir) y Certificados hasta 4.10% APY ($1,000 para abrir).",
  },
  {
    keywords: ['phone', 'number', 'call', 'text'],
    en: "We'll use your phone number to send a security code for verification. We won't share it with third parties or use it for marketing calls.",
    es: "Usaremos su número para enviar un código de seguridad. No lo compartiremos con terceros ni lo usaremos para llamadas de marketing.",
  },
  {
    keywords: ['email', 'spam', 'mail'],
    en: "We'll only email you about your account — things like statements and security alerts. No spam, ever. You can change your email anytime in Online Banking.",
    es: "Solo le enviaremos correos sobre su cuenta — como estados de cuenta y alertas de seguridad. Sin spam, nunca. Puede cambiar su correo en Online Banking.",
  },
  {
    keywords: ['address', 'mail', 'card', 'send', 'p.o. box', 'po box'],
    en: "We need your address to mail your debit card and to meet federal address verification rules. A P.O. Box can work for mailing, but federal law also requires a physical address on file.",
    es: "Necesitamos su dirección para enviar su tarjeta de débito y cumplir con verificación federal. Un apartado postal funciona para correo, pero la ley requiere también una dirección física.",
  },
  {
    keywords: ['plaid', 'link bank', 'bank', 'external'],
    en: "Plaid securely connects your existing bank so we can transfer your opening deposit. Your bank login credentials are encrypted by Plaid and never stored by UFCU.",
    es: "Plaid conecta de forma segura su banco actual para transferir su depósito inicial. Sus credenciales son cifradas por Plaid y nunca almacenadas por UFCU.",
  },
  {
    keywords: ['deposit', 'minimum deposit', 'fund', 'transfer'],
    en: "You can start with as little as $1 for savings or $0 for checking. For this demo, we're showing a $25 opening deposit — but there's no real minimum required.",
    es: "Puede comenzar con tan solo $1 para ahorro o $0 para cuenta corriente. En esta demostración mostramos $25, pero no hay mínimo real requerido.",
  },
  {
    keywords: ['protect', 'insured', 'fdic', 'ncua', 'ncusif'],
    en: "Your funds are federally insured up to $250,000 per account ownership type through the NCUSIF — the credit union equivalent of FDIC. Not a single penny has ever been lost by a member of a federally insured credit union.",
    es: "Sus fondos están asegurados federalmente hasta $250,000 por tipo de titularidad a través del NCUSIF. Ningún centavo se ha perdido jamás en una cooperativa de crédito asegurada federalmente.",
  },
  {
    keywords: ['what is ufcu', 'credit union', 'bank', 'difference'],
    en: "UFCU is a member-owned, not-for-profit credit union. Unlike banks, we have no outside shareholders — every dollar we save goes back into better rates and lower fees for our 436,007 member-owners across Central Texas, Houston and Galveston.",
    es: "UFCU es una cooperativa de crédito sin fines de lucro. A diferencia de los bancos, no tenemos accionistas externos — cada dólar ahorrado se devuelve en mejores tasas y menos cargos para nuestros 436,007 miembros-dueños.",
  },
]

const FALLBACK = {
  en: "That's a great question. A UFCU member advocate can walk you through it in detail. Phone Support Hours: Mon-Fri 8 AM - 5:30 PM, Sat 10 AM - 2 PM. Call (512) 467-8080 or (800) 252-8311.",
  es: "Buena pregunta. Un asesor de UFCU puede explicarle en detalle. Horario telefónico: Lun-Vie 8 AM - 5:30 PM, Sáb 10 AM - 2 PM. Llame al (512) 467-8080 o (800) 252-8311.",
}

// ── Instant keyword-match lookup (for hardcoded chip answers) ──────────
export function askGuide(question, lang = 'en') {
  const q = (question || '').toLowerCase()
  const hit = KNOWLEDGE.find((entry) => entry.keywords.some((k) => q.includes(k)))
  return hit ? hit[lang] : null
}

// ── Async RAG lookup (for custom typed questions) ──────────────────────
export async function askRag(question, screen = '', field = '', lang = 'en', history = []) {
  // Hit the RAG API which uses the real local LLM (Llama 3.2 via Metal)
  try {
    const res = await fetch('/api/ask', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question, screen, focusedField: field, history }),
    })
    if (!res.ok) throw new Error(`Server error: ${res.status}`)
    const data = await res.json()
    return data.answer
  } catch (err) {
    console.warn('[Lumi RAG] Server unavailable or error, falling back:', err.message)
    return FALLBACK[lang]
  }
}

// ── Context-aware suggestions ──────────────────────────────────────────
// Keyed by screen → field → [questions]. null field = default for that screen.
const CONTEXT_SUGGESTIONS = {
  goals: {
    _default: {
      en: ['What checking accounts do you offer?', "What's Plus Checking?", 'Do you have savings accounts?'],
      es: ['¿Qué cuentas corrientes ofrecen?', '¿Qué es Plus Checking?', '¿Tienen cuentas de ahorro?'],
    },
  },
  about: {
    _default: {
      en: ['What info do you need from me?', 'How long does this take?', 'Is my data safe?'],
      es: ['¿Qué información necesitan?', '¿Cuánto tiempo toma?', '¿Están seguros mis datos?'],
    },
    firstName: {
      en: ['What info do you need from me?', 'How long does this take?', 'Is my data safe?'],
      es: ['¿Qué información necesitan?', '¿Cuánto tiempo toma?', '¿Están seguros mis datos?'],
    },
    email: {
      en: ['Will you send me spam?', 'Can I change my email later?', 'Is my data safe?'],
      es: ['¿Me enviarán spam?', '¿Puedo cambiar mi correo?', '¿Están seguros mis datos?'],
    },
    phone: {
      en: ['Why do you need my phone number?', 'Is my number shared?', 'How long does this take?'],
      es: ['¿Por qué necesitan mi número?', '¿Se comparte mi número?', '¿Cuánto tiempo toma?'],
    },
  },
  address: {
    _default: {
      en: ['Why do you need my address?', 'Can I use a P.O. Box?', 'Is my data safe?'],
      es: ['¿Por qué necesitan mi dirección?', '¿Puedo usar un apartado postal?', '¿Están seguros mis datos?'],
    },
    address: {
      en: ['Why do you need my address?', 'Can I use a P.O. Box?', 'Where do you send my card?'],
      es: ['¿Por qué necesitan mi dirección?', '¿Puedo usar un apartado postal?', '¿A dónde envían mi tarjeta?'],
    },
  },
  identity: {
    _default: {
      en: ['What IDs do you accept?', 'What if my ID scan fails?', 'Is my data safe?'],
      es: ['¿Qué identificaciones aceptan?', '¿Qué pasa si falla el escaneo?', '¿Están seguros mis datos?'],
    },
    ssn: {
      en: ['Why do you need my SSN?', 'Will this affect my credit score?', 'Is my SSN safe?'],
      es: ['¿Por qué necesitan mi SSN?', '¿Afectará mi puntaje de crédito?', '¿Está seguro mi SSN?'],
    },
  },
  waiting: {
    _default: {
      en: ['What are you checking?', 'How long does this take?', 'Are my funds insured?'],
      es: ['¿Qué están verificando?', '¿Cuánto tiempo toma?', '¿Están asegurados mis fondos?'],
    },
  },
  secure: {
    _default: {
      en: ['What is a passkey?', 'Do I need a password?', 'Is this secure?'],
      es: ['¿Qué es una passkey?', '¿Necesito contraseña?', '¿Es seguro?'],
    },
  },
  funding: {
    _default: {
      en: ['What is the minimum deposit?', 'How do I link my bank?', 'Is Plaid secure?'],
      es: ['¿Cuál es el depósito mínimo?', '¿Cómo vinculo mi banco?', '¿Es seguro Plaid?'],
    },
  },
  done: {
    _default: {
      en: ['What is UFCU?', 'Are my funds insured?', "What's Plus Checking?"],
      es: ['¿Qué es UFCU?', '¿Están asegurados mis fondos?', '¿Qué es Plus Checking?'],
    },
  },
}

// Get suggested questions based on current screen and focused field.
export function getSuggestions(screen, focusedField, lang = 'en') {
  const screenMap = CONTEXT_SUGGESTIONS[screen] || CONTEXT_SUGGESTIONS.goals
  const fieldMap = (focusedField && screenMap[focusedField]) || screenMap._default
  return fieldMap?.[lang] || CONTEXT_SUGGESTIONS.goals._default[lang]
}

// Backwards-compatible flat export for any remaining consumers.
export const SUGGESTED = {
  en: CONTEXT_SUGGESTIONS.goals._default.en,
  es: CONTEXT_SUGGESTIONS.goals._default.es,
}
