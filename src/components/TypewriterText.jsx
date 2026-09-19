import { useEffect, useRef, useState } from 'react'

// Renders text one character at a time, like a real-time chat reply.
// Speed is tuned to feel responsive without being annoyingly slow.
const CHAR_MS = 25 // milliseconds per character

export function TypewriterText({ text, onComplete, className = '' }) {
  const [displayed, setDisplayed] = useState('')
  const [done, setDone] = useState(false)
  const indexRef = useRef(0)
  const textRef = useRef(text)

  // Reset when text changes
  useEffect(() => {
    textRef.current = text
    indexRef.current = 0
    setDisplayed('')
    setDone(false)
  }, [text])

  useEffect(() => {
    if (done) return
    const interval = setInterval(() => {
      indexRef.current += 1
      const next = textRef.current.slice(0, indexRef.current)
      setDisplayed(next)

      if (indexRef.current >= textRef.current.length) {
        clearInterval(interval)
        setDone(true)
        onComplete?.()
      }
    }, CHAR_MS)

    return () => clearInterval(interval)
  }, [text, done, onComplete])

  return (
    <span className={className}>
      {displayed}
      {!done && <span className="typewriter-cursor" aria-hidden="true">|</span>}
    </span>
  )
}
