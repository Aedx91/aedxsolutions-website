import {
  AUTH_STORAGE_KEY,
  clearStoredAuth,
  getStoredAuth,
  setStoredAuth,
  validateDemoCredentials,
} from '@/hooks/useAuth'

describe('useAuth storage helpers', () => {
  beforeEach(() => {
    window.localStorage.clear()
  })

  test('validateDemoCredentials accepts only Carmy credentials', () => {
    expect(validateDemoCredentials('carmy', 'carmylovesfood')).toBe(true)
    expect(validateDemoCredentials('carmy', 'nope')).toBe(false)
    expect(validateDemoCredentials('nope', 'carmylovesfood')).toBe(false)
  })

  test('setStoredAuth/getStoredAuth roundtrip', () => {
    expect(getStoredAuth()).toBeNull()

    setStoredAuth({ isAuthenticated: true, user: 'carmy' })
    expect(window.localStorage.getItem(AUTH_STORAGE_KEY)).toContain('carmy')

    expect(getStoredAuth()).toEqual({ isAuthenticated: true, user: 'carmy' })
  })

  test('clearStoredAuth removes token', () => {
    setStoredAuth({ isAuthenticated: true, user: 'carmy' })
    clearStoredAuth()
    expect(getStoredAuth()).toBeNull()
  })
})
