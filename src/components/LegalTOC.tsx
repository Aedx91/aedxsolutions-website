import React from 'react';

interface Heading { id: string; text: string; }

// Simple clientless TOC: we generate IDs manually in MDX and list them here via props later if needed.
// For now we parse children (string search) – lightweight placeholder until a parser step is added.
export function LegalTOC({ content }: { content: string }) {
  const headings: Heading[] = [];
  const regex = /<h2 id="(.*?)".*?>(.*?)<\/h2>/g;
  let match: RegExpExecArray | null;
  while ((match = regex.exec(content)) !== null) {
    headings.push({ id: match[1], text: match[2].replace(/<[^>]+>/g,'') });
  }
  if (!headings.length) return null;
  return (
    <nav aria-label="Table of contents" className="hidden lg:block sticky top-28 max-h-[calc(100vh-8rem)] overflow-auto pr-6 text-sm">
      <p className="font-semibold mb-3 text-text-secondary/80 tracking-wide uppercase">On this page</p>
      <ul className="space-y-2">
        {headings.map(h => (
          <li key={h.id}>
            <a href={`#${h.id}`} className="hover:text-brand-primary focus:text-brand-primary focus:outline-none">
              {h.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
