import type { Metadata } from 'next'
import { getDictionary, Lang } from '@/lib/i18n/dictionaries'
import { pageMeta } from '@/lib/seo'
import DemoDashboard from '@/components/demo/DemoDashboard'

export async function generateMetadata(props: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await props.params
  const safe: Lang = lang === 'es' ? 'es' : 'en'
  const dict = await getDictionary(safe)
  return pageMeta(
    safe,
    '/demo/dashboard',
    dict.demo.dashboardTitle,
    dict.demo.dashboardDescription
  )
}

export default async function DemoDashboardPage(props: { params: Promise<{ lang: string }> }) {
  const { lang } = await props.params
  const safe: Lang = lang === 'es' ? 'es' : 'en'
  const dict = await getDictionary(safe)

  return (
    <DemoDashboard
      lang={safe}
      hero={{ title: dict.demoHero.title, subtitle: dict.demoHero.subtitle }}
      features={dict.features}
      labels={dict.demo.dashboard}
    />
  )
}
