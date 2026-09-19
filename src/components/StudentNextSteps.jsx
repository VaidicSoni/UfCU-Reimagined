import { useState } from 'react'

export function StudentNextSteps() {
  const [activeModal, setActiveModal] = useState(null)

  const steps = [
    { id: 'goals', title: 'Financial Goals', desc: 'Plan your future', icon: '📈', color: 'bg-blue-500' },
    { id: 'budget', title: 'Start My Budget', desc: 'Quick and easy setup', icon: '🧾', color: 'bg-indigo-500' },
    { id: 'credit', title: 'Credit Report', desc: 'Activate your free report', icon: '⏱️', color: 'bg-orange-500' },
    { id: 'quiz', title: "Let's talk money", desc: '5 questions quiz', icon: '☎️', color: 'bg-emerald-500' },
  ]

  return (
    <>
      <section className="bg-[#1C1C1E] rounded-2xl p-5 sm:p-6 shadow-card border border-[#3A3A3C]">
        <h2 className="text-sm font-extrabold uppercase tracking-widest text-gray-400 mb-4">Explore Features</h2>
        <div className="grid grid-cols-2 gap-3">
          {steps.map(step => (
            <button 
              key={step.id}
              onClick={() => setActiveModal(step.id)}
              className="flex flex-col items-start gap-2 bg-[#2C2C2E] p-4 rounded-xl text-left border border-transparent hover:border-[#3A3A3C] transition-all hover:bg-[#3A3A3C]/50"
            >
              <div className={`h-10 w-10 rounded-full ${step.color} flex items-center justify-center text-xl shadow-inner`}>
                {step.icon}
              </div>
              <div>
                <h3 className="text-sm font-bold text-white mt-1">{step.title}</h3>
                <p className="text-xs text-gray-400 font-semibold mt-0.5">{step.desc}</p>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Modal Overlays based on activeModal */}
      {activeModal === 'goals' && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-sm bg-[#1C1C1E] rounded-3xl p-6 shadow-2xl border border-[#3A3A3C] animate-in slide-in-from-bottom-8 relative">
            <button onClick={() => setActiveModal(null)} className="absolute top-4 right-4 text-gray-400 hover:text-white">✕</button>
            
            <div className="bg-white rounded-3xl p-6 mb-8 text-center mt-4">
              <div className="text-2xl font-bold text-navy mb-2">$80 / month</div>
              <div className="inline-block bg-black text-white text-xs font-bold px-3 py-1 rounded-full mb-6">is a great place to start ✓</div>
              
              {/* Fake visualizer */}
              <div className="flex items-end justify-center gap-1 h-12 mb-6">
                {[...Array(15)].map((_, i) => (
                  <div key={i} className={`w-1.5 rounded-full ${i === 7 ? 'h-full bg-red-500' : 'h-1/2 bg-red-500/20'}`}></div>
                ))}
              </div>
              
              <div className="bg-gray-100 rounded-2xl py-3 text-sm font-semibold text-gray-600">
                📅 Jan. 2026 Completion Date
              </div>
            </div>

            <h2 className="text-3xl font-bold text-white text-center mb-3">A plan you can stick with</h2>
            <p className="text-gray-400 text-center mb-8">Set a reasonable target date based on how much you save each month.</p>
            
            <div className="flex justify-center gap-2 mb-8">
              <div className="w-2 h-2 rounded-full bg-gray-600"></div>
              <div className="w-2 h-2 rounded-full bg-white"></div>
              <div className="w-2 h-2 rounded-full bg-gray-600"></div>
            </div>

            <button onClick={() => setActiveModal(null)} className="w-full bg-white text-black font-bold text-lg py-4 rounded-full hover:bg-gray-200 transition">
              Continue
            </button>
          </div>
        </div>
      )}

      {activeModal === 'quiz' && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-sm bg-[#1C1C1E] rounded-3xl p-6 shadow-2xl border border-[#3A3A3C] animate-in slide-in-from-bottom-8 relative">
            <button onClick={() => setActiveModal(null)} className="absolute top-4 right-4 text-gray-400 hover:text-white">✕</button>
            
            <div className="text-center mt-4 mb-6">
              <div className="text-7xl mb-4 relative inline-block">
                ☎️
                <span className="absolute -bottom-2 -right-4 text-3xl">🪙</span>
              </div>
              <div className="inline-block bg-[#3A3A3C] text-gray-300 text-xs font-bold px-3 py-1.5 rounded-full border border-gray-600 mb-2">
                ✎ 5 questions
              </div>
            </div>

            <h2 className="text-3xl font-bold text-white mb-6">Let's talk money</h2>
            
            <ul className="space-y-6 mb-8 text-gray-300 font-medium">
              <li className="flex gap-4 items-start">
                <span className="text-gray-500 mt-1">🔗</span>
                <p>Before beginning, link all your financial accounts to ensure accurate data</p>
                <span className="ml-auto text-gray-500">›</span>
              </li>
              <li className="flex gap-4 items-start">
                <span className="text-gray-500 mt-1">❓</span>
                <p>Test your knowledge of your current and past spending</p>
              </li>
              <li className="flex gap-4 items-start">
                <span className="text-gray-500 mt-1">📊</span>
                <p>We'll let you know how you're doing and recommend tools to aid your financial journey</p>
              </li>
            </ul>

            <button onClick={() => setActiveModal(null)} className="w-full bg-white text-black font-bold text-lg py-4 rounded-full hover:bg-gray-200 transition">
              Start quiz
            </button>
          </div>
        </div>
      )}

      {activeModal === 'credit' && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-sm bg-[#1C1C1E] rounded-3xl p-6 shadow-2xl border border-[#3A3A3C] animate-in slide-in-from-bottom-8 relative">
            <button onClick={() => setActiveModal(null)} className="absolute top-4 right-4 text-gray-400 hover:text-white">✕</button>
            
            <div className="flex justify-center mt-6 mb-8">
              <div className="w-32 h-20 relative overflow-hidden flex items-end justify-center">
                 <div className="w-32 h-32 rounded-full border-[12px] border-l-red-400 border-t-yellow-400 border-r-emerald-400 border-b-transparent relative rotate-45"></div>
                 <div className="absolute bottom-0 w-4 h-16 bg-gray-300 rounded-full origin-bottom -rotate-[30deg]"></div>
                 <div className="absolute bottom-[-10px] w-8 h-8 rounded-full bg-white shadow-lg flex items-center justify-center text-xs">❌</div>
              </div>
            </div>

            <h2 className="text-3xl font-bold text-white text-center mb-3">Activate your free Credit Report</h2>
            <p className="text-gray-400 text-center mb-8">Improving your credit score can save you thousands over time.</p>
            
            <ul className="space-y-6 mb-8 text-gray-300 font-medium">
              <li className="flex gap-4 items-center border-b border-[#3A3A3C] pb-4">
                <span className="text-gray-500">⏱️</span>
                <p>See what's impacting your score.</p>
              </li>
              <li className="flex gap-4 items-center border-b border-[#3A3A3C] pb-4">
                <span className="text-gray-500">📄</span>
                <p>Monitor your report for changes.</p>
              </li>
              <li className="flex gap-4 items-center">
                <span className="text-gray-500">📈</span>
                <p>Get tips to improve your score over time.</p>
              </li>
            </ul>

            <button onClick={() => setActiveModal(null)} className="w-full bg-white text-black font-bold text-lg py-4 rounded-full hover:bg-gray-200 transition">
              Continue
            </button>
            <p className="text-center text-xs text-gray-500 mt-4">Don't worry, activating your credit report will not directly impact your score</p>
          </div>
        </div>
      )}

      {activeModal === 'budget' && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-sm bg-[#1C1C1E] rounded-3xl p-6 shadow-2xl border border-[#3A3A3C] animate-in slide-in-from-bottom-8 relative h-[600px] flex flex-col">
            <button onClick={() => setActiveModal(null)} className="absolute top-4 right-4 text-gray-400 hover:text-white">✕</button>
            
            <div className="flex-1 flex flex-col justify-center">
              <div className="text-8xl mb-8 relative">
                🧾
                <span className="absolute top-0 right-16 text-5xl bg-[#A59F8B] rounded-full p-2 border-4 border-[#1C1C1E] drop-shadow-xl text-black">💲</span>
              </div>

              <h2 className="text-3xl font-bold text-white mb-4">Setting up your budget is quick and easy.</h2>
              <p className="text-gray-400 text-base leading-relaxed">
                Your budget is the foundation for planning your spending and reaching your goals. Don't worry, we'll guide you through it!
              </p>
            </div>

            <button onClick={() => setActiveModal(null)} className="w-full bg-white text-black font-bold text-lg py-4 rounded-full hover:bg-gray-200 transition mt-auto">
              Start My Budget
            </button>
          </div>
        </div>
      )}
    </>
  )
}
