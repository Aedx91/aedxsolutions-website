import Link from 'next/link'
import type { ReactNode } from 'react'
import ThemeToggle from '@/components/ThemeToggle'
import LanguageSwitcher from '@/components/LanguageSwitcher'
import MobileNav from '@/components/MobileNav'
import { getDictionary, Lang } from '@/lib/i18n/dictionaries'

export default async function SiteLayout({
  params,
  children,
}: {
  params: Promise<{ lang: string }>
  children: ReactNode
}) {
  const { lang: rawLang } = await params
  const lang: Lang = rawLang === 'es' ? 'es' : 'en'
  const dict = await getDictionary(lang)

  return (
    <div className="relative min-h-screen flex flex-col">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[70vh] hero-bg-base hero-bg-feather"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[70vh] hero-pattern-overlay hero-bg-feather"
      />

      <div className="site-shell">
        <header className="relative z-10 container section-sm flex items-center justify-between">
          <Link
            href={`/${lang}`}
            className="brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary rounded"
          >
            <span className="brand-badge" aria-hidden />
            <span className="text-xl sm:text-2xl font-semibold tracking-tight leading-tight">
              AedxSolutions
            </span>
          </Link>

          <div className="flex items-center gap-3">
            <Link
              href={`/${lang}/demo/login`}
              className="nav-pill focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
            >
              {dict.demo?.loginButton ?? 'Demo Login'}
            </Link>

            <nav className="hidden md:flex items-center gap-3">
              <Link
                href={`/${lang}`}
                className="nav-pill focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
              >
                {dict.nav.home}
              </Link>
              <Link
                href={`/${lang}/products`}
                className="nav-pill focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
              >
                {dict.nav.products}
              </Link>
              <Link
                href={`/${lang}/customers`}
                className="nav-pill focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
              >
                {dict.nav.customers}
              </Link>
              <Link
                href={`/${lang}/contact`}
                className="nav-pill focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
              >
                {dict.nav.contact}
              </Link>
              <LanguageSwitcher current={lang} />
              <ThemeToggle />
            </nav>

            <MobileNav lang={lang} dict={dict} />
          </div>
        </header>

        <main className="relative z-10 flex-1">{children}</main>

        <footer className="relative z-10 bg-surface-section">
          <div className="container section-sm text-sm text-text-secondary flex flex-col sm:flex-row gap-4 sm:items-center justify-between">
            <span>© {new Date().getFullYear()} AedxSolutions</span>
            <div className="flex gap-6">
              <a className="link" href={`/${lang}/legal/privacy`}>
                {dict.footer.privacy}
              </a>
              <a className="link" href={`/${lang}/legal/terms`}>
                {dict.footer.terms}
              </a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}
