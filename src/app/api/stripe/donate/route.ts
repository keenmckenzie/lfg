import { NextResponse } from 'next/server'
import { z } from 'zod'
import type Stripe from 'stripe'

import { donateSchema } from '@/lib/donations'
import { stripe } from '@/lib/stripe'

export const runtime = 'nodejs'

export async function POST(request: Request) {
  try {
    const json = await request.json()
    const input = donateSchema.parse(json)

    const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'
    const amountInCents = input.amount * 100

    const metadata: Record<string, string> = {
      donationType: input.recurring ? 'recurring' : 'one-time',
    }
    if (input.inMemoryOf) metadata.inMemoryOf = input.inMemoryOf
    if (input.inHonorOf) metadata.inHonorOf = input.inHonorOf
    if (input.donorName) metadata.donorName = input.donorName

    const productName = input.recurring
      ? "Monthly donation to Let's Fight Glio"
      : "Donation to Let's Fight Glio"

    const sessionParams: Stripe.Checkout.SessionCreateParams = {
      mode: input.recurring ? 'subscription' : 'payment',
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: 'usd',
            unit_amount: amountInCents,
            product_data: {
              name: productName,
              description:
                'Supporting glioblastoma research, awareness, and patient families. 501(c)(3) status pending.',
            },
            ...(input.recurring ? { recurring: { interval: 'month' as const } } : {}),
          },
        },
      ],
      success_url: `${baseUrl}/donate/thank-you?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/donate?canceled=true`,
      metadata,
      allow_promotion_codes: false,
      billing_address_collection: 'auto',
      ...(input.donorEmail ? { customer_email: input.donorEmail } : {}),
      ...(input.recurring
        ? {
            subscription_data: { metadata },
          }
        : {
            payment_intent_data: { metadata },
            submit_type: 'donate',
          }),
    }

    const session = await stripe.checkout.sessions.create(sessionParams)

    if (!session.url) {
      throw new Error('Stripe did not return a Checkout Session URL.')
    }

    return NextResponse.json({ url: session.url })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.issues },
        { status: 400 },
      )
    }

    console.error('[STRIPE_DONATE]', error)
    return NextResponse.json(
      { error: 'Could not start checkout. Please try again.' },
      { status: 500 },
    )
  }
}
