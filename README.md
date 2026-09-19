# UFCU Onboard

**DevelopU Hackathon — reimagining UFCU's new member onboarding.**

A stranger can go from "who is UFCU?" to a funded, member-owned account with a
live card in about three minutes — guided the whole way by Lumi, a UFCU-branded
assistant answering from UFCU's own content.

> Every financial system here is simulated. No real identity verification, bank
> connection or payment is performed, and nothing entered leaves the machine.

---

## Run it

```bash
npm install
npm run dev:all      # RAG server on :3001 + Vite on :5173
```

Open <http://localhost:5173>.

`npm run dev` starts the UI alone — the chat then falls back to a single canned
reply, so use `dev:all` for anything you want to demo.

### The language model is optional

Lumi's answers come from a local RAG pipeline over **133 pages scraped from
ufcu.org** (2,094 embedded chunks). Retrieval runs on its own, so **the chat
works without any model download** — it answers extractively from the matched
passage.

Dropping `Llama-3.2-1B-Instruct-Q4_K_M.gguf` into `models/` turns those
passages into conversational replies. The server detects it at boot and says
which mode it's in. Either way there is **no API key and no internet call** —
a demo that depends on venue Wi-Fi is a demo that fails in front of judges.

---

## Demo guide

### Walk the onboarding

Click **Open my account** and go. Everything is pre-wired; type anything.

### Jump to any screen

URL shortcuts, so a single screen can be re-shown during Q&A without replaying
the flow. They compose.

| Parameter | Example | Effect |
|---|---|---|
| `?step=` | `?step=dashboard` | Jump to a screen |
| `?goals=` | `?goals=everyday,auto,credit` | Seed the product selection |
| `?university=` | `?university=UT%20Austin` | Seed the student persona |
| `?scan=fail` | `?scan=fail` | Force the ID scan to fail once, to show recovery |

### Sign in as an existing member

**Demo sign-in** on the landing page loads a seeded member with real history —
transactions, recurring payments, transfers, cards. Password is `demo123` for
all three.

| Persona | Email | Shows |
|---|---|---|
| Student | `alex.student@demo.ufcu.org` | Student dashboard, Explore Features, swipe categorisation |
| Business | `sarah.business@demo.ufcu.org` | Business theming, EIN onboarding, multi-account |
| Personal | `marcus.personal@demo.ufcu.org` | Standard member portal |

---

## The flow

Ten screens. Steps 2–4 split what a single "collect everything" screen would
be, so the flow actually honours one question per screen rather than claiming to.

| # | Screen | What it demonstrates |
|---|---|---|
| 0 | Landing | Who UFCU is, the member-owned difference, the full product range |
| 1 | Goals | Asks *why* before asking for anything sensitive; covers all four product areas |
| 2 | About you | Progressive profiling — name, email, phone, date of birth |
| 3 | Address | Mock autocomplete so nobody types a full address |
| 4 | Identity | Tax ID, document capture, consent — with every fallback below |
| 5 | Waiting room | The KYC pause becomes a goal-aware cross-sell, not a spinner |
| 6 | Secure | **Real WebAuthn passkey** — no password is ever created |
| 7 | Funding | Plaid-style bank link, or routes for members without one |
| 8 | Handoff | Accounts summary and a magic-link bridge into the mobile app |
| 9 | Portal | The first sixty seconds as a member |

---

## Edge cases

Most onboarding demos show the happy path. The drop-off happens everywhere else,
so these are built rather than described:

**No SSN.** ITIN is a first-class option, with validation that catches the real
mistake — SSNs are never issued starting with 9, ITINs always are. Business
goals add EIN.

**Neither number.** A third option replaces the field with two genuine routes:
we help with the ITIN application (IRS Form W-7) and hold the account, or you
finish with a member advocate. UFCU's own page says to call or visit a branch if
you lack the documents, so the second route uses their published numbers.

**No driver's licence.** Passport and state ID are accepted — international
students are a large share of UT and Texas State and the group most likely to
have neither.

**The ID scan fails.** A failed scan is the single biggest drop-off point in
digital account opening. Failure gives a reason ("there's glare across the
photo") and three ways forward: retry, upload instead, or switch document.

**No ID at all.** Sign in to a bank you already use and we verify you from that
account — the same Plaid flow doing identity instead of funding.

**Plaid sign-in refused.** Retry, or fall back to manual account and routing
entry with micro-deposits.

**No other bank account.** Being unbanked is the reason to join a credit union,
not a reason to be turned away: direct deposit, cash at a branch, or open it
unfunded.

---

## The member portal

Patterned on the **live UFCU portal** — the navy greeting band, routing number
with a copy button, sort-by, grouped sections with an orange accent rail, masked
number plus suffix code, total-available and quick transfer are all theirs.

What changes is the density. UFCU's own reviews say members can't find a balance
and the navigation is confusing, so balances lead and nothing hides behind a
menu.

On top of the portal patterns: a **live virtual card** tappable to reveal its
number, a **spending donut**, **income against spend** with a real quarter
aggregation, a **savings goal** whose slider moves the completion date, an
**account tracker** keeping balances and debts as separate groups so one is
never visually netted against the other, a **subscription tracker** where
switching a payment off moves the monthly and annual totals, and a
**hide-balances toggle**.

A **Day 1 / After 90 days** toggle keeps the zero-state honest: the spending,
goal and subscription panels don't exist on day one, because inventing activity
for a brand-new member would be a lie. It also gives the pitch a second beat —
this is what you open with, and this is what it becomes.

Panels are laid out as **CSS columns rather than a grid**: a grid leaves a ragged
edge whenever one column runs short, whereas columns pack by height.

---

## Lumi

Lumi is assembled from two marks UFCU already owns rather than invented: the
filament is the lowercase **u** of the wordmark, and the bulb is the lightbulb
from the DevelopU logo. They combine into UFCU's own purpose — *brighter
futures* — so her filament brightens as the member progresses.

**At rest she stays the letterform.** She relaxes into a face only where she's
in use: her landing introduction, when your cursor comes near, and whenever the
chat is open. Close it and she returns to the **u**.

She tracks the pointer, leans and lifts toward it, and pulls faces when idle —
wink, tongue, bored — suppressed while speaking or while being pointed at, where
they read as a glitch rather than personality. Hovering a suggested question
makes her grin. While reading aloud her mouth is driven by the speech
synthesiser's own word-boundary events, so it moves with the words actually
being spoken.

She is pure inline SVG — no image assets, no animation library. The loop writes
SVG attributes directly rather than through React state, so a permanently
running animation never re-renders the tree. All of it is suppressed under
`prefers-reduced-motion`.

**Her questions follow the screen and the focused field** — on the SSN field she
offers "Why do you need my SSN?"; on the portal, "Where is my card number?"

---

## Accessibility

The prompt's bar for *good* is "simple, accessible to all individuals, including
generations boomer through alpha." That is the one criterion you can build to,
so it is built throughout rather than bolted on:

- **Text scaling** — A / A+ / A++, applied at the root so the whole app scales
- **Full Spanish** — all 276 copy strings, not a decorative toggle
- **Read aloud** — every response has its own Listen control, available while the
  answer is still typing; someone who wants to listen shouldn't wait out an
  animation
- **Voice input** — native speech recognition on the ask field, disabled with a
  reason where the browser has no implementation
- **Reduced motion** — respected by the mascot, carousel and every transition
- **Keyboard** — visible focus rings shaped to the control they surround, full
  keyboard navigation, `aria-live` on progress and answers
- Preferences persist across reloads

---

## Real vs. simulated

| Real | Simulated |
|---|---|
| **WebAuthn passkey** — raises the genuine Touch ID / Windows Hello sheet | Identity verification and KYC checks |
| **Local RAG** over 133 scraped UFCU pages | Bank linking and funding transfers |
| **Web Speech API** — text-to-speech and speech recognition | Licence scanning (no camera opens) |
| Text scaling, translation, keyboard navigation | Address autocomplete, account balances |

No account data, question or keystroke leaves the machine — the app talks only
to `localhost:3001`. The single external request is the Google Fonts stylesheet
in `index.html`, which carries nothing and falls back to system fonts offline.

---

## Data handling

This is a prototype, not a banking system:

- **No sensitive value is persisted.** Only text size, language and read-aloud
  reach `localStorage`.
- **The funding step never collects bank credentials** in the identity path, and
  what is typed in the Plaid mock is never stored or sent anywhere.
- **Demo with fake data only.** Never type a real SSN or real bank credentials
  into this prototype.

---

## Architecture

```
src/
├── App.jsx                     layout, step routing, browser history
├── context/OnboardingContext   flow state, accessibility prefs, demo sign-in
├── screens/                    landing + nine flow steps
├── components/                 Lumi, Concierge, portal panels, MockPlaid, …
└── lib/
    ├── i18n.js                 all copy, EN + ES
    ├── concierge.js            RAG client, per-screen suggestions, fallbacks
    ├── speech.js               Web Speech wrappers (TTS + STT)
    └── mockApi.js              products, banks, validation, simulated activity

server/
├── server.js                   Express API — /api/ask, /api/login, /api/users
├── rag.js                      TF-IDF vectoriser, cosine similarity, chunk store
├── llm.js                      optional local Llama 3.2 via node-llama-cpp
└── users.js                    three seeded members with generated history

lumi-project/
├── ufcu_scraper.py             the scraper that produced the knowledge base
└── knowledge_docs/             133 pages of ufcu.org
```

React 18 + Vite 6 + Tailwind 3 on the front. Express + `node-llama-cpp` on the
back. No router, no state library, no component library.

Every screen is wrapped in an error boundary: a crash shows a message and keeps
the rest of the prototype alive rather than unmounting the tree and leaving a
white page mid-demo.

Browser **Back and Forward work throughout** — every step change pushes a
history entry, and the demo query parameters survive navigation.

---

## Brand

Navy `#23335D` for structure, Orange `#EF6820` for primary calls to action only,
Amber `#F2780C` as accent — from the prompt's swatch sheet, defined once in
`tailwind.config.js`. The UFCU mark in `public/ufcu-logo.svg` is used unmodified.

> The logo file's orange is `#ff671d`, which is not the `#EF6820` on the brand
> sheet. That's the mark's own colour and it has been left alone.

Collegiate card designs use **only the schools' colours** — no logos or marks.
UFCU really does offer them; the artwork is licensed.

---

## Research

The team's research sits alongside this README — competitor analysis, the screen
flow blueprint, brand guidelines and the pitch outline. Facts in the product
(436,007 member-owners, $4.239B in assets, chartered 1936, the membership
routes, the document requirements) come from `lumi-project/knowledge_docs/`,
scraped from ufcu.org, rather than from memory.
