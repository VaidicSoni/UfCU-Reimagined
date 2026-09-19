import { useEffect, useRef, useState } from 'react'
import { useOnboarding } from './context/OnboardingContext.jsx'
import { t } from './lib/i18n.js'
import { LumiTrigger } from './components/LumiTrigger.jsx'
import { Icon } from './components/Icons.jsx'
import { Concierge } from './components/Concierge.jsx'
import { AccessibilityBar } from './components/AccessibilityBar.jsx'
import { ProgressBar } from './components/ProgressBar.jsx'
import { Landing } from './screens/Landing.jsx'
import { Goals } from './screens/Goals.jsx'
import { About } from './screens/About.jsx'
import { Address } from './screens/Address.jsx'
import { Identity } from './screens/Identity.jsx'
import { Waiting } from './screens/Waiting.jsx'
import { Secure } from './screens/Secure.jsx'
import { Funding } from './screens/Funding.jsx'
import { Done } from './screens/Done.jsx'
import { Dashboard } from './screens/Dashboard.jsx'
import { Disclosures } from './components/Disclosures.jsx'

const SCREENS = {
  welcome: Landing,
  goals: Goals,
  about: About,
  address: Address,
  identity: Identity,
  waiting: Waiting,
  secure: Secure,
  funding: Funding,
  done: Done,
  dashboard: Dashboard,
}

// Lumi's scripted line for each step; chat answers layer on top of this.
const GUIDE_LINE = {
  welcome: 's1Guide',
  goals: 's1Guide',
  about: 's2Guide',
  address: 's3Guide',
  identity: 's4Guide',
  waiting: 's5Guide',
  secure: 's6Guide',
  funding: 's7Guide',
  done: 's8Guide',
  dashboard: 's9Guide',
}

// How the mascot behaves at each step.
const MOOD = { waiting: 'thinking', secure: 'celebrate', done: 'celebrate' }

// The official UFCU mark, used unmodified and unbacked. The warm lift in the
// top-left of the page gradient is what separates its navy body from the
// ground; its orange ring and white wordmark carry the rest.
function Wordmark({ onHome, lang }) {
  return (
    <div className="flex items-center gap-3">
      <button onClick={onHome} aria-label={t(lang, 'homeAria')} className="rounded-full">
      <img
        src="/ufcu-logo.svg"
        alt="UFCU — University Federal Credit Union"
        className="h-11 w-auto"
        width="232"
        height="118"
      />
      </button>
      <span className="hidden text-sm font-semibold text-navy-subtle sm:inline">
        University Federal Credit Union
      </span>
    </div>
  )
}

export default function App() {
  const { step, lang, go } = useOnboarding()
  const [chatOpen, setChatOpen] = useState(false)
  const [docsOpen, setDocsOpen] = useState(false)
  const [seed, setSeed] = useState(null)
  const panelRef = useRef(null)

  const Screen = SCREENS[step]
  const isLanding = step === 'welcome'
  const mood = MOOD[step] || 'idle'

  // Keep the closed panel out of the tab order rather than just invisible.
  useEffect(() => {
    if (panelRef.current) panelRef.current.inert = !chatOpen
  }, [chatOpen])

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && setChatOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const askFromChip = (question) => {
    setSeed({ text: question, at: Date.now() })
    setChatOpen(true)
  }

  return (
    <div className="mesh grain min-h-screen">
      <header className="relative z-10 mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-5 py-6">
        <Wordmark onHome={() => go('welcome')} lang={lang} />
        <div className="flex items-center gap-3">
          <AccessibilityBar />
          {/* Progress is kept, not discarded — re-entering picks up where you
              left off, so leaving never costs anything. */}
          {!isLanding && (
            <button
              onClick={() => go('welcome')}
              aria-label={t(lang, 'exitFlowAria')}
              className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 text-sm font-bold text-white transition hover:bg-white/25"
            >
              <Icon.close className="h-4 w-4" aria-hidden="true" />
              {t(lang, 'exitFlow')}
            </button>
          )}
        </div>
      </header>

      {isLanding ? (
        <Screen />
      ) : (
        <>
          {/* Closed, the card sits wide and centred. Opening the chat splits the
              page: the card slides into its right half as the chat is revealed
              on the left, landing on a true half-and-half. */}
          <main className="relative z-10 mx-auto flex w-full max-w-6xl items-start gap-6 px-5 pb-36 lg:pb-16">
            <section
              aria-hidden={!chatOpen}
              className={`split-col min-w-0 lg:overflow-hidden ${
                chatOpen ? 'w-0 opacity-100 lg:w-[48%]' : 'w-0 opacity-0'
              }`}
            >
              <div
                ref={panelRef}
                role="dialog"
                aria-label="Lumi"
                className={`chat-body u-card fixed inset-x-4 bottom-4 z-50 h-[80vh] overflow-hidden bg-navy-darkest/95 ring-1 ring-white/15 backdrop-blur-xl lg:static lg:h-[min(78vh,720px)] lg:w-full lg:min-w-[340px] ${
                  chatOpen ? '' : 'chat-body--closed'
                }`}
              >
                <Concierge
                  open={chatOpen}
                  message={t(lang, GUIDE_LINE[step])}
                  mood={mood}
                  seed={seed}
                  onClose={() => setChatOpen(false)}
                />
              </div>
            </section>

            {/* Capped at max-w-2xl throughout: centred when the chat is closed,
                filling the narrower right column once it opens. */}
            <section className="mx-auto w-full min-w-0 max-w-2xl flex-1">
              <div className="u-card bg-white p-6 shadow-card sm:p-9">
                {step !== 'done' && step !== 'dashboard' && (
                  <div className="mb-8">
                    <ProgressBar />
                  </div>
                )}
                <Screen />
              </div>
            </section>
          </main>

          <LumiTrigger
            open={chatOpen}
            onOpen={() => setChatOpen(true)}
            onAsk={askFromChip}
            mood={mood}
          />
        </>
      )}

      {/* Required credit-union disclosures. "Federally insured by NCUA" and the
          equal-housing statement are not decoration — a US credit union must
          display them, and their absence is the first thing a compliance
          reviewer notices. */}
      <footer className="relative z-10 mx-auto max-w-6xl px-5 pb-10">
        <div className="mx-auto flex max-w-3xl flex-col items-center gap-4 border-t border-white/10 pt-6 text-center">
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-xs font-bold uppercase tracking-wide text-navy-subtle">
            <span className="flex items-center gap-2.5">
              <span
                aria-hidden="true"
                className="rounded-full border border-navy-subtle/70 px-2 py-[3px] text-[9px] font-extrabold leading-none tracking-[0.06em]"
              >
                NCUA
              </span>
              {t(lang, 'ncua')}
            </span>
            <span className="flex items-center gap-2.5">
              <span
                aria-hidden="true"
                className="flex h-[19px] w-[19px] items-center justify-center rounded-[4px] border border-navy-subtle/70 text-[12px] leading-none"
              >
                ⌂
              </span>
              {t(lang, 'equalHousing')}
            </span>
          </div>

          <button
            onClick={() => setDocsOpen(true)}
            className="text-xs font-semibold text-navy-subtle underline transition hover:text-white"
          >
            {t(lang, 'footerDisclosures')}
          </button>

          <p className="text-xs leading-relaxed text-navy-subtle">
            {t(lang, 'footerDemo')}
          </p>
        </div>
      </footer>

      <Disclosures open={docsOpen} onClose={() => setDocsOpen(false)} />
    </div>
  )
}
