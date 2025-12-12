export const DEMO_LOGS_KEY = 'demoLogs'

export type DemoLogEntry = {
  timestamp: string
  client: string
  packedBoxes: number
  user: string
}

export function getDemoLogs(): DemoLogEntry[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = window.localStorage.getItem(DEMO_LOGS_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as unknown
    return Array.isArray(parsed) ? (parsed as DemoLogEntry[]) : []
  } catch {
    return []
  }
}

export function appendDemoLog(entry: DemoLogEntry) {
  if (typeof window === 'undefined') return
  // Simulate DB log for custom reports later.
  const next = [...getDemoLogs(), entry]
  window.localStorage.setItem(DEMO_LOGS_KEY, JSON.stringify(next))
}

export function downloadJson(filename: string, payload: unknown) {
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}
