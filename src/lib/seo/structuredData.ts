export function organizationJsonLd(lang: 'en' | 'es') {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Aedx Solutions',
    url: `https://aedxsolutions.com/${lang}`,
    logo: 'https://aedxsolutions.com/icon.png',
    sameAs: [
      'https://www.linkedin.com/company/aedxsolutions',
    ],
    foundingDate: '2024-01-01',
    foundingLocation: 'United States',
    contactPoint: [{
      '@type': 'ContactPoint',
      contactType: 'sales',
      email: 'contact@aedxsolutions.com',
      availableLanguage: ['en','es']
    }]
  };
}

export function websiteJsonLd(lang: 'en' | 'es') {
  const base = 'https://aedxsolutions.com';
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Aedx Solutions',
    url: `${base}/${lang}`,
    inLanguage: lang,
    potentialAction: {
      '@type': 'ContactAction',
      target: `${base}/${lang}/contact`,
      name: 'Contact'
    }
  };
}
