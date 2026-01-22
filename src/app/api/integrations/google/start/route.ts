import { NextResponse } from 'next/server'
import { getGoogleAuthUrl } from '@/lib/integrations/google'

export async function GET(req: Request) {
  const url = new URL(req.url)
  const userId = url.searchParams.get('user')
  if (!userId) return NextResponse.json({ error: 'Missing user' }, { status: 400 })
  const redirect = getGoogleAuthUrl(userId)
  return NextResponse.redirect(redirect)
}
