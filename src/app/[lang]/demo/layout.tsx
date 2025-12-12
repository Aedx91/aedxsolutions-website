import type { ReactNode } from 'react'
import { getDictionary, Lang } from '@/lib/i18n/dictionaries'
import DemoTopNav from '@/components/demo/DemoTopNav'

export default async function DemoLayout({
  params,
  children,
}: {
  params: Promise<{ lang: string }>
  children: ReactNode
}) {
  const { lang: rawLang } = await params
  const lang: Lang = rawLang === 'es' ? 'es' : 'en'
  const dict = await getDictionary(lang)

  return (
    <div className="min-h-screen bg-black text-white">
      <DemoTopNav lang={lang} logoutLabel={dict.demo.dashboard.logout} />
      <main className="container pb-16">{children}</main>
    </div>
  )
}
