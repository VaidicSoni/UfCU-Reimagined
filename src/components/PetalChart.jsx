import { useMemo, useState } from 'react'

const COLORS = ['#117ACA', '#E31837', '#00447C', '#EF6820', '#CDCDE0']
const ICONS = ['checking', 'savings', 'auto', 'credit', 'invest']

export function PetalChart({ accounts = [] }) {
  const [active, setActive] = useState(null)
  
  // Normalize balances so the largest petal fills the radius
  const maxBalance = Math.max(...accounts.map(a => a.balance), 1)
  
  const petals = useMemo(() => {
    return accounts.map((acc, i) => {
      const angle = (i * 360) / accounts.length
      const radiusPct = Math.max(0.3, Math.sqrt(acc.balance / maxBalance)) // min 30% radius so it's clickable
      const color = COLORS[i % COLORS.length]
      return { ...acc, angle, radiusPct, color, index: i }
    })
  }, [accounts, maxBalance])
  
  // Draw a petal pointing UP (angle 0), we will rotate it in the SVG
  // A petal is roughly a teardrop shape
  const drawPetal = (radius) => {
    // r is the max extension (0 to 100)
    const r = radius * 100
    return `M 0,0 C -${r*0.4},-${r*0.3} -${r*0.5},-${r} 0,-${r} C ${r*0.5},-${r} ${r*0.4},-${r*0.3} 0,0 Z`
  }

  if (accounts.length === 0) return null

  const activeAcc = active !== null ? petals[active] : null

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-64 h-64">
        <svg viewBox="-120 -120 240 240" className="w-full h-full drop-shadow-md">
          {petals.map((p) => {
            const isActive = active === null || active === p.index
            return (
              <g 
                key={p.key} 
                transform={`rotate(${p.angle})`} 
                onClick={() => setActive(active === p.index ? null : p.index)}
                className="cursor-pointer transition-all duration-300 ease-out origin-center"
                style={{
                  opacity: isActive ? 1 : 0.2,
                  transform: `rotate(${p.angle}deg) scale(${isActive ? 1.05 : 0.95})`
                }}
              >
                <path 
                  d={drawPetal(p.radiusPct)} 
                  fill={p.color} 
                  stroke="#fff" 
                  strokeWidth="2"
                  className="transition-colors duration-300"
                />
              </g>
            )
          })}
          {/* Inner circle hole */}
          <circle cx="0" cy="0" r="15" fill="#23335D" />
        </svg>
      </div>
      
      <div className="mt-2 text-center min-h-[4rem]">
        {activeAcc ? (
          <div className="animate-in fade-in slide-in-from-bottom-2">
            <p className="text-xl font-extrabold text-navy" style={{ color: activeAcc.color }}>
              ${activeAcc.balance.toLocaleString('en-US', {minimumFractionDigits: 2})}
            </p>
            <p className="text-sm font-bold text-navy-lighter">{activeAcc.label}</p>
          </div>
        ) : (
          <div className="text-navy-lighter text-sm font-semibold">
            Tap a petal to view account balance
          </div>
        )}
      </div>
    </div>
  )
}
