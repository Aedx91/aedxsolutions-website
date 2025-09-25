'use client'

import Link from 'next/link'
import { useFormState, useFormStatus } from 'react-dom'
import { submitContact, type ContactResult } from '@/app/[lang]/contact/actions'

function SubmitBtn() {
  const { pending } = useFormStatus()
  return (
    <button
      className="btn btn-primary tap-target"
      disabled={pending}
    >
      {pending ? 'Sending…' : 'Send message'}
    </button>
  )
}

const initialState: ContactResult = { ok: false, errors: {} }

export default function ContactForm({ lang }: { lang: 'en' | 'es' }) {
  const [state, action] = useFormState<ContactResult, FormData>(submitContact, initialState)

  const ok = state?.ok === true
  const e = !state || state.ok ? {} : state.errors || {}
  const nameAria = e.name ? { 'aria-invalid': true, 'aria-describedby': 'err-name' } : null
  const emailAria = e.email ? { 'aria-invalid': true, 'aria-describedby': 'err-email' } : null
  const messageAria = e.message ? { 'aria-invalid': true, 'aria-describedby': 'err-message' } : null

  return (
    <form action={action} className="grid gap-4 max-w-xl">
      {/* success banner */}
      {ok && (
        <div role="status" className="rounded-lg p-3 border border-border-subtle bg-[color:var(--state-success)]/10 text-[color:var(--state-success)]">
          {lang === 'es' ? '¡Mensaje enviado! Te responderemos pronto.' : 'Message sent! We’ll get back to you soon.'}
        </div>
      )}

      {/* honeypot */}
      <input
        type="text"
        name="company"
        autoComplete="off"
        tabIndex={-1}
        aria-hidden="true"
        className="hidden"
      />

      <label className="grid gap-1">
        <span className="text-sm">{lang === 'es' ? 'Nombre' : 'Name'}</span>
        <input
          name="name"
          className="card px-3 py-2"
          {...(nameAria ?? {})}
        />
        {e.name && <span id="err-name" className="text-[color:var(--state-error)] text-sm">{e.name}</span>}
      </label>

      <label className="grid gap-1">
        <span className="text-sm">Email</span>
        <input
          name="email"
          type="email"
          className="card px-3 py-2"
          {...(emailAria ?? {})}
        />
        {e.email && <span id="err-email" className="text-[color:var(--state-error)] text-sm">{e.email}</span>}
      </label>

      <label className="grid gap-1">
        <span className="text-sm">{lang === 'es' ? 'Mensaje' : 'Message'}</span>
        <textarea
          name="message"
          rows={5}
          className="card px-3 py-2"
          {...(messageAria ?? {})}
        />
        {e.message && <span id="err-message" className="text-[color:var(--state-error)] text-sm">{e.message}</span>}
      </label>

      <div className="flex gap-3 items-center">
        <SubmitBtn />
        <Link className="btn btn-outline" href={`/${lang}/customers`}>
          {lang === 'es' ? 'Ver trabajo' : 'See work'}
        </Link>
      </div>
    </form>
  )
}
