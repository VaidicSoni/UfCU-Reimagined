import { useEffect, useRef, useState, useCallback } from 'react'
import { useOnboarding } from '../context/OnboardingContext.jsx'
import { t } from '../lib/i18n.js'
import { speak, stopSpeaking, ttsSupported } from '../lib/speech.js'
import { askGuide, askRag, getSuggestions } from '../lib/concierge.js'
import { Mascot } from './Mascot.jsx'
import { Icon } from './Icons.jsx'
import { TypewriterText } from './TypewriterText.jsx'
import { ShimmerBubble } from './ShimmerBubble.jsx'

// Body of the expanded chat panel. Lumi wears her face here — this is the only
// place she's actually "in use" — and her mouth moves against the speech.
//
// Two answer paths:
//   • Suggested chip → instant hardcoded answer via askGuide(), typewriter effect
//   • Custom typed → shimmer while fetching from local RAG server, then typewriter
export function Concierge({ message, seed, onClose, open, mood = 'idle' }) {
  const { lang, step, progress, focusedField, readAloud, setReadAloud } = useOnboarding()
  // thread entries: { role, text, typing?, loading? }
  const [thread, setThread] = useState([])
  const [draft, setDraft] = useState('')
  const [speaking, setSpeaking] = useState(false)
  const scrollRef = useRef(null)

  const ask = useCallback(async (question) => {
    const q = question.trim()
    if (!q) return
    
    // RAG answer path (with shimmer) for EVERYTHING
    setThread((prev) => [
      ...prev,
      { role: 'user', text: q },
      { role: 'guide', text: '', loading: true },
    ])
    setDraft('')

    try {
      const answer = await askRag(q, step, focusedField || '', lang)
      // Replace the loading placeholder with the real answer
      setThread((prev) => {
        const updated = [...prev]
        for (let i = updated.length - 1; i >= 0; i--) {
          if (updated[i].loading) {
            updated[i] = { role: 'guide', text: answer, typing: true }
            break
          }
        }
        return updated
      })
    } catch {
      // In case of any unhandled error in askRag
      setThread((prev) => {
        const updated = [...prev]
        for (let i = updated.length - 1; i >= 0; i--) {
          if (updated[i].loading) {
            updated[i] = {
              role: 'guide',
              text: lang === 'es' ? 'Hubo un error. Intente de nuevo.' : 'Something went wrong. Please try again.',
              typing: true,
            }
            break
          }
        }
        return updated
      })
    }
  }, [lang, step, focusedField])
  
  const suggestions = getSuggestions(step, focusedField, lang)

  // A chip tapped on the dock arrives here as a seed and asks itself.
  useEffect(() => {
    if (seed?.text) ask(seed.text, true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [seed?.at])

  // A new step means a new scripted line — clear the side conversation.
  useEffect(() => {
    setThread([])
    stopSpeaking()
    setSpeaking(false)
  }, [message])

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [thread])

  // Mark a message as done typing (typewriter finished)
  const markTypingDone = useCallback((index) => {
    setThread((prev) => {
      const updated = [...prev]
      if (updated[index]) {
        updated[index] = { ...updated[index], typing: false }
      }
      return updated
    })
  }, [])

  const toggleSpeech = () => {
    if (speaking) {
      stopSpeaking()
      setSpeaking(false)
      return
    }
    const latest = thread.filter((m) => m.role === 'guide' && m.text).slice(-1)[0]
    speak(latest ? latest.text : message, lang)
    setSpeaking(true)
  }

  return (
    <div className="flex h-full flex-col">
      <header className="flex items-center gap-3 border-b border-white/10 px-5 py-4">
        <Mascot
          brightness={0.32 + 0.68 * (progress.current / progress.total)}
          state={mood}
          size={46}
          intro={false}
          className="shrink-0"
        />
        <div className="flex-1">
          <p className="text-base font-extrabold text-white">Lumi</p>
          <p className="text-xs text-navy-subtle">{t(lang, 'guide')}</p>
        </div>
        <button
          onClick={onClose}
          aria-label={lang === 'es' ? 'Cerrar' : 'Close'}
          className="rounded-full p-2 text-white/70 transition hover:bg-white/15 hover:text-white"
        >
          <Icon.close className="h-5 w-5" aria-hidden="true" />
        </button>
      </header>

      <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto px-5 py-4">
        {/* Lumi's scripted guide message for this step — always with typewriter */}
        <div className="rounded-2xl rounded-tl-sm bg-white/10 p-4 text-white">
          <p className="text-base leading-relaxed">
            <TypewriterText text={message} key={message} />
          </p>
          {ttsSupported() && (
            <button
              onClick={toggleSpeech}
              className="mt-3 inline-flex items-center gap-2 rounded-full bg-white/15 px-3.5 py-1.5 text-sm font-semibold text-white transition hover:bg-white/25"
            >
              {speaking
                ? <Icon.stop className="h-4 w-4" aria-hidden="true" />
                : <Icon.sound className="h-4 w-4" aria-hidden="true" />}
              {speaking ? t(lang, 'stop') : t(lang, 'listen')}
            </button>
          )}
        </div>

        {/* Conversation thread */}
        <div className="space-y-3" aria-live="polite">
          {thread.map((m, i) => {
            if (m.role === 'user') {
              return (
                <div
                  key={i}
                  className="ml-auto max-w-[88%] rounded-2xl rounded-br-sm bg-orange px-4 py-3 text-base text-white"
                >
                  {m.text}
                </div>
              )
            }
            // Guide message
            if (m.loading) {
              return <ShimmerBubble key={i} />
            }
            return (
              <div
                key={i}
                className="max-w-[88%] rounded-2xl rounded-tl-sm bg-white/10 px-4 py-3 text-base text-white"
              >
                {m.typing ? (
                  <TypewriterText
                    text={m.text}
                    onComplete={() => markTypingDone(i)}
                  />
                ) : (
                  m.text
                )}
              </div>
            )
          })}
        </div>
      </div>

      <footer className="border-t border-white/10 px-5 py-4">
        {/* Context-aware suggested question chips */}
        <div className="mb-3 flex flex-wrap gap-2">
          {suggestions.map((q) => (
            <button
              key={q}
              onClick={() => ask(q, true)}
              className="rounded-full border border-white/25 px-3 py-1.5 text-sm text-white/90 transition hover:bg-white/15"
            >
              {q}
            </button>
          ))}
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            ask(draft)
          }}
          className="flex gap-2"
        >
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder={t(lang, 'askPlaceholder')}
            aria-label={t(lang, 'askPlaceholder')}
            className="min-w-0 flex-1 rounded-full bg-white/95 px-4 py-2.5 text-base text-navy outline-none placeholder:text-navy-lighter"
          />
          <button
            type="submit"
            className="rounded-full bg-white px-5 py-2.5 text-sm font-bold text-navy transition hover:bg-navy-subtle"
          >
            {t(lang, 'send')}
          </button>
        </form>
      </footer>
    </div>
  )
}
