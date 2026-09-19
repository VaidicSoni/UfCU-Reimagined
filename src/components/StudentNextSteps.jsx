import { useState } from 'react'

export function StudentNextSteps() {
  const [activeModal, setActiveModal] = useState(null)
  const [goalSlide, setGoalSlide] = useState(0)

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
          <div className="w-full max-w-sm bg-[#1C1C1E] rounded-3xl p-6 shadow-2xl border border-[#3A3A3C] animate-in slide-in-from-bottom-8 relative h-[600px] flex flex-col">
            <button onClick={() => setActiveModal(null)} className="absolute top-4 right-4 text-gray-400 hover:text-white z-10">✕</button>
            
            <div className="flex-1 flex flex-col justify-center transition-opacity duration-300">
              {goalSlide === 0 && (
                <div className="animate-in fade-in slide-in-from-right-4">
                  <div className="bg-white rounded-3xl p-6 mb-8 mt-4 relative overflow-hidden h-48">
                    {/* Fake line chart */}
                    <div className="absolute right-4 top-4 text-xs font-bold text-red-900">$2K</div>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-red-900">$1.5K</div>
                    <div className="absolute right-4 bottom-4 text-xs font-bold text-red-900">$1K</div>
                    <div className="absolute right-4 bottom-[-8px] text-xs font-bold text-red-900">$0</div>
                    
                    <div className="absolute left-6 top-8 bg-[#5E5CE6] text-white text-xs font-bold px-3 py-1.5 rounded-xl z-10 flex items-center">
                      $1,800 Target
                      <div className="absolute -right-1 top-1/2 -translate-y-1/2 w-2 h-2 bg-[#5E5CE6] rotate-45"></div>
                    </div>
                    
                    <div className="absolute left-32 right-12 top-[38px] border-t-2 border-dashed border-[#5E5CE6]"></div>
                    
                    {/* SVG Line Graph */}
                    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                      <path d="M -10,100 C 10,80 20,80 30,70 C 40,60 45,60 55,40 C 65,20 70,25 75,25" fill="none" stroke="#7E7CF6" strokeWidth="4" strokeLinecap="round" />
                      <path d="M -10,100 C 10,80 20,80 30,70 C 40,60 45,60 55,40 C 65,20 70,25 75,25 L 75,100 L -10,100 Z" fill="#F0F3FF" opacity="0.6" />
                      <circle cx="75" cy="25" r="4" fill="white" stroke="#7E7CF6" strokeWidth="3" />
                    </svg>
                  </div>
                  <h2 className="text-3xl font-bold text-white text-center mb-3">Plan your future with Financial Goals</h2>
                  <p className="text-gray-400 text-center mb-8">Track your progress over time and always know what's next.</p>
                </div>
              )}

              {goalSlide === 1 && (
                <div className="animate-in fade-in slide-in-from-right-4">
                  <div className="bg-white rounded-3xl p-6 mb-8 text-center mt-4 h-48 flex flex-col justify-center">
                    <div className="text-2xl font-bold text-navy mb-2">$80 / month</div>
                    <div className="inline-block bg-black text-white text-xs font-bold px-3 py-1 rounded-full mb-6 relative">
                      is a great place to start ✓
                      <div className="absolute left-1/2 -bottom-1 -translate-x-1/2 w-2 h-2 bg-black rotate-45"></div>
                    </div>
                    
                    {/* Fake visualizer */}
                    <div className="flex items-end justify-center gap-1 h-10 mb-4">
                      {[...Array(20)].map((_, i) => (
                        <div key={i} className={`w-1.5 rounded-full ${i === 10 ? 'h-full bg-red-500' : 'h-1/2 bg-red-500/20'}`}></div>
                      ))}
                    </div>
                    
                    <div className="bg-gray-100 rounded-2xl py-2 text-sm font-semibold text-gray-600">
                      📅 Jan. 2026 Completion Date
                    </div>
                  </div>
                  <h2 className="text-3xl font-bold text-white text-center mb-3">A plan you can stick with</h2>
                  <p className="text-gray-400 text-center mb-8">Set a reasonable target date based on how much you save each month.</p>
                </div>
              )}

              {goalSlide === 2 && (
                <div className="animate-in fade-in slide-in-from-right-4">
                  <div className="bg-white rounded-3xl p-6 mb-8 mt-4 relative overflow-hidden h-48 flex items-center justify-center">
                    {/* Hexagons background */}
                    <div className="absolute inset-0 bg-[#FFF0F2] flex flex-wrap gap-1 opacity-80 -skew-x-12 scale-110">
                      <div className="w-20 h-20 bg-red-100 rounded-xl flex items-center justify-center text-4xl text-red-300 font-bold">50</div>
                      <div className="w-20 h-20 bg-red-100 rounded-xl flex items-center justify-center text-4xl">🌱</div>
                      <div className="w-20 h-20 bg-red-100 rounded-xl flex items-center justify-center text-4xl">🚀</div>
                      <div className="w-20 h-20 bg-red-100 rounded-xl flex items-center justify-center text-4xl text-red-300 font-bold">75</div>
                    </div>
                    {/* Main Hexagon Badge */}
                    <div className="relative z-10 w-28 h-28 bg-[#DD3340] flex items-center justify-center shadow-lg" style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }}>
                      <div className="w-16 h-16 border-4 border-white rounded-full flex items-center justify-center text-4xl">
                        🔥
                      </div>
                    </div>
                  </div>
                  <h2 className="text-3xl font-bold text-white text-center mb-3 leading-tight">Celebrate progress with milestones</h2>
                  <p className="text-gray-400 text-center mb-8">Break down your goals into smaller milestones that celebrate success.</p>
                </div>
              )}

              {goalSlide === 3 && (
                <div className="animate-in fade-in slide-in-from-right-4">
                  <div className="bg-white rounded-3xl p-6 mb-8 mt-4 relative overflow-hidden h-48">
                    <div className="bg-[#F0F3FF] rounded-2xl p-3 flex items-center gap-3 w-max mx-auto relative z-10 shadow-sm">
                      <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-gray-500 font-bold text-xs shadow-sm">$</div>
                      <span className="text-sm font-semibold text-navy">You have an upcoming smart transfer of $37</span>
                    </div>
                    
                    {/* Fake line chart */}
                    <div className="absolute left-6 right-6 bottom-8 border-t border-dashed border-gray-400"></div>
                    <div className="absolute left-6 right-6 bottom-2 flex justify-between text-[10px] font-bold text-gray-400">
                      <span>1st</span>
                      <span>5th</span>
                      <span>10th</span>
                    </div>
                    
                    {/* SVG Line Graph */}
                    <svg className="absolute inset-0 w-full h-[calc(100%-40px)] mt-10" viewBox="0 0 100 100" preserveAspectRatio="none">
                      <path d="M 5,80 L 20,80 C 25,80 30,50 35,50 L 50,50 C 55,50 60,30 65,30 L 80,30" fill="none" stroke="#7E7CF6" strokeWidth="3" strokeLinecap="round" />
                      <circle cx="20" cy="80" r="3" fill="white" stroke="#7E7CF6" strokeWidth="2" />
                      <circle cx="50" cy="50" r="3" fill="white" stroke="#7E7CF6" strokeWidth="2" />
                      
                      {/* Pulse effect */}
                      <circle cx="80" cy="30" r="8" fill="none" stroke="#7E7CF6" strokeWidth="1" opacity="0.3" className="animate-ping" />
                      <circle cx="80" cy="30" r="5" fill="#7E7CF6" stroke="#C2C0FF" strokeWidth="2" />
                      
                      <line x1="80" y1="30" x2="80" y2="80" stroke="#7E7CF6" strokeWidth="1" />
                    </svg>
                  </div>
                  <h2 className="text-3xl font-bold text-white text-center mb-3 leading-tight">Savings you can set and forget</h2>
                  <p className="text-gray-400 text-center mb-8">We'll make the transfers for you, so you never have to think about saving.</p>
                </div>
              )}
            </div>
            
            {/* Dots */}
            <div className="flex justify-center gap-2 mb-6">
              {[0, 1, 2, 3].map(i => (
                <div key={i} className={`w-2 h-2 rounded-full transition-colors ${goalSlide === i ? 'bg-white' : 'bg-gray-600'}`}></div>
              ))}
            </div>

            <button 
              onClick={() => {
                if (goalSlide < 3) setGoalSlide(s => s + 1)
                else {
                  setActiveModal(null)
                  setGoalSlide(0)
                }
              }} 
              className="w-full bg-white text-black font-bold text-lg py-4 rounded-full hover:bg-gray-200 transition"
            >
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
