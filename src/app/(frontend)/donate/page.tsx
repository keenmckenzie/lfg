import type { Metadata } from 'next'

import { DonationForm } from '@/components/donations/DonationForm'

export const metadata: Metadata = {
  title: 'Donate',
  description:
    'Support glioblastoma research, awareness, and patient families. One-time and recurring monthly donations.',
}

interface DonatePageProps {
  searchParams: Promise<{ canceled?: string; inMemoryOf?: string; inHonorOf?: string }>
}

export default async function DonatePage({ searchParams }: DonatePageProps) {
  const params = await searchParams
  const canceled = params.canceled === 'true'

  return (
    <section className="mx-auto max-w-3xl px-6 py-16 sm:py-20">
      <header className="mb-10 text-center">
        <p className="inline-block rounded-full bg-primary/10 px-4 py-1 text-xs font-semibold tracking-wide text-primary uppercase">
          Make a difference
        </p>
        <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">Support the fight</h1>
        <p className="mx-auto mt-4 max-w-xl text-base text-muted-foreground">
          Every gift directly funds research, supports families, and helps us push glioblastoma out
          of the shadows. Thank you for standing with us.
        </p>
      </header>

      {canceled && (
        <div
          role="alert"
          className="mb-6 rounded-2xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900"
        >
          Your donation was canceled — no payment was made. Feel free to try again whenever you
          are ready.
        </div>
      )}

      <DonationForm
        defaultInMemoryOf={params.inMemoryOf}
        defaultInHonorOf={params.inHonorOf}
      />

      <footer className="mt-10 space-y-3 text-xs text-muted-foreground">
        <p>
          <strong>501(c)(3) status pending.</strong> Let&apos;s Fight Glio has applied for
          501(c)(3) tax-exempt status. Your donation may be tax-deductible retroactive to our date
          of incorporation once approved.
        </p>
        <p>
          Payments are processed securely by{' '}
          <a
            href="https://stripe.com"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-foreground"
          >
            Stripe
          </a>
          . We never see or store your card information.
        </p>
      </footer>
    </section>
  )
}
