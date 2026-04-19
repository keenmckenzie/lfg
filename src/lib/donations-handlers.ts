import type Stripe from 'stripe'

import { getPayloadClient } from '@/lib/payload'
import { sendDonationReceipt } from '@/lib/donation-receipt'
import { stripe } from '@/lib/stripe'

interface DonationDetails {
  amount: number
  currency: string
  donorEmail?: string
  donorName?: string
  inMemoryOf?: string
  inHonorOf?: string
  recurring: boolean
  stripeSessionId?: string
  stripePaymentIntentId?: string
  stripeInvoiceId?: string
  stripeSubscriptionId?: string
  stripeCustomerId?: string
}

/**
 * One-time donations are recorded here.
 * Subscription mode also fires this event, but we defer to invoice.payment_succeeded
 * so that renewals and the first charge use a single code path.
 */
export async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  if (session.mode === 'subscription') {
    // Donor will be created when the first invoice is paid.
    return
  }

  if (session.payment_status !== 'paid') {
    console.warn('[STRIPE_WEBHOOK] Skipping unpaid one-time session', session.id)
    return
  }

  const details = extractFromSession(session)
  await recordDonation(details)
}

/**
 * Subscription invoices: fires for the initial charge AND every renewal.
 */
export async function handleInvoicePaid(invoice: Stripe.Invoice) {
  if (invoice.status !== 'paid' || invoice.amount_paid <= 0) {
    return
  }

  const subscriptionRef = invoice.parent?.subscription_details?.subscription
  if (!subscriptionRef) {
    // Not a subscription invoice (e.g. one-off invoice editor) — ignore.
    return
  }

  const subscriptionId =
    typeof subscriptionRef === 'string' ? subscriptionRef : subscriptionRef.id

  const subscription = await stripe.subscriptions.retrieve(subscriptionId)
  const details = await extractFromInvoice(invoice, subscription)
  await recordDonation(details)
}

export async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  // For now we just log. Future: mark donor as no-longer-recurring.
  console.info('[STRIPE_WEBHOOK] Subscription canceled', {
    subscriptionId: subscription.id,
    customerId: subscription.customer,
  })
}

function extractFromSession(session: Stripe.Checkout.Session): DonationDetails {
  const meta = session.metadata ?? {}
  const customerEmail =
    session.customer_details?.email ?? session.customer_email ?? undefined
  const customerName = session.customer_details?.name ?? meta.donorName ?? undefined

  return {
    amount: session.amount_total ?? 0,
    currency: (session.currency ?? 'usd').toLowerCase(),
    donorEmail: customerEmail,
    donorName: customerName,
    inMemoryOf: meta.inMemoryOf,
    inHonorOf: meta.inHonorOf,
    recurring: false,
    stripeSessionId: session.id,
    stripePaymentIntentId:
      typeof session.payment_intent === 'string'
        ? session.payment_intent
        : session.payment_intent?.id,
    stripeCustomerId:
      typeof session.customer === 'string' ? session.customer : session.customer?.id,
  }
}

async function extractFromInvoice(
  invoice: Stripe.Invoice,
  subscription: Stripe.Subscription,
): Promise<DonationDetails> {
  // Prefer the snapshot metadata captured at invoice finalization, fall back to live subscription.
  const snapshotMeta = invoice.parent?.subscription_details?.metadata ?? {}
  const subscriptionMeta = subscription.metadata ?? {}
  const meta: Record<string, string> = { ...subscriptionMeta, ...snapshotMeta }

  const customerId =
    typeof invoice.customer === 'string' ? invoice.customer : invoice.customer?.id

  let donorEmail: string | undefined = invoice.customer_email ?? undefined
  let donorName: string | undefined = invoice.customer_name ?? meta.donorName ?? undefined

  if (!donorEmail && customerId) {
    const customer = await stripe.customers.retrieve(customerId)
    if (customer && !customer.deleted) {
      donorEmail = customer.email ?? undefined
      donorName = donorName ?? customer.name ?? undefined
    }
  }

  return {
    amount: invoice.amount_paid,
    currency: (invoice.currency ?? 'usd').toLowerCase(),
    donorEmail,
    donorName,
    inMemoryOf: meta.inMemoryOf,
    inHonorOf: meta.inHonorOf,
    recurring: true,
    stripeInvoiceId: invoice.id,
    stripeSubscriptionId: subscription.id,
    stripeCustomerId: customerId,
  }
}

async function recordDonation(details: DonationDetails) {
  const payload = await getPayloadClient()

  // Idempotency: skip if we've already recorded this Stripe event.
  if (details.stripeSessionId) {
    const existing = await payload.find({
      collection: 'donations',
      where: { stripeSessionId: { equals: details.stripeSessionId } },
      limit: 1,
    })
    if (existing.docs.length > 0) {
      console.info('[STRIPE_WEBHOOK] Donation for session already recorded', details.stripeSessionId)
      return
    }
  }

  if (details.stripeInvoiceId) {
    const existing = await payload.find({
      collection: 'donations',
      where: { stripeInvoiceId: { equals: details.stripeInvoiceId } },
      limit: 1,
    })
    if (existing.docs.length > 0) {
      console.info('[STRIPE_WEBHOOK] Donation for invoice already recorded', details.stripeInvoiceId)
      return
    }
  }

  // Upsert donor by email.
  let donorId: number | undefined
  if (details.donorEmail) {
    const existingDonor = await payload.find({
      collection: 'donors',
      where: { email: { equals: details.donorEmail } },
      limit: 1,
    })

    if (existingDonor.docs.length > 0) {
      const donor = existingDonor.docs[0]
      donorId = donor.id
      await payload.update({
        collection: 'donors',
        id: donor.id,
        data: {
          name: donor.name ?? details.donorName,
          totalDonated: (donor.totalDonated ?? 0) + details.amount,
          donationCount: (donor.donationCount ?? 0) + 1,
        },
      })
    } else {
      const created = await payload.create({
        collection: 'donors',
        data: {
          email: details.donorEmail,
          name: details.donorName,
          totalDonated: details.amount,
          donationCount: 1,
        },
      })
      donorId = created.id
    }
  }

  const donation = await payload.create({
    collection: 'donations',
    data: {
      stripeSessionId: details.stripeSessionId,
      stripePaymentIntentId: details.stripePaymentIntentId,
      stripeInvoiceId: details.stripeInvoiceId,
      stripeSubscriptionId: details.stripeSubscriptionId,
      stripeCustomerId: details.stripeCustomerId,
      amount: details.amount,
      currency: details.currency,
      donorEmail: details.donorEmail,
      donorName: details.donorName,
      donor: donorId,
      inMemoryOf: details.inMemoryOf,
      inHonorOf: details.inHonorOf,
      recurring: details.recurring,
      status: 'succeeded',
      receiptSent: false,
    },
  })

  // Email failure should not cause Stripe to retry; we log and continue.
  if (details.donorEmail) {
    try {
      await sendDonationReceipt({
        to: details.donorEmail,
        donorName: details.donorName,
        amountInCents: details.amount,
        currency: details.currency,
        recurring: details.recurring,
        inMemoryOf: details.inMemoryOf,
        inHonorOf: details.inHonorOf,
        donationDate: new Date(),
        receiptId: String(donation.id),
      })

      await payload.update({
        collection: 'donations',
        id: donation.id,
        data: { receiptSent: true },
      })
    } catch (error) {
      console.error('[STRIPE_WEBHOOK] Failed to send receipt email', {
        donationId: donation.id,
        error,
      })
    }
  }
}
