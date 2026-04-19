import { NextResponse } from 'next/server'
import { z } from 'zod'

import { sendWelcomeEmail } from '@/lib/emails'
import { getPayloadClient } from '@/lib/payload'

export const runtime = 'nodejs'

const subscribeSchema = z.object({
  email: z.string().email('Please enter a valid email address.'),
  firstName: z.string().max(80).optional().or(z.literal('').transform(() => undefined)),
  lastName: z.string().max(80).optional().or(z.literal('').transform(() => undefined)),
})

export async function POST(request: Request) {
  try {
    const json = await request.json()
    const { email, firstName, lastName } = subscribeSchema.parse(json)
    const normalizedEmail = email.trim().toLowerCase()

    const payload = await getPayloadClient()

    const existing = await payload.find({
      collection: 'subscribers',
      where: { email: { equals: normalizedEmail } },
      limit: 1,
    })

    let isNewSubscription = false

    if (existing.docs.length > 0) {
      const sub = existing.docs[0]
      if (!sub.active) {
        await payload.update({
          collection: 'subscribers',
          id: sub.id,
          data: {
            active: true,
            firstName: firstName ?? sub.firstName,
            lastName: lastName ?? sub.lastName,
            subscribedAt: new Date().toISOString(),
          },
        })
        isNewSubscription = true
      }
    } else {
      await payload.create({
        collection: 'subscribers',
        data: {
          email: normalizedEmail,
          firstName,
          lastName,
          active: true,
        },
      })
      isNewSubscription = true
    }

    if (isNewSubscription) {
      try {
        await sendWelcomeEmail({ to: normalizedEmail, firstName })
      } catch (error) {
        console.error('[SUBSCRIBE] Welcome email failed', { email: normalizedEmail, error })
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0]?.message ?? 'Invalid input' },
        { status: 400 },
      )
    }

    console.error('[SUBSCRIBE]', error)
    return NextResponse.json(
      { error: 'Could not subscribe. Please try again.' },
      { status: 500 },
    )
  }
}
