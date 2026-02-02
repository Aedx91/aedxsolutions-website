"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getStoredAuth } from '@/hooks/useAuth'

function resolveLangFromPath(): string {
  if (typeof window === 'undefined') return 'en'
  const parts = window.location.pathname.split('/').filter(Boolean)
  const candidate = parts[0]
  return candidate === 'es' ? 'es' : 'en'
}

export default function PolloDashboardPage() {
  const router = useRouter()
  const [checked, setChecked] = useState(false)

  useEffect(() => {
    const auth = getStoredAuth()
    const lang = resolveLangFromPath()
    if (!auth) {
      setChecked(true)
      router.replace(`/${lang}/demo/login`)
      return
    }
    if (auth.role === 'admin') {
      setChecked(true)
      router.replace(`/${lang}/demo/admin`)
      return
    }
    if (auth.role === 'carmy') {
      setChecked(true)
      router.replace(`/${lang}/demo/dashboard`)
      return
    }
    // Only pollo is allowed to stay here
    setChecked(true)
  }, [router])

  if (!checked) {
    return <div className="min-h-[60vh] flex items-center justify-center text-gray-200">Cargando...</div>
  }

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center space-y-4">
      <h1 className="text-3xl font-semibold text-white">Polli hermos</h1>
      <p className="text-lg text-gray-200">Aquí podemos hacer algo para el negocio.</p>
    </div>
  )
}