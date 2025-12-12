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

  test('validateDemoCredentials accepts only admin/admin', () => {
    expect(validateDemoCredentials('admin', 'admin')).toBe(true)
    expect(validateDemoCredentials('admin', 'nope')).toBe(false)
    expect(validateDemoCredentials('nope', 'admin')).toBe(false)
  })

  test('setStoredAuth/getStoredAuth roundtrip', () => {
    expect(getStoredAuth()).toBeNull()

    setStoredAuth({ isAuthenticated: true, user: 'admin' })
    expect(window.localStorage.getItem(AUTH_STORAGE_KEY)).toContain('admin')

    expect(getStoredAuth()).toEqual({ isAuthenticated: true, user: 'admin' })
  })

  test('clearStoredAuth removes token', () => {
    setStoredAuth({ isAuthenticated: true, user: 'admin' })
    clearStoredAuth()
    expect(getStoredAuth()).toBeNull()
  })
})
