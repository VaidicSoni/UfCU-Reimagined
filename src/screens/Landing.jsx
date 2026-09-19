import { useOnboarding } from '../context/OnboardingContext.jsx'
import { t } from '../lib/i18n.js'
import { Mascot } from '../components/Mascot.jsx'
import { Icon } from '../components/Icons.jsx'
import { Button } from '../components/Button.jsx'

const SERVICES = [
  { key: 'Everyday', icon: Icon.everyday },
  { key: 'Consumer', icon: Icon.consumer },
  { key: 'Mortgage', icon: Icon.mortgage },
  { key: 'Business', icon: Icon.business },
  { key: 'Invest', icon: Icon.invest },
]

// Screen 0. Before we ask for anything, say who UFCU is and what they offer —
// a credit union's member-owned model is its whole differentiator and most
// prospective members don't know it.
export function Landing() {
  const { go, lang } = useOnboarding()

  return (
    <div className="relative z-10">
      {/* Hero */}
      <section className="mx-auto grid max-w-6xl items-center gap-10 px-5 pb-16 pt-6 lg:grid-cols-[1.15fr_0.85fr] lg:pt-10">
        <div>
          <p className="rule text-xs font-bold uppercase tracking-[0.18em] text-orange-lighter">
            {t(lang, 'eyebrow')}
          </p>
          <h1 className="display mt-5 text-5xl font-extrabold text-white sm:text-6xl lg:text-7xl">
            {t(lang, 'heroTitle')}
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-navy-subtle">
            {t(lang, 'heroBody')}
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-4">
            <Button onClick={() => go('goals')} className="px-8 py-4 text-lg">
              {t(lang, 'landingCta')}
            </Button>
            <span className="text-sm font-semibold text-navy-subtle">
              {t(lang, 'landingTime')}
            </span>
          </div>
          <p className="mt-4 text-sm text-navy-lighter">{t(lang, 'landingNote')}</p>
        </div>

        {/* Lumi's introduction */}
        <div className="u-card relative bg-white/[0.07] p-8 ring-1 ring-white/10">
          <div className="flex flex-col items-center text-center">
            <Mascot brightness={0.85} size={150} face loop />
            <p className="mt-4 text-xs font-bold uppercase tracking-[0.18em] text-orange-lighter">
              {t(lang, 'meetLumi')}
            </p>
            <p className="mt-3 text-base leading-relaxed text-white">{t(lang, 'lumiIntro')}</p>
          </div>
        </div>
      </section>

      {/* Purpose + proof */}
      <section className="border-y border-white/10 bg-navy-darkest/40">
        <div className="mx-auto max-w-6xl px-5 py-10">
          <blockquote className="display max-w-3xl text-2xl font-bold text-white sm:text-3xl">
            &ldquo;{t(lang, 'purpose')}&rdquo;
          </blockquote>
          <dl className="mt-8 grid gap-6 sm:grid-cols-3">
            <div>
              <dt className="text-3xl font-extrabold text-orange-lighter">400,000+</dt>
              <dd className="mt-1 text-sm text-navy-subtle">{t(lang, 'statMembers')}</dd>
            </div>
            <div>
              <dt className="text-3xl font-extrabold text-orange-lighter">100%</dt>
              <dd className="mt-1 text-sm text-navy-subtle">{t(lang, 'statOwned')}</dd>
            </div>
            <div>
              <dt className="text-3xl font-extrabold text-orange-lighter">ATX</dt>
              <dd className="mt-1 text-sm text-navy-subtle">{t(lang, 'statPlace')}</dd>
            </div>
          </dl>
        </div>
      </section>

      {/* Services */}
      <section className="mx-auto max-w-6xl px-5 py-16">
        <p className="rule text-xs font-bold uppercase tracking-[0.18em] text-orange-lighter">
          {t(lang, 'servicesEyebrow')}
        </p>
        <h2 className="display mt-4 max-w-2xl text-3xl font-extrabold text-white sm:text-4xl">
          {t(lang, 'servicesTitle')}
        </h2>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map(({ key, icon: Glyph }) => (
            <article
              key={key}
              className="u-chip bg-white/[0.06] p-6 ring-1 ring-white/10 transition hover:bg-white/[0.11]"
            >
              <Glyph className="h-7 w-7 text-orange" />
              <h3 className="mt-4 text-lg font-bold text-white">{t(lang, `svc${key}`)}</h3>
              <p className="mt-2 text-sm leading-relaxed text-navy-subtle">
                {t(lang, `svc${key}Body`)}
              </p>
            </article>
          ))}

          {/* Closing CTA occupies the sixth cell of the grid. */}
          <article className="u-chip flex flex-col justify-between bg-orange p-6">
            <div>
              <Icon.shield className="h-7 w-7 text-white" />
              <h3 className="mt-4 text-lg font-bold text-white">{t(lang, 'landingCta')}</h3>
              <p className="mt-2 text-sm leading-relaxed text-white/85">
                {t(lang, 'landingTime')} · {t(lang, 'landingNote')}
              </p>
            </div>
            <button
              onClick={() => go('goals')}
              className="mt-6 w-full rounded-full bg-white px-5 py-3 text-base font-bold text-navy transition hover:bg-orange-subtle"
            >
              {t(lang, 's1Cta')}
            </button>
          </article>
        </div>
      </section>
    </div>
  )
}
