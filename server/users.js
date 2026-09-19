const seedRandom = (seed) => {
  let x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
};

function generateTransactions(seed, count, categories, minAmt, maxAmt, accountIds) {
  const txs = [];
  let s = seed;
  const now = new Date("2026-09-19T12:00:00Z");
  
  for (let i = 0; i < count; i++) {
    // random date in past 30 days
    const daysAgo = Math.floor(seedRandom(s++) * 30);
    const d = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);
    const dateStr = d.toISOString().split('T')[0];
    
    const catKeys = Object.keys(categories);
    const cat = catKeys[Math.floor(seedRandom(s++) * catKeys.length)];
    const merchants = categories[cat];
    const desc = merchants[Math.floor(seedRandom(s++) * merchants.length)];
    
    // amount between minAmt and maxAmt
    const amt = (seedRandom(s++) * (maxAmt - minAmt) + minAmt).toFixed(2);
    const amount = cat === 'Income' ? parseFloat(amt) : -parseFloat(amt);
    
    const accountId = accountIds[Math.floor(seedRandom(s++) * accountIds.length)];
    
    txs.push({
      id: `tx_${s}_${i}`,
      date: dateStr,
      description: desc,
      amount: amount,
      category: cat,
      accountId: accountId
    });
  }
  
  return txs.sort((a, b) => new Date(b.date) - new Date(a.date));
}

function summarize(txs) {
  const summary = {};
  for (const t of txs) {
    if (t.amount < 0) {
      summary[t.category] = (summary[t.category] || 0) + Math.abs(t.amount);
    }
  }
  // round to 2 decimals
  for (const k in summary) {
    summary[k] = parseFloat(summary[k].toFixed(2));
  }
  return summary;
}

function enrichTransactions(txs) {
  return txs.map((tx, index) => ({
    ...tx,
    status: index % 11 === 0 ? "pending" : "posted",
    type: tx.category === "Income" ? "credit" : tx.category === "Transfer" ? "transfer" : "debit",
    recurring: /AWS|Google Workspace|Adobe|Spotify|Netflix|Energy|Water/i.test(tx.description),
    postedAt: index % 11 === 0 ? null : `${tx.date}T09:00:00Z`
  }));
}

const studentCats = {
  "Food & Dining": ["Torchy's Tacos", "P. Terry's", "Kerbey Lane Cafe", "Chick-fil-A", "Chipotle", "Pizza Press"],
  "Entertainment": ["Spotify", "Netflix", "Alamo Drafthouse", "AMC Theaters", "Barton Springs Pool"],
  "Education": ["UT Co-op", "Chegg", "Canvas Sub", "University Bookstore"],
  "Groceries": ["HEB Grocery", "Trader Joe's", "Target", "Oasis Texas Brewing"],
  "Transport": ["CapMetro", "Uber", "Lyft", "Lime Scooter"]
};

const studentTxs = enrichTransactions(generateTransactions(100, 45, studentCats, 5, 80, ["acc_chk_01"]));

const businessCats = {
  "Business Expenses": ["Apple Store", "AWS Services", "Google Workspace", "WeWork", "Office Depot", "Adobe Creative Cloud"],
  "Food & Dining": ["Uchi Austin", "Franklin Barbecue", "Odd Duck", "Launderette", "Eberly"],
  "Auto & Transport": ["Tesla Supercharger", "Chevron", "Valero", "Delta Airlines", "Enterprise Rent-A-Car"],
  "Shopping": ["Whole Foods", "Nordstrom", "Amazon", "Central Market", "IKEA"],
  "Income": ["Client Payment - Consulting", "Invoice #1042", "Stripe Payout", "Square Inc"]
};

const businessTxs = enrichTransactions(generateTransactions(200, 80, businessCats, 20, 500, ["acc_chk_02", "acc_bus_01"]));

const personalCats = {
  "Groceries": ["Central Market", "HEB Grocery", "Randalls", "Sprouts"],
  "Utilities": ["Austin Energy", "Texas Gas Service", "Spectrum Internet", "City of Austin Water"],
  "Gas": ["Shell Station", "Exxon", "7-Eleven"],
  "Home": ["Home Depot", "Lowe's", "Target", "Bed Bath & Beyond"],
  "Healthcare": ["CVS Pharmacy", "Walgreens", "Austin Regional Clinic"]
};

const personalTxs = enrichTransactions(generateTransactions(300, 35, personalCats, 15, 150, ["acc_chk_03"]));

const demoTransfers = [
  { id: "tr_001", date: "2026-09-11", fromAccountId: "acc_chk_01", toAccountId: "acc_sav_01", amount: 650.00, status: "completed", note: "Rent reserve" },
  { id: "tr_002", date: "2026-09-09", fromAccountId: "acc_bus_01", toAccountId: "acc_sav_02", amount: 1000.00, status: "completed", note: "Tax reserve" },
  { id: "tr_003", date: "2026-09-06", fromAccountId: "acc_chk_03", toAccountId: "acc_sav_03", amount: 250.00, status: "completed", note: "Emergency fund" }
];

const recurringPayments = [
  { id: "rec_phone", merchant: "Mobile plan", amount: 65.00, cadence: "monthly", nextDate: "2026-10-01", status: "active" },
  { id: "rec_stream", merchant: "Streaming", amount: 15.49, cadence: "monthly", nextDate: "2026-09-24", status: "active" },
  { id: "rec_cloud", merchant: "Cloud storage", amount: 2.99, cadence: "monthly", nextDate: "2026-09-27", status: "active" }
];

const MONTHLY_SUMMARY = {
  student: [
    { month: "Jul", income: 1450, spending: 1120 },
    { month: "Aug", income: 850, spending: 980 },
    { month: "Sep", income: 850, spending: 827 }
  ],
  business: [
    { month: "Jul", income: 8420, spending: 3910 },
    { month: "Aug", income: 9100, spending: 4280 },
    { month: "Sep", income: 9105, spending: 2571 }
  ],
  personal: [
    { month: "Jul", income: 2650, spending: 1240 },
    { month: "Aug", income: 2650, spending: 1080 },
    { month: "Sep", income: 2650, spending: 602 }
  ]
};

export const users = [
  {
    id: "user_student_01",
    name: "Alex Rivera",
    type: "student",
    demoLogin: { email: "alex.student@demo.ufcu.org", password: "demo123" },
    profile: {
      email: "alex.rivera@example.com",
      phone: "(512) 555-0198",
      address: "2001 Speedway, Austin, TX 78712",
      university: "ut"
    },
    accounts: [
      {
        id: "acc_chk_01",
        type: "checking",
        name: "Free Checking",
        balance: 450.25,
        currency: "USD",
        accountNumber: "****1234",
        routingNumber: "**********"
      },
      {
        id: "acc_sav_01",
        type: "savings",
        name: "Student Savings",
        balance: 1200.00,
        currency: "USD",
        accountNumber: "****5678",
        routingNumber: "**********"
      }
    ],
    spendingSummary: summarize(studentTxs),
    recentTransactions: studentTxs,
    pendingTransactions: studentTxs.filter((tx) => tx.status === "pending"),
    transfers: demoTransfers.filter((transfer) => ["acc_chk_01", "acc_sav_01"].includes(transfer.fromAccountId)),
    recurringPayments,
    cards: [{ id: "card_student", name: "Starter Credit Card", last4: "1842", limit: 1500, balance: 312.45, available: 1187.55, dueDate: "2026-10-04", minimumDue: 35.00, status: "active" }],
    loans: [],
    monthlySummary: MONTHLY_SUMMARY.student
  },
  {
    id: "user_multi_02",
    name: "Sarah Chen",
    type: "business",
    demoLogin: { email: "sarah.business@demo.ufcu.org", password: "demo123" },
    profile: {
      email: "sarah.chen@example.com",
      phone: "(512) 555-8842",
      address: "1101 Red River St, Austin, TX 78701"
    },
    accounts: [
      {
        id: "acc_chk_02",
        type: "checking",
        name: "Plus Checking",
        balance: 4520.50,
        currency: "USD",
        accountNumber: "****8821"
      },
      {
        id: "acc_sav_02",
        type: "savings",
        name: "High-Yield Savings",
        balance: 18500.00,
        currency: "USD",
        accountNumber: "****9923"
      },
      {
        id: "acc_bus_01",
        type: "business",
        name: "Business Checking",
        balance: 34500.75,
        currency: "USD",
        accountNumber: "****4455"
      },
      {
        id: "acc_loan_01",
        type: "loan",
        name: "Auto Loan",
        balance: -15420.00,
        currency: "USD",
        accountNumber: "****7733"
      }
    ],
    spendingSummary: summarize(businessTxs),
    recentTransactions: businessTxs,
    pendingTransactions: businessTxs.filter((tx) => tx.status === "pending"),
    transfers: demoTransfers.filter((transfer) => ["acc_chk_02", "acc_bus_01"].includes(transfer.fromAccountId)),
    recurringPayments,
    cards: [{ id: "card_business", name: "Business Rewards Card", last4: "9031", limit: 10000, balance: 1240.62, available: 8759.38, dueDate: "2026-10-12", minimumDue: 75.00, status: "active" }],
    loans: [{ id: "loan_auto", name: "Auto Loan", principal: 18240.00, payment: 412.18, apr: 5.24, nextDue: "2026-10-01", status: "current" }],
    monthlySummary: MONTHLY_SUMMARY.business
  },
  {
    id: "user_simple_03",
    name: "Marcus Johnson",
    type: "personal",
    demoLogin: { email: "marcus.personal@demo.ufcu.org", password: "demo123" },
    profile: {
      email: "marcus.j@example.com",
      phone: "(512) 555-3311",
      address: "4700 Lamar Blvd, Austin, TX 78751"
    },
    accounts: [
      {
        id: "acc_chk_03",
        type: "checking",
        name: "Free Checking",
        balance: 850.12,
        currency: "USD",
        accountNumber: "****3312"
      },
      {
        id: "acc_sav_03",
        type: "savings",
        name: "Emergency Savings",
        balance: 3200.00,
        currency: "USD",
        accountNumber: "****7710"
      }
    ],
    spendingSummary: summarize(personalTxs),
    recentTransactions: personalTxs,
    pendingTransactions: personalTxs.filter((tx) => tx.status === "pending"),
    transfers: demoTransfers.filter((transfer) => transfer.fromAccountId === "acc_chk_03"),
    recurringPayments,
    cards: [],
    loans: [{ id: "loan_home", name: "Mortgage rate watch", principal: 0, payment: 0, apr: null, nextDue: null, status: "prequalified" }],
    monthlySummary: MONTHLY_SUMMARY.personal
  }
];
