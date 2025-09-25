import type { Metadata } from 'next'
import { getDictionary, Lang } from '@/lib/i18n/dictionaries'
import { pageMeta } from '@/lib/seo'
export const dynamic = 'force-static'

export async function generateMetadata({ params }: { params: { lang: 'en'|'es' } }): Promise<Metadata> {
  const { lang } = params
  const t = lang === 'es'
    ? { title: 'Clientes | AedxSolutions', desc: 'Resultados medibles, casos de éxito y testimonios.' }
    : { title: 'Customers | AedxSolutions', desc: 'Measurable outcomes, case studies, and testimonials.' }
  return pageMeta(lang, '/customers', t.title, t.desc)
}

export default async function CustomersPage({ params }: { params: { lang: string } }) {
  const { lang: rawLang } = params
  const lang = rawLang === 'es' ? 'es' : 'en'
  const dict = await getDictionary(lang as Lang)
  return (
    <section className="bg-surface-section">
      <div className="container section">
        <h1 className="text-3xl font-bold mb-4 text-text-primary">{dict.customers.title}</h1>
        <p className="text-text-secondary mb-10 max-w-2xl">{dict.customers.intro}</p>
        <div className="grid md:grid-cols-3 gap-8">
          {[1,2,3].map(i => (
            <div key={i} className="card">
              <div className="h-12 w-12 rounded-full bg-brand-primary mb-4" />
              <p className="text-sm italic mb-3 text-text-secondary">“Great measurable outcome statement from customer {i}.”</p>
              <p className="text-xs font-medium uppercase tracking-wide text-text-primary/85">Client {i}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
