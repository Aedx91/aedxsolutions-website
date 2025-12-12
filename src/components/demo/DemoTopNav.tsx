'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import type { Lang } from '@/lib/i18n/dictionaries'
import LanguageSwitcher from '@/components/LanguageSwitcher'
import { clearStoredAuth, getStoredAuth } from '@/hooks/useAuth'

export default function DemoTopNav({
  lang,
  logoutLabel,
}: {
  lang: Lang
  logoutLabel: string
}) {
  const router = useRouter()
  const [isAuthed, setIsAuthed] = useState(false)

  useEffect(() => {
    setIsAuthed(!!getStoredAuth()?.isAuthenticated)
  }, [])

  return (
    <header className="sticky top-0 z-20 bg-black/80 backdrop-blur border-b border-white/10">
      <div className="container py-4 flex items-center justify-between">
        <Link href={`/${lang}`} className="text-white font-semibold">
          AedxSolutions
        </Link>
        <div className="flex items-center gap-3">
          <LanguageSwitcher current={lang} />
          {isAuthed ? (
            <button
              type="button"
              className="btn btn-outline transition-all hover:scale-105"
              onClick={() => {
                clearStoredAuth()
                setIsAuthed(false)
                router.replace(`/${lang}/demo/login`)
              }}
            >
              {logoutLabel}
            </button>
          ) : null}
        </div>
      </div>
    </header>
  )
}
