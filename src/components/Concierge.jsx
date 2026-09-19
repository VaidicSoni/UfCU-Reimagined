import { useEffect, useRef, useState, useCallback } from 'react'
import { useOnboarding } from '../context/OnboardingContext.jsx'
import { t } from '../lib/i18n.js'
import { speak, stopSpeaking, ttsSupported, sttSupported, listen } from '../lib/speech.js'
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
  // Which message is being read aloud: 'intro' for the scripted line, or the
  // thread index. Tracking it per message is what lets every response have its
  // own Listen button.
  const [speakingId, setSpeakingId] = useState(null)
  const [speechTick, setSpeechTick] = useState(0)
  const [listening, setListening] = useState(false)
  const stopListenRef = useRef(null)
  const scrollRef = useRef(null)

  const stopSpeech = useCallback(() => {
    stopSpeaking()
    setSpeakingId(null)
  }, [])

  const say = useCallback((text, id) => {
    if (!text) return
    speak(text, lang, {
      onStart: () => setSpeakingId(id),
      onEnd: () => setSpeakingId((cur) => (cur === id ? null : cur)),
      onBoundary: () => setSpeechTick((n) => n + 1),
    })
  }, [lang])

  const toggleMic = useCallback(() => {
    if (listening) {
      stopListenRef.current?.()
      return
    }
    stopSpeech()
    const stop = listen(lang, {
      onResult: (transcript) => setDraft(transcript),
      onEnd: () => {
        setListening(false)
        stopListenRef.current = null
      },
      onError: () => {
        setListening(false)
        stopListenRef.current = null
      },
    })
    if (stop) {
      stopListenRef.current = stop
      setListening(true)
    }
  }, [listening, lang, stopSpeech])

  const ask = useCallback(async (question) => {
    const q = question.trim()
    if (!q) return
    
    // Snapshot history before adding the new question
    const historySnapshot = thread.filter(m => !m.loading && m.text).map(m => ({
      role: m.role === 'guide' ? 'model' : 'user',
      content: m.text
    }))
    
    // RAG answer path (with shimmer) for EVERYTHING
    setThread((prev) => [
      ...prev,
      { role: 'user', text: q },
      { role: 'guide', text: '', loading: true },
    ])
    setDraft('')

    try {
      const answer = await askRag(q, step, focusedField || '', lang, historySnapshot)
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
    setSpeakingId(null)
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

  // One control, reused on the scripted line and on every answer.
  const SpeakButton = ({ id, text }) => {
    const active = speakingId === id
    return (
      <button
        onClick={() => (active ? stopSpeech() : say(text, id))}
        aria-label={active ? t(lang, 'stopMessage') : t(lang, 'playMessage')}
        className="mt-2 inline-flex items-center gap-2 rounded-full bg-white/15 px-3.5 py-1.5 text-sm font-semibold text-white transition hover:bg-white/25"
      >
        {active
          ? <Icon.stop className="h-4 w-4" aria-hidden="true" />
          : <Icon.sound className="h-4 w-4" aria-hidden="true" />}
        {active ? t(lang, 'stop') : t(lang, 'listen')}
      </button>
    )
  }

  return (
    <div className="flex h-full flex-col">
      <header className="flex items-center gap-3 border-b border-white/10 px-5 py-4">
        <Mascot
          brightness={0.32 + 0.68 * (progress.current / progress.total)}
          state={mood}
          size={52}
          face={open}
          speaking={speakingId !== null}
          speechTick={speechTick}
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
        {/* Lumi's scripted guide message for this step — instantly rendered */}
        <div className="rounded-2xl rounded-tl-sm bg-white/10 p-4 text-white">
          <p className="whitespace-pre-wrap text-base leading-relaxed">
            {message}
          </p>
          {ttsSupported() && <SpeakButton id="intro" text={message} />}
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
                className="max-w-[88%] whitespace-pre-wrap rounded-2xl rounded-tl-sm bg-white/10 px-4 py-3 text-base text-white"
              >
                {m.typing ? (
                  <TypewriterText
                    text={m.text}
                    onComplete={() => markTypingDone(i)}
                  />
                ) : (
                  m.text
                )}
                {/* Available while it's still typing: the full text is already
                    known, and someone who wants to listen shouldn't have to
                    wait out an animation first. Block wrapper because the
                    bubble text is a bare string and an inline-flex button
                    would otherwise sit on its last line. */}
                {ttsSupported() && m.text && (
                  <div>
                    <SpeakButton id={i} text={m.text} />
                  </div>
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
            placeholder={listening ? t(lang, 'micListening') : t(lang, 'askPlaceholder')}
            aria-label={t(lang, 'askPlaceholder')}
            className="min-w-0 flex-1 rounded-full bg-white/95 px-4 py-2.5 text-base text-navy outline-none placeholder:text-navy-lighter"
          />
          {/* Dictation. Unsupported browsers get the control disabled with the
              reason, rather than a button that silently does nothing. */}
          <button
            type="button"
            onClick={toggleMic}
            disabled={!sttSupported()}
            aria-pressed={listening}
            aria-label={
              !sttSupported()
                ? t(lang, 'micUnsupported')
                : listening
                  ? t(lang, 'micStop')
                  : t(lang, 'micStart')
            }
            title={!sttSupported() ? t(lang, 'micUnsupported') : undefined}
            className={`shrink-0 rounded-full p-2.5 transition disabled:cursor-not-allowed disabled:opacity-40 ${
              listening
                ? 'bg-orange text-white'
                : 'bg-white/15 text-white hover:bg-white/25'
            }`}
          >
            <Icon.mic className="h-5 w-5" aria-hidden="true" />
          </button>
          <button
            type="submit"
            className="shrink-0 rounded-full bg-white px-5 py-2.5 text-sm font-bold text-navy transition hover:bg-navy-subtle"
          >
            {t(lang, 'send')}
          </button>
        </form>
      </footer>
    </div>
  )
}
