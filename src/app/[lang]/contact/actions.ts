'use server'

export type ContactErrors = Partial<Record<'name' | 'email' | 'message', string>> & { form?: string }
export type ContactResult = { ok: true } | { ok: false; errors: ContactErrors }

function isEmail(v: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)
}

export async function submitContact(prevState: ContactResult | null, formData: FormData): Promise<ContactResult> {
  // simple anti-bot
  const hp = (formData.get('company') || '').toString().trim()
  if (hp) return { ok: true } // silently accept bots

  const name = (formData.get('name') || '').toString().trim()
  const email = (formData.get('email') || '').toString().trim()
  const message = (formData.get('message') || '').toString().trim()

  const errors: ContactErrors = {}
  if (!name) errors.name = 'Required'
  if (!email) errors.email = 'Required'
  else if (!isEmail(email)) errors.email = 'Invalid email'
  if (!message) errors.message = 'Required'
  else if (message.length < 12) errors.message = 'Please add a bit more detail'

  if (Object.keys(errors).length) return { ok: false, errors }

  // TODO: integrate email provider (Resend/SMTP). For now, log on server:
  console.log('[contact]', { name, email, message })

  return { ok: true }
}
