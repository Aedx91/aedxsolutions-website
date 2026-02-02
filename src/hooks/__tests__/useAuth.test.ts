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

  test('validateDemoCredentials returns token for Carmy or admin', () => {
    expect(validateDemoCredentials('carmy', 'carmylovesfood')).toEqual({ isAuthenticated: true, user: 'carmy', role: 'carmy' })
    expect(validateDemoCredentials('admin', 'admin')).toEqual({ isAuthenticated: true, user: 'admin', role: 'admin' })
    expect(validateDemoCredentials('pollo', 'stormtruper')).toEqual({ isAuthenticated: true, user: 'pollo', role: 'pollo' })
    expect(validateDemoCredentials('carmy', 'nope')).toBeNull()
    expect(validateDemoCredentials('nope', 'carmylovesfood')).toBeNull()
    expect(validateDemoCredentials('admin', 'nope')).toBeNull()
    expect(validateDemoCredentials('pollo', 'nope')).toBeNull()
  })

  test('setStoredAuth/getStoredAuth roundtrip', () => {
    expect(getStoredAuth()).toBeNull()

    setStoredAuth({ isAuthenticated: true, user: 'carmy', role: 'carmy' })
    expect(window.localStorage.getItem(AUTH_STORAGE_KEY)).toContain('carmy')

    expect(getStoredAuth()).toEqual({ isAuthenticated: true, user: 'carmy', role: 'carmy' })

    window.localStorage.clear()

    setStoredAuth({ isAuthenticated: true, user: 'pollo', role: 'pollo' })
    expect(window.localStorage.getItem(AUTH_STORAGE_KEY)).toContain('pollo')

    expect(getStoredAuth()).toEqual({ isAuthenticated: true, user: 'pollo', role: 'pollo' })
  })

  test('clearStoredAuth removes token', () => {
    setStoredAuth({ isAuthenticated: true, user: 'carmy', role: 'carmy' })
    clearStoredAuth()
    expect(getStoredAuth()).toBeNull()
  })
})
