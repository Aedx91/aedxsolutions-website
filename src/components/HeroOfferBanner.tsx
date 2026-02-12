'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useMemo, useState } from 'react'

type Slide = {
  id: string
  title: string
  subtitle: string
}

export default function HeroOfferBanner({ lang }: { lang: string }) {
  const isEs = lang === 'es'

  const slides = useMemo<Slide[]>(
    () =>
      isEs
        ? [
            {
              id: 'ai-growth',
              title: 'IA que mantiene en marcha a los pequeños negocios',
              subtitle:
                'Automatiza ingreso, operaciones y soporte con flujos creados para las herramientas que ya utilizas.',
            },
            {
              id: 'custom-api',
              title: 'Integraciones API Personalizadas',
              subtitle:
                'Conecta tus sistemas de punta a punta: CRM, despacho, flota, telefonía y facturación con APIs confiables.',
            },
            {
              id: 'custom-systems',
              title: 'Sistemas y Automatización',
              subtitle:
                'Construye herramientas internas, dashboards y checklists para eliminar trabajo repetitivo y alinear equipos.',
            },
            {
              id: 'intake-routing',
              title: 'Ingreso y Enrutamiento con IA',
              subtitle:
                'Convierte solicitudes entrantes en tareas estructuradas con etiquetado inteligente y prioridad automática.',
            },
            {
              id: 'customer-care',
              title: 'Asistencia al Cliente',
              subtitle:
                'Acelera respuestas, unifica contexto y mantiene la voz de tu marca con soporte asistido por IA.',
            },
          ]
        : [
            {
              id: 'ai-growth',
              title: 'AI that keeps small businesses moving',
              subtitle:
                'Automate intake, operations, and customer care with workflows built for the tools you already use.',
            },
            {
              id: 'custom-api',
              title: 'Custom API Integrations',
              subtitle:
                'Connect your systems end-to-end: CRM, dispatch, fleet, telephony, and billing with reliable custom APIs.',
            },
            {
              id: 'custom-systems',
              title: 'Custom Systems & Automation',
              subtitle:
                'Build internal tools, dashboards, and checklists that eliminate repetitive work and keep teams aligned.',
            },
            {
              id: 'intake-routing',
              title: 'AI Intake & Routing',
              subtitle:
                'Turn inbound requests into structured tasks with smart tagging, priority scoring, and instant routing.',
            },
            {
              id: 'customer-care',
              title: 'Customer Care Assist',
              subtitle:
                'Speed up replies, unify context, and keep your team on brand with AI-assisted support workflows.',
            },
          ],
    [isEs]
  )

  const [activeIndex, setActiveIndex] = useState(0)

  const goToPrev = () => {
    setActiveIndex((current) => (current - 1 + slides.length) % slides.length)
  }

  const goToNext = () => {
    setActiveIndex((current) => (current + 1) % slides.length)
  }

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % slides.length)
    }, 15000)

    return () => window.clearInterval(timer)
  }, [slides.length])

  const activeSlide = slides[activeIndex]

  return (
    <section className="mt-5">
      <div className="relative overflow-hidden rounded-2xl bg-transparent p-5 sm:p-6">
        <div className="pointer-events-none absolute inset-0 rounded-2xl bg-[radial-gradient(circle_at_15%_20%,rgba(236,72,153,0.16),transparent_40%),radial-gradient(circle_at_85%_80%,rgba(99,102,241,0.16),transparent_45%)]" aria-hidden />
        <div className="pointer-events-none absolute inset-0 rounded-2xl border border-white/5" aria-hidden />
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSlide.id}
            initial={{ opacity: 0, x: 20, scale: 0.99 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -20, scale: 0.99 }}
            transition={{ duration: 0.42, ease: [0.2, 0.9, 0.2, 1] }}
            className="relative"
          >
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-semibold tracking-tight leading-[1.08] font-display text-text-hero min-h-[3.2em] sm:min-h-[2.4em]">
              {activeSlide.title}
            </h1>
            <p className="mt-3 text-lg sm:text-xl text-text-secondary max-w-2xl min-h-[4.4em]">{activeSlide.subtitle}</p>
          </motion.div>
        </AnimatePresence>

        <div className="mt-5 flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={goToPrev}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-white/5 text-text-primary transition-all hover:border-pink-400/50"
            aria-label={isEs ? 'Anterior' : 'Previous'}
          >
            ‹
          </button>

          <div className="flex items-center gap-2">
            {slides.map((slide, index) => {
              const active = index === activeIndex
              return (
                <button
                  key={slide.id}
                  type="button"
                  onClick={() => setActiveIndex(index)}
                  className={`h-2.5 rounded-full transition-all ${active ? 'w-7 bg-pink-400' : 'w-2.5 bg-white/35 hover:bg-white/55'}`}
                  aria-label={isEs ? `Ir al slide ${index + 1}` : `Go to slide ${index + 1}`}
                />
              )
            })}
          </div>

          <button
            type="button"
            onClick={goToNext}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-white/5 text-text-primary transition-all hover:border-pink-400/50"
            aria-label={isEs ? 'Siguiente' : 'Next'}
          >
            ›
          </button>
        </div>
      </div>
    </section>
  )
}
