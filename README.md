## AedxSolutions Website

Next.js 15 + TypeScript + Tailwind v4. Static export optimized for GoDaddy (cPanel/Apache).

### Scripts
- `npm run dev` — Dev server with Turbopack
- `npm run build` — Builds and exports static site to `out/`, then copies `.htaccess`, `robots.txt`, `sitemap.xml`
- `npm run lint` — ESLint

### Build
1. `cd website`
2. `npm install`
3. `npm run build`
4. Output in `out/`

### Deploy (GoDaddy cPanel)
1. Open cPanel > File Manager > `public_html/`
2. Upload contents of `out/` (including `_next/` and `.htaccess`)
3. Ensure SSL is enabled (AutoSSL/Let’s Encrypt)
4. Verify: https://aedxsolutions.com , `/robots.txt`, `/sitemap.xml`

### Tech
- Next.js App Router, `output: 'export'`
- Tailwind v4, design tokens in `src/app/theme.css`
- SEO: metadata in `src/app/layout.tsx`
- Apache config: `.htaccess` (HTTPS, cache, compression, security headers)

### CI/CD (optional)
Use GitHub Actions to build and SFTP-upload `out/` to GoDaddy `public_html/`. Store credentials as GitHub Secrets.

### License
MIT
