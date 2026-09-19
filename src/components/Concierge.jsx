import { useEffect, useRef, useState } from 'react'
import { useOnboarding } from '../context/OnboardingContext.jsx'
import { t } from '../lib/i18n.js'
import { speak, stopSpeaking, ttsSupported, primeVoices } from '../lib/speech.js'
import { askGuide, suggestionsFor } from '../lib/concierge.js'
import { Mascot } from './Mascot.jsx'
import { Icon } from './Icons.jsx'

// Body of the expanded chat panel. Lumi wears her face here — this is the only
// place she's actually "in use" — and her mouth moves against the speech.
export function Concierge({ message, seed, onClose, open, mood = 'idle' }) {
  const { lang, step, progress, readAloud, setReadAloud } = useOnboarding()
  const [thread, setThread] = useState([])
  const [draft, setDraft] = useState('')
  const [speakingId, setSpeakingId] = useState(null)
  const scrollRef = useRef(null)

  useEffect(() => primeVoices(), [])

  const say = (text, id) => {
    speak(text, lang, {
      onStart: () => setSpeakingId(id),
      onEnd: () => setSpeakingId((cur) => (cur === id ? null : cur)),
    })
  }

  const stop = () => {
    stopSpeaking()
    setSpeakingId(null)
  }

  const ask = (question) => {
    const q = question.trim()
    if (!q) return
    const answer = askGuide(q, lang)
    const id = `a-${Date.now()}`
    setThread((prev) => [...prev, { role: 'user', text: q }, { role: 'guide', text: answer, id }])
    setDraft('')
    if (readAloud) say(answer, id)
  }

  // A chip tapped on the dock arrives here as a seed and asks itself.
  useEffect(() => {
    if (seed?.text && open) ask(seed.text)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [seed?.at])

  // A new step means a new scripted line — clear the side conversation.
  useEffect(() => {
    setThread([])
    stop()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [message])

  // Reading the step's own line aloud is the main win for anyone who'd rather
  // listen than read, so it fires on open and on every step change.
  useEffect(() => {
    if (open && readAloud) say(message, 'intro')
    if (!open) stop()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, message, readAloud])

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [thread])

  const isSpeaking = speakingId !== null

  const SpeakButton = ({ id, text, label = false }) => {
    const active = speakingId === id
    return (
      <button
        onClick={() => (active ? stop() : say(text, id))}
        aria-label={active ? t(lang, 'stopMessage') : t(lang, 'playMessage')}
        className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1.5 text-sm font-semibold text-white transition hover:bg-white/25"
      >
        {active
          ? <Icon.stop className="h-4 w-4" aria-hidden="true" />
          : <Icon.sound className="h-4 w-4" aria-hidden="true" />}
        {label && (active ? t(lang, 'stop') : t(lang, 'listen'))}
      </button>
    )
  }

  return (
    <div className="flex h-full flex-col">
      <header className="flex items-center gap-3 border-b border-white/10 px-5 py-4">
        <Mascot
          brightness={0.32 + 0.68 * (progress.current / progress.total)}
          state={mood}
          size={64}
          face={open}
          speaking={isSpeaking}
          intro={false}
          className="shrink-0"
        />
        <div className="flex-1">
          <p className="text-base font-extrabold text-white">Lumi</p>
          <p className="text-xs text-navy-subtle">
            {isSpeaking ? t(lang, 'readAloudOn') : t(lang, 'guide')}
          </p>
        </div>
        <button
          onClick={onClose}
          aria-label={lang === 'es' ? 'Cerrar' : 'Close'}
          className="rounded-full p-2 text-white/70 transition hover:bg-white/15 hover:text-white"
        >
          <Icon.close className="h-5 w-5" aria-hidden="true" />
        </button>
      </header>

      {/* Read-aloud lives at the top of the panel, not buried in a menu —
          it's the control most likely to be wanted by the people who need it. */}
      {ttsSupported() && (
        <div className="border-b border-white/10 px-5 py-3">
          <button
            onClick={() => {
              if (readAloud) stop()
              setReadAloud(!readAloud)
            }}
            aria-pressed={readAloud}
            className={`flex w-full items-center gap-3 rounded-full px-4 py-2.5 text-sm font-bold transition ${
              readAloud ? 'bg-orange text-white' : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            <Icon.sound className="h-5 w-5 shrink-0" aria-hidden="true" />
            <span className="flex-1 text-left">{t(lang, 'readAloud')}</span>
            <span
              aria-hidden="true"
              className={`flex h-6 w-11 items-center rounded-full p-0.5 transition ${
                readAloud ? 'bg-white/35' : 'bg-white/20'
              }`}
            >
              <span
                className={`h-5 w-5 rounded-full bg-white transition-transform ${
                  readAloud ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </span>
          </button>
        </div>
      )}

      <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto px-5 py-4">
        <div className="rounded-2xl rounded-tl-sm bg-white/10 p-4 text-white">
          <p className="text-base leading-relaxed">{message}</p>
          {ttsSupported() && (
            <div className="mt-3">
              <SpeakButton id="intro" text={message} label />
            </div>
          )}
        </div>

        <div className="space-y-3" aria-live="polite">
          {thread.map((m, i) => (
            <div
              key={i}
              className={`max-w-[88%] rounded-2xl px-4 py-3 text-base ${
                m.role === 'user'
                  ? 'ml-auto rounded-br-sm bg-orange text-white'
                  : 'rounded-tl-sm bg-white/10 text-white'
              }`}
            >
              <p>{m.text}</p>
              {m.role === 'guide' && ttsSupported() && (
                <div className="mt-2">
                  <SpeakButton id={m.id} text={m.text} />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <footer className="border-t border-white/10 px-5 py-4">
        <div className="mb-3 flex flex-wrap gap-2">
          {suggestionsFor(step, lang).map((q) => (
            <button
              key={q}
              onClick={() => ask(q)}
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
