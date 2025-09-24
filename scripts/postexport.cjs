// Ensure exported static files exist and copy public extras into out/
const { copyFileSync, existsSync } = require('fs');
const { join } = require('path');

const outDir = join(process.cwd(), 'out');
const publicDir = join(process.cwd(), 'public');

if (!existsSync(outDir)) {
  console.error('out/ directory not found. Make sure output: "export" is set and build succeeded.');
  process.exit(0);
}

const files = ['.htaccess', 'robots.txt', 'sitemap.xml'];
for (const f of files) {
  const src = join(publicDir, f);
  const dst = join(outDir, f);
  if (existsSync(src)) {
    try {
      copyFileSync(src, dst);
      console.log(`Copied ${f} -> out/${f}`);
    } catch (e) {
      console.warn(`Failed to copy ${f}:`, e.message);
    }
  }
}
