import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'
import { Resend } from 'resend'

const RECIPIENT_EMAIL = 'aedxpx@outlook.com'

export async function POST(request: NextRequest) {
  try {
    const { dish, option, lang } = await request.json()
    const optionLabels: Record<string, string> = {
      x1: 'You cover it all',
      x2: 'Split 50/50',
      x3: 'Carmy covers it',
      x4: 'Bodymatic mode',
    }

    const optionLabel = optionLabels[option] || 'Unknown'
    const subject = `Dish choice logged: ${dish}`
    const html = `
      <h2>New dish selection</h2>
      <p><strong>Dish:</strong> ${dish}</p>
      <p><strong>Option:</strong> ${optionLabel} (${option})</p>
      <p><strong>Lang:</strong> ${lang}</p>
      <p><em>This notification was generated automatically.</em></p>
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
          return NextResponse.json({ success: true })
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
          subject,
          html,
        })
      } else {
        console.log('SMTP not configured - logging instead:', { dish, option })
      }
    } catch (smtpError) {
      console.error('SMTP send failed:', smtpError)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error in /api/menu/selection:', error)
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 })
  }
}
