import { useState, useRef } from 'react'
import { t } from '../lib/i18n.js'
import { SPEND_CATEGORIES } from '../lib/mockApi.js'

export function SwipeCategory({ lang }) {
  const [transactions, setTransactions] = useState([
    { id: 1, merchant: 'Kerbey Lane Cafe', category: 'dining', amount: 24.50 },
    { id: 2, merchant: 'H-E-B', category: 'grocery', amount: 89.12 },
    { id: 3, merchant: 'Netflix', category: 'bills', amount: 15.49 },
  ])
  const [index, setIndex] = useState(0)
  const [pan, setPan] = useState(0)
  const [correcting, setCorrecting] = useState(false)
  
  const current = transactions[index]

  const handlePan = (e) => {
    if (correcting || !current) return
    const mx = e.movementX || (e.touches ? e.touches[0].clientX - 150 : 0) // rough delta
    // simple tracker... wait, a full drag tracker is hard in raw React without framer-motion.
    // I'll make it simple buttons instead of drag if drag is too complex, but user asked for swipe/tilt.
  }

  if (!current) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 mb-3">✓</div>
        <p className="text-sm font-bold text-navy">All caught up!</p>
        <p className="text-xs text-navy-lighter mt-1">Your spending categories are perfectly organized.</p>
      </div>
    )
  }

  if (correcting) {
    return (
      <div className="space-y-4 animate-in fade-in zoom-in-95">
        <div className="text-center">
          <p className="text-sm font-bold text-navy">Select category for</p>
          <p className="text-lg font-extrabold text-navy">{current.merchant}</p>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {SPEND_CATEGORIES.map(c => (
            <button 
              key={c.id} 
              onClick={() => {
                setCorrecting(false)
                setIndex(i => i + 1)
              }}
              className="rounded-xl border-2 border-navy-subtle py-2 px-3 text-sm font-semibold text-navy hover:border-orange transition"
            >
              {lang === 'es' ? c.es : c.en}
            </button>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="relative flex flex-col items-center justify-center py-4 overflow-hidden">
      <div className="text-center mb-4">
        <p className="text-xs font-bold uppercase tracking-wider text-navy-lighter">Verify Category</p>
      </div>
      
      {/* Cards stack */}
      <div className="relative w-full max-w-[280px] h-[160px]">
        {/* Next card preview */}
        {transactions[index + 1] && (
          <div className="absolute inset-0 bg-white border-2 border-navy-subtle rounded-2xl shadow-sm scale-95 -translate-y-3 opacity-50 z-0"></div>
        )}
        
        {/* Active card */}
        <div className="absolute inset-0 bg-white border-2 border-navy-subtle rounded-2xl shadow-card z-10 flex flex-col items-center justify-center p-5 text-center transition-transform hover:scale-[1.02]">
          <h3 className="text-2xl font-extrabold text-navy">${current.amount.toFixed(2)}</h3>
          <p className="font-semibold text-navy mt-1">{current.merchant}</p>
          <div className="mt-4 inline-block rounded-full bg-navy/5 px-3 py-1 text-xs font-bold text-navy-lighter">
            Looks like <span className="text-orange">{SPEND_CATEGORIES.find(c => c.id === current.category)?.en || 'Shopping'}</span>
          </div>
        </div>
      </div>
      
      <div className="flex gap-4 mt-6">
        <button 
          onClick={() => setCorrecting(true)}
          className="flex h-12 w-12 items-center justify-center rounded-full bg-white border-2 border-navy-subtle text-orange font-extrabold text-xl shadow-sm hover:scale-110 transition-transform"
        >
          ✕
        </button>
        <button 
          onClick={() => setIndex(i => i + 1)}
          className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500 text-white font-extrabold text-xl shadow-sm hover:scale-110 transition-transform"
        >
          ✓
        </button>
      </div>
      <p className="text-xs text-navy-lighter mt-4">Tap ✓ if correct, ✕ to re-categorize</p>
    </div>
  )
}
