export type Theme = 'light' | 'dark';
const KEY = 'theme';

export function initTheme() {
  try {
    const stored = localStorage.getItem(KEY) as Theme | null;
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const theme: Theme = stored ?? (prefersDark ? 'dark' : 'light');
    setTheme(theme, false);
    if (!stored) {
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
        setTheme(e.matches ? 'dark' : 'light');
      });
    }
  } catch {}
}

export function setTheme(theme: Theme, persist = true) {
  const root = document.documentElement;
  if (theme === 'dark') root.classList.add('dark');
  else root.classList.remove('dark');
  root.style.colorScheme = theme;
  if (persist) localStorage.setItem(KEY, theme);
}

export function toggleTheme() {
  const isDark = document.documentElement.classList.contains('dark');
  setTheme(isDark ? 'light' : 'dark');
}
