import { NextResponse } from 'next/server'
import { getMicrosoftAuthUrl } from '@/lib/integrations/microsoft'

export async function GET(req: Request) {
  const url = new URL(req.url)
  const userId = url.searchParams.get('user')
  if (!userId) return NextResponse.json({ error: 'Missing user' }, { status: 400 })
  const redirect = getMicrosoftAuthUrl(userId)
  return NextResponse.redirect(redirect)
}
