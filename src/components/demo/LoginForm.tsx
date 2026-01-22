'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import type { Lang } from '@/lib/i18n/dictionaries'
import { getStoredAuth, setStoredAuth, validateDemoCredentials } from '@/hooks/useAuth'

export default function LoginForm({
  lang,
  labels,
}: {
  lang: Lang
  labels: {
    title: string
    username: string
    password: string
    signIn: string
    invalidCreds: string
  }
}) {
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const existing = getStoredAuth()
    if (existing?.isAuthenticated) {
      router.replace(`/${lang}/demo/dashboard`)
    }
  }, [lang, router])

  return (
    <div className="min-h-[70vh] flex items-center justify-center">
      <div className="max-w-md mx-auto bg-gray-900/80 rounded-xl p-8 shadow-2xl w-full">
        <h1 className="text-2xl font-semibold text-white">{labels.title}</h1>

        <form
          className="mt-6 space-y-4"
          onSubmit={(e) => {
            e.preventDefault()
            setError(null)
            const auth = validateDemoCredentials(username, password)
            if (!auth) {
              setError(labels.invalidCreds)
              return
            }
            setStoredAuth(auth)
            const destination = auth.role === 'admin' ? `/${lang}/demo/admin` : `/${lang}/demo/dashboard`
            router.push(destination)
          }}
        >
          <div>
            <label className="block text-sm text-gray-300 mb-2" htmlFor="username">
              {labels.username}
            </label>
            <input
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-gray-950 text-white border border-gray-700 rounded-lg px-3 py-2"
              autoComplete="username"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-2" htmlFor="password">
              {labels.password}
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-gray-950 text-white border border-gray-700 rounded-lg px-3 py-2"
              autoComplete="current-password"
            />
          </div>

          {error ? <p className="text-sm text-red-500">{error}</p> : null}

          <button
            type="submit"
            className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg transition-all"
          >
            {labels.signIn}
          </button>
        </form>
      </div>
    </div>
  )
}
