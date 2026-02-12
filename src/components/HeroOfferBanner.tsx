'use client'

import Link from 'next/link'
import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useMemo, useState } from 'react'

type Slide = {
  id: string
  title: string
  subtitle: string
  primaryCta: string
  primaryHref: string
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
              primaryCta: 'Solicitar hoja de ruta',
              primaryHref: `/${lang}/contact`,
            },
            {
              id: 'custom-api',
              title: 'Integraciones API Personalizadas',
              subtitle:
                'Conecta tus sistemas de punta a punta: CRM, despacho, flota, telefonía y facturación con APIs confiables.',
              primaryCta: 'Hablar de integración',
              primaryHref: `/${lang}/contact`,
            },
            {
              id: 'custom-systems',
              title: 'Sistemas y Automatización',
              subtitle:
                'Construye herramientas internas, dashboards y checklists para eliminar trabajo repetitivo y alinear equipos.',
              primaryCta: 'Iniciar proyecto',
              primaryHref: `/${lang}/contact`,
            },
            {
              id: 'intake-routing',
              title: 'Ingreso y Enrutamiento con IA',
              subtitle:
                'Convierte solicitudes entrantes en tareas estructuradas con etiquetado inteligente y prioridad automática.',
              primaryCta: 'Ver capacidades',
              primaryHref: `/${lang}/products`,
            },
            {
              id: 'customer-care',
              title: 'Asistencia al Cliente',
              subtitle:
                'Acelera respuestas, unifica contexto y mantiene la voz de tu marca con soporte asistido por IA.',
              primaryCta: 'Explorar soluciones',
              primaryHref: `/${lang}/products`,
            },
          ]
        : [
            {
              id: 'ai-growth',
              title: 'AI that keeps small businesses moving',
              subtitle:
                'Automate intake, operations, and customer care with workflows built for the tools you already use.',
              primaryCta: 'Get a roadmap',
              primaryHref: `/${lang}/contact`,
            },
            {
              id: 'custom-api',
              title: 'Custom API Integrations',
              subtitle:
                'Connect your systems end-to-end: CRM, dispatch, fleet, telephony, and billing with reliable custom APIs.',
              primaryCta: 'Discuss your integration',
              primaryHref: `/${lang}/contact`,
            },
            {
              id: 'custom-systems',
              title: 'Custom Systems & Automation',
              subtitle:
                'Build internal tools, dashboards, and checklists that eliminate repetitive work and keep teams aligned.',
              primaryCta: 'Start your project',
              primaryHref: `/${lang}/contact`,
            },
            {
              id: 'intake-routing',
              title: 'AI Intake & Routing',
              subtitle:
                'Turn inbound requests into structured tasks with smart tagging, priority scoring, and instant routing.',
              primaryCta: 'See capabilities',
              primaryHref: `/${lang}/products`,
            },
            {
              id: 'customer-care',
              title: 'Customer Care Assist',
              subtitle:
                'Speed up replies, unify context, and keep your team on brand with AI-assisted support workflows.',
              primaryCta: 'Explore solutions',
              primaryHref: `/${lang}/products`,
            },
          ],
    [isEs, lang]
  )

  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % slides.length)
    }, 6500)

    return () => window.clearInterval(timer)
  }, [slides.length])

  const activeSlide = slides[activeIndex]

  return (
    <section className="mt-5">
      <div className="flex flex-wrap gap-2">
        {slides.map((slide, index) => {
          const active = index === activeIndex
          return (
            <button
              key={slide.id}
              type="button"
              onClick={() => setActiveIndex(index)}
              className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition-all ${
                active
                  ? 'border-pink-400/70 bg-pink-500/20 text-white'
                  : 'border-white/10 bg-white/5 text-text-secondary hover:border-pink-400/40 hover:text-white'
              }`}
            >
              {slide.title}
            </button>
          )
        })}
      </div>

      <div className="mt-4 min-h-[208px] rounded-2xl border border-white/10 bg-black/25 p-5 sm:p-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSlide.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.28 }}
          >
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-semibold tracking-tight leading-[1.05] sm:leading-tight font-display text-text-hero">
              {activeSlide.title}
            </h1>
            <p className="mt-5 text-lg sm:text-xl text-text-secondary max-w-2xl">{activeSlide.subtitle}</p>

            <div className="mt-7 flex flex-wrap items-center gap-3">
              <Link className="btn btn-primary shadow-glow" href={activeSlide.primaryHref}>
                {activeSlide.primaryCta}
              </Link>
              <Link className="btn btn-outline" href={`/${lang}/products`}>
                {isEs ? 'Explorar soluciones' : 'Explore solutions'}
              </Link>
              <Link className="btn btn-outline" href={`/${lang}/demo/login`}>
                {isEs ? 'Ver demo' : 'See demo'}
              </Link>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  )
}
