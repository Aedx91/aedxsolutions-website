"use client"
import React, { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import ThemeToggle from './ThemeToggle'
import LanguageSwitcher from './LanguageSwitcher'

type DictShape = {
  nav: { products: string; customers: string; contact: string; home?: string }
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

  // keep aria-expanded attribute in sync imperatively to avoid lint false-positives
  useEffect(() => {
    const btn = buttonRef.current
    if (!btn) return
    btn.setAttribute('aria-expanded', open ? 'true' : 'false')
  }, [open])

  return (
    <div className="md:hidden">
      <button
        ref={buttonRef}
        aria-controls="mobile-nav"
        onClick={() => setOpen(v => !v)}
        className="inline-flex items-center justify-center p-2 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
      >
        <span className="sr-only">{open ? 'Close menu' : 'Open menu'}</span>
        {open ? '✕' : '☰'}
      </button>

      {open && (
        <div className="fixed inset-0 z-40">
          <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />
          <div
            id="mobile-nav"
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            className="absolute right-0 top-0 w-72 h-full bg-surface-section shadow-lg p-6 flex flex-col gap-6"
          >
            <nav className="flex flex-col gap-4 text-lg">
              <Link href={`/${lang}`} onClick={() => setOpen(false)} className="font-semibold">{dict.nav.home ?? 'Home'}</Link>
              <Link href={`/${lang}/products`} onClick={() => setOpen(false)}>{dict.nav.products}</Link>
              <Link href={`/${lang}/customers`} onClick={() => setOpen(false)}>{dict.nav.customers}</Link>
              <Link href={`/${lang}/contact`} onClick={() => setOpen(false)}>{dict.nav.contact}</Link>
            </nav>

            <div className="mt-auto flex items-center justify-between gap-3">
              <LanguageSwitcher current={lang === 'es' ? 'es' : 'en'} />
              <ThemeToggle />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

