// Native Web Speech API — no external TTS service, works fully offline.
// Backs the speaker icon on every Concierge dialogue bubble.

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

export function speak(text, lang = 'en') {
  if (!ttsSupported()) return
  window.speechSynthesis.cancel()
  const utterance = new SpeechSynthesisUtterance(text)
  const voice = pickVoice(lang)
  if (voice) utterance.voice = voice
  utterance.lang = lang === 'es' ? 'es-US' : 'en-US'
  utterance.rate = 0.98
  window.speechSynthesis.speak(utterance)
}

export function stopSpeaking() {
  if (ttsSupported()) window.speechSynthesis.cancel()
}
