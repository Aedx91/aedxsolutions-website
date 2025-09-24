import { getDictionary, Lang } from '@/lib/i18n/dictionaries';
import { LegalTOC } from '@/components/LegalTOC';
import React from 'react';

export const dynamic = 'force-static';

export default async function PrivacyPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang: rawLang } = await params;
  const lang = rawLang === 'es' ? 'es' : 'en';
  const safeLang: Lang = lang;
  const dict = await getDictionary(lang as Lang);
  const sections = [
    { id: 'data-we-collect', heading: 'Data We Collect', body: 'We currently collect minimal operational data required to respond to inbound requests, improve reliability and fulfill prospective commercial agreements. This placeholder section will be localized and expanded.' },
    { id: 'how-we-use', heading: 'How We Use Information', body: 'Usage is restricted to performing requested services, internal analytics, security monitoring and legal compliance.' },
    { id: 'storage-retention', heading: 'Storage & Retention', body: 'Data is retained only as long as necessary for stated purposes or contractual / statutory requirements.' },
    { id: 'your-rights', heading: 'Your Rights', body: 'Access, rectification, deletion, portability and objection rights will be addressed once the full compliance copy is added.' },
    { id: 'contact', heading: 'Contact', body: `Questions: <a href="/${safeLang}/contact" class="text-brand-primary underline">Contact us</a>.` },
  ];
  const rawHtml = sections.map(s => `<h2 id="${s.id}">${s.heading}</h2>`).join('');
  return (
    <section className="bg-surface-section">
      <div className="container section grid lg:grid-cols-[1fr_280px] gap-12">
        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <h1 className="mb-2 text-3xl font-bold tracking-tight text-text-primary dark:text-white">{dict.legal.privacyTitle}</h1>
          <p className="text-sm text-text-secondary dark:text-white/60 mb-10">Updated: 2025-09-01</p>
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
