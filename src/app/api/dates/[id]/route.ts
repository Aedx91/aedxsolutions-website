import { NextResponse } from 'next/server'
import { getSupabaseServiceClient } from '@/lib/supabase/server'

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

  const { error } = await supabase.from('dates').delete().eq('id', id).eq('user_id', user)

  if (error) {
    console.error('Supabase delete date error', error)
    return NextResponse.json({ error: 'Failed to delete' }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
