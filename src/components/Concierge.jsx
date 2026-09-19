import { useEffect, useRef, useState } from 'react'
import { useOnboarding } from '../context/OnboardingContext.jsx'
import { t } from '../lib/i18n.js'
import { speak, stopSpeaking, ttsSupported } from '../lib/speech.js'
import { askGuide, SUGGESTED } from '../lib/concierge.js'
import { Mascot } from './Mascot.jsx'
import { Icon } from './Icons.jsx'

// Body of the expanded chat panel. Lumi lives in the corner dock; this is what
// grows out of her when a question is asked.
export function Concierge({ message, seed, onClose, mood = 'idle' }) {
  const { lang, progress } = useOnboarding()
  const [thread, setThread] = useState([])
  const [draft, setDraft] = useState('')
  const [speaking, setSpeaking] = useState(false)
  const scrollRef = useRef(null)

  const ask = (question) => {
    const q = question.trim()
    if (!q) return
    setThread((prev) => [
      ...prev,
      { role: 'user', text: q },
      { role: 'guide', text: askGuide(q, lang) },
    ])
    setDraft('')
  }

  // A chip tapped on the dock arrives here as a seed and asks itself.
  useEffect(() => {
    if (seed?.text) ask(seed.text)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [seed?.at])

  // A new step means a new scripted line — clear the side conversation.
  useEffect(() => {
    setThread([])
    stopSpeaking()
    setSpeaking(false)
  }, [message])

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [thread])

  const toggleSpeech = () => {
    if (speaking) {
      stopSpeaking()
      setSpeaking(false)
      return
    }
    const latest = thread.filter((m) => m.role === 'guide').slice(-1)[0]
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
        <div className="rounded-2xl rounded-tl-sm bg-white/10 p-4 text-white">
          <p className="text-base leading-relaxed">{message}</p>
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
              {m.text}
            </div>
          ))}
        </div>
      </div>

      <footer className="border-t border-white/10 px-5 py-4">
        <div className="mb-3 flex flex-wrap gap-2">
          {SUGGESTED[lang].map((q) => (
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
