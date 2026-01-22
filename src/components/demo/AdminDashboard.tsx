'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import type { Lang } from '@/lib/i18n/dictionaries'
import { clearStoredAuth, getStoredAuth } from '@/hooks/useAuth'

export default function AdminDashboard({ lang }: { lang: Lang }) {
  const router = useRouter()
  const [isAuthed, setIsAuthed] = useState(false)

  useEffect(() => {
    const token = getStoredAuth()
    if (!token?.isAuthenticated) {
      router.replace(`/${lang}/demo/login`)
      return
    }
    if (token.role !== 'admin') {
      router.replace(`/${lang}/demo/dashboard`)
      return
    }
    setIsAuthed(true)
  }, [lang, router])

  if (!isAuthed) return null

  return (
    <div className="space-y-10 py-10">
      <section>
        <h1 className="text-4xl font-bold">Admin Control Center</h1>
        <p className="mt-3 text-gray-300 max-w-2xl">
          Manage tenants, feature flags, and data visibility. This view is isolated from the Carmy experience.
        </p>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="rounded-xl border border-white/10 bg-gray-900/60 p-6">
          <div className="text-sm text-gray-400">Tenants</div>
          <div className="mt-2 text-xl font-semibold">Segmented access</div>
          <p className="mt-2 text-gray-300 text-sm">Review orgs, assign seats, and enforce per-tenant roles.</p>
        </div>
        <div className="rounded-xl border border-white/10 bg-gray-900/60 p-6">
          <div className="text-sm text-gray-400">Feature flags</div>
          <div className="mt-2 text-xl font-semibold">Rollouts & pilots</div>
          <p className="mt-2 text-gray-300 text-sm">Gate capabilities per role to keep the Carmy flow separate.</p>
        </div>
        <div className="rounded-xl border border-white/10 bg-gray-900/60 p-6">
          <div className="text-sm text-gray-400">Data guardrails</div>
          <div className="mt-2 text-xl font-semibold">Isolation first</div>
          <p className="mt-2 text-gray-300 text-sm">Simulated RLS and partitioning to avoid cross-tenant reads.</p>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-xl border border-purple-500/30 bg-purple-900/20 p-6">
          <h2 className="text-2xl font-semibold">Operational view</h2>
          <p className="mt-2 text-gray-200 text-sm">
            Imagine charts here: latency, error rates, and per-tenant usage. In production, wire this to your telemetry.
          </p>
        </div>
        <div className="rounded-xl border border-emerald-500/30 bg-emerald-900/20 p-6">
          <h2 className="text-2xl font-semibold">Access actions</h2>
          <p className="mt-2 text-gray-200 text-sm">
            Provision seats, reset passwords, or revoke sessions. For now, this is a static mock separated from Carmy.
          </p>
          <div className="mt-4 flex gap-3">
            <button
              type="button"
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg transition-all"
              onClick={() => alert('Simulated: provision new tenant')}
            >
              Provision tenant
            </button>
            <button
              type="button"
              className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-all"
              onClick={() => alert('Simulated: revoke all sessions')}
            >
              Revoke sessions
            </button>
          </div>
        </div>
      </section>

      <div className="flex justify-end">
        <button
          type="button"
          className="text-sm text-gray-300 underline"
          onClick={() => {
            clearStoredAuth()
            router.replace(`/${lang}/demo/login`)
          }}
        >
          Sign out
        </button>
      </div>
    </div>
  )
}
