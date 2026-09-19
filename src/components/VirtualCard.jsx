import { useOnboarding } from '../context/OnboardingContext.jsx'
import { t } from '../lib/i18n.js'
import { Icon } from './Icons.jsx'
import { UNIVERSITIES } from '../lib/mockApi.js'
import { useState, useRef } from 'react'

export function VirtualCard({ hidden, revealed, onToggle }) {
  const { lang, form } = useOnboarding()
  const holder = `${form.firstName || 'New'} ${form.lastName || 'Member'}`.trim()
  
  const uni = UNIVERSITIES.find(u => u.id === form.university) || UNIVERSITIES[0]
  const isCustomCard = uni.id === 'ut' || uni.id === 'txst'
  const cardImage = uni.id === 'ut' ? '/cards/uta.png' : (uni.id === 'txst' ? '/cards/txst.png' : null)

  const [tilt, setTilt] = useState({ rx: 0, ry: 0 })
  const cardRef = useRef(null)

  const handleMouseMove = (e) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const centerX = rect.width / 2
    const centerY = rect.height / 2
    
    // Max rotation 10 degrees
    const rotateX = ((centerY - y) / centerY) * 10
    const rotateY = ((x - centerX) / centerX) * 10
    
    setTilt({ rx: rotateX, ry: rotateY })
  }

  const handleMouseLeave = () => {
    setTilt({ rx: 0, ry: 0 })
  }

  return (
    <section
      aria-label={t(lang, 'virtualCard')}
      className="u-card overflow-hidden border-2 border-navy-subtle bg-white"
    >
      <div 
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="p-4 [perspective:1000px]"
      >
        <div 
          className="relative aspect-[1.586] overflow-hidden rounded-xl shadow-lg transition-transform duration-200 ease-out"
          style={{
            transform: `rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg)`,
            transformStyle: 'preserve-3d'
          }}
        >
          {/* Shimmer effect */}
          <div className="absolute inset-0 z-20 pointer-events-none overflow-hidden rounded-xl">
            <div className="absolute inset-0 -translate-x-full animate-[shimmer_2.5s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
          </div>

          <img src={cardImage || '/cards/default.png'} alt={`${uni.name} Card`} className="absolute inset-0 h-full w-full object-contain" />

          <div className="relative z-10 flex h-full flex-col justify-between p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[0.65rem] font-bold uppercase tracking-[0.18em] text-white/80 drop-shadow-md">
                  {t(lang, 'cardDebit')}
                </p>
                <p className="mt-1 inline-flex items-center gap-1.5 text-sm font-bold text-emerald-300 drop-shadow-md">
                  <span aria-hidden="true">●</span> {t(lang, 'cardActive')}
                </p>
              </div>
            </div>

            <div>
              <p className="font-mono text-lg font-semibold tracking-[0.16em] text-white drop-shadow-md">
                {hidden ? '•••• •••• •••• ••••' : revealed ? '4821 7734 0192 4721' : '•••• •••• •••• 4721'}
              </p>

              <div className="mt-4 flex items-end justify-between gap-4">
                <div>
                  <p className="text-[0.6rem] font-bold uppercase tracking-[0.18em] text-white/80 drop-shadow-md">
                    {t(lang, 'cardHolder')}
                  </p>
                  <p className="mt-0.5 text-sm font-bold uppercase text-white drop-shadow-md">{holder}</p>
                </div>
                <div className="text-right">
                  <p className="text-[0.6rem] font-bold uppercase tracking-[0.18em] text-white/80 drop-shadow-md">
                    {t(lang, 'cardExpires')}
                  </p>
                  <p className="mt-0.5 text-sm font-bold text-white drop-shadow-md">09/30</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 pt-0">
        <button
          onClick={onToggle}
          aria-pressed={revealed}
          disabled={hidden}
          className="inline-flex w-full items-center justify-center gap-2 rounded-full border-2 border-navy-subtle px-4 py-2.5 text-sm font-bold text-navy transition hover:bg-navy-subtle/40 disabled:opacity-40"
        >
          <Icon.eye className="h-4 w-4" aria-hidden="true" />
          {revealed ? t(lang, 'hideNumber') : t(lang, 'revealNumber')}
        </button>
      </div>
    </section>
  )
}
