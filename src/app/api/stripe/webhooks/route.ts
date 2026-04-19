import { NextResponse } from 'next/server'
import type Stripe from 'stripe'

import { handleCheckoutCompleted, handleInvoicePaid, handleSubscriptionDeleted } from '@/lib/donations-handlers'
import { stripe } from '@/lib/stripe'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  const signature = request.headers.get('stripe-signature')
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

  if (!signature) {
    return NextResponse.json({ error: 'Missing stripe-signature header.' }, { status: 400 })
  }

  if (!webhookSecret) {
    console.error('[STRIPE_WEBHOOK] STRIPE_WEBHOOK_SECRET is not configured.')
    return NextResponse.json({ error: 'Webhook secret not configured.' }, { status: 500 })
  }

  const rawBody = await request.text()

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown signature error'
    console.error('[STRIPE_WEBHOOK] Signature verification failed:', message)
    return NextResponse.json({ error: 'Invalid signature.' }, { status: 400 })
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session)
        break
      case 'invoice.payment_succeeded':
        await handleInvoicePaid(event.data.object as Stripe.Invoice)
        break
      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object as Stripe.Subscription)
        break
      default:
        // Acknowledge but ignore
        break
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error(`[STRIPE_WEBHOOK] Handler failed for ${event.type}:`, error)
    // Returning 500 tells Stripe to retry. Use 200 with logging if you want to drop the event.
    return NextResponse.json({ error: 'Webhook handler failed.' }, { status: 500 })
  }
}
