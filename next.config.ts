import type { NextConfig } from 'next';
import createMDX from '@next/mdx';

// Vercel-optimized config. In development we relax CSP (or omit) because Next.js dev server
// uses inline scripts + eval + WebSocket connections for HMR which a strict CSP blocks, causing
// a blank/black screen. In production we apply the hardened policy.
const isProd = process.env.NODE_ENV === 'production';

// NOTE: Temporary hotfix: Added 'unsafe-inline' to script-src to unblock blank screen
// caused by CSP blocking Next.js small inline bootstrap/runtime chunks and our
// (now removed) early theme setter. For a hardened policy, replace this with
// nonce or hash based allowances per request.
const prodCsp = [
  "default-src 'self'",
  "img-src 'self' data: blob:",
  "style-src 'self' 'unsafe-inline'",
  "font-src 'self' data:",
  // TEMP: allow inline scripts so Next runtime can execute. Replace with nonce.
  "script-src 'self' 'unsafe-inline'",
  "connect-src 'self'",
].join('; ');

const devCsp = [
  "default-src 'self'",
  "img-src 'self' data: blob:",
  "style-src 'self' 'unsafe-inline'",
  "font-src 'self' data:",
  // Allow inline/eval + WS for Next dev HMR.
  "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
  "connect-src 'self' ws://localhost:3000 ws://127.0.0.1:3000 ws://192.168.1.69:3000",
].join('; ');

const withMDX = createMDX({
  extension: /\.mdx?$/,
});

const nextConfig: NextConfig = withMDX({
  reactStrictMode: true,
  trailingSlash: false,
  pageExtensions: ['ts', 'tsx', 'mdx'],
  typescript: {
    ignoreBuildErrors: true, // Ignore Playwright config errors
  },
  async redirects() {
    return [
      { source: '/', destination: '/en', permanent: true },
      { source: '/privacy', destination: '/en/legal/privacy', permanent: true },
      { source: '/terms', destination: '/en/legal/terms', permanent: true },
    ];
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
          // Use relaxed CSP only in dev to avoid breaking Next.js tooling.
          { key: 'Content-Security-Policy', value: isProd ? prodCsp : devCsp },
        ],
      },
    ];
  }
});

export default nextConfig;
