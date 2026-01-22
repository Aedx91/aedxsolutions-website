'use client'

import { useCallback, useEffect, useState } from 'react'

export const AUTH_STORAGE_KEY = 'demoAuth'

export type DemoRole = 'carmy' | 'admin'

export type DemoAuthToken = {
  isAuthenticated: true
  user: string
  role: DemoRole
}

export function getStoredAuth(): DemoAuthToken | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = window.localStorage.getItem(AUTH_STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as Partial<DemoAuthToken> | null
    if (!parsed || parsed.isAuthenticated !== true || typeof parsed.user !== 'string' || parsed.role !== 'carmy' && parsed.role !== 'admin') {
      return null
    }
    return { isAuthenticated: true, user: parsed.user, role: parsed.role }
  } catch {
    return null
  }
}

export function setStoredAuth(token: DemoAuthToken) {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(token))
}

export function clearStoredAuth() {
  if (typeof window === 'undefined') return
  window.localStorage.removeItem(AUTH_STORAGE_KEY)
}

const CARMY_USER = 'carmy'
const CARMY_PASS = 'carmylovesfood'
const ADMIN_USER = 'admin'
const ADMIN_PASS = 'admin'

export function validateDemoCredentials(username: string, password: string): DemoAuthToken | null {
  const normalized = username.trim().toLowerCase()
  if (normalized === CARMY_USER && password === CARMY_PASS) {
    return { isAuthenticated: true, user: CARMY_USER, role: 'carmy' }
  }
  if (normalized === ADMIN_USER && password === ADMIN_PASS) {
    return { isAuthenticated: true, user: ADMIN_USER, role: 'admin' }
  }
  return null
}

export function useAuth() {
  const [token, setToken] = useState<DemoAuthToken | null>(null)

  const refresh = useCallback(() => {
    setToken(getStoredAuth())
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  const login = useCallback((auth: DemoAuthToken) => {
    setStoredAuth(auth)
    setToken(auth)
  }, [])

  const logout = useCallback(() => {
    clearStoredAuth()
    setToken(null)
  }, [])

  return {
    isAuthenticated: token?.isAuthenticated === true,
    user: token?.user ?? null,
    role: token?.role ?? null,
    login,
    logout,
    refresh,
  }
}
