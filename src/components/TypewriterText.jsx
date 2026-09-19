import { useEffect, useRef, useState } from 'react'

// Renders text one character at a time, like a real-time chat reply.
// Speed is tuned to feel responsive without being annoyingly slow.
const CHAR_MS = 25 // milliseconds per character

export function TypewriterText({ text, onComplete, className = '' }) {
  const [displayed, setDisplayed] = useState('')
  const [done, setDone] = useState(false)
  const indexRef = useRef(0)
  const charsRef = useRef([])
  const onCompleteRef = useRef(onComplete)

  // Keep callback ref updated
  useEffect(() => {
    onCompleteRef.current = onComplete
  }, [onComplete])

  // Reset when text changes
  useEffect(() => {
    charsRef.current = Array.from(text)
    indexRef.current = 0
    setDisplayed('')
    setDone(false)
  }, [text])

  useEffect(() => {
    if (done) return
    const interval = setInterval(() => {
      indexRef.current += 1
      const next = charsRef.current.slice(0, indexRef.current).join('')
      setDisplayed(next)

      if (indexRef.current >= charsRef.current.length) {
        clearInterval(interval)
        setDone(true)
        onCompleteRef.current?.()
      }
    }, CHAR_MS)

    return () => clearInterval(interval)
  }, [done])

  return (
    <span className={className}>
      {displayed}
      {!done && <span className="typewriter-cursor" aria-hidden="true">|</span>}
    </span>
  )
}
