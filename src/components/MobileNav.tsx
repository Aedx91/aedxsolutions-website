"use client"
import React, { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import ThemeToggle from './ThemeToggle'
import LanguageSwitcher from './LanguageSwitcher'
import { AnimatePresence, motion } from 'framer-motion'

type DictShape = {
  nav: { products: string; customers: string; contact: string; home?: string }
  demo?: { loginButton?: string }
  menu?: { open: string; close: string }
}

export default function MobileNav({ lang, dict }: { lang: string; dict: DictShape }) {
  const [open, setOpen] = useState(false)
  const panelRef = useRef<HTMLDivElement | null>(null)
  const buttonRef = useRef<HTMLButtonElement | null>(null)

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false)
    }
    if (open) document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open])

  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [open])

  useEffect(() => {
    const root = document.documentElement
    if (open) {
      root.setAttribute('data-nav-open', 'true')
    } else {
      root.removeAttribute('data-nav-open')
    }
    return () => root.removeAttribute('data-nav-open')
  }, [open])

  const openLabel = dict.menu?.open ?? 'Open menu'
  const closeLabel = dict.menu?.close ?? 'Close menu'

  return (
    <div className="md:hidden">
      <button
        ref={buttonRef}
        aria-controls="mobile-nav"
        aria-expanded={open}
        aria-haspopup="dialog"
        type="button"
        onClick={() => setOpen(v => !v)}
        className="inline-flex items-center justify-center p-2 rounded-md text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
      >
        <span className="sr-only">{open ? closeLabel : openLabel}</span>
        <span className="flex flex-col items-center justify-center">
          <span
            className={`block h-0.5 w-5 rounded bg-current transition-transform duration-200 ${
              open ? 'translate-y-1.5 rotate-45' : ''
            }`}
          />
          <span
            className={`mt-1.5 block h-0.5 w-5 rounded bg-current transition-opacity duration-200 ${
              open ? 'opacity-0' : 'opacity-100'
            }`}
          />
          <span
            className={`mt-1.5 block h-0.5 w-5 rounded bg-current transition-transform duration-200 ${
              open ? '-translate-y-1.5 -rotate-45' : ''
            }`}
          />
        </span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <button
              type="button"
              aria-label={closeLabel}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              onClick={() => setOpen(false)}
            />
            <motion.div
              id="mobile-nav"
              ref={panelRef}
              role="dialog"
              aria-modal="true"
              initial={{ x: 320 }}
              animate={{ x: 0 }}
              exit={{ x: 320 }}
              transition={{ type: 'spring', stiffness: 260, damping: 26 }}
              className="absolute right-0 top-0 w-72 h-full bg-surface-section text-text-primary shadow-xl p-6 flex flex-col gap-6"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm uppercase tracking-[0.3em] text-text-secondary">
                  {dict.nav.home ?? 'Menu'}
                </span>
                <button
                  type="button"
                  className="text-text-secondary hover:text-text-primary"
                  onClick={() => setOpen(false)}
                >
                  <span className="sr-only">{closeLabel}</span>
                  ✕
                </button>
              </div>
              <nav className="flex flex-col gap-4 text-lg">
                <Link href={`/${lang}`} onClick={() => setOpen(false)} className="font-semibold">
                  {dict.nav.home ?? 'Home'}
                </Link>
                <Link href={`/${lang}/products`} onClick={() => setOpen(false)}>
                  {dict.nav.products}
                </Link>
                <Link href={`/${lang}/customers`} onClick={() => setOpen(false)}>
                  {dict.nav.customers}
                </Link>
                <Link href={`/${lang}/contact`} onClick={() => setOpen(false)}>
                  {dict.nav.contact}
                </Link>
                <Link href={`/${lang}/demo/login`} onClick={() => setOpen(false)}>
                  {dict.demo?.loginButton ?? 'Demo Login'}
                </Link>
              </nav>

              <div className="mt-auto flex items-center justify-between gap-3">
                <LanguageSwitcher current={lang === 'es' ? 'es' : 'en'} />
                <ThemeToggle />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

