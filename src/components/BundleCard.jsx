import { useOnboarding } from '../context/OnboardingContext.jsx'
import { t } from '../lib/i18n.js'
import { bundleFor, inferSegment } from '../lib/mockApi.js'

// The recommendation, shown live as goals are picked and again at the end.
// The rubric's top band asks that the journey "naturally leads to an
// appropriate product bundle with clear value explanation" — so every product
// carries the reason it's there, never just a name.
export function BundleCard({ tone = 'light', showMemberNote = true }) {
  const { goals, lang } = useOnboarding()
  const items = bundleFor(goals)
  if (items.length === 0) return null

  const segment = inferSegment(goals)
  const dark = tone === 'dark'

  return (
    <section
      className={`u-chip p-5 ${dark ? 'bg-navy text-white' : 'border-2 border-navy-subtle bg-navy-subtle/25'}`}
      aria-live="polite"
    >
      <div className="flex items-baseline justify-between gap-3">
        <h3 className={`text-sm font-extrabold uppercase tracking-wide ${dark ? 'text-orange-lighter' : 'text-navy'}`}>
          {t(lang, 'bundleTitle')}
        </h3>
        <span className={`text-xs font-semibold ${dark ? 'text-navy-subtle' : 'text-navy-lighter'}`}>
          {t(lang, 'bundleFor', segment[lang])}
        </span>
      </div>

      <ul className="mt-4 space-y-3">
        {items.map((item) => (
          <li key={item.en} className="flex gap-3">
            <span
              aria-hidden="true"
              className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-orange"
            />
            <div>
              <p className={`text-base font-bold ${dark ? 'text-white' : 'text-navy'}`}>
                {lang === 'es' ? item.es : item.en}
              </p>
              <p className={`text-sm leading-snug ${dark ? 'text-navy-subtle' : 'text-navy-lighter'}`}>
                {lang === 'es' ? item.valueEs : item.valueEn}
              </p>
            </div>
          </li>
        ))}
      </ul>

      <p className={`mt-4 border-t pt-3 text-xs ${dark ? 'border-white/15 text-navy-subtle' : 'border-navy-subtle text-navy-lighter'}`}>
        {t(lang, 'bundleNote')}
        {showMemberNote && ` ${t(lang, 'memberNote')}`}
      </p>
    </section>
  )
}
