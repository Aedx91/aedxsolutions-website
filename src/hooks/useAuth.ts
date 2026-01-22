'use client'

import { useCallback, useEffect, useState } from 'react'

export const AUTH_STORAGE_KEY = 'demoAuth'

export type DemoAuthToken = {
  isAuthenticated: true
  user: string
}

export function getStoredAuth(): DemoAuthToken | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = window.localStorage.getItem(AUTH_STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as Partial<DemoAuthToken> | null
    if (!parsed || parsed.isAuthenticated !== true || typeof parsed.user !== 'string') return null
    return { isAuthenticated: true, user: parsed.user }
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

export function validateDemoCredentials(username: string, password: string) {
  return username.trim().toLowerCase() === CARMY_USER && password === CARMY_PASS
}

export function useAuth() {
  const [token, setToken] = useState<DemoAuthToken | null>(null)

  const refresh = useCallback(() => {
    setToken(getStoredAuth())
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  const login = useCallback((user: string) => {
    const next: DemoAuthToken = { isAuthenticated: true, user }
    setStoredAuth(next)
    setToken(next)
  }, [])

  const logout = useCallback(() => {
    clearStoredAuth()
    setToken(null)
  }, [])

  return {
    isAuthenticated: token?.isAuthenticated === true,
    user: token?.user ?? null,
    login,
    logout,
    refresh,
  }
}
