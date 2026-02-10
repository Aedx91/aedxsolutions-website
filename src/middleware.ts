import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

function buildCsp(isProd: boolean) {
  const base = [
    "default-src 'self'",
    "base-uri 'self'",
    "object-src 'none'",
    "frame-ancestors 'none'",
    "img-src 'self' data: blob:",
    "style-src 'self' 'unsafe-inline'",
    "font-src 'self' data:",
    // NOTE: Next.js renders some required inline scripts. Enforcing nonce-based CSP
    // requires *all* of those scripts to carry the matching nonce.
    // Until that pipeline is fully in place, do NOT include a nonce in `script-src`,
    // because browsers will then ignore `'unsafe-inline'` and block inline execution.
    isProd
      ? "script-src 'self' 'unsafe-inline'"
      : "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
  ]

  if (isProd) {
    base.push("connect-src 'self'")
  } else {
    // Dev HMR uses WS connections.
    base.push("connect-src 'self' ws: http://localhost:3000 http://127.0.0.1:3000")
  }

  return base.join('; ')
}

function nonceValue() {
  // Edge runtime safe nonce generation
  return globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random()}`
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // Canonical redirects (single source of truth)
  if (pathname === '/') {
    const url = req.nextUrl.clone()
    url.pathname = '/en'
    return NextResponse.redirect(url, 308)
  }
  if (pathname === '/privacy') {
    const url = req.nextUrl.clone()
    url.pathname = '/en/legal/privacy'
    return NextResponse.redirect(url, 308)
  }
  if (pathname === '/terms') {
    const url = req.nextUrl.clone()
    url.pathname = '/en/legal/terms'
    return NextResponse.redirect(url, 308)
  }

  const isProd = process.env.NODE_ENV === 'production'
  const nonce = nonceValue()

  // Pass nonce into the app render pipeline (server components can read it).
  const requestHeaders = new Headers(req.headers)
  requestHeaders.set('x-nonce', nonce)

  const res = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  })

  // Response headers
  res.headers.set('x-nonce', nonce)
  res.headers.set('Content-Security-Policy', buildCsp(isProd))
  return res
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
