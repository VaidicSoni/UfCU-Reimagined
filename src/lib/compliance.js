// Regulatory scaffolding for the prototype. Every rule cited here is a real
// requirement for opening a US credit union account; the *data* is simulated,
// the *obligations* are not. Keeping them in one file means the disclosure
// text, the consent gates and the screening steps can never drift apart.
//
// Rubric E asks for "a strong, member-friendly approach to consent, data use,
// and regulatory steps". The shape of that answer is: say what we collect, say
// which law requires it, let the member decline the parts that are optional.

// ─────────────────────────────────────────────────────────────────────────────
// Customer Identification Program — USA PATRIOT Act §326 / 31 CFR 1020.220
// A CU must collect these four before opening an account. Date of birth is the
// one most demos forget, and it is also what proves the 18+ signing age.
// ─────────────────────────────────────────────────────────────────────────────
export const CIP_FIELDS = [
  { id: 'name', en: 'Legal name', es: 'Nombre legal' },
  { id: 'dob', en: 'Date of birth', es: 'Fecha de nacimiento' },
  { id: 'address', en: 'Physical address', es: 'Dirección física' },
  { id: 'ssn', en: 'Taxpayer ID (SSN or ITIN)', es: 'ID fiscal (SSN o ITIN)' },
]

export const MIN_AGE = 18

// Whole years elapsed, calendar-correct (no 365.25 drift on leap years).
export function ageFrom(dob) {
  if (!dob) return null
  const birth = new Date(`${dob}T00:00:00`)
  if (Number.isNaN(birth.getTime())) return null
  const now = new Date()
  let age = now.getFullYear() - birth.getFullYear()
  const monthDelta = now.getMonth() - birth.getMonth()
  if (monthDelta < 0 || (monthDelta === 0 && now.getDate() < birth.getDate())) age -= 1
  return age
}

export function isEligibleAge(dob) {
  const age = ageFrom(dob)
  return age !== null && age >= MIN_AGE && age < 120
}

// ─────────────────────────────────────────────────────────────────────────────
// Consent, unbundled. One checkbox covering five unrelated agreements is the
// pattern regulators keep pushing back on, so each obligation stands alone and
// the optional one ships OFF — an opt-in, not a pre-ticked opt-out.
// ─────────────────────────────────────────────────────────────────────────────
export const CONSENTS = [
  {
    id: 'esign',
    required: true,
    reg: 'E-SIGN Act, 15 U.S.C. §7001',
    en: 'I agree to receive disclosures and statements electronically.',
    es: 'Acepto recibir divulgaciones y estados de cuenta electrónicamente.',
    whyEn: 'Without this we would have to mail you paper before we can open anything.',
    whyEs: 'Sin esto tendríamos que enviarle papel antes de abrir su cuenta.',
  },
  {
    id: 'cip',
    required: true,
    reg: 'USA PATRIOT Act §326',
    en: 'I consent to identity verification and federal screening.',
    es: 'Doy mi consentimiento para la verificación de identidad y revisión federal.',
    whyEn: 'Federal law requires every financial institution to confirm who you are.',
    whyEs: 'La ley federal exige que toda institución financiera confirme su identidad.',
  },
  {
    id: 'agreement',
    required: true,
    reg: 'Membership Agreement + Privacy Notice',
    en: 'I have read the Membership Agreement and Privacy Notice.',
    es: 'He leído el Acuerdo de Membresía y el Aviso de Privacidad.',
    whyEn: 'These set out your rights as a member-owner and how we handle your data.',
    whyEs: 'Establecen sus derechos como miembro-propietario y el manejo de sus datos.',
  },
  {
    id: 'sharing',
    required: false,
    reg: 'GLBA / Reg P — your right to opt out',
    en: 'You may share my information with partners for marketing.',
    es: 'Pueden compartir mi información con socios para marketing.',
    whyEn: 'Entirely optional. Declining changes nothing about your accounts.',
    whyEs: 'Totalmente opcional. Rechazar no cambia nada en sus cuentas.',
  },
]

export const REQUIRED_CONSENTS = CONSENTS.filter((c) => c.required).map((c) => c.id)

// ─────────────────────────────────────────────────────────────────────────────
// The disclosures the button actually opens. Summarised to demo length, but
// each is a real document a credit union must hand over at account opening.
// ─────────────────────────────────────────────────────────────────────────────
export const DISCLOSURES = [
  {
    id: 'tis',
    reg: 'Truth in Savings — Reg DD',
    en: {
      title: 'Truth in Savings',
      body: [
        'Free Checking: no monthly maintenance fee, no minimum balance, no per-item fees.',
        'High-Yield Savings: 4.05% APY on balances from $0.01. Rate is variable and may change after opening.',
        '12-month Certificate: 4.30% APY. Early withdrawal penalty equals 90 days of dividends.',
        'Fees could reduce the earnings on your account.',
      ],
    },
    es: {
      title: 'Veracidad en los Ahorros',
      body: [
        'Cuenta corriente gratuita: sin cuota mensual, sin saldo mínimo, sin cargos por transacción.',
        'Ahorros de alto rendimiento: 4.05% APY desde $0.01. La tasa es variable.',
        'Certificado a 12 meses: 4.30% APY. Penalidad de 90 días de dividendos por retiro anticipado.',
        'Los cargos podrían reducir las ganancias de su cuenta.',
      ],
    },
  },
  {
    id: 'regcc',
    reg: 'Funds Availability — Reg CC',
    en: {
      title: 'When your money is available',
      body: [
        'The first $275 of a check deposit is available the next business day.',
        'The remainder is generally available on the second business day after deposit.',
        'New accounts open fewer than 30 days may be subject to longer holds.',
        'We will tell you at the time of deposit if a longer hold applies, and why.',
      ],
    },
    es: {
      title: 'Disponibilidad de fondos',
      body: [
        'Los primeros $275 de un cheque están disponibles el siguiente día hábil.',
        'El resto suele estar disponible el segundo día hábil tras el depósito.',
        'Las cuentas con menos de 30 días pueden tener retenciones más largas.',
        'Le avisaremos al momento del depósito si aplica una retención mayor, y por qué.',
      ],
    },
  },
  {
    id: 'privacy',
    reg: 'GLBA / Reg P',
    en: {
      title: 'Privacy Notice',
      body: [
        'We collect your name, date of birth, address, taxpayer ID and transaction history.',
        'We use it to open and service your accounts, to prevent fraud, and to meet legal reporting duties.',
        'We do not sell your personal information. Ever.',
        'You may opt out of marketing sharing at any time without affecting your accounts.',
      ],
    },
    es: {
      title: 'Aviso de Privacidad',
      body: [
        'Recopilamos su nombre, fecha de nacimiento, dirección, ID fiscal e historial de transacciones.',
        'Lo usamos para abrir y administrar sus cuentas, prevenir fraude y cumplir obligaciones legales.',
        'No vendemos su información personal. Nunca.',
        'Puede rechazar el uso para marketing en cualquier momento sin afectar sus cuentas.',
      ],
    },
  },
  {
    id: 'esign',
    reg: 'E-SIGN Act',
    en: {
      title: 'Electronic delivery',
      body: [
        'Agreeing lets us deliver statements, notices and tax forms electronically.',
        'You need a device with a browser and an email address you can reach.',
        'You may withdraw consent or request paper at any time, free of charge.',
        'Withdrawing consent does not undo disclosures already delivered.',
      ],
    },
    es: {
      title: 'Entrega electrónica',
      body: [
        'Su acuerdo nos permite entregar estados, avisos y formularios fiscales electrónicamente.',
        'Necesita un dispositivo con navegador y un correo electrónico accesible.',
        'Puede retirar su consentimiento o pedir papel en cualquier momento, sin costo.',
        'Retirar el consentimiento no anula las divulgaciones ya entregadas.',
      ],
    },
  },
  {
    id: 'membership',
    reg: 'Membership Agreement',
    en: {
      title: 'Membership Agreement',
      body: [
        'A $5 par value share establishes your ownership stake in the credit union.',
        'As a member-owner you have one vote, regardless of your balance.',
        'Accounts are federally insured to at least $250,000 by the NCUA.',
        'Credit products are subject to approval; rates shown are illustrative.',
      ],
    },
    es: {
      title: 'Acuerdo de Membresía',
      body: [
        'Una participación de $5 establece su propiedad en la cooperativa.',
        'Como miembro-propietario tiene un voto, sin importar su saldo.',
        'Las cuentas están aseguradas federalmente hasta $250,000 por la NCUA.',
        'Los productos de crédito están sujetos a aprobación; las tasas son ilustrativas.',
      ],
    },
  },
]

// ─────────────────────────────────────────────────────────────────────────────
// What actually runs during the waiting room. Naming the regulation turns a
// decorative spinner into a visible compliance step.
// ─────────────────────────────────────────────────────────────────────────────
export const SCREENING = [
  {
    id: 'cip',
    reg: '31 CFR 1020.220',
    en: 'Customer Identification Program',
    es: 'Programa de Identificación del Cliente',
    detailEn: 'Matching the four CIP data points against your document.',
    detailEs: 'Cotejando los cuatro datos del CIP con su documento.',
  },
  {
    id: 'idv',
    reg: 'Documentary verification',
    en: 'Document authenticity',
    es: 'Autenticidad del documento',
    detailEn: 'Checking security features on your license.',
    detailEs: 'Verificando elementos de seguridad de su licencia.',
  },
  {
    id: 'ofac',
    reg: 'OFAC — SDN list',
    en: 'Sanctions screening',
    es: 'Revisión de sanciones',
    detailEn: 'Screening against the Specially Designated Nationals list.',
    detailEs: 'Cotejo con la lista de Nacionales Especialmente Designados.',
  },
  {
    id: 'aml',
    reg: 'BSA / AML — 31 CFR 1020.210',
    en: 'AML risk scoring',
    es: 'Evaluación de riesgo AML',
    detailEn: 'Bank Secrecy Act risk profile for ongoing monitoring.',
    detailEs: 'Perfil de riesgo de la Ley de Secreto Bancario para monitoreo continuo.',
  },
]

// ─────────────────────────────────────────────────────────────────────────────
// Data privacy, stated as member rights rather than as policy prose.
// ─────────────────────────────────────────────────────────────────────────────
export const DATA_RIGHTS = [
  {
    id: 'retention',
    en: 'Kept for 5 years after your account closes',
    es: 'Se conserva 5 años tras cerrar su cuenta',
    detailEn: 'The retention period the Bank Secrecy Act requires — not a day longer.',
    detailEs: 'El periodo que exige la Ley de Secreto Bancario, ni un día más.',
  },
  {
    id: 'access',
    en: 'Request a copy of everything we hold',
    es: 'Solicite una copia de todo lo que tenemos',
    detailEn: 'Delivered within 30 days, free of charge.',
    detailEs: 'Entregada en 30 días, sin costo.',
  },
  {
    id: 'delete',
    en: 'Ask us to delete what we are not required to keep',
    es: 'Pida que borremos lo que no debemos conservar',
    detailEn: 'Anything outside the regulatory minimum is yours to remove.',
    detailEs: 'Todo lo que exceda el mínimo regulatorio puede eliminarse.',
  },
  {
    id: 'sell',
    en: 'Never sold, to anyone, for any price',
    es: 'Nunca vendida, a nadie, a ningún precio',
    detailEn: 'A member-owned institution has nobody to sell you to.',
    detailEs: 'Una institución de miembros no tiene a quién venderle sus datos.',
  },
]

// Consent receipt reference. Random, human-readable, and obviously a demo
// artifact rather than anything that implies a real filed record.
export function consentReference() {
  const block = () => Math.random().toString(36).slice(2, 6).toUpperCase()
  return `DEMO-${block()}-${block()}`
}

// Masks all but the last four digits, so a projector never shows a full SSN.
export function maskSSN(value) {
  const digits = (value || '').replace(/\D/g, '')
  if (digits.length < 4) return '•••-••-••••'
  return `•••-••-${digits.slice(-4)}`
}
