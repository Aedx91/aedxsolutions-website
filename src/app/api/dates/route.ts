import { NextResponse } from 'next/server'
import { getSupabaseServiceClient } from '@/lib/supabase/server'

function requireUser(headers: Headers) {
  const user = headers.get('x-demo-user')
  if (!user) return null
  return user
}

export async function GET(req: Request) {
  const user = requireUser(req.headers)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const supabase = getSupabaseServiceClient()
  const { data, error } = await supabase
    .from('dates')
    .select('id, date, description, google_event_id, microsoft_event_id')
    .eq('user_id', user)
    .order('date', { ascending: true })

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

  return NextResponse.json(mapped)
}

export async function POST(req: Request) {
  const user = requireUser(req.headers)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json().catch(() => null)
  const date = body?.date as string | undefined
  const description = body?.description as string | undefined
  if (!date || !description) {
    return NextResponse.json({ error: 'Missing date or description' }, { status: 400 })
  }

  const supabase = getSupabaseServiceClient()
  const { data, error } = await supabase
    .from('dates')
    .insert({ user_id: user, date, description })
    .select('id, date, description, google_event_id, microsoft_event_id')
    .single()

  if (error || !data) {
    console.error('Supabase insert date error', error)
    return NextResponse.json({ error: 'Failed to save date' }, { status: 500 })
  }

  return NextResponse.json({
    id: data.id,
    date: data.date,
    description: data.description,
    googleEventId: data.google_event_id ?? null,
    microsoftEventId: data.microsoft_event_id ?? null,
  })
}
