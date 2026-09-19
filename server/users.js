export const users = [
  {
    id: "user_student_01",
    name: "Alex Rivera",
    type: "student",
    profile: {
      email: "alex.rivera@example.com",
      phone: "(512) 555-0198",
      address: "2001 Speedway, Austin, TX 78712"
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
    spendingSummary: {
      "Food & Dining": 150.50,
      "Entertainment": 45.00,
      "Education": 120.00,
      "Groceries": 80.20
    },
    recentTransactions: [
      { id: "tx_01", date: "2026-09-18", description: "HEB Grocery", amount: -45.20, category: "Groceries", accountId: "acc_chk_01" },
      { id: "tx_02", date: "2026-09-17", description: "UT Co-op", amount: -120.00, category: "Education", accountId: "acc_chk_01" },
      { id: "tx_03", date: "2026-09-15", description: "Torchy's Tacos", amount: -18.50, category: "Food & Dining", accountId: "acc_chk_01" },
      { id: "tx_04", date: "2026-09-14", description: "Spotify", amount: -5.99, category: "Entertainment", accountId: "acc_chk_01" }
    ]
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
    spendingSummary: {
      "Business Expenses": 4500.00,
      "Food & Dining": 420.00,
      "Auto & Transport": 350.00,
      "Shopping": 890.00
    },
    recentTransactions: [
      { id: "tx_11", date: "2026-09-19", description: "Apple Store - Domain", amount: -2499.00, category: "Business Expenses", accountId: "acc_bus_01" },
      { id: "tx_12", date: "2026-09-18", description: "Uchi Austin", amount: -210.00, category: "Food & Dining", accountId: "acc_chk_02" },
      { id: "tx_13", date: "2026-09-15", description: "Tesla Supercharger", amount: -15.40, category: "Auto & Transport", accountId: "acc_chk_02" },
      { id: "tx_14", date: "2026-09-10", description: "Whole Foods", amount: -145.20, category: "Shopping", accountId: "acc_chk_02" },
      { id: "tx_15", date: "2026-09-01", description: "Client Payment - Consulting", amount: 8500.00, category: "Income", accountId: "acc_bus_01" }
    ]
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
    spendingSummary: {
      "Groceries": 250.00,
      "Utilities": 120.00,
      "Gas": 45.00
    },
    recentTransactions: [
      { id: "tx_21", date: "2026-09-16", description: "Austin Energy", amount: -120.00, category: "Utilities", accountId: "acc_chk_03" },
      { id: "tx_22", date: "2026-09-14", description: "Shell Station", amount: -45.00, category: "Gas", accountId: "acc_chk_03" },
      { id: "tx_23", date: "2026-09-12", description: "Central Market", amount: -85.50, category: "Groceries", accountId: "acc_chk_03" }
    ]
  }
];
