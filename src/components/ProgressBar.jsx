import { useOnboarding } from '../context/OnboardingContext.jsx'
import { t } from '../lib/i18n.js'

export function ProgressBar() {
  const { progress, lang } = useOnboarding()
  const pct = Math.round((progress.current / progress.total) * 100)

  return (
    <div className="w-full">
      <div className="mb-2 flex items-center justify-between text-xs font-semibold text-navy-lighter">
        <span>{t(lang, 'stepOf', progress.current, progress.total)}</span>
        <span>{pct}%</span>
      </div>
      <div
        className="h-2 w-full overflow-hidden rounded-full bg-navy-subtle"
        role="progressbar"
        aria-valuenow={progress.current}
        aria-valuemin={1}
        aria-valuemax={progress.total}
        aria-label={t(lang, 'stepOf', progress.current, progress.total)}
      >
        <div
          className="h-full rounded-full bg-orange transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}
