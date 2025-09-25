import type { Metadata } from 'next'
import { getDictionary, Lang } from '@/lib/i18n/dictionaries'
import { LegalTOC } from '@/components/LegalTOC'
import { pageMeta } from '@/lib/seo'
import React from 'react'

export const dynamic = 'force-static'

export async function generateMetadata({ params }: { params: { lang: 'en'|'es' } }): Promise<Metadata> {
  const { lang } = params
  const t = lang === 'es'
    ? { title: 'Términos de Servicio | AedxSolutions', desc: 'Condiciones para colaborar con AedxSolutions.' }
    : { title: 'Terms of Service | AedxSolutions', desc: 'The service terms and conditions for working with AedxSolutions.' }
  return pageMeta(lang, '/legal/terms', t.title, t.desc)
}

export default async function TermsPage({ params }: { params: { lang: string } }) {
  const { lang: rawLang } = params
  const lang = rawLang === 'es' ? 'es' : 'en'
  const safeLang: Lang = lang
  const dict = await getDictionary(lang as Lang)
  const sections = [
    { id: 'agreement', heading: 'Agreement', body: 'These placeholder terms outline a future commercial relationship framework. They will be replaced with finalized bilingual legal language.' },
    { id: 'license', heading: 'License & Access', body: 'Access is provided on an as-is basis. No warranties are currently expressed in this provisional document.' },
    { id: 'acceptable-use', heading: 'Acceptable Use', body: 'Users must not interfere with platform security, integrity or availability.' },
    { id: 'liability', heading: 'Limitation of Liability', body: 'To the maximum extent permitted by law liability will be limited to directly incurred fees.' },
    { id: 'changes', heading: 'Changes', body: 'We may update these terms; material changes will be versioned and dated.' },
    { id: 'governing-law', heading: 'Governing Law', body: 'Jurisdiction to be specified in final document.' },
  { id: 'contact', heading: 'Contact', body: `For contract or compliance inquiries please <a href="/${safeLang}/contact" class="link underline">reach out</a>.` },
  ];
  const rawHtml = sections.map(s => `<h2 id="${s.id}">${s.heading}</h2>`).join('');
  return (
    <section className="bg-surface-section">
      <div className="container section grid lg:grid-cols-[1fr_280px] gap-12">
        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <h1 className="mb-2 text-3xl font-bold tracking-tight text-text-primary dark:text-white">{dict.legal.termsTitle}</h1>
          <p className="text-sm text-text-secondary dark:text-white/60 mb-10">Version: 2025-09-01</p>
          {sections.map(s => (
            <section key={s.id}>
              <h2 id={s.id}>{s.heading}</h2>
              <p dangerouslySetInnerHTML={{ __html: s.body }} />
            </section>
          ))}
        </div>
        <LegalTOC content={rawHtml} />
      </div>
    </section>
  );
}
