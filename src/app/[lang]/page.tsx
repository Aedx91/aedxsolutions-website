import type { Metadata } from 'next'
import { getDictionary, Lang } from '@/lib/i18n/dictionaries'
import { pageMeta } from '@/lib/seo'

export const dynamic = 'force-static'

export async function generateMetadata(
  { params }: { params: { lang: 'en' | 'es' } }
): Promise<Metadata> {
  const { lang } = params
  const t = lang === 'es'
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

export default async function HomeLangPage({ params }: { params: { lang: string } }) {
  const { lang: rawLang } = params
  const lang = rawLang === 'es' ? 'es' : 'en'
  const dict = await getDictionary(lang as Lang)
  return (
    <div>
      <section className="hero">
        <div className="hero-bg" aria-hidden></div>
        <div className="hero-overlay" aria-hidden></div>
        <div className="hero-accent" aria-hidden></div>
        <div className="container">
          <div className="hero-content">
            <span className="btn-chip">AedxSolutions • AI + Web + Integrations</span>
            <h1 className="hero-heading mt-4 text-4xl sm:text-5xl md:text-6xl font-semibold leading-tight">AI-powered software for real-world operations</h1>
            <p className="hero-sub mt-4 max-w-2xl">Modern web, cloud and consulting solutions that scale with your ambition.</p>
            <div className="mt-8 flex items-center gap-3">
              <a className="btn btn-primary shadow-glow" href={`/${lang}/contact`}>{dict.hero.cta}</a>
              <a className="btn btn-outline" href={`/${lang}/products`}>{dict.nav.products}</a>
            </div>
          </div>
        </div>
      </section>
      <section className="bg-surface-section">
        <div className="container section">
          <h2 className="text-2xl sm:text-3xl font-semibold text-text-primary text-center mb-2">Platform Pillars</h2>
          <p className="text-text-secondary max-w-2xl mx-auto text-center">Foundational capabilities that accelerate delivery, reliability and insight.</p>
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {[1,2,3].map(i => (
              <article key={i} className="card">
                <div className="h-10 w-10 rounded-md bg-surface-section/60" />
                <h3 className="mt-4 text-lg font-semibold">Feature {i}</h3>
                <p className="mt-1 text-sm text-text-secondary">Concise value proposition highlighting measurable benefit number {i}.</p>
              </article>
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
