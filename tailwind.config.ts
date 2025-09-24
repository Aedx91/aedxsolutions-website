import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: ['class', '[data-theme="dark"]'],
  content: ['./src/**/*.{ts,tsx,js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: 'var(--brand-primary)',
          secondary: 'var(--brand-secondary)',
        },
        surface: {
          app: 'var(--surface-app)',
          section: 'var(--surface-section)',
          raised: 'var(--surface-raised)',
          deep: 'var(--surface-deep)',
        },
        text: {
          primary: 'var(--text-primary)',
          secondary: 'var(--text-secondary)',
          inverse: 'var(--text-inverse)',
        },
        border: {
          subtle: 'var(--border-subtle)',
        },
        state: {
          success: 'var(--state-success)',
          warning: 'var(--state-warning)',
          error: 'var(--state-error)',
        },
      },
      boxShadow: {
        card: '0 1px 2px rgba(0,0,0,0.06), 0 10px 30px rgba(0,0,0,0.10)',
        cardDark: '0 1px 1px rgba(0,0,0,0.40), 0 12px 32px rgba(0,0,0,0.45)',
        glow: '0 0 0 4px rgba(0,120,212,0.30)'
      }
    }
  },
  plugins: []
}

export default config
