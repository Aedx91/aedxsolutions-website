import { NextResponse } from 'next/server'
import { getSupabaseServiceClient } from '@/lib/supabase/server'
import { createGoogleEvent } from '@/lib/integrations/google'
import { createMicrosoftEvent } from '@/lib/integrations/microsoft'
import { getProviderToken } from '@/lib/integrations/tokens'

function requireUser(headers: Headers) {
  const user = headers.get('x-demo-user')
  if (!user) return null
  return user
}

function tryGetSupabase() {
  try {
    return getSupabaseServiceClient()
  } catch (error) {
    console.error('Supabase config error', error)
    return null
  }
}

export async function GET(req: Request) {
  const user = requireUser(req.headers)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const supabase = tryGetSupabase()
  if (!supabase) return NextResponse.json({ error: 'Supabase not configured' }, { status: 503 })
  const { data, error } = await supabase
    .from('dates')
    .select('id, date, description, google_event_id, microsoft_event_id')
    .eq('user_id', user)
    .order('date', { ascending: true })

  const { data: tokens } = await supabase
    .from('oauth_tokens')
    .select('provider')
    .eq('user_id', user)

  if (error) {
    console.error('Supabase GET dates error', error)
    return NextResponse.json({ error: 'Failed to load dates' }, { status: 500 })
  }

  const mapped = (data || []).map((row) => ({
    id: row.id,
    date: row.date,
    description: row.description,
    googleEventId: row.google_event_id ?? null,
    microsoftEventId: row.microsoft_event_id ?? null,
  }))

  const integrations = {
    google: !!tokens?.some((t) => t.provider === 'google'),
    microsoft: !!tokens?.some((t) => t.provider === 'microsoft'),
  }

  return NextResponse.json({ dates: mapped, integrations })
}

export async function POST(req: Request) {
  const user = requireUser(req.headers)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json().catch(() => null)
  const date = body?.date as string | undefined
  const description = body?.description as string | undefined
  const sync = body?.sync === true
  if (!date || !description) {
    return NextResponse.json({ error: 'Missing date or description' }, { status: 400 })
  }

  const supabase = tryGetSupabase()
  if (!supabase) return NextResponse.json({ error: 'Supabase not configured' }, { status: 503 })
  const { data, error } = await supabase
    .from('dates')
    .insert({ user_id: user, date, description })
    .select('id, date, description, google_event_id, microsoft_event_id')
    .single()

  if (error || !data) {
    console.error('Supabase insert date error', error)
    return NextResponse.json({ error: 'Failed to save date' }, { status: 500 })
  }

  if (sync) {
    // Attempt calendar syncs if tokens exist; failures do not block response
    try {
      const googleToken = await getProviderToken(user, 'google')
      if (googleToken) {
        const eventId = await createGoogleEvent(user, { summary: description, description, date })
        if (eventId) {
          await supabase.from('dates').update({ google_event_id: eventId }).eq('id', data.id)
        }
      }
    } catch (syncErr) {
      console.error('Google sync failed', syncErr)
    }

    try {
      const msToken = await getProviderToken(user, 'microsoft')
      if (msToken) {
        const eventId = await createMicrosoftEvent(user, { subject: description, body: description, date })
        if (eventId) {
          await supabase.from('dates').update({ microsoft_event_id: eventId }).eq('id', data.id)
        }
      }
    } catch (syncErr) {
      console.error('MS sync failed', syncErr)
    }
  }

  return NextResponse.json({
    id: data.id,
    date: data.date,
    description: data.description,
    googleEventId: data.google_event_id ?? null,
    microsoftEventId: data.microsoft_event_id ?? null,
  })
}
