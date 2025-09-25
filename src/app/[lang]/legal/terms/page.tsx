import type { Metadata } from 'next'
import { getDictionary, Lang } from '@/lib/i18n/dictionaries'
import { LegalTOC } from '@/components/LegalTOC'
import { pageMeta } from '@/lib/seo'
import React from 'react'

export const dynamic = 'force-static'

export async function generateMetadata(props: { params: Promise<{ lang: 'en'|'es' }> }): Promise<Metadata> {
  const { lang } = await props.params
  const t = lang === 'es'
    ? { title: 'Términos de Servicio | AedxSolutions', desc: 'Condiciones para colaborar con AedxSolutions.' }
    : { title: 'Terms of Service | AedxSolutions', desc: 'The service terms and conditions for working with AedxSolutions.' }
  return pageMeta(lang, '/legal/terms', t.title, t.desc)
}

export default async function TermsPage(props: { params: Promise<{ lang: string }> }) {
  const { lang: rawLang } = await props.params
  const lang = rawLang === 'es' ? 'es' : 'en'
  const dict = await getDictionary(lang as Lang)
  const sections = dict.legal.terms.sections.map(s => ({
    ...s,
    body: s.body.replace(/\{lang\}/g, lang)
  }))
  const rawHtml = sections.map(s => `<h2 id="${s.id}">${s.heading}</h2>`).join('')
  return (
    <section className="bg-surface-section">
      <div className="container section grid lg:grid-cols-[1fr_280px] gap-12">
        <div className="legal-prose max-w-none">
          <h1 className="mb-2 text-3xl font-bold tracking-tight">{dict.legal.termsTitle}</h1>
          <p className="legal-meta mb-10">{dict.legal.labels.version}: 2025-09-01</p>
          {sections.map(s => (
            <section key={s.id}>
              <h2 id={s.id}>{s.heading}</h2>
              <p dangerouslySetInnerHTML={{ __html: s.body }} />
            </section>
          ))}
        </div>
        <div className="legal-toc" aria-label={dict.legal.labels.onThisPage}>
          <span className="legal-meta mb-2">{dict.legal.labels.onThisPage}</span>
          <LegalTOC content={rawHtml} />
        </div>
      </div>
    </section>
  )
}
