# AI Repo Brief — AedxSolutions (aedxsolutions.com)

This document is written for AI coding agents (Copilot-style) to quickly understand this repository and propose safe, high-value improvements.

## High-level

- This repo contains two parts:
  - A **brand/design tokens** bundle at the repository root (colors and tokens in multiple formats).
  - The **website** Next.js application in `website/` (this is what is deployed as aedxsolutions.com).

## Website stack (website/)

- Framework: **Next.js 15 (App Router)** + **React 19** + **TypeScript**
- Styling: **Tailwind v4** + **CSS variables** theme tokens + `data-theme` light/dark
- Tests: **Jest** (unit) + **Playwright** (e2e) including **Axe** a11y and visual snapshots
- Server routes (App Router): API routes under `src/app/api/*`

## Run commands

From `website/`:

- Dev: `npm run dev`
- Build: `npm run build`
- Start: `npm run start`
- Lint: `npm run lint`
- Unit tests: `npm test`
- E2E: `npm run e2e`

## Routing & i18n

- Locale strategy is URL-prefixed: `/en/*` and `/es/*`.
- Locale segment: `src/app/[lang]/...`
- Dictionaries:
  - `src/lib/i18n/dictionaries.ts` (router)
  - `src/lib/i18n/en.ts`
  - `src/lib/i18n/es.ts`
- Language switcher rewrites the first path segment and preserves query string: `src/components/LanguageSwitcher.tsx`.

### Public marketing pages (localized)

- `/:lang` home: `src/app/[lang]/(site)/page.tsx`
- `/:lang/products`: `src/app/[lang]/(site)/products/page.tsx`
- `/:lang/customers`: `src/app/[lang]/(site)/customers/page.tsx`
- `/:lang/contact`: `src/app/[lang]/(site)/contact/page.tsx`
- `/:lang/legal/privacy`: `src/app/[lang]/(site)/legal/privacy/page.tsx`
- `/:lang/legal/terms`: `src/app/[lang]/(site)/legal/terms/page.tsx`

### Demo area (localized)

- `/:lang/demo/login`: `src/app/[lang]/demo/login/page.tsx`
- `/:lang/demo/dashboard`: `src/app/[lang]/demo/dashboard/page.tsx`
- `/:lang/demo/admin`: `src/app/[lang]/demo/admin/page.tsx`
- `/:lang/demo/pollo`: `src/app/[lang]/demo/pollo/page.tsx`

Important: demo gating uses **client-side localStorage** auth only (`src/hooks/useAuth.ts`). It is intended for demos, not production security.

## Styling & theming

- Theme tokens live in `src/styles/theme.css` and are consumed via CSS variables.
- Theme toggling:
  - logic: `src/lib/theme.ts`
  - UI: `src/components/ThemeToggle.tsx`
- Tailwind maps semantic colors to CSS vars in `tailwind.config.js`.

## SEO

- Global metadata: `src/app/layout.tsx`
- Per-page helper: `src/lib/seo.ts`
- Sitemap: `src/app/sitemap.ts`
- Robots: `src/app/robots.ts`

## Server/API features

### Email notifications

- `POST /api/menu/selection`: `src/app/api/menu/selection/route.ts`
- `POST /api/date/accept`: `src/app/api/date/accept/route.ts`

These attempt Resend first (if configured), then SMTP fallback; otherwise they log.

### Supabase-backed demo dates + calendar sync

- `GET/POST /api/dates`: `src/app/api/dates/route.ts`
- `DELETE /api/dates/:id`: `src/app/api/dates/[id]/route.ts`
- Supabase service client: `src/lib/supabase/server.ts`
- OAuth token store: `src/lib/integrations/tokens.ts`
- Google calendar integration: `src/lib/integrations/google.ts`
- Microsoft calendar integration: `src/lib/integrations/microsoft.ts`

Important: `/api/dates` identifies the “user” via request header `x-demo-user`. This is **demo-only** and should not be treated as secure identity.

### Legacy Postgres auth (optional)

- DB pool: `src/lib/db.ts` expects `DATABASE_URL`
- Auth helpers: `src/lib/auth/server.ts` expects `AUTH_SECRET`
- Auth endpoints: `src/app/api/auth/*`

Project note: the Azure Postgres instance was deleted; see `DB_NOTES.md`.

## Environment variables (names only)

Never print actual values; only reference names.

- Postgres auth: `DATABASE_URL`, `AUTH_SECRET`
- Supabase: `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`
- OAuth:
  - Google: `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `APP_BASE_URL`
  - Microsoft: `MS_CLIENT_ID`, `MS_CLIENT_SECRET`, `MS_TENANT_ID`, `APP_BASE_URL`
- Email:
  - Resend: `RESEND_API_KEY`, `RESEND_FROM`
  - SMTP: `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM`

## CI / deployment reality

- This project builds with `next build` (dynamic Next runtime). It is **not** a static export (`out/`).
- A legacy SFTP deploy workflow exists but is not appropriate for server features.

## Known risk flags (good AI suggestions should mention)

- Security headers include a relaxed CSP in production (`unsafe-inline`) in `next.config.ts`.
- `next.config.ts` has `typescript.ignoreBuildErrors: true` (type safety reduced).
- Demo auth and demo identity headers are not production security.
- Some legacy/duplicate routes exist (redirected) and can be cleaned up.

## Suggested improvement backlog (safe, high-value)

1. Keep CI aligned with `next build` (no `out/` assumptions).
2. Remove legacy routes/files and consolidate redirects to a single source.
3. Harden CSP (nonce/hash strategy) and remove `unsafe-inline` where possible.
4. Stop ignoring TypeScript build errors, or narrow it to specific cases.
5. If demo becomes real: replace `x-demo-user` with real auth/authorization.
6. Unify contact form implementations (there are two ContactForm components; one is a simulation).
