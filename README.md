## AedxSolutions Website

Modern marketing / portfolio site built with Next.js 15 (App Router), TypeScript, and Tailwind CSS v4.

### Current Deployment (Vercel)
Automatic builds & deployments on every push to `main` (Production) and preview deployments for pull requests. Domain DNS points to Vercel (A 76.76.21.21 + `www` CNAME → vercel-dns target).

### Key Features
- Next.js App Router with React 19
- Tailwind v4 and design tokens (`src/app/theme.css` + CSS variables in `globals.css`)
- Strong SEO metadata defined in `src/app/layout.tsx`
- Security headers (HSTS, CSP, Referrer-Policy, Permissions-Policy, X-Content-Type-Options, X-Frame-Options) injected via `next.config.ts`
- CI workflow (`.github/workflows/ci.yml`) for lint + build artifact

### Scripts
- `npm run dev` – Dev server (Turbopack)
- `npm run build` – Production build (no longer static `export`; enables future ISR/dynamic capabilities)
- `npm run lint` – ESLint

### Local Development
```bash
git clone <repo>
cd website
npm install
npm run dev
```
Visit http://localhost:3000

### Production Build (local)
```bash
npm run build
```
Then run `npm start` to serve the production build locally.

### DNS / Domain
`aedxsolutions.com` apex A record → 76.76.21.21 and `www` CNAME → provided Vercel DNS hostname. SSL is auto-managed by Vercel.

### Removed Legacy Artifacts
- Static export mode & Apache `.htaccess` (replaced by Vercel runtime + security headers)
- SFTP deployment workflow (deprecated)
- Post-export copy script (`scripts/postexport.cjs`)

### Future Enhancements (Ideas)
- Add Lighthouse CI / accessibility checks in PRs
- Introduce analytics (privacy-friendly) via Edge Middleware
- Image optimization & responsive images (now possible after removing unoptimized/export settings)
- Incremental Static Regeneration for content pages

### License
MIT
