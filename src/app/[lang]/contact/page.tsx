import { getDictionary, Lang } from '@/lib/i18n/dictionaries';
import ContactForm from './ContactForm';

export const dynamic = 'force-static';

export default async function ContactPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang: rawLang } = await params;
  const lang = rawLang === 'es' ? 'es' : 'en';
  const dict = await getDictionary(lang as Lang);
  return (
    <section className="bg-surface-section">
      <div className="container section max-w-2xl">
        <h1 className="text-3xl font-bold mb-6 text-text-primary">{dict.contact.title}</h1>
        <p className="mb-8 text-text-secondary">{dict.contact.intro}</p>
        <ContactForm lang={lang === 'es' ? 'es' : 'en'} />
      </div>
    </section>
  );
}
