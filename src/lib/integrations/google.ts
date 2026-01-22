import { upsertProviderToken, getProviderToken } from './tokens'

function env(key: string) {
  const value = process.env[key]
  if (!value) throw new Error(`Missing env ${key}`)
  return value
}

const GOOGLE_AUTH_URL = 'https://accounts.google.com/o/oauth2/v2/auth'
const GOOGLE_TOKEN_URL = 'https://oauth2.googleapis.com/token'
const GOOGLE_SCOPE = 'https://www.googleapis.com/auth/calendar.events'

export function getGoogleAuthUrl(userId: string) {
  const clientId = env('GOOGLE_CLIENT_ID')
  const redirectUri = `${env('APP_BASE_URL')}/api/integrations/google/callback`
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: GOOGLE_SCOPE,
    access_type: 'offline',
    prompt: 'consent',
    state: userId,
  })
  return `${GOOGLE_AUTH_URL}?${params.toString()}`
}

async function exchangeCode(code: string) {
  const clientId = env('GOOGLE_CLIENT_ID')
  const clientSecret = env('GOOGLE_CLIENT_SECRET')
  const redirectUri = `${env('APP_BASE_URL')}/api/integrations/google/callback`
  const params = new URLSearchParams({
    code,
    client_id: clientId,
    client_secret: clientSecret,
    redirect_uri: redirectUri,
    grant_type: 'authorization_code',
  })
  const res = await fetch(GOOGLE_TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params.toString(),
  })
  if (!res.ok) throw new Error('Google token exchange failed')
  return res.json() as Promise<{ access_token: string; refresh_token?: string; expires_in?: number; scope?: string }>
}

async function refreshToken(userId: string, refreshTokenValue: string) {
  const clientId = env('GOOGLE_CLIENT_ID')
  const clientSecret = env('GOOGLE_CLIENT_SECRET')
  const params = new URLSearchParams({
    refresh_token: refreshTokenValue,
    client_id: clientId,
    client_secret: clientSecret,
    grant_type: 'refresh_token',
  })
  const res = await fetch(GOOGLE_TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params.toString(),
  })
  if (!res.ok) throw new Error('Google token refresh failed')
  const json = await res.json() as { access_token: string; expires_in?: number; scope?: string }
  await upsertProviderToken(userId, 'google', { ...json, refresh_token: refreshTokenValue })
  return json.access_token
}

export async function saveGoogleToken(userId: string, code: string) {
  const token = await exchangeCode(code)
  await upsertProviderToken(userId, 'google', token)
}

async function getValidAccessToken(userId: string) {
  const stored = await getProviderToken(userId, 'google')
  if (!stored) return null
  const expiresAt = stored.expires_at ? new Date(stored.expires_at).getTime() : null
  if (expiresAt && expiresAt - Date.now() < 60_000 && stored.refresh_token) {
    try {
      return await refreshToken(userId, stored.refresh_token)
    } catch (error) {
      console.error('Google refresh failed', error)
    }
  }
  return stored.access_token
}

export async function createGoogleEvent(userId: string, payload: { summary: string; description?: string; date: string }) {
  const accessToken = await getValidAccessToken(userId)
  if (!accessToken) return null
  const body = {
    summary: payload.summary,
    description: payload.description,
    start: { date: payload.date },
    end: { date: payload.date },
  }
  const res = await fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })
  if (!res.ok) {
    console.error('Google event create failed', await res.text())
    return null
  }
  const json = await res.json() as { id?: string }
  return json.id ?? null
}

export async function deleteGoogleEvent(userId: string, eventId: string) {
  const accessToken = await getValidAccessToken(userId)
  if (!accessToken) return
  const res = await fetch(`https://www.googleapis.com/calendar/v3/calendars/primary/events/${encodeURIComponent(eventId)}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${accessToken}` },
  })
  if (!res.ok) {
    console.error('Google event delete failed', await res.text())
  }
}
