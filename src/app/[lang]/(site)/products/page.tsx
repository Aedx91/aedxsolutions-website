import type { Metadata } from 'next'
import { getDictionary, Lang } from '@/lib/i18n/dictionaries'
import { pageMeta } from '@/lib/seo'

export const dynamic = 'force-static'

export async function generateMetadata(props: { params: Promise<{ lang: 'en' | 'es' }> }): Promise<Metadata> {
  const { lang } = await props.params
  const t =
    lang === 'es'
      ? { title: 'Soluciones | AedxSolutions', desc: 'Automatizacion, integraciones API, chatbots y servicios IA a medida.' }
      : { title: 'Solutions | AedxSolutions', desc: 'Automation, API integrations, chatbots, and custom AI services.' }
  return pageMeta(lang, '/products', t.title, t.desc)
}

export default async function ProductsPage(props: { params: Promise<{ lang: string }> }) {
  const { lang: rawLang } = await props.params
  const lang = rawLang === 'es' ? 'es' : 'en'
  const dict = await getDictionary(lang as Lang)
  return (
    <section className="bg-surface-section">
      <div className="container section">
        <h1 className="text-3xl font-bold mb-4 text-text-primary font-display">{dict.solutionsPage.title}</h1>
        <p className="text-text-secondary mb-10 max-w-2xl text-lg">{dict.solutionsPage.intro}</p>
        <div className="grid md:grid-cols-3 gap-8">
          {dict.solutionsPage.items.map((item) => (
            <article key={item.title} className="card flex flex-col">
              <div className="h-40 rounded-md bg-surface-app/60 mb-4" />
              <h3 className="font-semibold mb-2 text-lg text-text-primary">{item.title}</h3>
              <p className="text-sm text-text-secondary mb-4 flex-1">{item.desc}</p>
              <a className="mt-auto inline-flex text-brand-secondary hover:underline text-sm" href={`/${lang}/contact`}>
                {lang === 'es' ? 'Hablemos' : 'Let\'s talk'} →
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
