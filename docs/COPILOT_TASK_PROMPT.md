# Copilot Task Prompt — AedxSolutions Website Hardening (Top 3 Improvements)

Use this prompt for an AI coding agent (Copilot-style) to implement **three** production-grade improvements in small, reviewable changes.

## Context

- App: Next.js 15 App Router in `website/`.
- Bilingual routing: `/en/*` and `/es/*`.
- Current security headers are defined in `next.config.ts`, but CSP is relaxed (`unsafe-inline`) in production.
- Redirect logic is duplicated between middleware and `next.config.ts`.
- Contact form uses a Server Action but currently only logs.

## Rules / constraints

- Do not print or commit any secret values.
- Do not introduce new UI pages.
- Keep UX the same unless the task explicitly requires a change.
- Validate with `npm run lint` and `npm run build` at minimum.

---

## Task 1 — Harden CSP in production (remove `unsafe-inline` for scripts)

### Goal

Replace the current “temporary hotfix” CSP that allows inline scripts in production with a **nonce-based** CSP.

### Why

CSP with `script-src 'unsafe-inline'` weakens XSS protection. A nonce-based CSP allows required scripts without global inline execution.

### Implementation plan (recommended)

1. **Add a request nonce in middleware**
   - Update `middleware.ts` to:
     - Generate a fresh nonce per request.
     - Attach it as a response header, e.g. `x-nonce: <nonce>`.
     - Set a `Content-Security-Policy` header that includes `script-src 'self' 'nonce-<nonce>'`.
   - Keep a separate dev CSP that still allows HMR (`unsafe-eval` + ws connects).

2. **Consume nonce in server components that inject scripts**
   - In `src/app/[lang]/(site)/page.tsx`, the page currently injects JSON-LD via `<script dangerouslySetInnerHTML=...>`.
   - Read the nonce using `import { headers } from 'next/headers'` and apply `nonce={nonce}` to those `<script>` tags.
   - If any other inline scripts exist (now or later), they must also carry the nonce.

3. **Stop setting CSP in `next.config.ts` once middleware handles it**
   - Keep other security headers in `next.config.ts` (HSTS, XFO, etc.).
   - Remove the CSP header there to avoid confusion and ensure there is exactly one source of truth.

### Acceptance criteria

- In production mode (`NODE_ENV=production`), `Content-Security-Policy` does **not** contain `script-src 'unsafe-inline'`.
- The home page still renders and structured data scripts remain present.
- `npm run build` passes.

---

## Task 2 — Consolidate redirects (single source of truth)

### Goal

Remove duplicate redirect logic so there is only one mechanism deciding redirects.

### Current situation

- `middleware.ts` redirects `/` → `/en`.
- `next.config.ts` also redirects `/` → `/en` and also redirects `/privacy` and `/terms`.

### Implementation plan (recommended)

Option A (recommended if middleware is already needed for CSP):
- Keep redirects in **middleware** (fast, centralized when already running).
- Remove redirect rules from `next.config.ts`.

Option B (recommended if you decide middleware should be removed):
- Keep redirects only in **`next.config.ts`**.
- Remove redirect handling from middleware.

Pick **one** option and delete the other to avoid drift.

### Acceptance criteria

- Visiting `/` redirects to `/en` (308/307 acceptable; prefer permanent if intended).
- Visiting `/privacy` redirects to `/en/legal/privacy`.
- Visiting `/terms` redirects to `/en/legal/terms`.
- No duplicate redirect implementations remain.

---

## Task 3 — Make contact form send email (Resend preferred, SMTP fallback)

### Goal

When users submit the contact form, send an email notification to the business inbox.

### Current situation

- Contact form is implemented as a Server Action: `src/app/[lang]/contact/actions.ts`.
- The form UI used by the localized contact page is `src/components/ContactForm.tsx`.
- The action currently logs only.

### Implementation plan (recommended)

1. Add an email sending helper (server-only)
   - Create a small helper in `src/lib/email/contact.ts`.
   - It should:
     - Prefer Resend if `RESEND_API_KEY` is set.
     - Fallback to SMTP if `SMTP_HOST`, `SMTP_USER`, `SMTP_PASS` exist.
     - If neither is configured, keep current behavior (log), but return `{ ok: true }` to avoid breaking UX.

2. Wire the helper into the Server Action
   - In `src/app/[lang]/contact/actions.ts`:
     - After validation passes, call the helper.
     - Do not expose internal errors to the user; keep a generic message.

3. Remove duplicate/unused contact form implementation
   - There is a second contact form component at `src/app/[lang]/contact/ContactForm.tsx` which appears to be a simulated form.
   - Remove it if it is not referenced, to avoid confusion.

### Acceptance criteria

- Submitting the form triggers a send attempt (Resend if configured, else SMTP, else logs).
- No UI changes required.
- `npm run lint` and `npm run build` pass.

---

## Validation commands (run locally)

From `website/`:

- `npm run lint`
- `npm test`
- `npm run build`

Optional (slower):
- `npm run e2e`

---

## Suggested PR breakdown

1. PR #1: CSP nonce in middleware + add nonce to JSON-LD scripts
2. PR #2: Redirect consolidation (pick one redirect source)
3. PR #3: Contact email sending + remove duplicate contact form file
