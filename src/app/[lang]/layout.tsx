import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import '@/app/globals.css'
import { getDictionary, Lang } from '@/lib/i18n/dictionaries'
import React from 'react'
import ThemeToggle from '@/components/ThemeToggle'

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

export default function LangLayout({ params, children }: { params: Promise<{ lang: string }>; children: React.ReactNode }) {
  return (
    <html suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{__html:`try{const s=localStorage.getItem('theme');const m=window.matchMedia('(prefers-color-scheme: dark)').matches;const t=s??(m?'dark':'light');document.documentElement.setAttribute('data-theme',t);document.documentElement.style.colorScheme=t;}catch{}`}} />
      </head>
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
        <a href={`/${safeLang}`} className="brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary rounded">
          <span className="brand-badge" aria-hidden />
          <span className="text-lg sm:text-xl">AedxSolutions</span>
        </a>
        <nav className="flex items-center gap-6 text-sm">
          <a href={`/${safeLang}`} className="hover:text-brand-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary rounded">{dict.nav.home}</a>
          <a href={`/${safeLang}/products`} className="hover:text-brand-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary rounded">{dict.nav.products}</a>
          <a href={`/${safeLang}/customers`} className="hover:text-brand-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary rounded">{dict.nav.customers}</a>
          <a href={`/${safeLang}/contact`} className="hover:text-brand-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary rounded">{dict.nav.contact}</a>
          <ThemeToggle />
        </nav>
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
