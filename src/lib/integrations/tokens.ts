import { getSupabaseServiceClient } from '@/lib/supabase/server'

export type Provider = 'google' | 'microsoft'

export type StoredToken = {
  access_token: string
  refresh_token: string | null
  expires_at: string | null
  scope: string | null
}

export async function getProviderToken(userId: string, provider: Provider): Promise<StoredToken | null> {
  const supabase = getSupabaseServiceClient()
  const { data, error } = await supabase
    .from('oauth_tokens')
    .select('access_token, refresh_token, expires_at, scope')
    .eq('user_id', userId)
    .eq('provider', provider)
    .single()

  if (error || !data) return null
  return data as StoredToken
}

export async function upsertProviderToken(userId: string, provider: Provider, token: {
  access_token: string
  refresh_token?: string | null
  expires_in?: number | null
  scope?: string | null
}) {
  const supabase = getSupabaseServiceClient()
  const expiresAt = token.expires_in ? new Date(Date.now() + token.expires_in * 1000).toISOString() : null
  const { error } = await supabase.from('oauth_tokens').upsert({
    user_id: userId,
    provider,
    access_token: token.access_token,
    refresh_token: token.refresh_token ?? null,
    expires_at: expiresAt,
    scope: token.scope ?? null,
  })
  if (error) throw error
}
