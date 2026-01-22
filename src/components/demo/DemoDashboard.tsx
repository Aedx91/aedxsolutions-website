'use client'

import React, { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import FlipCard from '@/components/FlipCard'
  const router = useRouter()
  const [isAuthed, setIsAuthed] = useState(false)
  const [tab, setTab] = useState<'menu' | 'dates' | 'todo' | 'watch'>('menu')
  const [role, setRole] = useState<'carmy' | 'admin' | null>(null)
  const [toast, setToast] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const options = useMemo(() => {
    return features.items.map((item, idx) => {
      const key = idx === 0 ? 'discovery' : idx === 1 ? 'integration' : 'ai-pilot'
      return { key, title: item.title, subtitle: item.desc }
    })
  }, [features.items])

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
    if (!toast) return
    const t = window.setTimeout(() => setToast(null), 2500)
    return () => window.clearTimeout(t)
  }, [toast])

  if (!isAuthed) return null

  const tabContent = {
    menu: (
      <div className="space-y-4">
        <div className="rounded-2xl border border-purple-500/30 bg-purple-900/30 p-6 shadow-lg shadow-purple-900/40">
          <h3 className="text-xl font-semibold text-pink-200">Carmy Food Menu</h3>
          <p className="mt-2 text-sm text-pink-100/80">Save favorite dishes, weekly picks, and new experiments.</p>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="rounded-xl bg-black/50 border border-white/5 p-4">
              <div className="text-pink-200 font-semibold">This week</div>
              <ul className="mt-2 space-y-1 text-pink-100/80">
                <li>• Truffle pasta</li>
                <li>• Spicy tuna bowls</li>
                <li>• Citrus salmon</li>
              </ul>
            </div>
            <div className="rounded-xl bg-black/50 border border-white/5 p-4">
              <div className="text-pink-200 font-semibold">On deck</div>
              <ul className="mt-2 space-y-1 text-pink-100/80">
                <li>• Gnocchi w/ pesto</li>
                <li>• Miso cod</li>
                <li>• Roasted veggies</li>
              </ul>
            </div>
            <div className="rounded-xl bg-black/50 border border-white/5 p-4">
              <div className="text-pink-200 font-semibold">Treats</div>
              <ul className="mt-2 space-y-1 text-pink-100/80">
                <li>• Tiramisu jars</li>
                <li>• Berry shortcake</li>
                <li>• Mochi flight</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    ),
    dates: (
      <div className="rounded-2xl border border-purple-500/30 bg-gradient-to-br from-purple-900/40 via-black to-pink-900/20 p-6 shadow-lg shadow-purple-900/40">
        <h3 className="text-xl font-semibold text-pink-200">Dates & Moments</h3>
        <p className="mt-2 text-sm text-pink-100/80">Keep little anniversaries, plans, and surprises aligned.</p>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="rounded-xl bg-black/50 border border-white/5 p-4">
            <div className="text-pink-200 font-semibold">Upcoming</div>
            <ul className="mt-2 space-y-1 text-pink-100/80">
              <li>• Thursday: sushi + movie</li>
              <li>• Sunday: hike + picnic</li>
              <li>• Next week: new coffee spot</li>
            </ul>
          </div>
          <div className="rounded-xl bg-black/50 border border-white/5 p-4">
            <div className="text-pink-200 font-semibold">Memories</div>
            <ul className="mt-2 space-y-1 text-pink-100/80">
              <li>• First ramen date</li>
              <li>• Rooftop sunset</li>
              <li>• Surprise gelato run</li>
            </ul>
          </div>
        </div>
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
          <div className="absolute right-4 top-4 flex gap-2">
            <button
              type="button"
              className="px-3 py-2 text-sm rounded-full border border-white/20 bg-white/10 text-white hover:border-white/40"
              onClick={() => {
                clearStoredAuth()
                router.replace(`/${lang}`)
              }}
            >
              Log out
            </button>
          </div>
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
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-all border ${
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

        <div className="mt-6">{tabContent[tab]}</div>
      </section>

      {tab === 'menu' ? (
        <section className="py-6">
          <h2 className="text-2xl font-semibold text-pink-100 text-center">{features.sectionTitle}</h2>
          <p className="mt-2 text-pink-100/80 max-w-2xl mx-auto text-center">{features.sectionSubtitle}</p>

          <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
            {options.map((option) => (
              <div key={option.key} className="transition-all hover:scale-105">
                <FlipCard
                  title={option.title}
                  subtitle={<span>{option.subtitle}</span>}
                  ctaHref={`/${lang}/products`}
                  ctaLabel={lang === 'es' ? 'Más info' : 'More info'}
                />
              </div>
            ))}
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
