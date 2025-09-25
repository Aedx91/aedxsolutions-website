import type { Metadata } from 'next'
import { getDictionary, Lang } from '@/lib/i18n/dictionaries'
import { pageMeta } from '@/lib/seo'
export const dynamic = 'force-static'

export async function generateMetadata(
  { params }: { params: { lang: 'en' | 'es' } }
): Promise<Metadata> {
  const { lang } = params
  const t = lang === 'es'
    ? { title: 'Servicios | AedxSolutions', desc: 'Sitios web modernos, integraciones API, IA y consultoría.' }
    : { title: 'Services | AedxSolutions', desc: 'Modern websites, API integrations, AI automations, and consulting.' }
  return pageMeta(lang, '/products', t.title, t.desc)
}

export default async function ProductsPage({ params }: { params: { lang: string } }) {
  const { lang: rawLang } = params
  const lang = rawLang === 'es' ? 'es' : 'en'
  const dict = await getDictionary(lang as Lang)
  return (
    <section className="bg-surface-section">
      <div className="container section">
        <h1 className="text-3xl font-bold mb-4 text-text-primary">{dict.products.title}</h1>
        <p className="text-text-secondary mb-10 max-w-2xl">{dict.products.intro}</p>
        <div className="grid md:grid-cols-3 gap-8">
          {[1,2,3,4,5,6].map(i => (
            <article key={i} className="card flex flex-col">
              <div className="h-40 rounded-md bg-surface-app/60 mb-4" />
              <h3 className="font-semibold mb-2">Product {i}</h3>
              <p className="text-sm text-text-secondary mb-4 flex-1">Short elevator pitch of product capability {i}.</p>
              <a className="mt-auto inline-flex text-brand-secondary hover:underline text-sm" href="#">Learn more →</a>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
