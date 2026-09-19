# UFCU Onboard — From Click to Community

A concept prototype for the **DevelopU Hackathon**, reimagining UFCU's new member
onboarding as a goals-first, sub-three-minute web flow.

> Every backend is simulated. No real identity verification, banking, or payment
> system is connected, and nothing entered here leaves the browser.

## Run it locally

```bash
npm install
npm run dev
```

Opens on <http://localhost:5173>. No API keys, no network calls, no accounts —
it runs fully offline once dependencies are installed.

```bash
npm run build && npm run preview   # production build check
```

**Demo shortcut:** append `?step=<name>` to jump straight to any screen, e.g.
<http://localhost:5173/?step=waiting>. Useful for re-showing one screen during Q&A
without replaying the whole flow. Valid names: `welcome`, `goals`, `about`,
`address`, `identity`, `waiting`, `secure`, `funding`, `done`.

## The flow

| # | Screen | What it demonstrates |
|---|--------|----------------------|
| 0 | Landing | Who UFCU is, why member-owned matters, and the full product range — before asking for anything. |
| 1 | Goals | Asks *why* before asking for anything sensitive. Multi-select, covers all four product areas in the prompt. |
| 2 | About you | Progressive profiling — name, email, phone only. |
| 3 | Address | Mock autocomplete so nobody types a full address. |
| 4 | Identity | SSN with contextual reassurance + simulated licence scan. |
| 5 | Waiting room | The KYC pause becomes a goal-aware cross-sell, not a spinner. |
| 6 | Secure | **Real WebAuthn passkey** — no password is ever created. |
| 7 | Funding | Plaid-style bank link, then a $25 opening deposit. |
| 8 | Handoff | Accounts summary + magic-link bridge into the mobile app. |

Screens 2–4 split what the original blueprint had as a single screen, so the flow
actually honours One Question Per Screen instead of just claiming to.

## Lumi, and the design language

**Lumi** is the guide character, and is assembled from two existing UFCU marks
rather than invented: the filament is the lowercase **u** of the UFCU wordmark,
and the bulb is the lightbulb from the DevelopU hackathon logo. The two combine
into UFCU's own stated purpose — *brighter futures* — so Lumi's filament
literally brightens as the member moves through onboarding, reaching full glow
at account approval.

The filament also doubles as Lumi's smile, so the UFCU letterform *is* the
character's expression.

The filament draws itself on as the **u**, holds long enough to read as the
wordmark, then relaxes into a smile as the eyes open — and returns to the
letterform every ~6 seconds, so the connection lands even if you arrive
mid-screen. Both shapes share one path grammar (`M, L, A, L`), so the morph is a
numeric interpolation of ten values rather than a cross-fade between two
drawings; the arc bottom stays anchored while the stems retract, which is what
keeps the curve reading as one continuous shape.

Lumi is pure inline SVG: no image assets, no library, nothing to load. The morph
loop writes SVG attributes directly rather than going through React state, so a
permanently running animation never re-renders the tree. Ambient motion stays
deliberately small — a slow float, an irregular blink that only fires while the
face is actually showing, a soft halo pulse — with two reactive states:
`thinking` during the KYC wait and `celebrate` on approval. All of it is
suppressed under `prefers-reduced-motion`, which pins Lumi to the resting face.

Three rules carry the look beyond default template territory:

- **The U motif.** Panels and chips use square shoulders and a deeply rounded
  foot (`.u-card`, `.u-chip`) — the silhouette of the lowercase "u" in the UFCU
  wordmark, reused as the shape language for every surface.
- **Light, not flat fill.** The background is a five-layer mesh gradient plus a
  fine grain overlay, carrying the "brighter futures" idea into the page itself
  (see *The background*).
- **No emoji.** Every icon is a geometric stroke mark in `components/Icons.jsx`.
  Emoji render differently on every OS and read as a default template.

## The logo

The official UFCU mark ships as `public/ufcu-logo.svg` and is used **unmodified
and unbacked** — no recolouring, no redrawing, no container. Its navy body sits
directly on the page gradient; the warm lift in the top-left of that gradient is
what separates it from the ground, and its orange ring and white wordmark carry
the rest. It also serves as the favicon.

> Worth knowing: the logo file's orange is `#ff671d`, which is **not** the
> `#EF6820` on the prompt's brand sheet. That's the mark's own colour and it has
> been left alone — the palette in `tailwind.config.js` still drives the UI.
> Flag it to a mentor if you want them reconciled.

## The background

Five layers, fixed to the viewport so the page moves over the light rather than
dragging it along:

- a warm orange lift from the top-left — the "brighter futures" idea carried
  into the page itself, and the thing that gives the navy logo its separation
- a softer amber pass just under it, to stop the falloff banding
- a cool periwinkle counterweight top-right, so the page isn't uniformly warm
- a deep navy pool bottom-right
- a vertical `#172a55 → #0a1229` darkening underneath, giving the page a floor

A fine grain overlay sits on top of all of it, which is what keeps the large
flat areas from reading as a default template.

## Lumi's corner dock, and the split

With the chat closed, the form card sits wide and centred — the member sees one
question and nothing else. Lumi waits in the **bottom-left** corner. That corner
is deliberate: every primary CTA (`Continue`, `Verify my identity`) sits
bottom-right of the card, so a helper there would overlap the button we most
want pressed, and in left-to-right reading the eye lands there last.

She bounces and shakes on her own, on a five-second CSS loop that rests for most
of its length then bursts — no hover required, so she reads as alive even while
the member is typing. Three suggested questions fan out around her along an arc,
staggered in and drifting gently.

Opening the chat **splits the page** rather than covering it: the card slides
into the right half as the chat is revealed in the left, landing on a true
half-and-half. Both halves run on the same easing curve and duration, so it
reads as one movement. The card is capped at `max-w-2xl` throughout and simply
stops being the widest thing on screen, which is what lets the position and
width animate together without a `max-width` keyframe.

A question tapped on a chip is asked automatically on open, so one tap gets an
answer rather than an empty box. Escape closes it, and the closed panel is
marked `inert` so it stays out of the tab order rather than merely being
invisible.

On phones the chips are hidden (they would run off-screen), Lumi carries a small
"Help" badge instead, and the chat opens as a full-width sheet — a split makes no
sense at that width.

## How this answers the prompt

**"Establishing identity in a simple, member-centric way"** — identity is
gathered progressively across three light screens rather than one wall of fields.
The SSN field carries an inline explanation of *why* federal law requires it and
that it will not affect the member's credit score.

**"Ensuring the credit union obtains required information"** — the flow still
collects the full KYC set (legal name, address, SSN, government ID). Nothing is
skipped; it is only resequenced and explained.

**"Applying for Everyday Banking, Mortgage, Consumer Lending or Business
Banking"** — all four are selectable on screen 1. Selections assemble a live
product bundle with a value line per product, tailored to an inferred member
segment, and drive which offer appears during the wait.

**"Trust and identity confidence without breaking the experience"** — four
moves: contextual microcopy at every sensitive field, a guide who answers "why
do you need this?" in plain language, an explicit consent gate that states the
three things the data is used for, and a passkey instead of a password.

**"Interest → membership-ready"** — the flow does not end at approval. It ends at
a funded account with a card on the way and a signed-in path into the app.

**"Accessible to all generations"** — text scaling (A / A+ / A++), full Spanish
translation, text-to-speech on every concierge line, keyboard-visible focus
rings, ARIA live regions on progress, and reduced-motion support.

## Scoring against the rubric

| Weight | Category | Where it lands |
|---|---|---|
| 25 (×5) | Member onboarding & product fit | Goals-first entry covering all four product areas; the **bundle builds live** as goals are picked, tailored to an inferred member segment, each product carrying its value line — not just a name. |
| 20 (×4) | Speed & friction reduction | Progressive profiling, one question per screen, a single application for multiple products, mock address autocomplete, no password to invent. |
| 20 (×4) | UX intuitiveness & creativity | Lumi answers questions in plain language before they're asked; no-dead-end errors; text scaling, Spanish, and text-to-speech built in. |
| 15 (×3) | Technical execution & feasibility | Runs locally with no network dependency; real WebAuthn; mock boundaries drawn where real vendors (KYC, Plaid, core) would sit. |
| 10 (×2) | Compliance, trust & risk awareness | Explicit consent gate before verification, plain-language data-use disclosure, soft-check statement, and no sensitive value ever persisted. |
| 10 (×2) | Pitch & communication | The demo shortcut below lets any screen be re-shown during Q&A. |

## What is real vs. simulated

| Real | Simulated |
|------|-----------|
| WebAuthn passkey (`navigator.credentials.create`) — raises the genuine Touch ID / Windows Hello sheet | Identity verification and KYC checks |
| Web Speech API text-to-speech | Bank linking and funding transfer |
| Text scaling, translation, keyboard navigation | Licence scanning (no camera opens) |
| | Address autocomplete |
| | Sarah's answers (keyword-matched, offline by design) |

Sarah is deliberately **not** wired to a live LLM. The prompt requires the app to
run locally on a laptop, and a demo that depends on venue Wi-Fi is a demo that can
fail in front of judges.

## Data handling

This is a prototype, not a banking system:

- No sensitive value is ever persisted. Only text-size and language preferences
  reach `localStorage`.
- The funding step never collects bank credentials — choosing a bank is enough to
  tell the story and keeps real logins off a demo laptop.
- **Use obviously fake data when demoing.** Never type a real SSN or real bank
  credentials into this prototype.

## Stack

React 18 + Vite 6 + Tailwind 3. React Context for state. No backend, no router,
no external services.

```
src/
├── App.jsx                    layout, step routing, Sarah's scripted lines
├── context/OnboardingContext  flow state, accessibility prefs, progress
├── screens/                   landing + the eight flow steps
├── components/                Mascot, LumiTrigger, Concierge, BundleCard, Consent, Icons, …
└── lib/
    ├── i18n.js                all copy, EN + ES
    ├── concierge.js           Sarah's offline knowledge base
    ├── speech.js              Web Speech API wrapper
    └── mockApi.js             goals, banks, addresses, passkey, formatters
```

## Brand

Navy `#23335D` for structure and trust, Orange `#EF6820` for primary CTAs only,
Amber `#F2780C` as accent. Taken from the prompt's swatch sheet and defined once
in `tailwind.config.js`. The logo keeps its own colours (see above).

> One value to confirm with a mentor: primary **Lighter** is set to `#8182B1`,
> which is ambiguous in the prompt PDF render.

## Research

Team research lives alongside this README — brand guidelines, competitor
analysis, screen-flow blueprint, and the pitch outline.
