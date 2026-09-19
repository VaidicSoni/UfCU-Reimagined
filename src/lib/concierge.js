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
    keywords: ['credit union', 'different from a bank', 'vs a bank', 'not a bank'],
    en: "A credit union is owned by its members, not outside shareholders. Profits come back to you as better rates and lower fees.",
    es: "Una cooperativa de crédito es propiedad de sus miembros, no de accionistas. Las ganancias vuelven a usted en mejores tasas y menos cargos.",
  },
  {
    keywords: ['join', 'eligible', 'qualify', 'membership', 'member'],
    en: "If you live, work or study in Central Texas — or you're related to a member — you can join. Opening a deposit account, loan or mortgage makes it official.",
    es: "Si vive, trabaja o estudia en Texas Central, o es familiar de un miembro, puede unirse. Abrir una cuenta, préstamo o hipoteca lo hace oficial.",
  },
  {
    keywords: ['safe', 'secure', 'security', 'encrypt', 'privacy', 'data'],
    en: "Everything you enter is protected with bank-level encryption. We only ask for what the law requires — nothing more, and we never sell it.",
    es: "Todo lo que ingresa está protegido con cifrado de nivel bancario. Solo pedimos lo que la ley exige y nunca lo vendemos.",
  },
  {
    keywords: ['insured', 'ncua', 'fdic', 'protected'],
    en: "Your deposits are federally insured by the NCUA up to $250,000 — the credit union equivalent of FDIC cover.",
    es: "Sus depósitos están asegurados federalmente por la NCUA hasta $250,000.",
  },
  {
    keywords: ['credit score', 'score', 'hurt', 'affect my credit'],
    en: "Opening your account uses a soft check only, so your credit score is untouched.",
    es: "Abrir su cuenta solo usa una verificación suave, así que su puntaje de crédito no se ve afectado.",
  },
  {
    keywords: ['fee', 'fees', 'cost', 'charge', 'minimum', 'free'],
    en: "UFCU Free Checking has no monthly maintenance fee and no minimum balance requirement.",
    es: "La cuenta corriente gratuita de UFCU no tiene cuota mensual ni saldo mínimo.",
  },
  {
    keywords: ['long', 'time', 'minutes', 'how long', 'quick', 'take'],
    en: "Most members finish in under three minutes. I'll stay with you the whole way.",
    es: "La mayoría de los miembros terminan en menos de tres minutos. Estaré con usted todo el camino.",
  },
  {
    keywords: ['phone', 'number', 'text', 'mobile'],
    en: "We use your mobile number to send a one-time security code, and later the link that signs you into the app.",
    es: "Usamos su número móvil para enviar un código de seguridad y luego el enlace para entrar a la app.",
  },
  {
    keywords: ['name', 'nickname', 'legal name', 'call me'],
    en: "We need your legal name to match your ID, but you can set a preferred name once you're in.",
    es: "Necesitamos su nombre legal para que coincida con su identificación, pero puede elegir un nombre preferido después.",
  },
  {
    keywords: ['address', 'moved', 'live', 'mail'],
    en: "Your address is used to mail your debit card and to meet federal address-verification rules. You can update it any time.",
    es: "Su dirección se usa para enviar su tarjeta y cumplir las reglas federales. Puede actualizarla cuando quiera.",
  },
  {
    keywords: ['id', 'license', 'passport', 'document', 'photo', 'scan', "won't scan", 'blurry'],
    en: "A driver's licence works, and so does a passport or state ID. If a scan fails, try better lighting and avoid glare — or upload a photo instead.",
    es: "Puede usar licencia, pasaporte o identificación estatal. Si falla el escaneo, pruebe con mejor luz o suba una foto.",
  },
  {
    keywords: ['checking', 'verifying', 'background', 'what are you'],
    en: "We're reading your ID, confirming your identity and running the federal checks every financial institution has to run. It takes seconds.",
    es: "Estamos leyendo su identificación, confirmando su identidad y haciendo las verificaciones federales obligatorias.",
  },
  {
    keywords: ['password', 'passkey', 'login', 'log in', 'sign in'],
    en: "No password needed. A passkey is tied to this device, so your face or fingerprint unlocks your account — nothing to remember or leak.",
    es: "No necesita contraseña. Una clave de acceso se vincula a este dispositivo: su rostro o huella la desbloquea.",
  },
  {
    keywords: ['lose', 'lost', 'new phone', 'device', 'broken'],
    en: "If you lose the device, we'll email you a one-time magic link so you can set up a passkey on the new one.",
    es: "Si pierde el dispositivo, le enviaremos un enlace mágico para crear una clave de acceso en el nuevo.",
  },
  {
    keywords: ['fund', 'money', 'deposit', 'transfer', 'add money', 'link my bank', 'plaid'],
    en: "A small opening deposit activates the account and your virtual card. Linking your other bank is read-only and you can fund it later instead.",
    es: "Un depósito inicial activa la cuenta y su tarjeta virtual. Vincular su otro banco es solo de lectura y puede hacerlo después.",
  },
  {
    keywords: ['card arrive', 'physical card', 'debit card', 'when will', 'mail my card'],
    en: "Your virtual card works right away. The physical card is posted to your address and usually lands within five business days.",
    es: "Su tarjeta virtual funciona de inmediato. La tarjeta física llega por correo en unos cinco días hábiles.",
  },
  {
    keywords: ['direct deposit', 'payroll', 'paycheck', 'salary'],
    en: "Direct deposit takes one form: give your employer the routing and account number on your dashboard, and your pay lands here.",
    es: "Para el depósito directo, dé a su empleador el número de ruta y cuenta de su panel.",
  },
  {
    keywords: ['card number', 'see my card', 'reveal', 'wallet', 'apple pay'],
    en: "Tap your card on the dashboard to reveal the full number, or add it straight to your phone's wallet to pay today.",
    es: "Toque su tarjeta en el panel para ver el número completo, o agréguela a la billetera de su teléfono.",
  },
  {
    keywords: ['magic link', 'app', 'download'],
    en: "The magic link is a one-time sign-in. Tap it on your phone and the app opens already signed in — no password, no re-typing.",
    es: "El enlace mágico es un inicio de sesión único. Tóquelo en su teléfono y la app se abre ya conectada.",
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

// Suggested questions follow the step, so the three on offer are always the
// three actually worth asking here.
const BY_STEP = {
  welcome: {
    en: ['What is a credit union?', 'Can I join UFCU?', 'How long does this take?'],
    es: ['¿Qué es una cooperativa de crédito?', '¿Puedo unirme a UFCU?', '¿Cuánto tiempo toma?'],
  },
  goals: {
    en: ['Can I pick more than one?', 'Are there any fees?', 'Can I join UFCU?'],
    es: ['¿Puedo elegir más de una?', '¿Hay cargos?', '¿Puedo unirme a UFCU?'],
  },
  about: {
    en: ['Why do you need my phone number?', 'Do I have to use my legal name?', 'Is my data safe?'],
    es: ['¿Por qué necesitan mi teléfono?', '¿Debo usar mi nombre legal?', '¿Están seguros mis datos?'],
  },
  address: {
    en: ['Why do you need my address?', 'What do you mail me?', 'I just moved — what do I use?'],
    es: ['¿Por qué necesitan mi dirección?', '¿Qué me envían?', 'Acabo de mudarme, ¿qué uso?'],
  },
  identity: {
    en: ['Why do you need my SSN?', "What if my ID won't scan?", 'Will this affect my credit?'],
    es: ['¿Por qué necesitan mi SSN?', '¿Y si no escanea mi identificación?', '¿Afecta mi crédito?'],
  },
  waiting: {
    en: ['What are you checking?', 'How long does this take?', 'Is my data safe?'],
    es: ['¿Qué están verificando?', '¿Cuánto tiempo toma?', '¿Están seguros mis datos?'],
  },
  secure: {
    en: ['What is a passkey?', 'What if I lose my phone?', 'Can I use a password instead?'],
    es: ['¿Qué es una clave de acceso?', '¿Y si pierdo mi teléfono?', '¿Puedo usar contraseña?'],
  },
  funding: {
    en: ['Why do I need to add money?', 'Is linking my bank safe?', 'Can I fund it later?'],
    es: ['¿Por qué agregar dinero?', '¿Es seguro vincular mi banco?', '¿Puedo hacerlo después?'],
  },
  done: {
    en: ['When will my card arrive?', 'What is a magic link?', 'How do I sign in again?'],
    es: ['¿Cuándo llega mi tarjeta?', '¿Qué es un enlace mágico?', '¿Cómo inicio sesión?'],
  },
  dashboard: {
    en: ['How do I set up direct deposit?', 'Where is my card number?', 'When will my card arrive?'],
    es: ['¿Cómo configuro el depósito directo?', '¿Dónde está el número de mi tarjeta?', '¿Cuándo llega mi tarjeta?'],
  },
}

export function suggestionsFor(step, lang = 'en') {
  return (BY_STEP[step] || BY_STEP.goals)[lang]
}
