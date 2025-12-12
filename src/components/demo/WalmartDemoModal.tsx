'use client'

import React, { useMemo, useState } from 'react'
import type { DemoLogEntry } from '@/lib/demoLogs'

export default function WalmartDemoModal({
  isOpen,
  onClose,
  onLog,
  labels,
}: {
  isOpen: boolean
  onClose: () => void
  onLog: (entry: DemoLogEntry) => void
  labels: {
    title: string
    packedBoxesLabel: string
    logEntry: string
    close: string
    invalidNumber: string
  }
}) {
  const [value, setValue] = useState('')
  const [error, setError] = useState<string | null>(null)

  const parsed = useMemo(() => {
    if (value.trim() === '') return null
    const n = Number(value)
    if (!Number.isFinite(n)) return null
    if (!Number.isInteger(n)) return null
    return n
  }, [value])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-xl p-8 w-full max-w-lg">
        <div className="flex items-start justify-between gap-4">
          <h2 className="text-xl font-semibold text-white">{labels.title}</h2>
          <button
            type="button"
            onClick={() => {
              setError(null)
              setValue('')
              onClose()
            }}
            className="text-gray-300 hover:text-white transition-colors"
          >
            {labels.close}
          </button>
        </div>

        <div className="mt-6">
          <label className="block text-sm text-gray-300 mb-2" htmlFor="packedBoxes">
            {labels.packedBoxesLabel}
          </label>
          <input
            id="packedBoxes"
            type="number"
            min={0}
            value={value}
            onChange={(e) => {
              setValue(e.target.value)
              setError(null)
            }}
            className="w-full bg-gray-950 text-white border border-gray-700 rounded-lg px-3 py-2"
          />
          {error ? <p className="mt-2 text-sm text-red-500">{error}</p> : null}
        </div>

        <div className="mt-6 flex items-center justify-end gap-3">
          <button
            type="button"
            className="bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-lg transition-all"
            onClick={() => {
              if (parsed === null || parsed < 0) {
                setError(labels.invalidNumber)
                return
              }
              onLog({
                timestamp: new Date().toISOString(),
                client: 'Walmart',
                packedBoxes: parsed,
                user: 'admin',
              })
              setError(null)
              setValue('')
              onClose()
            }}
          >
            {labels.logEntry}
          </button>
        </div>
      </div>
    </div>
  )
}
