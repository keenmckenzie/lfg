import type { Metadata } from 'next'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Unsubscribed',
  robots: { index: false, follow: false },
}

interface PageProps {
  searchParams: Promise<{ status?: string }>
}

export default async function UnsubscribedPage({ searchParams }: PageProps) {
  const { status } = await searchParams

  let heading = "You've been unsubscribed"
  let body =
    "You won't receive newsletter emails from Let's Fight Glio anymore. We're sorry to see you go."

  if (status === 'invalid') {
    heading = 'Unsubscribe link not valid'
    body =
      'This unsubscribe link is missing or invalid. If you would still like to unsubscribe, please reply to any of our emails.'
  } else if (status === 'error') {
    heading = 'Something went wrong'
    body = 'We could not process your unsubscribe request. Please try again, or reply to any of our emails.'
  }

  return (
    <section className="mx-auto max-w-2xl px-6 py-24 text-center sm:py-28">
      <h1 className="text-balance text-4xl font-bold tracking-tight sm:text-5xl">{heading}</h1>
      <p className="mx-auto mt-6 max-w-xl text-base text-muted-foreground">{body}</p>
      <div className="mt-10">
        <Link
          href="/"
          className="inline-flex items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary-dark"
        >
          Back to home
        </Link>
      </div>
    </section>
  )
}
