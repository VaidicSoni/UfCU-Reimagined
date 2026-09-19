// "Mock RAG" — hardcoded keyword matching, per Implementation Option A.
// Deliberately offline: a live LLM call would put the demo at the mercy of
// venue Wi-Fi, and the prompt requires the app to run locally on a laptop.

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
    keywords: ['id', 'license', 'passport', 'document', 'photo'],
    en: "A driver's license works, and so does a passport or state ID. International students can use a foreign passport with an ITIN.",
    es: "Puede usar licencia de conducir, pasaporte o identificación estatal. Estudiantes internacionales pueden usar pasaporte extranjero con ITIN.",
  },
  {
    keywords: ['password', 'passkey', 'login', 'log in'],
    en: "No password needed. We use a passkey tied to your device — your face or fingerprint unlocks it.",
    es: "No necesita contraseña. Usamos una clave de acceso vinculada a su dispositivo.",
  },
  {
    keywords: ['member', 'membership', 'join', 'eligible'],
    en: "You become a UFCU member the moment you open a deposit account, a loan, or a mortgage with us.",
    es: "Usted se convierte en miembro de UFCU al abrir una cuenta de depósito, un préstamo o una hipoteca.",
  },
]

const FALLBACK = {
  en: "That's a great question. A UFCU member advocate can walk you through it in detail — for now, let's keep you moving.",
  es: "Buena pregunta. Un asesor de UFCU puede explicarle en detalle. Por ahora, sigamos adelante.",
}

export function askGuide(question, lang = 'en') {
  const q = (question || '').toLowerCase()
  const hit = KNOWLEDGE.find((entry) => entry.keywords.some((k) => q.includes(k)))
  return hit ? hit[lang] : FALLBACK[lang]
}

export const SUGGESTED = {
  en: ['Why do you need my SSN?', 'Is my data safe?', 'How long does this take?'],
  es: ['¿Por qué necesitan mi SSN?', '¿Están seguros mis datos?', '¿Cuánto tiempo toma?'],
}
