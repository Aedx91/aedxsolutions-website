import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { getDbPool } from '@/lib/db'

const TOKEN_COOKIE = 'auth_token'
const TOKEN_TTL_DAYS = 7

export type AuthUser = {
  id: number
  username: string
  role: string
}

type JwtPayload = {
  sub: number
  username: string
  role: string
}

function getJwtSecret() {
  const secret = process.env.AUTH_SECRET
  if (!secret) throw new Error('AUTH_SECRET is not set')
  return secret
}

export async function ensureUsersTable() {
  const pool = getDbPool()
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      username VARCHAR(50) UNIQUE NOT NULL,
      password_hash VARCHAR(255) NOT NULL,
      role VARCHAR(20) DEFAULT 'user',
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    );
  `)
}

export async function findUserByUsername(username: string) {
  const pool = getDbPool()
  const res = await pool.query('SELECT id, username, role, password_hash FROM users WHERE username = $1', [username])
  return res.rows[0] as (AuthUser & { password_hash: string }) | undefined
}

export async function createUser(username: string, password: string, role = 'user') {
  const pool = getDbPool()
  const hash = await bcrypt.hash(password, 10)
  const res = await pool.query(
    'INSERT INTO users (username, password_hash, role) VALUES ($1, $2, $3) RETURNING id, username, role',
    [username, hash, role]
  )
  return res.rows[0] as AuthUser
}

export async function verifyCredentials(username: string, password: string) {
  const user = await findUserByUsername(username)
  if (!user) return null
  const ok = await bcrypt.compare(password, user.password_hash)
  if (!ok) return null
  return { id: user.id, username: user.username, role: user.role } as AuthUser
}

export async function changePassword(userId: number, newPassword: string) {
  const pool = getDbPool()
  const hash = await bcrypt.hash(newPassword, 10)
  await pool.query('UPDATE users SET password_hash = $1, updated_at = NOW() WHERE id = $2', [hash, userId])
}

export function signToken(payload: AuthUser) {
  const secret = getJwtSecret()
  const token = jwt.sign(
    { sub: payload.id, username: payload.username, role: payload.role } satisfies JwtPayload,
    secret,
    { expiresIn: `${TOKEN_TTL_DAYS}d` }
  )
  return token
}

export function verifyToken(token: string): AuthUser | null {
  try {
    const secret = getJwtSecret()
    const decoded = jwt.verify(token, secret)
    if (
      !decoded ||
      typeof decoded !== 'object' ||
      !('sub' in decoded) ||
      !('username' in decoded) ||
      !('role' in decoded)
    ) {
      return null
    }
    const payload = decoded as unknown as JwtPayload
    return { id: payload.sub, username: payload.username, role: payload.role }
  } catch {
    return null
  }
}

export function buildAuthCookie(token: string) {
  const maxAge = TOKEN_TTL_DAYS * 24 * 60 * 60
  const secure = process.env.NODE_ENV === 'production' ? 'Secure; ' : ''
  return `${TOKEN_COOKIE}=${token}; Path=/; HttpOnly; ${secure}SameSite=Lax; Max-Age=${maxAge}`
}

export function clearAuthCookie() {
  const secure = process.env.NODE_ENV === 'production' ? 'Secure; ' : ''
  return `${TOKEN_COOKIE}=deleted; Path=/; HttpOnly; ${secure}SameSite=Lax; Max-Age=0`
}

export function extractTokenFromRequest(req: Request) {
  const cookie = req.headers.get('cookie') || ''
  const match = cookie.split(';').map((c) => c.trim()).find((c) => c.startsWith(`${TOKEN_COOKIE}=`))
  if (!match) return null
  return match.substring(TOKEN_COOKIE.length + 1)
}
