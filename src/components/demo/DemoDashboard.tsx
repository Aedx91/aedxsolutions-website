'use client'

import React, { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import FlipCard from '@/components/FlipCard'
import type { Lang } from '@/lib/i18n/dictionaries'
import { getStoredAuth } from '@/hooks/useAuth'
import { appendDemoLog, downloadJson, getDemoLogs } from '@/lib/demoLogs'
import WalmartDemoModal from '@/components/demo/WalmartDemoModal'

export default function DemoDashboard({
  lang,
  labels,
  hero,
  features,
}: {
  lang: Lang
  labels: {
    logout: string
    walmartDemo: string
    viewLogs: string
    toastSaved: string
    modalTitle: string
    packedBoxesLabel: string
    logEntry: string
    close: string
    invalidNumber: string
  }
  hero: { title: string; subtitle: string }
  features: {
    sectionTitle: string
    sectionSubtitle: string
    items: Array<{ title: string; desc: string }>
  }
}) {
  const router = useRouter()
  const [isAuthed, setIsAuthed] = useState(false)
  const [toast, setToast] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    const token = getStoredAuth()
    if (!token?.isAuthenticated) {
      router.replace(`/${lang}/demo/login`)
      return
    }
    setIsAuthed(true)
  }, [lang, router])

  useEffect(() => {
    if (!toast) return
    const t = window.setTimeout(() => setToast(null), 2500)
    return () => window.clearTimeout(t)
  }, [toast])

  const options = useMemo(() => {
    return features.items.map((item, idx) => {
      const key = idx === 0 ? 'discovery' : idx === 1 ? 'integration' : 'ai-pilot'
      return { key, title: item.title, subtitle: item.desc }
    })
  }, [features.items])

  if (!isAuthed) return null

  return (
    <>
      <section className="pt-10 pb-8">
        <h1 className="text-4xl font-bold">{hero.title}</h1>
        <p className="mt-3 text-gray-300 max-w-2xl">{hero.subtitle}</p>
      </section>

      <section className="py-10">
        <h2 className="text-2xl font-semibold text-center">{features.sectionTitle}</h2>
        <p className="mt-2 text-gray-300 max-w-2xl mx-auto text-center">{features.sectionSubtitle}</p>

        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
          {options.map((option) => (
            <div key={option.key} className="transition-all hover:scale-105">
              <FlipCard title={option.title} subtitle={<span>{option.subtitle}</span>} optionKey={option.key} />
            </div>
          ))}
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
          <button
            type="button"
            className="text-left bg-green-900/50 hover:bg-green-800 rounded-xl p-6 transition-all hover:scale-105"
            onClick={() => setIsModalOpen(true)}
          >
            <div className="text-lg font-semibold">{labels.walmartDemo}</div>
            <div className="mt-1 text-sm text-gray-200">{labels.logEntry}</div>
          </button>

          <button
            type="button"
            className="text-left bg-green-900/50 hover:bg-green-800 rounded-xl p-6 transition-all hover:scale-105"
            onClick={() => {
              const logs = getDemoLogs()
              downloadJson('demoLogs.json', logs)
            }}
          >
            <div className="text-lg font-semibold">{labels.viewLogs}</div>
            <div className="mt-1 text-sm text-gray-200">demoLogs.json</div>
          </button>
        </div>
      </section>

      <WalmartDemoModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        labels={{
          title: labels.modalTitle,
          packedBoxesLabel: labels.packedBoxesLabel,
          logEntry: labels.logEntry,
          close: labels.close,
          invalidNumber: labels.invalidNumber,
        }}
        onLog={(entry) => {
          appendDemoLog(entry)
          setToast(labels.toastSaved)
        }}
      />

      {toast ? (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-gray-900 text-white px-4 py-2 rounded-lg border border-white/10 z-50">
          {toast}
        </div>
      ) : null}
    </>
  )
}
