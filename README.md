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
`address`, `identity`, `waiting`, `secure`, `funding`, `done`, `dashboard`.

`?goals=everyday,auto,credit` seeds the goal selection alongside it, so a
populated portal can be re-shown during Q&A without replaying the flow.

Every screen is wrapped in an error boundary: a crash shows a message and keeps
the rest of the prototype alive, rather than unmounting the tree and leaving a
white page mid-demo.

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
| 9 | Dashboard | The first sixty seconds as a member: balance, live virtual card, accounts, setup steps. |

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

The bulb is a single closed path whose glass shoulders taper into a neck — a
circle on a stand doesn't read as a bulb — and the screw base is two bars
stepping down in width, outlined and filled like the glass.

A pale rim is drawn first, a couple of pixels wider than each shape. The navy
outline has nowhere to go against a navy page, and the rim gives the whole
silhouette an edge without changing its colour: on the white cards it falls away
to nothing and the navy outline does the work on its own.

The filament is centred in the glass cavity — it reads y 27.5–68.5 inside a
16–80 opening, so there's 11.5 clear above and below.

**At rest she stays the UFCU "u".** She relaxes into a face only where she's
actually in use: her introduction on the landing page, and whenever the chat is
open. That keeps the letterform — the brand — as her default state. Close the
chat and she returns to the letter.

On the landing she **cycles** between the two (face for 3.6s, letter for 1.9s),
because a one-shot intro is over inside two seconds and most visitors never see
it. Everywhere else the transition is driven by actual state, not a timer.

While reading aloud, her mouth animates against the speech at 2.2 Hz, driven by
the utterance's own `onstart`/`onend` events rather than a guess about timing,
so she stops the moment the sentence does. The open mouth keeps the smile's
endpoints and horizontal radius and only deepens, so the jaw drops rather than
the mouth squeezing inwards, and two detuned sines drive it so it doesn't read
as a metronome.

All three shapes — letter, smile, open mouth — share one path grammar
(`M, L, A, L`), so every transition is a numeric interpolation of ten values
rather than a cross-fade between drawings; the arc bottom stays anchored while
the stems retract, which is what keeps the curve reading as one continuous
shape.

Lumi is pure inline SVG: no image assets, no library, nothing to load. The
animation writes SVG attributes directly rather than going through React state,
so a permanently running loop never re-renders the tree. Ambient motion stays
deliberately small — a slow float, an irregular blink that fires only when she
has a face and isn't mid-sentence, a soft halo pulse — with two reactive states:
`thinking` during the KYC wait and `celebrate` on approval. All of it is
suppressed under `prefers-reduced-motion`.

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

The header shows the mark alone — the spelt-out name beside it was redundant
once the real logo was in place.

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

She holds the UFCU letterform there, and bounces and shakes on her own on a
five-second CSS loop that rests for most of its length then bursts — no hover
required, so she reads as alive even while the member is typing. Three suggested
questions fan out around her along an arc, staggered in and drifting gently.

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

## The landing page

Kept deliberately short: hero, proof, products. Someone ready to join clicks
the CTA and never scrolls; everything below is for the rest.

**The carousel sits in the hero**, sharing the right column with Lumi's
introduction rather than living further down the page — so the first screen
carries the headline, the rotating proof and the guide together. Lumi's intro
is a compact row instead of a tall card to make room. Both columns carry
`min-w-0`: the carousel's track is a flex row of full-width slides, and without
it the grid column sizes to that intrinsic width and overflows the page.

**The carousel** advances every 2 seconds and carries four things a prospective
member wants to know: the team behind it, the collegiate card designs, the
schools already affiliated, and that anyone can join through the American
Consumer Council regardless. It can be swiped, dragged, arrowed, dotted or
driven with the keyboard. Autoplay pauses on hover and on focus, is skipped
entirely under `prefers-reduced-motion`, and **any manual interaction restarts
the timer** — without that, tapping a dot bumps you off your own choice a moment
later, which at a 2-second cadence is constant.

Photographs run full-bleed with the caption **directly on the image** — no
panel behind it. Contrast comes from two things instead: a vertical gradient
that's dense at the foot and fully clear across the top half, and a text shadow
(`.on-photo`) on the caption itself. The shadow is what makes this work — it's
invisible against the dark end of the gradient and only earns its keep where
the photo underneath is bright, so the image is never boxed in. Images live in
`public/slides/` and each slide falls back to a drawn panel if its file is
missing.

The card faces are themed to UT Austin, Texas State and Austin Community College
using **only the schools' colours** — no logos or marks. UFCU really does offer
collegiate card designs; the actual artwork is licensed. Real art can be dropped
at `public/slides/card-ut.png`, `card-txst.png` and `card-acc.png`, and it
replaces the drawn face automatically.

The carousel deliberately repeats none of the figures from the band below it.

**The product cards start the flow.** Each one seeds its goal and jumps into
onboarding, so picking "Mortgage Lending" lands on the goals step with that
already selected rather than on a blank screen.

**The figures are UFCU's own**, from the scraped site rather than rounded from
memory: 436,007 member-owners, $4.239B in assets, chartered 1936.

> One claim to be ready to defend: the hero says *about 3 minutes*, while
> UFCU's own page says 3–5. Ours is the improvement being proposed, not a
> quotation of theirs.

## The member dashboard

Onboarding that ends at a receipt hasn't shown *"interest → membership-ready"* —
it's shown that a form was submitted. The final screen is a working dashboard,
built to echo the **live UFCU portal** rather than invent a new language:

| Taken from the real portal | What changed |
|---|---|
| Navy greeting band, "Hello \<name\>" | Total available balance moved into it, large |
| Routing number with a copy button | Kept as-is — members come looking for this |
| Sort by account type / balance | Kept, as a segmented control instead of a dropdown |
| Grouped sections with an orange accent rail | Kept, with the masked number and suffix code |
| Total available balance row | Promoted to the header instead of the list footer |
| Quick transfer (from / to / amount) | Kept, and it actually moves money between accounts |

Their own reviews say members can't find a balance and the navigation is
confusing, so the density is the thing that changes: balances lead, groups are
labelled, and nothing is behind a menu.

The portal runs **full width** (the rest of the flow stays a single centred
card). Panels are laid out as **CSS columns, not a grid** — a grid leaves a
ragged edge whenever one column runs shorter than its neighbour, whereas columns
pack by height, so there is no dead space to look at. With the chat open it
drops to a single column, since half a screen can't hold three.

Panels, with the money-app patterns they borrow:

- **A virtual card** in solid navy with a hard-edged orange rule. An earlier
  version used a blurred orange glow, which sat directly behind the card number
  and destroyed its contrast — brand colour belongs at the edges, not under text
  you need to read. Tap to reveal the number (instant issuance, from
  `Banking 101`: spend today, plastic later).
- **A spending donut** with the total in the middle and a category list beneath.
  A donut earns its place here because the question is "what share went where",
  and selecting a category gives the exact figure.
- **Income against spend**, paired bars per period. The quarter view is a real
  aggregation of the same rows, not a relabelled month.
- **A savings goal** whose slider moves the completion date. Watching the date
  move as you change the monthly amount is what makes a target feel reachable.
- **An account tracker** — horizontal bars, not a pie, because the real question
  is "which account holds the most" and length beats angle for that. Assets and
  debts stay separate groups so a balance is never visually netted against a
  loan.
- **A subscription tracker** with the count and annual total in the header. Each
  payment switches off and both totals move with it; the annual figure is the
  one that changes behaviour.
- **A Day 1 / After 90 days toggle.** Day one is the honest zero-state a new
  member actually sees — the spending, goal and subscription panels simply
  aren't there, because inventing activity on day one would be a lie. The 90-day
  view carries simulated activity so the trackers have something to plot, and
  gives the pitch a second beat: this is what you open with, and this is what it
  becomes.
- **Three tickable setup steps** marked as not urgent, and a **hide-balances
  toggle** that is both a privacy control and an accessibility affordance for
  anyone opening this in public.

Ending here gives the pitch a closing beat: *"and this is what they see ten
seconds later."*

## Leaving the flow

The header carries an **Exit** control on every step, and the wordmark is a link
home. Neither discards anything — progress stays in state, so re-entering picks
up where you left off. A full reset is deliberate and separate: "Run the demo
again" on the handoff screen.

## Lumi's questions follow the step

The three suggested questions are per-screen, not a fixed list — on the SSN
screen she offers "Why do you need my SSN?" and "What if my ID won't scan?"; on
the dashboard she offers "Where is my card number?" and "How do I set up direct
deposit?". `suggestionsFor(step, lang)` in `lib/concierge.js` drives it, and the
knowledge base answers every question it offers.

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
translation, keyboard-visible focus rings, ARIA live regions on progress, and
reduced-motion support. Plus **read-aloud**: a toggle at the top of the chat has
Lumi speak every reply and every step's explanation, with a play button on each
individual message for anyone who wants one line repeated. The preference
persists, so it survives a reload mid-demo.

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
