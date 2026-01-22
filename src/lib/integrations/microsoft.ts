import { upsertProviderToken, getProviderToken } from './tokens'

function env(key: string) {
  const value = process.env[key]
  if (!value) throw new Error(`Missing env ${key}`)
  return value
}

const AUTH_BASE = 'https://login.microsoftonline.com'
const GRAPH_BASE = 'https://graph.microsoft.com/v1.0'
const MS_SCOPE = 'Calendars.ReadWrite offline_access'

export function getMicrosoftAuthUrl(userId: string) {
  const clientId = env('MS_CLIENT_ID')
  const tenant = env('MS_TENANT_ID') || 'common'
  const redirectUri = `${env('APP_BASE_URL')}/api/integrations/microsoft/callback`
  const params = new URLSearchParams({
    client_id: clientId,
    response_type: 'code',
    redirect_uri: redirectUri,
    response_mode: 'query',
    scope: MS_SCOPE,
    state: userId,
  })
  return `${AUTH_BASE}/${tenant}/oauth2/v2.0/authorize?${params.toString()}`
}

async function exchangeCode(code: string) {
  const clientId = env('MS_CLIENT_ID')
  const clientSecret = env('MS_CLIENT_SECRET')
  const tenant = env('MS_TENANT_ID') || 'common'
  const redirectUri = `${env('APP_BASE_URL')}/api/integrations/microsoft/callback`
  const params = new URLSearchParams({
    client_id: clientId,
    scope: MS_SCOPE,
    code,
    redirect_uri: redirectUri,
    grant_type: 'authorization_code',
    client_secret: clientSecret,
  })
  const res = await fetch(`${AUTH_BASE}/${tenant}/oauth2/v2.0/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params.toString(),
  })
  if (!res.ok) throw new Error('MS token exchange failed')
  return res.json() as Promise<{ access_token: string; refresh_token?: string; expires_in?: number; scope?: string }>
}

async function refreshToken(userId: string, refreshTokenValue: string) {
  const clientId = env('MS_CLIENT_ID')
  const clientSecret = env('MS_CLIENT_SECRET')
  const tenant = env('MS_TENANT_ID') || 'common'
  const params = new URLSearchParams({
    client_id: clientId,
    scope: MS_SCOPE,
    refresh_token: refreshTokenValue,
    grant_type: 'refresh_token',
    client_secret: clientSecret,
  })
  const res = await fetch(`${AUTH_BASE}/${tenant}/oauth2/v2.0/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params.toString(),
  })
  if (!res.ok) throw new Error('MS token refresh failed')
  const json = await res.json() as { access_token: string; expires_in?: number; scope?: string }
  await upsertProviderToken(userId, 'microsoft', { ...json, refresh_token: refreshTokenValue })
  return json.access_token
}

export async function saveMicrosoftToken(userId: string, code: string) {
  const token = await exchangeCode(code)
  await upsertProviderToken(userId, 'microsoft', token)
}

async function getValidAccessToken(userId: string) {
  const stored = await getProviderToken(userId, 'microsoft')
  if (!stored) return null
  const expiresAt = stored.expires_at ? new Date(stored.expires_at).getTime() : null
  if (expiresAt && expiresAt - Date.now() < 60_000 && stored.refresh_token) {
    try {
      return await refreshToken(userId, stored.refresh_token)
    } catch (error) {
      console.error('MS refresh failed', error)
    }
  }
  return stored.access_token
}

export async function createMicrosoftEvent(userId: string, payload: { subject: string; body?: string; date: string }) {
  const accessToken = await getValidAccessToken(userId)
  if (!accessToken) return null
  const body = {
    subject: payload.subject,
    body: {
      contentType: 'Text',
      content: payload.body ?? '',
    },
    start: { dateTime: `${payload.date}T00:00:00`, timeZone: 'UTC' },
    end: { dateTime: `${payload.date}T23:59:59`, timeZone: 'UTC' },
  }
  const res = await fetch(`${GRAPH_BASE}/me/events`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })
  if (!res.ok) {
    console.error('MS event create failed', await res.text())
    return null
  }
  const json = await res.json() as { id?: string }
  return json.id ?? null
}

export async function deleteMicrosoftEvent(userId: string, eventId: string) {
  const accessToken = await getValidAccessToken(userId)
  if (!accessToken) return
  const res = await fetch(`${GRAPH_BASE}/me/events/${encodeURIComponent(eventId)}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${accessToken}` },
  })
  if (!res.ok) {
    console.error('MS event delete failed', await res.text())
  }
}
