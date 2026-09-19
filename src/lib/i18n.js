// All user-facing copy lives here so the Español toggle is real, not decorative.
// Screen copy follows the blueprint in "UFCU Web Onboarding Screen Flow & UI Copy".

export const COPY = {
  en: {
    brand: 'UFCU',
    tagline: 'From click to community',
    stepOf: (a, b) => `Step ${a} of ${b}`,
    langToggle: 'Español',
    textSize: 'Text size',
    listen: 'Listen',
    stop: 'Stop',
    askPlaceholder: 'Ask Lumi a question…',
    send: 'Ask',
    guide: 'Your UFCU guide',
    back: 'Back',

    // Dashboard — patterned on the live UFCU portal
    routingNumber: 'Routing number',
    copyAria: 'Copy routing number',
    copied: 'Copied',
    sortBy: 'Sort by',
    sortType: 'Account type',
    sortBalance: 'Balance',
    grpChecking: 'Checking accounts',
    grpSavings: 'Savings accounts',
    grpOther: 'Other accounts',
    totalAvailable: 'Total available balance',
    quickTransfer: 'Quick transfer',
    tFrom: 'From',
    tTo: 'To',
    tAmount: 'Amount',
    tSelect: 'Select an account',
    transferNow: 'Transfer now',
    transferDone: 'Transfer complete',
    transferSame: 'Choose two different accounts.',
    transferFunds: 'That is more than the account holds.',
    exitFlow: 'Exit',
    exitFlowAria: 'Leave setup and go back to the home page',
    homeAria: 'UFCU home',

    // Member dashboard
    dashGreeting: (name) => `Welcome, ${name}`,
    dashSub: 'Your accounts are open and ready to use.',
    memberNo: 'Member number',
    totalBalance: 'Available balance',
    hideBalances: 'Hide balances',
    showBalances: 'Show balances',
    virtualCard: 'Your virtual card',
    cardActive: 'Active now',
    revealNumber: 'Show card number',
    hideNumber: 'Hide card number',
    cardHolder: 'Card holder',
    cardExpires: 'Expires',
    accountsHeading: 'Your accounts',
    statusPrequalified: 'Pre-qualified',
    statusWatching: 'Watching rates',
    statusCardActive: 'Active',
    nextSteps: 'Finish setting up',
    nextStepsSub: 'Three quick things. None of them are urgent.',
    stepDeposit: 'Set up direct deposit',
    stepDepositBody: 'Send your employer your routing and account number.',
    stepWallet: 'Add your card to your phone',
    stepWalletBody: 'Pay in stores today, before the plastic arrives.',
    stepCard: 'Confirm your mailing address',
    stepCardBody: 'Your physical card arrives in about five business days.',
    markDone: 'Mark as done',
    stepDone: 'Done',
    dashDemoNote: 'Demo dashboard — all balances and card details are simulated.',

    // Read-aloud (accessibility)
    readAloud: 'Read answers aloud',
    readAloudOn: 'Reading aloud is on',
    playMessage: 'Play this message',
    stopMessage: 'Stop reading',

    // Bundle recommendation (rubric A: product fit + value explanation)
    bundleTitle: 'Your UFCU bundle',
    bundleFor: (seg) => `Tailored for someone ${seg}`,
    bundleNote: 'One application. We open all of it together.',
    memberNote: 'Opening any of these makes you a UFCU member.',
    // Consent (rubric E: compliance, consent, data use)
    consentTitle: 'Before we verify you',
    consentPlain: 'In plain language: we check your ID to confirm you are who you say you are, as federal law requires. We do not sell your data.',
    consentCheck: 'I agree to the Membership Agreement, Privacy Notice and electronic disclosures.',
    consentRead: 'Read the full disclosures',
    consentUses: 'What we do with your information',
    consentUse1: 'Verify your identity (required by the USA PATRIOT Act)',
    consentUse2: 'Run a soft credit check — this does not affect your score',
    consentUse3: 'Open and service the accounts you chose',
    consentNever: 'We never sell your personal information.',

    // 0 — Landing
    eyebrow: 'Member-owned · Austin, Texas',
    heroTitle: 'Banking that answers to you.',
    heroBody:
      "UFCU isn't a bank. There are no outside shareholders — the members are the owners. Every dollar we don't pay out goes back into better rates, lower fees and people who pick up the phone in Austin.",
    purpose:
      'Empowering our Members to achieve financial success and brighter futures.',
    statMembers: 'members',
    statPlace: 'Austin & Central Texas',
    statOwned: 'Member-owned, not-for-profit',
    servicesEyebrow: 'What we do',
    servicesTitle: 'Everything you need, under one roof.',
    svcEveryday: 'Everyday Banking',
    svcEverydayBody: 'Checking and savings with no monthly maintenance fee and no minimum balance.',
    svcConsumer: 'Consumer Lending',
    svcConsumerBody: 'Auto loans, credit cards and lines of credit at member-first rates.',
    svcMortgage: 'Mortgage Lending',
    svcMortgageBody: 'Home loans and first-time buyer guidance from people who know this market.',
    svcBusiness: 'Business Banking',
    svcBusinessBody: 'Accounts, lending and treasury support for Austin businesses.',
    svcInvest: 'Investments',
    svcInvestBody: 'Certificates and long-term savings to grow what you already have.',
    meetLumi: 'Meet Lumi',
    lumiIntro:
      "I'm Lumi, and I'll stay with you the whole way — explaining anything that looks like fine print. Ready when you are.",
    landingCta: 'Open my account',
    landingTime: 'About 3 minutes',
    landingNote: 'No paperwork. No branch visit. No password to invent.',

    // 1 — Goals
    s1Title: "Let's build your brighter future.",
    s1Sub: 'What brings you here today? Pick as many as you like.',
    s1Guide:
      "Welcome to UFCU! I'm Lumi, and I'll guide you through this. Pick more than one goal and we'll set everything up at once.",
    s1Cta: "Let's get started",

    // 2 — About you
    s2Title: 'First things first — what should we call you?',
    s2Guide:
      "Nice to meet you! We'll use your number to send a quick security code later, just to keep things safe.",
    firstName: 'First name',
    lastName: 'Last name',
    email: 'Email address',
    phone: 'Mobile phone number',

    // 3 — Address
    s3Title: 'Where should we send your debit card?',
    s3Guide:
      "Start typing and I'll fill in the rest. We only use this to mail your card and meet federal address rules.",
    address: 'Home address',
    city: 'City',
    state: 'State',
    zip: 'ZIP code',

    // 4 — Identity
    s4Title: "Let's make it official and secure your profile.",
    s4Guide:
      "I know asking for an SSN is a lot. Federal law requires us to verify your identity to prevent fraud. Your data is strictly encrypted and this will not affect your credit score.",
    ssn: 'Social Security Number',
    ssnWhy:
      'Required by federal law to verify your identity. Encrypted, never shared, and it will not affect your credit score.',
    scanId: 'Scan your driver’s license',
    scanning: 'Scanning…',
    scanned: 'License captured',
    scanRetry:
      "We couldn't quite read that. Try better lighting and avoid glare — or upload a photo instead.",
    uploadInstead: 'Upload a photo instead',
    verifyCta: 'Verify my identity',

    // 5 — Waiting room
    s5Title: (name) => `Hang tight, ${name}! We're running our secure checks.`,
    s5Guide:
      'While our system verifies your ID, did you know your new Free Checking account comes with zero monthly maintenance charges?',
    verifying: 'Verifying your identity',
    checkId: 'Reading your license',
    checkIdentity: 'Confirming your identity',
    checkOfac: 'Running required federal checks',
    checkAccount: 'Preparing your accounts',

    // 6 — Approved + passkey
    s6Title: "You're approved. Let's secure your account.",
    s6Guide:
      "No password to invent or forget. We'll create a passkey tied to this device — your face or fingerprint is the key.",
    passkeyCta: 'Secure my account (Passkey)',
    passkeyDone: 'Passkey created',
    magicFallback: 'Email me a magic link instead',

    // 7 — Funding
    s7Title: "Success! Let's get your account funded.",
    s7Guide:
      "You're approved! An unfunded account is like a wallet with no cash. Let's link your current bank and move a few dollars over.",
    linkBank: 'Link external bank securely',
    transferCta: 'Transfer $25.00 now',
    skipFunding: 'I’ll fund it later',

    // 8 — Handoff
    s8Title: "You're all set. Your accounts are ready.",
    s9Guide:
      "This is your dashboard. Your balance is the first thing on it — no hunting. Tap the card to see the number, and finish the setup steps whenever you like.",
    goDashboard: 'Go to my dashboard',
    s8Guide:
      "Welcome to the UFCU family. I've sent a magic link to your phone — tap it to download the app and you're already signed in.",
    accountsCreated: 'Accounts created',
    balance: 'Current balance',
    textApp: 'Text me the UFCU app',
    startOver: 'Run the demo again',
  },

  es: {
    brand: 'UFCU',
    tagline: 'Del clic a la comunidad',
    stepOf: (a, b) => `Paso ${a} de ${b}`,
    langToggle: 'English',
    textSize: 'Tamaño de texto',
    listen: 'Escuchar',
    stop: 'Detener',
    askPlaceholder: 'Pregúntele a Lumi…',
    send: 'Enviar',
    guide: 'Su guía de UFCU',
    back: 'Atrás',

    routingNumber: 'Número de ruta',
    copyAria: 'Copiar número de ruta',
    copied: 'Copiado',
    sortBy: 'Ordenar por',
    sortType: 'Tipo de cuenta',
    sortBalance: 'Saldo',
    grpChecking: 'Cuentas corrientes',
    grpSavings: 'Cuentas de ahorro',
    grpOther: 'Otras cuentas',
    totalAvailable: 'Saldo total disponible',
    quickTransfer: 'Transferencia rápida',
    tFrom: 'De',
    tTo: 'Para',
    tAmount: 'Monto',
    tSelect: 'Seleccione una cuenta',
    transferNow: 'Transferir ahora',
    transferDone: 'Transferencia completa',
    transferSame: 'Elija dos cuentas diferentes.',
    transferFunds: 'Eso es más de lo que tiene la cuenta.',
    exitFlow: 'Salir',
    exitFlowAria: 'Salir de la configuración y volver al inicio',
    homeAria: 'Inicio de UFCU',

    dashGreeting: (name) => `Bienvenido, ${name}`,
    dashSub: 'Sus cuentas están abiertas y listas para usar.',
    memberNo: 'Número de miembro',
    totalBalance: 'Saldo disponible',
    hideBalances: 'Ocultar saldos',
    showBalances: 'Mostrar saldos',
    virtualCard: 'Su tarjeta virtual',
    cardActive: 'Activa ahora',
    revealNumber: 'Mostrar número',
    hideNumber: 'Ocultar número',
    cardHolder: 'Titular',
    cardExpires: 'Vence',
    accountsHeading: 'Sus cuentas',
    statusPrequalified: 'Precalificado',
    statusWatching: 'Monitoreando tasas',
    statusCardActive: 'Activa',
    nextSteps: 'Termine de configurar',
    nextStepsSub: 'Tres cosas rápidas. Ninguna es urgente.',
    stepDeposit: 'Configurar depósito directo',
    stepDepositBody: 'Dé a su empleador su número de ruta y cuenta.',
    stepWallet: 'Agregar la tarjeta a su teléfono',
    stepWalletBody: 'Pague en tiendas hoy, antes de que llegue la física.',
    stepCard: 'Confirmar su dirección de envío',
    stepCardBody: 'Su tarjeta física llega en unos cinco días hábiles.',
    markDone: 'Marcar como hecho',
    stepDone: 'Hecho',
    dashDemoNote: 'Panel de demostración: todos los saldos y datos son simulados.',

    readAloud: 'Leer respuestas en voz alta',
    readAloudOn: 'La lectura en voz alta está activada',
    playMessage: 'Reproducir este mensaje',
    stopMessage: 'Detener la lectura',

    bundleTitle: 'Su paquete UFCU',
    bundleFor: (seg) => `Adaptado para alguien ${seg}`,
    bundleNote: 'Una sola solicitud. Abrimos todo junto.',
    memberNote: 'Abrir cualquiera de estos lo convierte en miembro de UFCU.',
    consentTitle: 'Antes de verificarlo',
    consentPlain: 'En palabras simples: revisamos su identificación para confirmar que usted es quien dice ser, como exige la ley federal. No vendemos sus datos.',
    consentCheck: 'Acepto el Acuerdo de Membresía, el Aviso de Privacidad y las divulgaciones electrónicas.',
    consentRead: 'Leer las divulgaciones completas',
    consentUses: 'Qué hacemos con su información',
    consentUse1: 'Verificar su identidad (exigido por la Ley USA PATRIOT)',
    consentUse2: 'Hacer una verificación de crédito suave, que no afecta su puntaje',
    consentUse3: 'Abrir y administrar las cuentas que eligió',
    consentNever: 'Nunca vendemos su información personal.',

    // 0 — Landing
    eyebrow: 'Propiedad de los miembros · Austin, Texas',
    heroTitle: 'Banca que le responde a usted.',
    heroBody:
      'UFCU no es un banco. No hay accionistas externos: los miembros son los dueños. Cada dólar que no se reparte vuelve en mejores tasas, menos cargos y personas que contestan el teléfono en Austin.',
    purpose:
      'Empoderar a nuestros miembros para lograr éxito financiero y futuros más brillantes.',
    statMembers: 'miembros',
    statPlace: 'Austin y Texas Central',
    statOwned: 'Propiedad de los miembros, sin fines de lucro',
    servicesEyebrow: 'Qué hacemos',
    servicesTitle: 'Todo lo que necesita, en un solo lugar.',
    svcEveryday: 'Banca diaria',
    svcEverydayBody: 'Cuentas corrientes y de ahorro sin cuota mensual ni saldo mínimo.',
    svcConsumer: 'Préstamos personales',
    svcConsumerBody: 'Préstamos de auto, tarjetas de crédito y líneas de crédito.',
    svcMortgage: 'Hipotecas',
    svcMortgageBody: 'Préstamos de vivienda y guía para quienes compran por primera vez.',
    svcBusiness: 'Banca empresarial',
    svcBusinessBody: 'Cuentas, préstamos y apoyo para negocios de Austin.',
    svcInvest: 'Inversiones',
    svcInvestBody: 'Certificados y ahorro a largo plazo para hacer crecer su dinero.',
    meetLumi: 'Conozca a Lumi',
    lumiIntro:
      'Soy Lumi y lo acompañaré todo el camino, explicando cualquier letra pequeña. Cuando usted quiera, empezamos.',
    landingCta: 'Abrir mi cuenta',
    landingTime: 'Unos 3 minutos',
    landingNote: 'Sin papeleo. Sin visitar una sucursal. Sin contraseñas que inventar.',

    s1Title: 'Construyamos su futuro más brillante.',
    s1Sub: '¿Qué le trae hoy? Elija todas las que quiera.',
    s1Guide:
      '¡Bienvenido a UFCU! Soy Lumi y le guiaré. Elija más de una meta y lo configuraremos todo a la vez.',
    s1Cta: 'Comencemos',

    s2Title: 'Primero, ¿cómo lo llamamos?',
    s2Guide:
      '¡Mucho gusto! Usaremos su número para enviarle un código de seguridad más tarde.',
    firstName: 'Nombre',
    lastName: 'Apellido',
    email: 'Correo electrónico',
    phone: 'Teléfono móvil',

    s3Title: '¿A dónde enviamos su tarjeta de débito?',
    s3Guide:
      'Empiece a escribir y yo completo el resto. Solo la usamos para enviar su tarjeta.',
    address: 'Dirección',
    city: 'Ciudad',
    state: 'Estado',
    zip: 'Código postal',

    s4Title: 'Hagámoslo oficial y aseguremos su perfil.',
    s4Guide:
      'Sé que pedir el SSN es mucho. La ley federal exige verificar su identidad para prevenir fraude. Sus datos están cifrados y esto no afectará su crédito.',
    ssn: 'Número de Seguro Social',
    ssnWhy:
      'Requerido por ley federal para verificar su identidad. Cifrado, nunca compartido, y no afectará su crédito.',
    scanId: 'Escanee su licencia de conducir',
    scanning: 'Escaneando…',
    scanned: 'Licencia capturada',
    scanRetry:
      'No pudimos leerla bien. Pruebe con mejor luz y sin reflejos, o suba una foto.',
    uploadInstead: 'Subir una foto',
    verifyCta: 'Verificar mi identidad',

    s5Title: (name) => `¡Un momento, ${name}! Estamos haciendo las verificaciones.`,
    s5Guide:
      'Mientras verificamos su identificación, ¿sabía que su cuenta corriente gratuita no tiene cargos mensuales?',
    verifying: 'Verificando su identidad',
    checkId: 'Leyendo su licencia',
    checkIdentity: 'Confirmando su identidad',
    checkOfac: 'Ejecutando verificaciones federales',
    checkAccount: 'Preparando sus cuentas',

    s6Title: 'Está aprobado. Aseguremos su cuenta.',
    s6Guide:
      'Sin contraseñas que inventar u olvidar. Crearemos una clave de acceso en este dispositivo.',
    passkeyCta: 'Asegurar mi cuenta (Passkey)',
    passkeyDone: 'Clave de acceso creada',
    magicFallback: 'Envíenme un enlace mágico',

    s7Title: '¡Éxito! Agreguemos fondos a su cuenta.',
    s7Guide:
      '¡Está aprobado! Una cuenta sin fondos es como una cartera vacía. Vinculemos su banco actual.',
    linkBank: 'Vincular banco externo',
    transferCta: 'Transferir $25.00 ahora',
    skipFunding: 'Lo haré más tarde',

    s8Title: 'Todo listo. Sus cuentas están abiertas.',
    s9Guide:
      'Este es su panel. Su saldo es lo primero que ve. Toque la tarjeta para ver el número y complete los pasos cuando quiera.',
    goDashboard: 'Ir a mi panel',
    s8Guide:
      'Bienvenido a la familia UFCU. Le envié un enlace mágico a su teléfono para descargar la app ya conectado.',
    accountsCreated: 'Cuentas creadas',
    balance: 'Saldo actual',
    textApp: 'Envíenme la app de UFCU',
    startOver: 'Repetir la demostración',
  },
}

export const t = (lang, key, ...args) => {
  const value = COPY[lang]?.[key] ?? COPY.en[key] ?? key
  return typeof value === 'function' ? value(...args) : value
}
