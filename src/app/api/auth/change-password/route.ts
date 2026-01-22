import { NextResponse } from 'next/server'
import { changePassword, extractTokenFromRequest, verifyToken } from '@/lib/auth/server'

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}))
    const newPassword = typeof body.newPassword === 'string' ? body.newPassword : ''

    const token = extractTokenFromRequest(req)
    const user = token ? verifyToken(token) : null
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    if (!newPassword || newPassword.length < 6) {
      return NextResponse.json({ error: 'New password must be at least 6 characters' }, { status: 400 })
    }

    await changePassword(user.id, newPassword)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Change password error', error)
    return NextResponse.json({ error: 'Unexpected error' }, { status: 500 })
  }
}
