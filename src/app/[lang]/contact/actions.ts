'use server'

import nodemailer from 'nodemailer'
import { Resend } from 'resend'

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

  const RECIPIENT_EMAIL = process.env.CONTACT_TO || 'aedxpx@outlook.com'
  const subject = `New contact message from ${name}`
  const html = `
    <h2>New contact message</h2>
    <p><strong>Name:</strong> ${name}</p>
    <p><strong>Email:</strong> ${email}</p>
    <p><strong>Message:</strong></p>
    <pre style="white-space:pre-wrap">${message}</pre>
    <p><em>This notification was generated automatically by aedxsolutions.com.</em></p>
  `

  // Try Resend first
  try {
    const RESEND_API_KEY = process.env.RESEND_API_KEY
    const RESEND_FROM = process.env.RESEND_FROM || 'onboarding@resend.dev'
    if (RESEND_API_KEY) {
      const resend = new Resend(RESEND_API_KEY)
      const sendRes = await resend.emails.send({
        from: RESEND_FROM,
        to: RECIPIENT_EMAIL,
        subject,
        html,
      })
      if (!sendRes?.error) {
        return { ok: true }
      }
      console.error('Resend send error:', sendRes.error)
    }
  } catch (resendError) {
    console.error('Resend failed:', resendError)
  }

  // SMTP fallback
  try {
    if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT) || 587,
        secure: false,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      })

      await transporter.verify()
      await transporter.sendMail({
        from: process.env.SMTP_FROM || process.env.SMTP_USER,
        to: RECIPIENT_EMAIL,
        replyTo: `${name} <${email}>`,
        subject,
        html,
      })
    } else {
      console.log('Contact email not configured - logging instead:', { name, email, message })
    }
  } catch (smtpError) {
    console.error('SMTP send failed:', smtpError)
  }

  return { ok: true }
}
