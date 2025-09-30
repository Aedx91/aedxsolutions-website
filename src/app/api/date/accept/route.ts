import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'
import { Resend } from 'resend'

// Use environment variables for email configuration
const RECIPIENT_EMAIL = 'aedxpx@outlook.com'

export async function POST(request: NextRequest) {
  try {
    const { option } = await request.json()
    
    const optionTitles: Record<string, string> = {
      'discovery': 'Discovery Accelerator',
      'integration': 'Integration Launchpad', 
      'ai-pilot': 'AI Pilot Sprint'
    }
    
    const optionTitle = optionTitles[option] || 'Unknown Option'
    
    // Email content
    const subject = `Engagement Track Selected: ${optionTitle}`
    const html = `
      <h2>Someone selected a delivery playbook from the site</h2>
      <p><strong>Selected Track:</strong> ${optionTitle}</p>
      <p><em>This notification was generated automatically by aedxsolutions.com.</em></p>
    `
    
    // Prefer Resend if configured (env only; no hardcoded fallback)
    try {
      const RESEND_API_KEY = process.env.RESEND_API_KEY
      const RESEND_FROM = process.env.RESEND_FROM || 'onboarding@resend.dev'
      if (RESEND_API_KEY) {
        const resend = new Resend(RESEND_API_KEY)
        const sendRes = await resend.emails.send({
          from: RESEND_FROM,
          to: RECIPIENT_EMAIL,
          subject,
          html
        })
        if (sendRes?.error) {
          console.error('Resend send error:', sendRes.error)
        } else {
          console.log('Email sent via Resend!')
          return NextResponse.json({ success: true, message: 'Email sent via Resend' })
        }
      } else {
        console.warn('RESEND_API_KEY is not set; email will not be sent via Resend.')
      }
    } catch (resendError) {
      console.error('Resend failed:', resendError)
      // continue to SMTP fallback
    }

    // Fallback: Try to send using SMTP if configured
    try {
      if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
  console.log('Attempting to send email...')
        
        const transporter = nodemailer.createTransport({
          host: process.env.SMTP_HOST,
          port: Number(process.env.SMTP_PORT) || 587,
          secure: false, // Use TLS
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
          },
          tls: {
            ciphers: 'SSLv3'
          }
        })
        
        // Verify connection
        await transporter.verify()
  console.log('SMTP connection verified')
        
        // Send email
        const info = await transporter.sendMail({
          from: process.env.SMTP_FROM || process.env.SMTP_USER,
          to: RECIPIENT_EMAIL,
          subject,
          html
        })
        
  console.log('Email sent successfully!')
  console.log(`Message ID: ${info.messageId}`)
  console.log(`To: ${RECIPIENT_EMAIL}`)
  console.log(`Subject: ${subject}`)
        
      } else {
        // Fallback: Log to console if SMTP not configured
  console.log('SMTP not configured - logging to console instead:')
  console.log(`Would send email to: ${RECIPIENT_EMAIL}`)
  console.log(`Selected Option: ${optionTitle}`)
  console.log(`Subject: ${subject}`)
  console.log(`Body: ${html}`)
      }
    } catch (emailError) {
  console.error('Email sending failed:', emailError)
      // Don't fail the request if email fails - just log it
    }
    
    return NextResponse.json({ 
      success: true, 
      message: 'Response logged to console. Check server logs!' 
    })
    
  } catch (error) {
    console.error('Error in /api/date/accept:', error)
    return NextResponse.json(
      { error: 'Failed to process request' }, 
      { status: 500 }
    )
  }
}