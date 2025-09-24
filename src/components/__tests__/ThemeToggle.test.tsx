import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ThemeToggle from '@/components/ThemeToggle'

function themeAttr() {
  return document.documentElement.getAttribute('data-theme')
}

describe('ThemeToggle', () => {
  beforeEach(() => {
    localStorage.clear()
    document.documentElement.setAttribute('data-theme', 'light')
  })

  it('defaults to light (no stored preference)', () => {
    render(<ThemeToggle />)
    // mounted button should render
    expect(screen.getByRole('button')).toBeInTheDocument()
    expect(themeAttr()).toBe('light')
  })

  it('toggles and persists', async () => {
    const u = userEvent.setup()
    render(<ThemeToggle />)
    const btn = await screen.findByRole('button')
    await u.click(btn)
    expect(themeAttr()).toBe('dark')
    expect(localStorage.getItem('theme')).toBe('dark')
    await u.click(btn)
    expect(themeAttr()).toBe('light')
    expect(localStorage.getItem('theme')).toBe('light')
  })
})