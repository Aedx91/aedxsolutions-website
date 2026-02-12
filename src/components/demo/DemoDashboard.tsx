'use client'

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import FlipCard from '@/components/FlipCard'
import WalmartDemoModal from '@/components/demo/WalmartDemoModal'
import { getStoredAuth } from '@/hooks/useAuth'
import { appendDemoLog, downloadJson, getDemoLogs } from '@/lib/demoLogs'
import type { Lang } from '@/lib/i18n/dictionaries'

type FeatureItem = { title: string; desc: string }
type DateItem = {
  id: string
  date: string
  description: string
  googleEventId?: string | null
  microsoftEventId?: string | null
}
type IntegrationStatus = {
  google: boolean
  microsoft: boolean
}

const MENU_SOURCE = [
  'Truffle pasta',
  'Spicy tuna bowls',
  'Citrus salmon',
  'Gnocchi w/ pesto',
  'Miso cod',
  'Roasted veggies',
  'Tiramisu jars',
  'Berry shortcake',
  'Mochi flight',
  'Porcini risotto',
  'Charred broccolini',
  'Chili crisp noodles',
  'Lemon butter scallops',
  'Burrata salad',
  'Harissa chicken',
  'Pomegranate lamb',
  'Garlic miso eggplant',
  'Chimichurri steak',
  'Cacio e pepe',
  'Caprese toasties',
  'Matcha tiramisu',
  'Salted caramel pots',
  'Mango sticky rice',
  'Affogato duo',
]

const DEFAULT_ROULETTE_OPTIONS = MENU_SOURCE.slice(0, 6)

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
    items: FeatureItem[]
  }
}) {
  const router = useRouter()
  const [isAuthed, setIsAuthed] = useState(false)
  const [tab, setTab] = useState<'menu' | 'dates' | 'todo' | 'watch' | null>(null)
  const [role, setRole] = useState<'carmy' | 'admin' | null>(null)
  const [userId, setUserId] = useState<string | null>(null)
  const [toast, setToast] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selection, setSelection] = useState<Record<string, string>>({})
  const [submittingDish, setSubmittingDish] = useState<string | null>(null)
  const [dates, setDates] = useState<DateItem[]>([])
  const [datesLoading, setDatesLoading] = useState(false)
  const [isDateModalOpen, setIsDateModalOpen] = useState(false)
  const [dateForm, setDateForm] = useState({ date: '', description: '' })
  const [integrations, setIntegrations] = useState<IntegrationStatus>({ google: false, microsoft: false })
  const [syncToCalendar, setSyncToCalendar] = useState(true)
  const [rouletteOptions, setRouletteOptions] = useState<string[]>([])
  const [isRouletteModalOpen, setIsRouletteModalOpen] = useState(false)
  const [selectedMenuItems, setSelectedMenuItems] = useState<string[]>([])
  const [customEntries, setCustomEntries] = useState<string[]>([])
  const [customDraft, setCustomDraft] = useState('')
  const [rouletteError, setRouletteError] = useState<string | null>(null)
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [wheelRotation, setWheelRotation] = useState(0)
  const [isSpinningWheel, setIsSpinningWheel] = useState(false)
  const [pointerTickPulse, setPointerTickPulse] = useState(false)
  const [roulettePick, setRoulettePick] = useState<string | null>(null)
  const [showCenterPick, setShowCenterPick] = useState(false)
  const datesStorageKey = useMemo(() => `carmy-dates-${lang}`, [lang])
  const rouletteSoundStorageKey = useMemo(() => `carmy-roulette-sound-${lang}`, [lang])
  const rouletteSectionRef = useRef<HTMLDivElement | null>(null)
  const pointerTickTimersRef = useRef<number[]>([])
  const audioContextRef = useRef<AudioContext | null>(null)

  const dishes = useMemo(
    () => MENU_SOURCE,
    []
  )

  const payOptions = [
    { id: 'x1', label: 'x1', desc: 'You cover it all' },
    { id: 'x2', label: 'x2', desc: 'Split 50/50' },
    { id: 'x3', label: 'x3', desc: 'Carmy covers it' },
    { id: 'x4', label: 'x4', desc: 'Bodymatic mode' },
  ]

  const valentineBannerItems = useMemo(
    () => [
      'Would you like to be my valentine? 💜',
      'Would you like to be my valentine? 💜',
      'Would you like to be my valentine? 💜',
      'Would you like to be my valentine? 💜',
    ],
    []
  )

  const activeRouletteOptions = useMemo(() => rouletteOptions.slice(0, 6).filter(Boolean), [rouletteOptions])
  const optionCount = activeRouletteOptions.length || 1
  const wheelSegmentAngle = 360 / optionCount
  const labelMidRotationClassMap: Record<number, string[]> = {
    1: ['rotate-0'],
    2: ['rotate-[90deg]', 'rotate-[270deg]'],
    3: ['rotate-[60deg]', 'rotate-[180deg]', 'rotate-[300deg]'],
    4: ['rotate-[45deg]', 'rotate-[135deg]', 'rotate-[225deg]', 'rotate-[315deg]'],
    5: ['rotate-[36deg]', 'rotate-[108deg]', 'rotate-[180deg]', 'rotate-[252deg]', 'rotate-[324deg]'],
    6: ['rotate-[30deg]', 'rotate-[90deg]', 'rotate-[150deg]', 'rotate-[210deg]', 'rotate-[270deg]', 'rotate-[330deg]'],
  }
  const labelMidCounterRotationClassMap: Record<number, string[]> = {
    1: ['rotate-0'],
    2: ['-rotate-[90deg]', '-rotate-[270deg]'],
    3: ['-rotate-[60deg]', '-rotate-[180deg]', '-rotate-[300deg]'],
    4: ['-rotate-[45deg]', '-rotate-[135deg]', '-rotate-[225deg]', '-rotate-[315deg]'],
    5: ['-rotate-[36deg]', '-rotate-[108deg]', '-rotate-[180deg]', '-rotate-[252deg]', '-rotate-[324deg]'],
    6: ['-rotate-[30deg]', '-rotate-[90deg]', '-rotate-[150deg]', '-rotate-[210deg]', '-rotate-[270deg]', '-rotate-[330deg]'],
  }
  const boundaryRotationClassMap: Record<number, string[]> = {
    1: [],
    2: ['rotate-0', 'rotate-[180deg]'],
    3: ['rotate-0', 'rotate-[120deg]', 'rotate-[240deg]'],
    4: ['rotate-0', 'rotate-[90deg]', 'rotate-[180deg]', 'rotate-[270deg]'],
    5: ['rotate-0', 'rotate-[72deg]', 'rotate-[144deg]', 'rotate-[216deg]', 'rotate-[288deg]'],
    6: ['rotate-0', 'rotate-[60deg]', 'rotate-[120deg]', 'rotate-[180deg]', 'rotate-[240deg]', 'rotate-[300deg]'],
  }
  const wheelSliceClassMap: Record<number, string> = {
    1: 'roulette-slices-1',
    2: 'roulette-slices-2',
    3: 'roulette-slices-3',
    4: 'roulette-slices-4',
    5: 'roulette-slices-5',
    6: 'roulette-slices-6',
  }

  const labelMidRotationClasses = labelMidRotationClassMap[optionCount]
  const labelMidCounterRotationClasses = labelMidCounterRotationClassMap[optionCount]
  const boundaryRotationClasses = boundaryRotationClassMap[optionCount]
  const wheelSliceClass = wheelSliceClassMap[optionCount]
  const labelRadiusClassMap: Record<number, string> = {
    1: '-translate-y-[88px]',
    2: '-translate-y-[90px]',
    3: '-translate-y-[92px]',
    4: '-translate-y-[90px]',
    5: '-translate-y-[86px]',
    6: '-translate-y-[80px]',
  }
  const labelWidthClassMap: Record<number, string> = {
    1: 'w-40',
    2: 'w-36',
    3: 'w-32',
    4: 'w-28',
    5: 'w-24',
    6: 'w-20',
  }
  const labelRadiusClass = labelRadiusClassMap[optionCount]
  const labelWidthClass = labelWidthClassMap[optionCount]

  const getSliceLabelSizeClass = (dish: string) => {
    const length = dish.length
    if (optionCount >= 5) {
      if (length > 18) return 'text-[9px] leading-[1.05]'
      if (length > 13) return 'text-[10px] leading-[1.05]'
      return 'text-[11px] leading-[1.08]'
    }
    if (optionCount === 4) {
      if (length > 18) return 'text-[10px] leading-[1.08]'
      return 'text-[11px] leading-[1.1]'
    }
    if (length > 20) return 'text-[11px] leading-[1.1]'
    return 'text-xs leading-[1.12]'
  }

  const getWinnerFromRotation = (finalRotationValue: number, options: string[]) => {
    if (options.length === 0) return null
    const segmentAngle = 360 / options.length
    const normalizedRotation = ((finalRotationValue % 360) + 360) % 360

    let bestIndex = 0
    let smallestDistance = Number.POSITIVE_INFINITY

    for (let index = 0; index < options.length; index++) {
      const centerAngle = index * segmentAngle + segmentAngle / 2
      const pointerRelativeAngle = (centerAngle + normalizedRotation) % 360
      const distanceToPointer = Math.min(pointerRelativeAngle, 360 - pointerRelativeAngle)
      if (distanceToPointer < smallestDistance) {
        smallestDistance = distanceToPointer
        bestIndex = index
      }
    }

    return options[bestIndex]
  }

  const ensureAudioContext = () => {
    if (typeof window === 'undefined') return null
    const AudioCtx = window.AudioContext
    if (!AudioCtx) return null

    if (!audioContextRef.current) {
      audioContextRef.current = new AudioCtx()
    }

    if (audioContextRef.current.state === 'suspended') {
      void audioContextRef.current.resume()
    }

    return audioContextRef.current
  }

  const playRouletteSound = (accent = false) => {
    if (!soundEnabled) return

    const audioContext = ensureAudioContext()
    if (!audioContext) return

    const now = audioContext.currentTime
    const oscillator = audioContext.createOscillator()
    const gain = audioContext.createGain()

    oscillator.type = accent ? 'triangle' : 'square'
    oscillator.frequency.setValueAtTime(accent ? 880 : 620, now)
    oscillator.frequency.exponentialRampToValueAtTime(accent ? 540 : 420, now + (accent ? 0.12 : 0.05))

    gain.gain.setValueAtTime(0.0001, now)
    gain.gain.exponentialRampToValueAtTime(accent ? 0.045 : 0.03, now + 0.01)
    gain.gain.exponentialRampToValueAtTime(0.0001, now + (accent ? 0.14 : 0.07))

    oscillator.connect(gain)
    gain.connect(audioContext.destination)

    oscillator.start(now)
    oscillator.stop(now + (accent ? 0.14 : 0.07))
  }

  const normalizeEntry = (value: string) => value.trim().replace(/\s+/g, ' ')

  const dedupeEntries = (items: string[]) => {
    const seen = new Set<string>()
    return items.filter((item) => {
      const key = item.toLowerCase()
      if (seen.has(key)) return false
      seen.add(key)
      return true
    })
  }

  const openRouletteModal = () => {
    setRouletteError(null)
    setCustomDraft('')
    setSelectedMenuItems(rouletteOptions.filter((item) => MENU_SOURCE.includes(item)))
    setCustomEntries(rouletteOptions.filter((item) => !MENU_SOURCE.includes(item)))
    setIsRouletteModalOpen(true)
  }

  const addCustomDraft = () => {
    const normalized = normalizeEntry(customDraft)
    if (!normalized) return
    if (normalized.length > 20) {
      setRouletteError('Custom option must be 20 chars max')
      return
    }

    const merged = dedupeEntries([...customEntries, normalized])
    if (selectedMenuItems.length + merged.length > 6) {
      setRouletteError('Max 6 options')
      return
    }

    setRouletteError(null)
    setCustomEntries(merged)
    setCustomDraft('')
  }

  const submitRouletteOptions = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const normalizedDraft = normalizeEntry(customDraft)
    if (normalizedDraft && normalizedDraft.length > 20) {
      setRouletteError('Custom option must be 20 chars max')
      return
    }

    const mergedCustom = normalizedDraft ? dedupeEntries([...customEntries, normalizedDraft]) : customEntries
    const nextOptions = dedupeEntries([...selectedMenuItems, ...mergedCustom])

    if (nextOptions.length > 6) {
      setRouletteError('Max 6 options')
      return
    }

    if (nextOptions.length === 0) {
      setRouletteError('Add at least 1 option')
      return
    }

    setRouletteOptions(nextOptions)
    setRoulettePick(null)
    setShowCenterPick(false)
    setCustomEntries(mergedCustom)
    setCustomDraft('')
    setRouletteError(null)
    setIsRouletteModalOpen(false)
  }

  const toggleMenuOption = (entry: string) => {
    setRouletteError(null)
    setSelectedMenuItems((prev) => {
      const exists = prev.includes(entry)
      if (exists) return prev.filter((item) => item !== entry)
      if (prev.length + customEntries.length >= 6) {
        setRouletteError('Max 6 options')
        return prev
      }
      return [...prev, entry]
    })
  }

  const removeCustomEntry = (entry: string) => {
    setRouletteError(null)
    setCustomEntries((prev) => prev.filter((item) => item !== entry))
  }

  const clearRoulette = () => {
    setRouletteOptions([])
    setSelectedMenuItems([])
    setCustomEntries([])
    setCustomDraft('')
    setRoulettePick(null)
    setShowCenterPick(false)
    setRouletteError(null)
    setToast('Roulette cleared')
  }

  const addDishToRoulette = (dish: string) => {
    setRouletteError(null)
    setTab('menu')

    if (typeof window !== 'undefined') {
      window.requestAnimationFrame(() => {
        rouletteSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      })
    }

    setRouletteOptions((prev) => {
      const exists = prev.some((item) => item.toLowerCase() === dish.toLowerCase())
      if (exists) {
        setToast('Already in roulette')
        return prev
      }
      if (prev.length >= 6) {
        setToast('Max 6 options')
        return prev
      }
      const next = [...prev, dish]
      setToast(`Added to roulette: ${dish}`)
      return next
    })
  }

  const randomUnit = () => {
    if (typeof window !== 'undefined' && window.crypto?.getRandomValues) {
      const randomBuffer = new Uint32Array(1)
      window.crypto.getRandomValues(randomBuffer)
      return randomBuffer[0] / 4294967296
    }
    return Math.random()
  }

  const spinRoulette = () => {
    if (isSpinningWheel || activeRouletteOptions.length === 0) return

    ensureAudioContext()

    pointerTickTimersRef.current.forEach((timerId) => window.clearTimeout(timerId))
    pointerTickTimersRef.current = []

    const spinOptions = [...activeRouletteOptions]
    const selectedIndex = Math.floor(randomUnit() * spinOptions.length)
    const selectedDish = spinOptions[selectedIndex]
    const centerAngle = selectedIndex * wheelSegmentAngle + wheelSegmentAngle / 2
    const landingRotation = (360 - centerAngle + 360) % 360
    const fullTurns = 6 + Math.floor(randomUnit() * 3)
    const finalRotation = wheelRotation + fullTurns * 360 + landingRotation
    const spinDurationMs = 4200
    const totalAngle = finalRotation - wheelRotation
    const segmentPasses = Math.max(1, Math.floor(totalAngle / wheelSegmentAngle))
    const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3)

    setIsSpinningWheel(true)
    setShowCenterPick(false)
    setPointerTickPulse(false)
    setWheelRotation(finalRotation)

    for (let step = 1; step <= segmentPasses; step++) {
      const progress = step / segmentPasses
      const triggerAt = Math.round(spinDurationMs * easeOutCubic(progress))

      const startTimer = window.setTimeout(() => {
        setPointerTickPulse(true)
        playRouletteSound(false)
        const endTimer = window.setTimeout(() => setPointerTickPulse(false), 52)
        pointerTickTimersRef.current.push(endTimer)
      }, triggerAt)

      pointerTickTimersRef.current.push(startTimer)
    }

    window.setTimeout(() => {
      const resolvedWinner = getWinnerFromRotation(finalRotation, spinOptions)
      setRoulettePick(resolvedWinner ?? selectedDish)
      setIsSpinningWheel(false)
      setPointerTickPulse(false)
      setShowCenterPick(true)
      playRouletteSound(true)
    }, 4200)
  }

  const formatDate = (value: string) => {
    try {
      return new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(value))
    } catch {
      return value
    }
  }

  const cacheDates = useCallback(
    (next: DateItem[]) => {
      if (typeof window === 'undefined') return
      window.localStorage.setItem(datesStorageKey, JSON.stringify(next))
    },
    [datesStorageKey]
  )

  const loadDates = useCallback(
    async (currentUser: string) => {
      setDatesLoading(true)
      // Try API first
      try {
        const res = await fetch('/api/dates', {
          headers: { 'x-demo-user': currentUser },
          cache: 'no-store',
        })
        if (res.ok) {
          const payload = (await res.json()) as { dates: DateItem[]; integrations: IntegrationStatus } | DateItem[]
          const list = Array.isArray(payload) ? payload : payload.dates
          const status = Array.isArray(payload) ? null : payload.integrations
          const sorted = list.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
          setDates(sorted)
          cacheDates(sorted)
          if (status) setIntegrations(status)
          setDatesLoading(false)
          return
        }
      } catch (error) {
        console.error('Fetch dates failed', error)
      }

      // Fallback to local cache
      if (typeof window !== 'undefined') {
        const cached = window.localStorage.getItem(datesStorageKey)
        if (cached) {
          try {
            const parsed = JSON.parse(cached) as DateItem[]
            setDates(parsed)
          } catch (error) {
            console.error('Failed to parse cached dates', error)
          }
        }
      }
      setDatesLoading(false)
    },
    [cacheDates, datesStorageKey]
  )

  const addDate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!dateForm.date || !dateForm.description.trim()) return
    if (!userId) {
      setToast('Not signed in')
      return
    }

    const optimisticId = `tmp-${Date.now()}`
    const pendingItem: DateItem = {
      id: optimisticId,
      date: dateForm.date,
      description: dateForm.description.trim(),
    }

    const optimistic = [...dates, pendingItem].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    setDates(optimistic)
    cacheDates(optimistic)
    setDateForm({ date: '', description: '' })
    setIsDateModalOpen(false)

    try {
      const res = await fetch('/api/dates', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-demo-user': userId,
        },
        body: JSON.stringify({ date: pendingItem.date, description: pendingItem.description, sync: syncToCalendar }),
      })
      if (!res.ok) throw new Error('Save failed')
      const saved = (await res.json()) as DateItem
      const reconciled = optimistic.map((item) => (item.id === optimisticId ? saved : item))
      cacheDates(reconciled)
      setDates(reconciled)
      setToast('Date added')
    } catch (error) {
      console.error('Add date failed', error)
      const rolledBack = dates.filter((d) => d.id !== optimisticId)
      setDates(rolledBack)
      cacheDates(rolledBack)
      setToast('Could not save date')
    }
  }

  const deleteDate = async (id: string) => {
    if (!userId) {
      setToast('Not signed in')
      return
    }
    const previous = dates
    const next = dates.filter((item) => item.id !== id)
    setDates(next)
    cacheDates(next)
    try {
      const res = await fetch(`/api/dates/${id}`, {
        method: 'DELETE',
        headers: { 'x-demo-user': userId },
      })
      if (!res.ok) throw new Error('Delete failed')
      setToast('Removed')
    } catch (error) {
      console.error('Delete date failed', error)
      setDates(previous)
      cacheDates(previous)
      setToast('Could not delete')
    }
  }

  async function submitDishChoice(dish: string) {
    const choice = selection[dish]
    if (!choice) return
    try {
      setSubmittingDish(dish)
      const res = await fetch('/api/menu/selection', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dish, option: choice, lang }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || 'Request failed')
      setToast('Saved your pick—thanks!')
    } catch (error) {
      console.error('Submit dish failed', error)
      setToast('Could not send right now')
    } finally {
      setSubmittingDish(null)
    }
  }

  useEffect(() => {
    const token = getStoredAuth()
    if (!token?.isAuthenticated) {
      router.replace(`/${lang}/demo/login`)
      return
    }
    if (token.role === 'admin') {
      router.replace(`/${lang}/demo/admin`)
      return
    }
    setRole(token.role)
    setUserId(token.user)
    setIsAuthed(true)
  }, [lang, router])

  useEffect(() => {
    if (!userId) return
    loadDates(userId)
  }, [userId, loadDates])

  useEffect(() => {
    if (!toast) return
    const t = window.setTimeout(() => setToast(null), 2500)
    return () => window.clearTimeout(t)
  }, [toast])

  useEffect(() => {
    if (typeof window === 'undefined') return
    const cached = window.localStorage.getItem(rouletteSoundStorageKey)
    if (cached === 'off') setSoundEnabled(false)
    if (cached === 'on') setSoundEnabled(true)
  }, [rouletteSoundStorageKey])

  useEffect(() => {
    if (typeof window === 'undefined') return
    window.localStorage.setItem(rouletteSoundStorageKey, soundEnabled ? 'on' : 'off')
  }, [rouletteSoundStorageKey, soundEnabled])

  useEffect(() => {
    if (!showCenterPick) return
    const t = window.setTimeout(() => setShowCenterPick(false), 1200)
    return () => window.clearTimeout(t)
  }, [showCenterPick])

  useEffect(() => {
    return () => {
      pointerTickTimersRef.current.forEach((timerId) => window.clearTimeout(timerId))
      if (audioContextRef.current) {
        void audioContextRef.current.close()
      }
    }
  }, [])

  if (!isAuthed) return null

  const tabContent = {
    menu: (
      <div className="space-y-4">
        <div className="rounded-2xl border border-purple-500/30 bg-purple-900/30 p-6 shadow-lg shadow-purple-900/40">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-pink-100">
            Aedx Restaurant for Carmy
          </div>
          <h3 className="mt-3 text-xl font-semibold text-pink-200">Carmy Food Menu</h3>
          <p className="mt-2 text-sm text-pink-100/80">
            I love cooking for you—this is the corner where we park the dishes, date nights, movies, and memories we want to keep. You never have to cook; just pick anything you like and choose how we cover it. It is also our little hub to jot movie dates, birthdays, and the important days we should remember.
          </p>
        </div>
      </div>
    ),
    dates: (
      <div className="rounded-2xl border border-purple-500/30 bg-gradient-to-br from-purple-900/40 via-black to-pink-900/20 p-6 shadow-lg shadow-purple-900/40">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h3 className="text-xl font-semibold text-pink-200">Dates & Moments</h3>
            <p className="mt-2 text-sm text-pink-100/80">Keep little anniversaries, plans, and surprises aligned.</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-pink-100 hover:border-pink-400/50 hover:text-white transition-all"
              onClick={() => setIsDateModalOpen(true)}
            >
              + Add date
            </button>
            <button
              type="button"
              className="rounded-full border border-white/10 bg-gradient-to-r from-cyan-500/40 to-blue-500/40 px-4 py-2 text-sm font-semibold text-white hover:from-cyan-500 hover:to-blue-500 transition-all"
              onClick={() => {
                if (!userId) {
                  setToast('Not signed in')
                  return
                }
                window.location.href = `/api/integrations/google/start?user=${encodeURIComponent(userId)}`
              }}
            >
              Connect Google
            </button>
            <button
              type="button"
              className="rounded-full border border-white/10 bg-gradient-to-r from-indigo-500/40 to-purple-500/40 px-4 py-2 text-sm font-semibold text-white hover:from-indigo-500 hover:to-purple-500 transition-all"
              onClick={() => {
                if (!userId) {
                  setToast('Not signed in')
                  return
                }
                window.location.href = `/api/integrations/microsoft/start?user=${encodeURIComponent(userId)}`
              }}
            >
              Connect Outlook
            </button>
            <div className="text-xs text-pink-100/70 flex flex-col">
              <span>{integrations.google ? 'Google connected' : 'Google not connected'}</span>
              <span>{integrations.microsoft ? 'Outlook connected' : 'Outlook not connected'}</span>
            </div>
          </div>
        </div>

        <div className="mt-4 rounded-2xl bg-black/50 border border-white/5 p-4">
          {datesLoading ? (
            <div className="text-sm text-pink-100/70">Loading dates...</div>
          ) : dates.length === 0 ? (
            <div className="text-sm text-pink-100/70">No dates yet. Add one to keep it here.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              {dates.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between rounded-xl border border-white/10 bg-gradient-to-r from-purple-900/50 to-pink-900/30 px-4 py-3 shadow-lg shadow-purple-900/30"
                >
                  <div>
                    <div className="text-xs uppercase tracking-wide text-pink-200/80">{formatDate(item.date)}</div>
                    <div className="text-pink-100 font-semibold">{item.description}</div>
                  </div>
                  <button
                    type="button"
                    className="text-xs text-pink-100/70 hover:text-white underline"
                    onClick={() => deleteDate(item.id)}
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {isDateModalOpen ? (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
            <div className="w-full max-w-md rounded-2xl border border-white/10 bg-gradient-to-br from-purple-900 via-black to-pink-900 p-6 shadow-2xl shadow-pink-900/40">
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-sm uppercase tracking-[0.2em] text-pink-200/80">New date</div>
                  <h4 className="mt-1 text-xl font-semibold text-white">Add a plan or memory</h4>
                </div>
                <button
                  type="button"
                  aria-label="Close"
                  className="text-pink-100/70 hover:text-white"
                  onClick={() => setIsDateModalOpen(false)}
                >
                  ✕
                </button>
              </div>

              <form className="mt-4 space-y-4" onSubmit={addDate}>
                <label className="block space-y-1 text-sm text-pink-100/80">
                  <span>Date</span>
                  <input
                    type="date"
                    value={dateForm.date}
                    onChange={(e) => setDateForm((prev) => ({ ...prev, date: e.target.value }))}
                    className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-white focus:border-pink-400 focus:outline-none"
                    required
                  />
                </label>
                <label className="block space-y-1 text-sm text-pink-100/80">
                  <span>Description</span>
                  <input
                    type="text"
                    value={dateForm.description}
                    onChange={(e) => setDateForm((prev) => ({ ...prev, description: e.target.value }))}
                    className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-white focus:border-pink-400 focus:outline-none"
                    placeholder="Birthday, movie night, weekend getaway"
                    required
                  />
                </label>

                <label className="flex items-center gap-2 text-sm text-pink-100/80">
                  <input
                    type="checkbox"
                    checked={syncToCalendar}
                    onChange={(e) => setSyncToCalendar(e.target.checked)}
                    className="h-4 w-4 rounded border-white/20 bg-white/5"
                    disabled={!integrations.google && !integrations.microsoft}
                  />
                  <span>
                    {integrations.google || integrations.microsoft
                      ? 'Sync to connected calendars'
                      : 'Connect Google or Outlook to sync'}
                  </span>
                </label>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    className="rounded-full border border-white/10 px-4 py-2 text-sm text-pink-100 hover:border-pink-400/60"
                    onClick={() => setIsDateModalOpen(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded-full bg-gradient-to-r from-purple-500 to-pink-500 px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-pink-500/30"
                  >
                    Save date
                  </button>
                </div>
              </form>
            </div>
          </div>
        ) : null}
      </div>
    ),
    todo: (
      <div className="rounded-2xl border border-purple-500/30 bg-black/60 p-6 shadow-lg shadow-purple-900/30">
        <h3 className="text-xl font-semibold text-pink-200">Together To-Do</h3>
        <p className="mt-2 text-sm text-pink-100/80">Shared list to keep us synced.</p>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-pink-100/80">
          <div className="rounded-lg bg-purple-900/30 border border-white/5 p-4">
            <div className="font-semibold text-pink-200">Home</div>
            <ul className="mt-2 space-y-1">
              <li>□ Prep groceries for the week</li>
              <li>□ Try new playlist while cooking</li>
              <li>□ Tidy up the plants corner</li>
            </ul>
          </div>
          <div className="rounded-lg bg-purple-900/30 border border-white/5 p-4">
            <div className="font-semibold text-pink-200">Us</div>
            <ul className="mt-2 space-y-1">
              <li>□ Book a weekend getaway</li>
              <li>□ Pick a new recipe to master</li>
              <li>□ Plan a photo day</li>
            </ul>
          </div>
        </div>
      </div>
    ),
    watch: (
      <div className="rounded-2xl border border-purple-500/30 bg-gradient-to-br from-black via-purple-950 to-pink-950 p-6 shadow-lg shadow-purple-900/40">
        <h3 className="text-xl font-semibold text-pink-200">Watch List</h3>
        <p className="mt-2 text-sm text-pink-100/80">Shows, movies, and stand-up to queue.</p>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
          <div className="rounded-lg bg-black/50 border border-white/5 p-4">
            <div className="text-pink-200 font-semibold">Series</div>
            <ul className="mt-2 space-y-1 text-pink-100/80">
              <li>• The Bear (rewatch)</li>
              <li>• Slow Horses</li>
              <li>• One Day</li>
            </ul>
          </div>
          <div className="rounded-lg bg-black/50 border border-white/5 p-4">
            <div className="text-pink-200 font-semibold">Movies</div>
            <ul className="mt-2 space-y-1 text-pink-100/80">
              <li>• Past Lives</li>
              <li>• Dune (double)</li>
              <li>• La La Land</li>
            </ul>
          </div>
          <div className="rounded-lg bg-black/50 border border-white/5 p-4">
            <div className="text-pink-200 font-semibold">Live / Stand-up</div>
            <ul className="mt-2 space-y-1 text-pink-100/80">
              <li>• Taylor Tomlinson</li>
              <li>• Hasan Minhaj</li>
              <li>• Local improv night</li>
            </ul>
          </div>
        </div>
      </div>
    ),
  }

  return (
    <div className="space-y-8">
      <section className="pt-10 pb-6 relative overflow-hidden rounded-3xl border border-purple-500/30 bg-gradient-to-br from-black via-purple-950 to-pink-950 shadow-2xl shadow-purple-900/40">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#8b5cf6_0,transparent_35%)] opacity-40" aria-hidden />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_60%,#ec4899_0,transparent_35%)] opacity-30" aria-hidden />
        <div className="relative px-6 md:px-10">
          <p className="text-sm uppercase tracking-[0.2em] text-pink-200/70">Carmy space</p>
          <h1 className="text-4xl md:text-5xl font-bold text-white mt-2">{hero.title}</h1>
          <p className="mt-3 text-pink-100/80 max-w-2xl">{hero.subtitle}</p>

          <div className="mt-6 hero-transition-banner" aria-label="Carmy offer banner">
            <div className="hero-transition-shimmer" aria-hidden></div>
            <div className="hero-transition-track" role="presentation">
              {[...valentineBannerItems, ...valentineBannerItems].map((item, index) => (
                <span
                  key={`${item}-${index}`}
                  className={`hero-transition-chip ${index % valentineBannerItems.length === 0 ? 'hero-transition-chip-accent' : ''}`}
                >
                  {item}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-6 inline-flex items-center gap-2 bg-white/5 border border-white/10 text-pink-100 px-3 py-2 rounded-full text-sm">
            <span className="inline-block h-2 w-2 rounded-full bg-emerald-400" /> Together mode is on
          </div>
        </div>
      </section>

      <section className="bg-black/50 border border-purple-500/20 rounded-2xl shadow-xl shadow-purple-900/20 p-4 md:p-6">
        <div className="flex flex-wrap gap-2">
          {[
            { id: 'menu', label: 'Food Menu' },
            { id: 'dates', label: 'Dates to Remember' },
            { id: 'todo', label: 'To-Do List' },
            { id: 'watch', label: 'Watch List' },
          ].map((item) => {
            const active = tab === item.id
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setTab(item.id as typeof tab)}
                className={`px-5 py-3 rounded-full text-base font-semibold transition-all border ${
                  active
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white border-transparent shadow-lg shadow-pink-500/30'
                    : 'bg-white/5 text-pink-100/80 border-white/10 hover:border-pink-400/50'
                }`}
              >
                {item.label}
              </button>
            )
          })}
        </div>

        <div className="mt-6">
          {tab ? (
            tabContent[tab]
          ) : (
            <div className="text-pink-100/80 text-sm">Pick a list to view its details.</div>
          )}
        </div>
      </section>

      {tab === 'menu' ? (
        <section className="py-6">
          <h2 className="text-2xl font-semibold text-pink-100 text-center">{features.sectionTitle}</h2>
          <p className="mt-2 text-pink-100/80 max-w-2xl mx-auto text-center">
            Pick a dish, choose who covers it, then submit so we log it.
          </p>

          <div
            ref={rouletteSectionRef}
            className="mt-8 rounded-2xl border border-purple-500/30 bg-gradient-to-br from-purple-900/40 via-black to-pink-900/30 p-6 shadow-lg shadow-purple-900/30"
          >
            <div className="flex flex-col items-center">
              <div className="text-xs uppercase tracking-[0.2em] text-pink-200/80">Carmy quick roulette</div>
              <h3 className="mt-2 text-xl font-semibold text-pink-100">What should we eat tonight?</h3>

              <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={openRouletteModal}
                  disabled={isSpinningWheel}
                  className="rounded-full border border-white/10 bg-white/5 px-5 py-2 text-sm font-semibold text-pink-100 transition-all hover:border-pink-400/50 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Add to Roulette
                </button>
                <button
                  type="button"
                  onClick={clearRoulette}
                  disabled={activeRouletteOptions.length === 0 || isSpinningWheel}
                  className="rounded-full border border-white/10 bg-white/5 px-5 py-2 text-sm font-semibold text-pink-100 transition-all hover:border-rose-400/50 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Clear Roulette
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSoundEnabled((prev) => !prev)
                    ensureAudioContext()
                  }}
                  disabled={isSpinningWheel}
                  className="rounded-full border border-white/10 bg-white/5 px-5 py-2 text-sm font-semibold text-pink-100 transition-all hover:border-sky-400/50 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Sound: {soundEnabled ? 'On' : 'Off'}
                </button>
              </div>

              <div className="mt-6 flex w-full max-w-3xl flex-col items-center gap-4 md:flex-row md:items-center md:justify-center md:gap-8">
                <div className="relative h-72 w-72 shrink-0">
                  <div className="absolute left-1/2 top-0 z-20 -translate-x-1/2 -translate-y-1/2">
                    <div
                      className={`h-0 w-0 border-x-[11px] border-x-transparent border-t-[18px] border-t-pink-300 ${
                        pointerTickPulse ? 'roulette-pointer-tick-pulse' : ''
                      } ${showCenterPick ? 'roulette-pointer-kick' : ''}`}
                    />
                  </div>

                  <div className="relative h-full w-full">
                    <motion.div
                      className={`roulette-wheel-depth relative h-full w-full overflow-hidden rounded-full border-4 border-pink-400/50 shadow-2xl shadow-pink-900/30 ${wheelSliceClass}`}
                      initial={false}
                      animate={{ rotate: wheelRotation }}
                      transition={
                        isSpinningWheel
                          ? { duration: 4.2, ease: [0.08, 0.88, 0.16, 1] }
                          : { duration: 0 }
                      }
                    >
                      <div className="roulette-wheel-shade pointer-events-none absolute inset-0 rounded-full" />
                      <div className="roulette-wheel-grain pointer-events-none absolute inset-0 rounded-full" />

                      {boundaryRotationClasses.map((rotationClass) => (
                        <div
                          key={`line-${rotationClass}`}
                          className={`absolute left-1/2 top-1/2 h-1/2 w-px -translate-x-1/2 -translate-y-full bg-white/25 origin-bottom ${rotationClass}`}
                        />
                      ))}

                      {activeRouletteOptions.map((dish, index) => (
                        <div key={`label-${index}`}>
                          <div className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 ${labelMidRotationClasses[index]}`}>
                            <div className={labelRadiusClass}>
                              <div
                                className={`roulette-slice-label ${labelWidthClass} text-center break-words [overflow-wrap:anywhere] ${labelMidCounterRotationClasses[index]} ${getSliceLabelSizeClass(
                                  dish
                                )}`}
                              >
                                {dish}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}

                      <div className="absolute left-1/2 top-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/15 bg-black/20 blur-md" />
                      <div className="roulette-wheel-rim pointer-events-none absolute inset-0 rounded-full" />
                    </motion.div>

                  </div>
                </div>

                <div
                  className={`roulette-result-panel w-full max-w-sm rounded-2xl border border-white/10 bg-black/40 p-4 text-center md:max-w-xs md:text-left ${
                    showCenterPick ? 'roulette-result-punk-pop' : ''
                  }`}
                >
                  <div className="roulette-result-kicker text-[11px] uppercase tracking-[0.18em] text-pink-200/75">Selected dish</div>
                  <div className="mt-2 min-h-8 text-lg font-semibold text-pink-100">
                    <span className={showCenterPick ? 'roulette-result-punk-text' : ''}>
                      {roulettePick && !isSpinningWheel ? roulettePick : '—'}
                    </span>
                  </div>
                  <div className="mt-1 text-xs text-pink-100/65">
                    {isSpinningWheel ? 'Spinning…' : 'Ready for next spin'}
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={spinRoulette}
                disabled={isSpinningWheel}
                className="mt-6 rounded-full border border-white/10 bg-gradient-to-r from-purple-600 to-pink-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-pink-500/25 transition-all hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSpinningWheel ? 'Spinning...' : 'Spin the roulette'}
              </button>

              <p className="mt-4 min-h-6 text-center text-sm text-pink-100/90">
                {roulettePick ? `Tonight's pick: ${roulettePick}` : 'Tap spin for a random food choice.'}
              </p>
            </div>
          </div>

          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {dishes.map((dish) => {
              const selected = selection[dish]

              const subtitle = (
                <>
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-xs text-pink-100/70">Tap a pay option below.</p>
                    <button
                      type="button"
                      onClick={() => addDishToRoulette(dish)}
                      className="rounded-full border border-white/15 bg-white/5 px-2.5 py-1 text-[11px] font-semibold text-pink-100 transition-all hover:border-pink-400/50 hover:text-white"
                    >
                      Add to Roulette
                    </button>
                  </div>
                  <div className="mt-3 grid grid-cols-2 gap-2">
                    {payOptions.map((opt) => {
                      const active = selected === opt.id
                      return (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() =>
                            setSelection((prev) => ({
                              ...prev,
                              [dish]: prev[dish] === opt.id ? '' : opt.id,
                            }))
                          }
                          className={`flex items-center justify-between rounded-xl border px-3 py-2 text-sm transition-all ${
                            active
                              ? 'border-pink-400 bg-pink-500/20 text-white shadow-lg shadow-pink-500/20'
                              : 'border-white/10 bg-white/5 text-pink-100/80 hover:border-pink-400/50'
                          }`}
                        >
                          <span className="font-semibold">{opt.label}</span>
                          <span className="text-xs text-pink-100/70">{opt.desc}</span>
                        </button>
                      )
                    })}
                  </div>
                </>
              )

              const action = (
                <button
                  type="button"
                  disabled={!selected || submittingDish === dish}
                  onClick={() => submitDishChoice(dish)}
                  className="w-full rounded-xl border border-white/10 bg-gradient-to-r from-purple-600 to-pink-500 px-4 py-2 text-white font-semibold shadow-md shadow-pink-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submittingDish === dish ? 'Sending...' : 'Submit choice'}
                </button>
              )

              return (
                <FlipCard key={dish} title={dish} subtitle={subtitle} action={action} />
              )
            })}
          </div>

          {role === 'admin' ? (
            <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
              <button
                type="button"
                className="text-left bg-gradient-to-r from-purple-700/70 to-pink-700/70 hover:from-purple-700 hover:to-pink-700 rounded-xl p-6 transition-all hover:scale-105 border border-white/10"
                onClick={() => setIsModalOpen(true)}
              >
                <div className="text-lg font-semibold text-white">{labels.walmartDemo}</div>
                <div className="mt-1 text-sm text-pink-100/80">{labels.logEntry}</div>
              </button>

              <button
                type="button"
                className="text-left bg-black/60 hover:bg-black/50 rounded-xl p-6 transition-all hover:scale-105 border border-white/10"
                onClick={() => {
                  const logs = getDemoLogs()
                  downloadJson('demoLogs.json', logs)
                }}
              >
                <div className="text-lg font-semibold text-white">{labels.viewLogs}</div>
                <div className="mt-1 text-sm text-pink-100/80">demoLogs.json</div>
              </button>
            </div>
          ) : null}
        </section>
      ) : null}

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

      {isRouletteModalOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 backdrop-blur-sm px-4">
          <div className="w-full max-w-xl rounded-2xl border border-white/10 bg-gradient-to-br from-purple-950 via-black to-pink-950 p-6 shadow-2xl shadow-pink-900/30">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-xs uppercase tracking-[0.2em] text-pink-200/80">Add to Roulette</div>
                <h4 className="mt-1 text-xl font-semibold text-pink-100">Build your 6 options</h4>
              </div>
              <button
                type="button"
                className="text-pink-100/70 hover:text-white"
                onClick={() => {
                  setRouletteError(null)
                  setIsRouletteModalOpen(false)
                }}
              >
                ✕
              </button>
            </div>

            <form className="mt-5 space-y-5" onSubmit={submitRouletteOptions}>
              <div>
                <div className="text-sm font-semibold text-pink-100">Menu options</div>
                <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
                  {MENU_SOURCE.map((item) => {
                    const checked = selectedMenuItems.includes(item)
                    return (
                      <label
                        key={item}
                        className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-sm transition-all ${
                          checked
                            ? 'border-pink-400/50 bg-pink-500/15 text-white'
                            : 'border-white/10 bg-white/5 text-pink-100/85 hover:border-pink-400/40'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggleMenuOption(item)}
                          className="h-4 w-4 rounded border-white/20 bg-white/10"
                        />
                        <span>{item}</span>
                      </label>
                    )
                  })}
                </div>
              </div>

              <div>
                <div className="text-sm font-semibold text-pink-100">Custom option</div>
                <div className="mt-2 flex gap-2">
                  <input
                    type="text"
                    value={customDraft}
                    maxLength={20}
                    onChange={(e) => {
                      setRouletteError(null)
                      setCustomDraft(e.target.value)
                    }}
                    placeholder="Pizza"
                    className="flex-1 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-pink-100/40 focus:border-pink-400 focus:outline-none"
                  />
                  <button
                    type="button"
                    className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm font-semibold text-pink-100 hover:border-pink-400/50"
                    onClick={addCustomDraft}
                  >
                    Add
                  </button>
                </div>

                {customEntries.length > 0 ? (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {customEntries.map((entry) => (
                      <button
                        key={entry}
                        type="button"
                        onClick={() => removeCustomEntry(entry)}
                        className="rounded-full border border-pink-400/40 bg-pink-500/15 px-3 py-1 text-xs text-pink-100 hover:border-pink-300"
                      >
                        {entry} ✕
                      </button>
                    ))}
                  </div>
                ) : null}
              </div>

              <div className="flex items-center justify-between text-xs text-pink-100/70">
                <span>{selectedMenuItems.length + customEntries.length} / 6 selected</span>
                {rouletteError ? <span className="text-rose-300">{rouletteError}</span> : null}
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setRouletteError(null)
                    setIsRouletteModalOpen(false)
                  }}
                  className="rounded-full border border-white/10 px-4 py-2 text-sm text-pink-100 hover:border-pink-400/50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-full bg-gradient-to-r from-purple-600 to-pink-500 px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-pink-500/25"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}

      {toast ? (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-gray-900 text-white px-4 py-2 rounded-lg border border-white/10 z-50">
          {toast}
        </div>
      ) : null}
    </div>
  )
}
