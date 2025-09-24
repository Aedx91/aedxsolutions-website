import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://aedxsolutions.com';
  const lastModified = new Date();
  const shared = ['', '/products', '/customers', '/contact', '/legal/privacy', '/legal/terms'];
  const entries: MetadataRoute.Sitemap = [];
  for (const p of shared) {
    const enUrl = `${base}/en${p}`;
    const esUrl = `${base}/es${p}`;
    // We list only EN canonical plus ES counterpart OR both; here include both for clarity.
    entries.push({
      url: enUrl,
      lastModified,
      alternates: { languages: { en: enUrl, es: esUrl } }
    });
    entries.push({
      url: esUrl,
      lastModified,
      alternates: { languages: { en: enUrl, es: esUrl } }
    });
  }
  return entries;
}
