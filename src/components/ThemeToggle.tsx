'use client'
import { useEffect, useState } from 'react'
import { initTheme, toggleTheme } from '@/lib/theme'

export default function ThemeToggle() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [ready, setReady] = useState(false)

  useEffect(() => {
    initTheme()
    setReady(true)
    // Set initial theme state
    const currentTheme = document.documentElement.getAttribute('data-theme') as 'light' | 'dark' || 'light'
    setTheme(currentTheme)
  }, [])

  useEffect(() => {
    if (!ready) return

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'data-theme') {
          const newTheme = document.documentElement.getAttribute('data-theme') as 'light' | 'dark' || 'light'
          setTheme(newTheme)
        }
      })
    })

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme']
    })

    return () => observer.disconnect()
  }, [ready])

  const handleToggle = () => {
    toggleTheme()
  }

  if (!ready) return null

  const isDark = theme === 'dark'

  return (
    <button
      onClick={handleToggle}
      className={`btn btn-outline rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary transition-colors ${isDark ? 'bg-white/5' : 'bg-transparent'}`}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDark ? 'Light mode' : 'Dark mode'}
    >
      {isDark ? '☀️' : '🌙'}
    </button>
  )
}
