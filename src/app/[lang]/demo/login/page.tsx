import type { Metadata } from 'next'
import { getDictionary, Lang } from '@/lib/i18n/dictionaries'
import { pageMeta } from '@/lib/seo'
import LoginForm from '@/components/demo/LoginForm'

export async function generateMetadata(props: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await props.params
  const safe: Lang = lang === 'es' ? 'es' : 'en'
  const dict = await getDictionary(safe)
  return pageMeta(
    safe,
    '/demo/login',
    dict.demo.loginTitle,
    dict.demo.loginDescription
  )
}

export default async function DemoLoginPage(props: { params: Promise<{ lang: string }> }) {
  const { lang } = await props.params
  const safe: Lang = lang === 'es' ? 'es' : 'en'
  const dict = await getDictionary(safe)
  return <LoginForm lang={safe} labels={dict.demo.login} />
}
