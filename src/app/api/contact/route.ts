import { NextResponse } from 'next/server'
import { z } from 'zod'

import { sendContactEmails } from '@/lib/emails'

export const runtime = 'nodejs'

const contactSchema = z.object({
  name: z.string().min(1, 'Please enter your name.').max(120),
  email: z.string().email('Please enter a valid email address.'),
  subject: z.string().min(1, 'Please enter a subject.').max(200),
  message: z.string().min(10, 'Please share a bit more (at least 10 characters).').max(5000),
  honeypot: z.string().max(0).optional(),
})

export async function POST(request: Request) {
  try {
    const json = await request.json()
    const data = contactSchema.parse(json)

    if (data.honeypot && data.honeypot.length > 0) {
      return NextResponse.json({ success: true })
    }

    const toAdmin = process.env.CONTACT_TO_EMAIL || process.env.SES_FROM_EMAIL
    if (!toAdmin) {
      console.error('[CONTACT] CONTACT_TO_EMAIL and SES_FROM_EMAIL are both unset.')
      return NextResponse.json({ error: 'Email is not configured.' }, { status: 500 })
    }

    await sendContactEmails({
      fromName: data.name.trim(),
      fromEmail: data.email.trim().toLowerCase(),
      subject: data.subject.trim(),
      message: data.message.trim(),
      toAdmin,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0]?.message ?? 'Invalid input' },
        { status: 400 },
      )
    }

    console.error('[CONTACT]', error)
    return NextResponse.json(
      { error: 'Could not send your message. Please try again.' },
      { status: 500 },
    )
  }
}
