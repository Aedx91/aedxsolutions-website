import { NextResponse } from 'next/server'
import { ensureUsersTable, createUser, findUserByUsername, signToken, buildAuthCookie } from '@/lib/auth/server'

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}))
    const username = typeof body.username === 'string' ? body.username.trim() : ''
    const password = typeof body.password === 'string' ? body.password : ''

    if (!username || !password) {
      return NextResponse.json({ error: 'Username and password are required' }, { status: 400 })
    }
    if (password.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters' }, { status: 400 })
    }

    await ensureUsersTable()
    const existing = await findUserByUsername(username)
    if (existing) {
      return NextResponse.json({ error: 'User already exists' }, { status: 409 })
    }

    const user = await createUser(username, password, 'admin')
    const token = signToken(user)
    return NextResponse.json({ user }, { status: 201, headers: { 'Set-Cookie': buildAuthCookie(token) } })
  } catch (error) {
    console.error('Signup error', error)
    return NextResponse.json({ error: 'Unexpected error' }, { status: 500 })
  }
}
