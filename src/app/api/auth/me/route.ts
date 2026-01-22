import { NextResponse } from 'next/server'
import { extractTokenFromRequest, verifyToken } from '@/lib/auth/server'

export async function GET(req: Request) {
  const token = extractTokenFromRequest(req)
  const user = token ? verifyToken(token) : null
  if (!user) {
    return NextResponse.json({ user: null }, { status: 401 })
  }
  return NextResponse.json({ user })
}
