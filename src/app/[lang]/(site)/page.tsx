import type { Metadata } from 'next'
import { headers } from 'next/headers'
import { getDictionary, Lang } from '@/lib/i18n/dictionaries'
import { pageMeta } from '@/lib/seo'
import { MotionSection } from '@/components/MotionSection'
import HeroOfferBanner from '@/components/HeroOfferBanner'

export const dynamic = 'force-static'

export async function generateMetadata(
  props: { params: Promise<{ lang: 'en' | 'es' }> }
): Promise<Metadata> {
  const { lang } = await props.params
  const t =
    lang === 'es'
      ? {
          title: 'IA aplicada para pequeños negocios | AedxSolutions',
          desc: 'Automatización clara, flujos conectados y resultados medibles para equipos pequeños.',
        }
      : {
          title: 'AI that keeps small businesses moving | AedxSolutions',
          desc: 'Practical automation, connected workflows, and measurable outcomes for lean teams.',
        }
  return pageMeta(lang, '', t.title, t.desc)
}

export default async function HomeLangPage(props: { params: Promise<{ lang: string }> }) {
  const { lang: rawLang } = await props.params
  const lang = rawLang === 'es' ? 'es' : 'en'
  const dict = await getDictionary(lang as Lang)
  const nonce = (await headers()).get('x-nonce') ?? undefined
  return (
    <div>
      <section className="hero">
        <div className="hero-accent" aria-hidden></div>
        <div className="container section">
          <div className="max-w-3xl">
            <span className="btn-chip">{dict.heroBadge}</span>
            <HeroOfferBanner lang={lang} />
            <div className="mt-8 rounded-2xl border border-white/10 bg-black/25 p-4 sm:p-5">
              <div className="flex items-center justify-between gap-3">
                <p className="text-xs uppercase tracking-[0.22em] text-text-secondary">{dict.heroSpotlight.eyebrow}</p>
                <a className="text-xs font-semibold text-text-primary underline underline-offset-4" href={`/${lang}/products`}>
                  {dict.heroSpotlight.viewAll}
                </a>
              </div>
              <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
                {dict.heroSpotlight.items.map((item) => (
                  <a
                    key={item.title}
                    href={`/${lang}${item.href}`}
                    className="h-full rounded-xl border border-white/10 bg-white/[0.03] p-4 transition-all hover:border-pink-400/40 hover:bg-white/[0.06] flex flex-col"
                  >
                    <span className="inline-flex rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] font-semibold text-text-secondary">
                      {item.tag}
                    </span>
                    <h3 className="mt-3 text-base font-semibold text-text-primary">{item.title}</h3>
                    <p className="mt-2 text-sm text-text-secondary">{item.desc}</p>
                    <div className="mt-auto pt-4">
                      <span className="inline-flex items-center justify-center rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-text-primary">
                        {item.cta} →
                      </span>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <MotionSection className="bg-surface-section">
        <div className="container section">
          <div className="max-w-2xl">
            <p className="text-xs uppercase tracking-[0.3em] text-text-secondary">{dict.signal.eyebrow}</p>
            <h2 className="mt-3 text-3xl sm:text-4xl font-semibold font-display text-text-primary">
              {dict.signal.title}
            </h2>
            <p className="mt-4 text-text-secondary text-lg">{dict.signal.subtitle}</p>
          </div>
          <div className="mt-9 grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6">
            {dict.signal.items.map((item) => (
              <div key={item.title} className="card">
                <h3 className="text-xl font-semibold text-text-primary">{item.title}</h3>
                <p className="mt-3 text-text-secondary">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </MotionSection>

      <MotionSection className="bg-app-surface">
        <div className="container section">
          <div className="max-w-2xl">
            <p className="text-xs uppercase tracking-[0.3em] text-text-secondary">{dict.solutions.eyebrow}</p>
            <h2 className="mt-3 text-3xl sm:text-4xl font-semibold font-display text-text-primary">
              {dict.solutions.title}
            </h2>
            <p className="mt-4 text-text-secondary text-lg">{dict.solutions.subtitle}</p>
          </div>
          <div className="mt-9 grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
            {dict.solutions.items.map((item) => (
              <div key={item.title} className="card">
                <h3 className="text-xl font-semibold text-text-primary">{item.title}</h3>
                <p className="mt-3 text-text-secondary">{item.desc}</p>
                <ul className="mt-4 space-y-2 text-sm text-text-secondary">
                  {item.bullets.map((bullet) => (
                    <li key={bullet}>• {bullet}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </MotionSection>

      <MotionSection className="bg-surface-section">
        <div className="container section">
          <div className="max-w-2xl">
            <p className="text-xs uppercase tracking-[0.3em] text-text-secondary">{dict.outcomes.eyebrow}</p>
            <h2 className="mt-3 text-3xl sm:text-4xl font-semibold font-display text-text-primary">
              {dict.outcomes.title}
            </h2>
            <p className="mt-4 text-text-secondary text-lg">{dict.outcomes.subtitle}</p>
          </div>
          <div className="mt-9 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
            {dict.outcomes.stats.map((stat) => (
              <div key={stat.label} className="card">
                <p className="text-3xl font-semibold text-text-primary">{stat.value}</p>
                <p className="mt-2 text-sm text-text-secondary">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </MotionSection>

      <MotionSection className="bg-app-surface">
        <div className="container section">
          <div className="max-w-2xl">
            <p className="text-xs uppercase tracking-[0.3em] text-text-secondary">{dict.process.eyebrow}</p>
            <h2 className="mt-3 text-3xl sm:text-4xl font-semibold font-display text-text-primary">
              {dict.process.title}
            </h2>
          </div>
          <div className="mt-9 grid grid-cols-1 md:grid-cols-4 gap-5 md:gap-6">
            {dict.process.steps.map((step, index) => (
              <div key={step.title} className="card">
                <p className="text-xs uppercase tracking-[0.3em] text-text-secondary">{String(index + 1).padStart(2, '0')}</p>
                <h3 className="mt-3 text-lg font-semibold text-text-primary">{step.title}</h3>
                <p className="mt-2 text-sm text-text-secondary">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </MotionSection>

      <MotionSection className="bg-surface-section">
        <div className="container section">
          <div className="card">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div className="max-w-2xl">
                <p className="text-xs uppercase tracking-[0.3em] text-text-secondary">{dict.cta.eyebrow}</p>
                <h2 className="mt-3 text-3xl sm:text-4xl font-semibold font-display text-text-primary">
                  {dict.cta.title}
                </h2>
                <p className="mt-4 text-text-secondary text-lg">{dict.cta.subtitle}</p>
              </div>
              <div className="flex flex-wrap gap-3">
                <a className="btn btn-primary shadow-glow" href={`/${lang}/contact`}>
                  {dict.cta.primaryCta}
                </a>
                <a className="btn btn-outline" href={`/${lang}/products`}>
                  {dict.cta.secondaryCta}
                </a>
              </div>
            </div>
          </div>
        </div>
      </MotionSection>

      <script
        type="application/ld+json"
        nonce={nonce}
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Organization',
            name: 'AedxSolutions',
            url: 'https://aedxsolutions.com',
          }),
        }}
      />
      <script
        type="application/ld+json"
        nonce={nonce}
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebSite',
            name: 'AedxSolutions',
            url: 'https://aedxsolutions.com',
            potentialAction: {
              '@type': 'SearchAction',
              target: 'https://aedxsolutions.com/en?search={query}',
              'query-input': 'required name=query',
            },
          }),
        }}
      />
    </div>
  )
}
