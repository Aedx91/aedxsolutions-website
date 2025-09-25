import type { Metadata } from 'next'
import { getDictionary, Lang } from '@/lib/i18n/dictionaries'
import { LegalTOC } from '@/components/LegalTOC'
import { pageMeta } from '@/lib/seo'
import React from 'react'

export const dynamic = 'force-static'

export async function generateMetadata({ params }: { params: { lang: 'en'|'es' } }): Promise<Metadata> {
  const { lang } = params
  const t = lang === 'es'
    ? { title: 'Política de Privacidad | AedxSolutions', desc: 'Cómo AedxSolutions gestiona los datos y protege tu privacidad.' }
    : { title: 'Privacy Policy | AedxSolutions', desc: 'How AedxSolutions handles data and protects your privacy.' }
  return pageMeta(lang, '/legal/privacy', t.title, t.desc)
}

export default async function PrivacyPage({ params }: { params: { lang: string } }) {
  const { lang: rawLang } = params
  const lang = rawLang === 'es' ? 'es' : 'en'
  const safeLang: Lang = lang
  const dict = await getDictionary(lang as Lang)
  const sections = [
    { id: 'data-we-collect', heading: 'Data We Collect', body: 'We currently collect minimal operational data required to respond to inbound requests, improve reliability and fulfill prospective commercial agreements. This placeholder section will be localized and expanded.' },
    { id: 'how-we-use', heading: 'How We Use Information', body: 'Usage is restricted to performing requested services, internal analytics, security monitoring and legal compliance.' },
    { id: 'storage-retention', heading: 'Storage & Retention', body: 'Data is retained only as long as necessary for stated purposes or contractual / statutory requirements.' },
    { id: 'your-rights', heading: 'Your Rights', body: 'Access, rectification, deletion, portability and objection rights will be addressed once the full compliance copy is added.' },
  { id: 'contact', heading: 'Contact', body: `Questions: <a href="/${safeLang}/contact" class="link underline">Contact us</a>.` },
  ];
  const rawHtml = sections.map(s => `<h2 id="${s.id}">${s.heading}</h2>`).join('');
  return (
    <section className="bg-surface-section">
      <div className="container section grid lg:grid-cols-[1fr_280px] gap-12">
        <div className="legal-prose max-w-none">
          <h1 className="mb-2 text-3xl font-bold tracking-tight">{dict.legal.privacyTitle}</h1>
          <p className="legal-meta mb-10">Updated: 2025-09-01</p>
          {sections.map(s => (
            <section key={s.id}>
              <h2 id={s.id}>{s.heading}</h2>
              <p dangerouslySetInnerHTML={{ __html: s.body }} />
            </section>
          ))}
        </div>
        <div className="legal-toc" aria-label="On this page">
          <span className="legal-meta mb-2">ON THIS PAGE</span>
          <LegalTOC content={rawHtml} />
        </div>
      </div>
    </section>
  );
}
