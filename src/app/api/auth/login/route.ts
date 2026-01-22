import { NextResponse } from 'next/server'
import { ensureUsersTable, verifyCredentials, signToken, buildAuthCookie, clearAuthCookie } from '@/lib/auth/server'

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}))
    const username = typeof body.username === 'string' ? body.username.trim() : ''
    const password = typeof body.password === 'string' ? body.password : ''

    if (!username || !password) {
      return NextResponse.json({ error: 'Username and password are required' }, { status: 400 })
    }

    await ensureUsersTable()
    const user = await verifyCredentials(username, password)
    if (!user) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401, headers: { 'Set-Cookie': clearAuthCookie() } })
    }

    const token = signToken(user)
    return NextResponse.json({ user }, { status: 200, headers: { 'Set-Cookie': buildAuthCookie(token) } })
  } catch (error) {
    console.error('Login error', error)
    return NextResponse.json({ error: 'Unexpected error' }, { status: 500 })
  }
}
