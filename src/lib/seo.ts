import type { Metadata } from 'next'

export type Lang = 'en' | 'es'
export const siteBase = 'https://aedxsolutions.com'

export function alternatesFor(lang: Lang, path = '') {
  return {
    languages: {
      en: `${siteBase}/en${path}`,
      es: `${siteBase}/es${path}`,
    },
  } as Metadata['alternates']
}

export function pageMeta(
  lang: Lang,
  path: string,
  title: string,
  description: string
): Metadata {
  const url = `${siteBase}/${lang}${path}`
  return {
    title,
    description,
    alternates: alternatesFor(lang, path),
    openGraph: {
      title,
      description,
      url,
      siteName: 'AedxSolutions',
      locale: lang === 'es' ? 'es_GT' : 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  }
}
