import type { NextConfig } from 'next';
import createMDX from '@next/mdx';


const withMDX = createMDX({
  extension: /\.mdx?$/,
});

const nextConfig: NextConfig = withMDX({
  reactStrictMode: true,
  trailingSlash: false,
  pageExtensions: ['ts', 'tsx', 'mdx'],
  turbopack: {
    root: __dirname,
  },
  typescript: {
    ignoreBuildErrors: true, // Ignore Playwright config errors
  },
  async headers() {
    return [
      // Immutable caching for static assets
      {
        source: '/:all*.(svg|jpg|jpeg|png|webp|avif|ico|js|css|woff2)',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
      // Global security headers (HSTS + misc)
      {
        source: '/(.*)',
        headers: [
          { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'geolocation=(), microphone=(), camera=()' },
        ],
      },
    ];
  }
});

export default nextConfig;
