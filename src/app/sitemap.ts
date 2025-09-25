import type { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://aedxsolutions.com'
  const routes = ['', '/products', '/customers', '/contact', '/legal/privacy', '/legal/terms']
  const langs: ('en'|'es')[] = ['en','es']
  const urls = langs.flatMap(lang => routes.map(r => ({
    url: `${base}/${lang}${r}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: r === '' ? 1 : 0.7,
  })))
  return urls
}
