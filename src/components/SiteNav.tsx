"use client";
import React from 'react';
import LanguageSwitcher from './LanguageSwitcher';
import { usePathname } from 'next/navigation';
import type { Lang } from '@/lib/i18n/dictionaries';

interface DictShape {
  nav: { products: string; customers: string; contact: string };
  footer: { privacy: string; terms: string };
}

interface Props {
  lang: Lang;
  dict: DictShape;
}

const links = [
  { href: 'products', key: 'products' as const },
  { href: 'customers', key: 'customers' as const },
  { href: 'contact', key: 'contact' as const },
];

export default function SiteNav({ lang, dict }: Props) {
  const pathname = usePathname();
  return (
    <header className="container flex items-center justify-between py-6">
  <a href={`/${lang}`} className="font-semibold text-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-secondary rounded-sm text-white">AedxSolutions</a>
  <nav className="flex items-center gap-6 text-sm" aria-label="Main navigation">
        {links.map(l => {
          const full = `/${lang}/${l.href}`;
          const active = pathname === full;
          return (
            <a
              key={l.key}
              href={full}
              aria-current={active ? 'page' : undefined}
              className={`transition-colors text-white/85 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-secondary rounded-sm ${active ? 'font-semibold underline underline-offset-4 decoration-brand-secondary text-white' : ''}`}
            >
              {dict.nav[l.key]}
            </a>
          );
        })}
        <LanguageSwitcher lang={lang} />
      </nav>
    </header>
  );
}
