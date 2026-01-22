import { NextResponse } from 'next/server'
import { saveGoogleToken } from '@/lib/integrations/google'

export async function GET(req: Request) {
  const url = new URL(req.url)
  const code = url.searchParams.get('code')
  const user = url.searchParams.get('state')
  if (!code || !user) return NextResponse.json({ error: 'Missing code or user' }, { status: 400 })
  try {
    await saveGoogleToken(user, code)
    return NextResponse.redirect(`${process.env.APP_BASE_URL || ''}/?connected=google`)
  } catch (error) {
    console.error('Google callback error', error)
    return NextResponse.json({ error: 'Failed to save token' }, { status: 500 })
  }
}
