export default function sitemap() {
  const base = 'https://aedxsolutions.com'
  const routes = ['', '/products', '/customers', '/contact', '/legal/privacy', '/legal/terms']
  const langs = ['en','es']
  const urls = langs.flatMap(lang => routes.map(r => ({
    url: `${base}/${lang}${r}`,
    lastModified: new Date().toISOString(),
    changefreq: 'weekly',
    priority: r === '' ? 1 : 0.7,
  })))
  return urls
}
