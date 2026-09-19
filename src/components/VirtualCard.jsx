import { useOnboarding } from '../context/OnboardingContext.jsx'
import { t } from '../lib/i18n.js'
import { Icon } from './Icons.jsx'

// Solid navy with a hard-edged orange band rather than a blurred glow. The glow
// sat directly behind the card number and dropped its contrast; brand colour
// belongs at the edges, not under the text you need to read.
export function VirtualCard({ hidden, revealed, onToggle }) {
  const { lang, form } = useOnboarding()
  const holder = `${form.firstName || 'New'} ${form.lastName || 'Member'}`.trim()

  return (
    <section
      aria-label={t(lang, 'virtualCard')}
      className="u-card overflow-hidden border-2 border-navy-subtle bg-white"
    >
      <div className="relative overflow-hidden bg-navy p-6 text-white">
        {/* Brand accent, kept clear of the number */}
        <div aria-hidden="true" className="absolute inset-x-0 top-0 h-1.5 bg-orange" />
        <div
          aria-hidden="true"
          className="absolute -bottom-14 -right-14 h-28 w-28 rotate-45 bg-orange/15"
        />

        <div className="relative flex items-start justify-between gap-4">
          <div>
            <p className="text-[0.65rem] font-bold uppercase tracking-[0.18em] text-navy-subtle">
              {t(lang, 'cardDebit')}
            </p>
            <p className="mt-1 inline-flex items-center gap-1.5 text-sm font-bold text-emerald-300">
              <span aria-hidden="true">●</span> {t(lang, 'cardActive')}
            </p>
          </div>
          {/* The mark's oval, reversed for a dark surface */}
          <span className="rounded-full border-2 border-orange px-3 py-1">
            <span className="text-base font-extrabold lowercase tracking-tight text-white">ufcu</span>
          </span>
        </div>

        {/* Chip */}
        <div aria-hidden="true" className="relative mt-6 h-8 w-11 rounded-md bg-amber-lighter">
          <div className="absolute inset-x-1.5 top-2.5 h-px bg-navy/40" />
          <div className="absolute inset-x-1.5 top-4.5 h-px bg-navy/40" />
          <div className="absolute inset-y-1.5 left-1/2 w-px bg-navy/40" />
        </div>

        <p className="relative mt-5 font-mono text-lg font-semibold tracking-[0.16em] text-white">
          {hidden ? '•••• •••• •••• ••••' : revealed ? '4821 7734 0192 4721' : '•••• •••• •••• 4721'}
        </p>

        <div className="relative mt-5 flex items-end justify-between gap-4">
          <div>
            <p className="text-[0.6rem] font-bold uppercase tracking-[0.18em] text-navy-subtle">
              {t(lang, 'cardHolder')}
            </p>
            <p className="mt-0.5 text-sm font-bold uppercase text-white">{holder}</p>
          </div>
          <div className="text-right">
            <p className="text-[0.6rem] font-bold uppercase tracking-[0.18em] text-navy-subtle">
              {t(lang, 'cardExpires')}
            </p>
            <p className="mt-0.5 text-sm font-bold text-white">09/30</p>
          </div>
        </div>
      </div>

      <div className="p-4">
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
