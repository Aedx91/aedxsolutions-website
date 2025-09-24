'use client';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';

export default function LanguageSwitcher({ lang }: { lang: 'en' | 'es' }) {
  const pathname = usePathname() || '/en';
  const search = useSearchParams();
  const to = lang === 'en' ? 'es' : 'en';
  const nextPath = pathname.replace(/^\/(en|es)/, `/${to}`);
  const qs = search.toString();
  const href = qs ? `${nextPath}?${qs}` : nextPath;
  return (
    <Link
      href={href}
      aria-label={`Switch language to ${to.toUpperCase()}`}
      className="inline-flex items-center gap-2 rounded-md border border-neutral-dark/20 bg-white/70 px-3 py-1.5 text-sm font-medium backdrop-blur hover:bg-white transition-colors"
    >
      {to.toUpperCase()}
    </Link>
  );
}
