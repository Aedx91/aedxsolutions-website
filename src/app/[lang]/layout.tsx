import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import '@/app/globals.css'
import { getDictionary, Lang } from '@/lib/i18n/dictionaries'
import React from 'react'
import ThemeToggle from '@/components/ThemeToggle'
import LanguageSwitcher from '@/components/LanguageSwitcher'
import Link from 'next/link'
import MobileNav from '@/components/MobileNav'

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] })
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] })

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

export default function LangLayout({ params, children }: { params: Promise<{ lang: string }>; children: React.ReactNode }) {
  return (
    <html suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col bg-surface-app text-text-primary`}>        
        <LangShell paramsPromise={params}>{children}</LangShell>
      </body>
    </html>
  )
}

async function LangShell({ paramsPromise, children }: { paramsPromise: Promise<{ lang: string }>; children: React.ReactNode }) {
  const { lang } = await paramsPromise
  const safeLang: Lang = lang === 'es' ? 'es' : 'en'
  const dict = await getDictionary(safeLang)
  return (
    <>
      <header className="container section-sm flex items-center justify-between">
        <Link href={`/${safeLang}`} className="brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary rounded">
          <span className="brand-badge" aria-hidden />
          <span className="text-lg sm:text-xl">AedxSolutions</span>
        </Link>
        <nav className="hidden md:flex items-center gap-6 text-sm">
          <Link href={`/${safeLang}`} className="hover:text-brand-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary rounded">{dict.nav.home}</Link>
          <Link href={`/${safeLang}/products`} className="hover:text-brand-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary rounded">{dict.nav.products}</Link>
          <Link href={`/${safeLang}/customers`} className="hover:text-brand-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary rounded">{dict.nav.customers}</Link>
          <Link href={`/${safeLang}/contact`} className="hover:text-brand-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary rounded">{dict.nav.contact}</Link>
          <LanguageSwitcher current={safeLang} />
          <ThemeToggle />
        </nav>
        <MobileNav lang={safeLang} dict={dict} />
      </header>
      <main className="flex-1">{children}</main>
      <footer className="bg-surface-section">
        <div className="container section-sm text-sm text-text-secondary flex flex-col sm:flex-row gap-4 sm:items-center justify-between">
          <span>© {new Date().getFullYear()} AedxSolutions</span>
          <div className="flex gap-6">
            <a className="link" href={`/${safeLang}/legal/privacy`}>{dict.footer.privacy}</a>
            <a className="link" href={`/${safeLang}/legal/terms`}>{dict.footer.terms}</a>
          </div>
        </div>
      </footer>
    </>
  )
}
