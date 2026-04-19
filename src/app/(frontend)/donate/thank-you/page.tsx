import type { Metadata } from 'next'
import Link from 'next/link'

import { stripe } from '@/lib/stripe'
import { formatCents } from '@/lib/utils'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Thank you',
  description: 'Thank you for your donation to Let’s Fight Glio.',
}

interface ThankYouPageProps {
  searchParams: Promise<{ session_id?: string }>
}

export default async function ThankYouPage({ searchParams }: ThankYouPageProps) {
  const { session_id: sessionId } = await searchParams

  let amountText = ''
  let donorName: string | undefined
  let recurring = false

  if (sessionId) {
    try {
      const session = await stripe.checkout.sessions.retrieve(sessionId)
      if (session.amount_total) {
        amountText = formatCents(session.amount_total, (session.currency ?? 'usd').toUpperCase())
      }
      donorName = session.customer_details?.name ?? undefined
      recurring = session.mode === 'subscription'
    } catch (error) {
      console.error('[THANK_YOU] Could not retrieve Stripe session', error)
    }
  }

  return (
    <section className="mx-auto max-w-2xl px-6 py-20 text-center sm:py-28">
      <p className="inline-block rounded-full bg-primary/10 px-4 py-1 text-xs font-semibold tracking-wide text-primary uppercase">
        Donation received
      </p>
      <h1 className="mt-4 text-balance text-4xl font-bold tracking-tight sm:text-5xl">
        {donorName ? `Thank you, ${donorName.split(' ')[0]}!` : 'Thank you!'}
      </h1>
      <p className="mx-auto mt-6 max-w-xl text-lg text-muted-foreground">
        {amountText ? (
          <>
            Your {recurring ? 'monthly ' : ''}gift of <strong>{amountText}</strong> means the
            world to us. You&apos;re directly funding glioblastoma research and supporting the
            families fighting this disease every day.
          </>
        ) : (
          <>
            Your generous contribution means the world to us. You&apos;re directly funding
            glioblastoma research and supporting the families fighting this disease every day.
          </>
        )}
      </p>
      <p className="mt-6 text-sm text-muted-foreground">
        A receipt has been emailed to you for your records. If it doesn&apos;t arrive within a few
        minutes, check your spam folder.
      </p>

      <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
        <Link
          href="/"
          className="inline-flex items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary-dark"
        >
          Back to home
        </Link>
        <Link
          href="/stories"
          className="inline-flex items-center justify-center rounded-full border border-border bg-background px-6 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-muted"
        >
          Read patient stories
        </Link>
      </div>

      <p className="mt-10 text-xs text-muted-foreground">
        501(c)(3) status pending — once approved, your donation may be tax-deductible retroactive
        to our date of incorporation.
      </p>
    </section>
  )
}
