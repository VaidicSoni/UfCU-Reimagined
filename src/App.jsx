import { useEffect, useRef, useState } from 'react'
import { useOnboarding } from './context/OnboardingContext.jsx'
import { t } from './lib/i18n.js'
import { LumiTrigger } from './components/LumiTrigger.jsx'
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
}

// How the mascot behaves at each step.
const MOOD = { waiting: 'thinking', secure: 'celebrate', done: 'celebrate' }

// The official UFCU mark, used unmodified and unbacked. The warm lift in the
// top-left of the page gradient is what separates its navy body from the
// ground; its orange ring and white wordmark carry the rest.
function Wordmark() {
  return (
    <div className="flex items-center gap-3">
      <img
        src="/ufcu-logo.svg"
        alt="UFCU — University Federal Credit Union"
        className="h-11 w-auto"
        width="232"
        height="118"
      />
      <span className="hidden text-sm font-semibold text-navy-subtle sm:inline">
        University Federal Credit Union
      </span>
    </div>
  )
}

export default function App() {
  const { step, lang } = useOnboarding()
  const [chatOpen, setChatOpen] = useState(false)
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
        <Wordmark />
        <AccessibilityBar />
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
                {step !== 'done' && (
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

      <footer className="relative z-10 mx-auto max-w-6xl px-5 pb-10 text-center text-xs text-navy-subtle">
        Concept prototype for the DevelopU Hackathon. All verification, funding and
        account data is simulated — no real financial systems are connected.
      </footer>
    </div>
  )
}
