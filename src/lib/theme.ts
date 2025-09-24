export type Theme = 'light' | 'dark'
const KEY = 'theme'

export function setTheme(t: Theme, persist = true) {
  const root = document.documentElement
  root.setAttribute('data-theme', t)
  root.style.colorScheme = t
  if (persist) try { localStorage.setItem(KEY, t) } catch {}
}

export function initTheme() {
  try {
    const stored = localStorage.getItem(KEY) as Theme | null
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    setTheme(stored ?? (prefersDark ? 'dark' : 'light'), false)
  } catch {}
}

export function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light'
  setTheme(current === 'dark' ? 'light' : 'dark')
}
