"use client";
import React from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';

// A simple toggle style switcher that preserves the rest of the path & query string.
export default function LanguageSwitcher({ current }: { current: 'en' | 'es' }) {
  const pathname = usePathname() || '/en';
  const search = useSearchParams();
  const other = current === 'en' ? 'es' : 'en';
  const nextPath = pathname.replace(/^\/(en|es)/, `/${other}`);
  const qs = search.toString();
  const href = qs ? `${nextPath}?${qs}` : nextPath;
  return (
    <div className="flex items-center gap-1" aria-label="Language selector">
      <span className="sr-only">Language</span>
      <Link
        href={href}
        aria-label={`Switch language to ${other.toUpperCase()}`}
        className="px-2 py-1 text-xs font-medium rounded-md border border-border-subtle hover:border-border-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary transition-colors bg-surface-raised/70 backdrop-blur"
      >
        {other.toUpperCase()}
      </Link>
    </div>
  );
}
