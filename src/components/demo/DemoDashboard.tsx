'use client'

import React, { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import FlipCard from '@/components/FlipCard'
import WalmartDemoModal from '@/components/demo/WalmartDemoModal'
import { getStoredAuth } from '@/hooks/useAuth'
import { appendDemoLog, downloadJson, getDemoLogs } from '@/lib/demoLogs'
import type { Lang } from '@/lib/i18n/dictionaries'

type FeatureItem = { title: string; desc: string }
type DateItem = { id: string; date: string; description: string }

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
  const [toast, setToast] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selection, setSelection] = useState<Record<string, string>>({})
  const [submittingDish, setSubmittingDish] = useState<string | null>(null)
  const [dates, setDates] = useState<DateItem[]>([])
  const [isDateModalOpen, setIsDateModalOpen] = useState(false)
  const [dateForm, setDateForm] = useState({ date: '', description: '' })
  const datesStorageKey = useMemo(() => `carmy-dates-${lang}`, [lang])

  const dishes = useMemo(
    () => [
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
    ],
    []
  )

  const payOptions = [
    { id: 'x1', label: 'x1', desc: 'You cover it all' },
    { id: 'x2', label: 'x2', desc: 'Split 50/50' },
    { id: 'x3', label: 'x3', desc: 'Carmy covers it' },
    { id: 'x4', label: 'x4', desc: 'Bodymatic mode' },
  ]

  const formatDate = (value: string) => {
    try {
      return new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(value))
    } catch {
      return value
    }
  }

  function persistDates(next: DateItem[]) {
    if (typeof window === 'undefined') return
    window.localStorage.setItem(datesStorageKey, JSON.stringify(next))
  }

  const addDate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!dateForm.date || !dateForm.description.trim()) return
    const id = typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}`
    const next = [...dates, { id, date: dateForm.date, description: dateForm.description.trim() }].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    )
    setDates(next)
    persistDates(next)
    setDateForm({ date: '', description: '' })
    setIsDateModalOpen(false)
    setToast('Date added')
  }

  const deleteDate = (id: string) => {
    const next = dates.filter((item) => item.id !== id)
    setDates(next)
    persistDates(next)
    setToast('Removed')
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
    setIsAuthed(true)
  }, [lang, router])

  useEffect(() => {
    if (typeof window === 'undefined') return
    const stored = window.localStorage.getItem(datesStorageKey)
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as DateItem[]
        setDates(parsed.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()))
      } catch (error) {
        console.error('Failed to parse stored dates', error)
      }
    }
  }, [datesStorageKey])

  useEffect(() => {
    if (!toast) return
    const t = window.setTimeout(() => setToast(null), 2500)
    return () => window.clearTimeout(t)
  }, [toast])

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
              onClick={() => setToast('Calendar sync coming soon (Google & Outlook)')}
            >
              Sync calendars
            </button>
          </div>
        </div>

        <div className="mt-4 rounded-2xl bg-black/50 border border-white/5 p-4">
          {dates.length === 0 ? (
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

          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {dishes.map((dish) => {
              const selected = selection[dish]

              const subtitle = (
                <>
                  <p className="text-xs text-pink-100/70">Tap a pay option below.</p>
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

      {toast ? (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-gray-900 text-white px-4 py-2 rounded-lg border border-white/10 z-50">
          {toast}
        </div>
      ) : null}
    </div>
  )
}
