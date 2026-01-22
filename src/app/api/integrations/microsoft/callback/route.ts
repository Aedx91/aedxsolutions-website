import { NextResponse } from 'next/server'
import { saveMicrosoftToken } from '@/lib/integrations/microsoft'

export async function GET(req: Request) {
  const url = new URL(req.url)
  const code = url.searchParams.get('code')
  const user = url.searchParams.get('state')
  if (!code || !user) return NextResponse.json({ error: 'Missing code or user' }, { status: 400 })
  try {
    await saveMicrosoftToken(user, code)
    return NextResponse.redirect(`${process.env.APP_BASE_URL || ''}/?connected=microsoft`)
  } catch (error) {
    console.error('Microsoft callback error', error)
    return NextResponse.json({ error: 'Failed to save token' }, { status: 500 })
  }
}
