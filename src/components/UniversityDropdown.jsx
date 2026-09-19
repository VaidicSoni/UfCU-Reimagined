import { useState, useRef, useEffect } from 'react'
import { AFFILIATIONS, UNIVERSITIES } from '../lib/mockApi.js'

export function UniversityDropdown({ value, onChange, lang }) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const dropdownRef = useRef(null)

  // Filtered lists
  const query = search.toLowerCase()
  
  // Top 3 partnered
  const topPartnerIds = ['none', 'ut', 'txst', 'acc']
  // We include 'none' as a top option for convenience
  const partners = UNIVERSITIES.filter(u => topPartnerIds.includes(u.id))
  
  // For the rest, we use AFFILIATIONS (excluding the ones already in top 3 to avoid duplicates)
  const partnerNames = ['University of Texas at Austin (UT Austin)', 'Texas State University (TXST)', 'Austin Community College (ACC)']
  const otherUnis = AFFILIATIONS.filter(a => !partnerNames.includes(a))

  const filteredPartners = partners.filter(p => p.en.toLowerCase().includes(query))
  const filteredOthers = otherUnis.filter(a => a.toLowerCase().includes(query))

  // Close on click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleSelect = (id, name) => {
    // We map back to the ID for the form state. If it's a generic affiliation, we just use its name as ID
    // or maybe a slugified version. But since the dashboard checks for 'none', anything else is considered a student.
    onChange(id)
    setOpen(false)
    setSearch('')
  }

  // Get current label
  const currentPartner = UNIVERSITIES.find(u => u.id === value)
  const currentLabel = currentPartner ? (lang === 'es' ? currentPartner.es : currentPartner.en) : (value === 'none' ? 'None / Not a student' : value)

  return (
    <div className="relative" ref={dropdownRef}>
      <label className="mb-1 block text-sm font-semibold text-navy-lighter">
        {lang === 'es' ? 'Universidad (Opcional)' : 'University (Optional)'}
      </label>
      
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between appearance-none rounded-2xl border-2 border-navy-subtle bg-white p-4 font-semibold text-navy outline-none focus:border-orange text-left"
      >
        <span className="truncate">{currentLabel}</span>
        <svg className="w-5 h-5 text-navy-lighter" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
      </button>

      {open && (
        <div className="absolute z-50 mt-2 w-full rounded-2xl border-2 border-navy-subtle bg-white shadow-xl overflow-hidden animate-in fade-in zoom-in-95">
          <div className="p-3 border-b-2 border-navy-subtle/50 bg-gray-50">
            <div className="relative">
              <span className="absolute inset-y-0 left-3 flex items-center text-gray-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
              </span>
              <input
                type="text"
                className="w-full rounded-xl border border-navy-subtle bg-white pl-9 pr-3 py-2 text-sm font-semibold text-navy outline-none focus:border-orange"
                placeholder={lang === 'es' ? 'Buscar...' : 'Search...'}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                autoFocus
              />
            </div>
          </div>
          
          <div className="max-h-64 overflow-y-auto">
            {filteredPartners.length > 0 && (
              <div className="p-2">
                <div className="px-3 py-1 text-xs font-extrabold uppercase tracking-widest text-navy-lighter">
                  Partnered
                </div>
                {filteredPartners.map(p => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => handleSelect(p.id, p.en)}
                    className="w-full text-left px-3 py-2 text-sm font-semibold text-navy hover:bg-orange/10 rounded-xl transition"
                  >
                    {lang === 'es' ? p.es : p.en}
                  </button>
                ))}
              </div>
            )}
            
            {filteredOthers.length > 0 && (
              <div className="p-2 border-t border-navy-subtle/30">
                <div className="px-3 py-1 text-xs font-extrabold uppercase tracking-widest text-navy-lighter">
                  All Affiliations
                </div>
                {filteredOthers.map(a => (
                  <button
                    key={a}
                    type="button"
                    onClick={() => handleSelect(a, a)}
                    className="w-full text-left px-3 py-2 text-sm font-semibold text-navy hover:bg-orange/10 rounded-xl transition"
                  >
                    {a}
                  </button>
                ))}
              </div>
            )}

            {filteredPartners.length === 0 && filteredOthers.length === 0 && (
              <div className="p-4 text-center text-sm font-semibold text-gray-400">
                No results found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
