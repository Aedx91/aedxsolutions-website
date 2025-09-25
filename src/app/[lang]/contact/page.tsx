import type { Metadata } from 'next'
import ContactForm from '@/components/ContactForm'
import { pageMeta } from '@/lib/seo'

export const dynamic = 'force-static'

export async function generateMetadata({ params }: { params: { lang: 'en'|'es' } }): Promise<Metadata> {
  const { lang } = params
  const t = lang === 'es'
    ? { title: 'Contacto | AedxSolutions', desc: 'Agenda una llamada o envíanos un mensaje.' }
    : { title: 'Contact | AedxSolutions', desc: 'Book an intro call or send us a message.' }
  return pageMeta(lang, '/contact', t.title, t.desc)
}

export default function ContactPage({ params }: { params: { lang: 'en'|'es' } }) {
  const { lang } = params
  const isEs = lang === 'es'
  return (
    <section className="bg-surface-section">
      <div className="container section">
        <h1 className="text-3xl sm:text-5xl font-semibold">{isEs ? 'Contacto' : 'Contact'}</h1>
        <p className="mt-2 text-text-secondary max-w-2xl">
          {isEs
            ? 'Cuéntanos qué necesitas y te responderemos en breve.'
            : 'Tell us what you need and we’ll get back to you shortly.'}
        </p>
        <div className="mt-8">
          <ContactForm lang={isEs ? 'es' : 'en'} />
        </div>
      </div>
    </section>
  )
}
