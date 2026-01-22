import type { Metadata } from 'next'
import AdminDashboard from '@/components/demo/AdminDashboard'
import { pageMeta } from '@/lib/seo'
import type { Lang } from '@/lib/i18n/dictionaries'

export async function generateMetadata(props: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await props.params
  const safe: Lang = lang === 'es' ? 'es' : 'en'
  return pageMeta(safe, '/demo/admin', 'Admin control', 'Admin-only controls for the demo')
}

export default async function AdminDashboardPage(props: { params: Promise<{ lang: string }> }) {
  const { lang } = await props.params
  const safe: Lang = lang === 'es' ? 'es' : 'en'
  return <AdminDashboard lang={safe} />
}
