import { NextResponse } from 'next/server'
import { getSupabaseServiceClient } from '@/lib/supabase/server'
import { deleteGoogleEvent } from '@/lib/integrations/google'
import { deleteMicrosoftEvent } from '@/lib/integrations/microsoft'
import { getProviderToken } from '@/lib/integrations/tokens'

function requireUser(headers: Headers) {
  const user = headers.get('x-demo-user')
  if (!user) return null
  return user
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const { id } = params
  const supabase = getSupabaseServiceClient()
  const user = requireUser(_req.headers)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: existing } = await supabase
    .from('dates')
    .select('google_event_id, microsoft_event_id')
    .eq('id', id)
    .eq('user_id', user)
    .single()

  const { error } = await supabase.from('dates').delete().eq('id', id).eq('user_id', user)

  if (error) {
    console.error('Supabase delete date error', error)
    return NextResponse.json({ error: 'Failed to delete' }, { status: 500 })
  }

  // Best-effort calendar cleanup
  try {
    if (existing?.google_event_id) {
      const token = await getProviderToken(user, 'google')
      if (token) await deleteGoogleEvent(user, existing.google_event_id)
    }
  } catch (syncErr) {
    console.error('Google delete sync failed', syncErr)
  }

  try {
    if (existing?.microsoft_event_id) {
      const token = await getProviderToken(user, 'microsoft')
      if (token) await deleteMicrosoftEvent(user, existing.microsoft_event_id)
    }
  } catch (syncErr) {
    console.error('MS delete sync failed', syncErr)
  }

  return NextResponse.json({ ok: true })
}
