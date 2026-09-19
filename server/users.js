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

const studentCats = {
  "Food & Dining": ["Torchy's Tacos", "P. Terry's", "Kerbey Lane Cafe", "Chick-fil-A", "Chipotle", "Pizza Press"],
  "Entertainment": ["Spotify", "Netflix", "Alamo Drafthouse", "AMC Theaters", "Barton Springs Pool"],
  "Education": ["UT Co-op", "Chegg", "Canvas Sub", "University Bookstore"],
  "Groceries": ["HEB Grocery", "Trader Joe's", "Target", "Oasis Texas Brewing"],
  "Transport": ["CapMetro", "Uber", "Lyft", "Lime Scooter"]
};

const studentTxs = generateTransactions(100, 45, studentCats, 5, 80, ["acc_chk_01"]);

const businessCats = {
  "Business Expenses": ["Apple Store", "AWS Services", "Google Workspace", "WeWork", "Office Depot", "Adobe Creative Cloud"],
  "Food & Dining": ["Uchi Austin", "Franklin Barbecue", "Odd Duck", "Launderette", "Eberly"],
  "Auto & Transport": ["Tesla Supercharger", "Chevron", "Valero", "Delta Airlines", "Enterprise Rent-A-Car"],
  "Shopping": ["Whole Foods", "Nordstrom", "Amazon", "Central Market", "IKEA"],
  "Income": ["Client Payment - Consulting", "Invoice #1042", "Stripe Payout", "Square Inc"]
};

const businessTxs = generateTransactions(200, 80, businessCats, 20, 500, ["acc_chk_02", "acc_bus_01"]);

const personalCats = {
  "Groceries": ["Central Market", "HEB Grocery", "Randalls", "Sprouts"],
  "Utilities": ["Austin Energy", "Texas Gas Service", "Spectrum Internet", "City of Austin Water"],
  "Gas": ["Shell Station", "Exxon", "7-Eleven"],
  "Home": ["Home Depot", "Lowe's", "Target", "Bed Bath & Beyond"],
  "Healthcare": ["CVS Pharmacy", "Walgreens", "Austin Regional Clinic"]
};

const personalTxs = generateTransactions(300, 35, personalCats, 15, 150, ["acc_chk_03"]);

export const users = [
  {
    id: "user_student_01",
    name: "Alex Rivera",
    type: "student",
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
    recentTransactions: studentTxs
  },
  {
    id: "user_multi_02",
    name: "Sarah Chen",
    type: "business",
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
    recentTransactions: businessTxs
  },
  {
    id: "user_simple_03",
    name: "Marcus Johnson",
    type: "personal",
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
      }
    ],
    spendingSummary: summarize(personalTxs),
    recentTransactions: personalTxs
  }
];
