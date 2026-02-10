import type { Metadata } from 'next'
import { headers } from 'next/headers'
import { getDictionary, Lang } from '@/lib/i18n/dictionaries'
import { pageMeta } from '@/lib/seo'
import { MotionSection } from '@/components/MotionSection'

export const dynamic = 'force-static'

export async function generateMetadata(
  props: { params: Promise<{ lang: 'en' | 'es' }> }
): Promise<Metadata> {
  const { lang } = await props.params
  const t =
    lang === 'es'
      ? {
          title: 'Soluciones con IA para pequeños negocios | AedxSolutions',
          desc: 'Automatización real, sistemas conectados y resultados medibles para equipos pequeños.',
        }
      : {
          title: 'AI-driven small business solutions | AedxSolutions',
          desc: 'Practical automation, connected systems, and measurable outcomes for lean teams.',
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
            <h1 className="mt-5 text-4xl sm:text-5xl md:text-6xl font-semibold tracking-tight leading-tight font-display text-text-hero">
              {dict.hero.title}
            </h1>
            <p className="mt-5 text-lg sm:text-xl text-text-secondary max-w-2xl">{dict.hero.subtitle}</p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <a className="btn btn-primary shadow-glow" href={`/${lang}/contact`}>
                {dict.hero.ctaPrimary}
              </a>
              <a className="btn btn-outline" href={`/${lang}/products`}>
                {dict.hero.ctaSecondary}
              </a>
              <a className="btn btn-outline" href={`/${lang}/demo/login`}>
                {dict.hero.ctaTertiary}
              </a>
            </div>
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm text-text-secondary">
              {dict.hero.highlights.map((item) => (
                <div key={item} className="card">
                  <p className="font-medium text-text-primary">{item}</p>
                </div>
              ))}
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
          <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
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
          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
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
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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
          <div className="mt-10 grid grid-cols-1 md:grid-cols-4 gap-6">
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
