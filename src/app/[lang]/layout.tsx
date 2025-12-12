import type { Metadata, Viewport } from 'next'
import type { ReactNode } from 'react'

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params
  const safeLang = lang === 'es' ? 'es' : 'en'
  const base = 'https://aedxsolutions.com'
  const current = `${base}/${safeLang}`
  return {
    metadataBase: new URL(base),
    alternates: { canonical: current, languages: { en: `${base}/en`, es: `${base}/es` } },
  }
}

export const viewport: Viewport = { width: 'device-width', initialScale: 1, maximumScale: 5, viewportFit: 'cover' }

export default function LangLayout({ children }: { children: ReactNode }) {
  return <>{children}</>
}
