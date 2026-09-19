// Native Web Speech API — no external TTS service, works fully offline.
// Drives the read-aloud feature and Lumi's mouth animation.

export const ttsSupported = () =>
  typeof window !== 'undefined' && 'speechSynthesis' in window

// Prefer a warm, mature voice for Lumi; fall back to the browser default.
function pickVoice(lang) {
  const voices = window.speechSynthesis.getVoices()
  if (!voices.length) return null
  const prefix = lang === 'es' ? 'es' : 'en'
  const preferred = ['Samantha', 'Karen', 'Moira', 'Google US English', 'Mónica']
  return (
    voices.find((v) => v.lang.startsWith(prefix) && preferred.includes(v.name)) ||
    voices.find((v) => v.lang.startsWith(prefix)) ||
    voices[0]
  )
}

// `onStart`/`onEnd` fire from the utterance itself rather than being assumed by
// the caller, so "is Lumi talking" stays true even when speech ends on its own.
export function speak(text, lang = 'en', { onStart, onEnd } = {}) {
  if (!ttsSupported() || !text) {
    onEnd?.()
    return
  }
  window.speechSynthesis.cancel()

  const utterance = new SpeechSynthesisUtterance(text)
  const voice = pickVoice(lang)
  if (voice) utterance.voice = voice
  utterance.lang = lang === 'es' ? 'es-US' : 'en-US'
  // A little under natural pace — this flow is read by people of every age.
  utterance.rate = 0.94

  utterance.onstart = () => onStart?.()
  utterance.onend = () => onEnd?.()
  utterance.onerror = () => onEnd?.()

  window.speechSynthesis.speak(utterance)
}

export function stopSpeaking() {
  if (ttsSupported()) window.speechSynthesis.cancel()
}

// Voices load asynchronously in some browsers; warm them up early so the first
// click doesn't fall back to a robotic default.
export function primeVoices() {
  if (!ttsSupported()) return
  window.speechSynthesis.getVoices()
  window.speechSynthesis.onvoiceschanged = () => window.speechSynthesis.getVoices()
}
