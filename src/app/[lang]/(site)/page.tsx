import type { Metadata } from 'next'
import { getDictionary, Lang } from '@/lib/i18n/dictionaries'
import { pageMeta } from '@/lib/seo'
import FlipCard from '@/components/FlipCard'

export const dynamic = 'force-static'

export async function generateMetadata(
  props: { params: Promise<{ lang: 'en' | 'es' }> }
): Promise<Metadata> {
  const { lang } = await props.params
  const t =
    lang === 'es'
      ? {
          title: 'Software con IA para operaciones reales | AedxSolutions',
          desc: 'Web moderna, integraciones API y consultoría que escalan con tu negocio.',
        }
      : {
          title: 'AI-powered software for real-world operations | AedxSolutions',
          desc: 'Modern web, API integrations, and consulting that scale with your business.',
        }
  return pageMeta(lang, '', t.title, t.desc)
}

export default async function HomeLangPage(props: { params: Promise<{ lang: string }> }) {
  const { lang: rawLang } = await props.params
  const lang = rawLang === 'es' ? 'es' : 'en'
  const dict = await getDictionary(lang as Lang)
  return (
    <div>
      <section className="hero">
        <div className="hero-accent" aria-hidden></div>
        <div className="container">
          <div className="hero-content">
            <span className="btn-chip">{dict.heroBadge}</span>
            <h1 className="hero-heading mt-4 text-4xl sm:text-5xl md:text-6xl font-semibold tracking-tight leading-tight">
              {dict.hero.title}
            </h1>
            <p className="hero-sub mt-4 max-w-2xl">{dict.hero.subtitle}</p>
            <div className="mt-8 flex items-center gap-3">
              <a className="btn btn-primary shadow-glow" href={`/${lang}/contact`}>
                {dict.hero.cta}
              </a>
              <a className="btn btn-outline" href={`/${lang}/products`}>
                {dict.nav.products}
              </a>
              <a className="btn btn-outline" href={`/${lang}/demo/login`}>
                {dict.demo.loginButton}
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-app-surface">
        <div className="container section">
          <h2 className="text-2xl sm:text-3xl font-semibold text-text-primary text-center mb-2">
            {dict.features.sectionTitle}
          </h2>
          <p className="text-text-secondary max-w-2xl mx-auto text-center">{dict.features.sectionSubtitle}</p>
          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 max-w-6xl mx-auto px-4">
            {dict.features.items.map((item) => (
              <FlipCard
                key={item.title}
                title={item.title}
                subtitle={<span>{item.desc}</span>}
                ctaHref={`/${lang}/products`}
                ctaLabel={lang === 'es' ? 'Más info' : 'More info'}
              />
            ))}
          </div>
        </div>
      </section>

      <script
        type="application/ld+json"
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
