import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'

import { RichTextRenderer } from '@/components/content/RichTextRenderer'
import { metaImage, resolveMedia } from '@/lib/media'
import { getEventBySlug } from '@/lib/queries'
import { formatDateTime } from '@/lib/utils'

export const revalidate = 300

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const event = await getEventBySlug(slug)
  if (!event) return { title: 'Event not found' }

  const ogImage = metaImage(event.meta) ?? resolveMedia(event.featuredImage)

  return {
    title: event.meta?.title ?? event.title,
    description: event.meta?.description ?? `${event.title} on ${formatDateTime(event.date)}.`,
    openGraph: {
      title: event.meta?.title ?? event.title,
      description: event.meta?.description ?? undefined,
      type: 'article',
      images: ogImage?.url ? [{ url: ogImage.url }] : undefined,
    },
  }
}

export default async function EventDetailPage({ params }: PageProps) {
  const { slug } = await params
  const event = await getEventBySlug(slug)
  if (!event) notFound()

  const image = resolveMedia(event.featuredImage)
  const isUpcoming = new Date(event.date).getTime() >= Date.now()

  return (
    <article className="mx-auto max-w-3xl px-6 py-16 sm:py-20">
      <Link
        href="/events"
        className="inline-flex items-center text-sm font-medium text-primary hover:text-primary-dark"
      >
        <span aria-hidden className="mr-1">
          ←
        </span>
        All events
      </Link>

      <header className="mt-6">
        <p className="text-sm font-semibold uppercase tracking-widest text-primary">
          {isUpcoming ? 'Upcoming event' : 'Past event'}
        </p>
        <h1 className="mt-3 text-balance text-4xl font-bold tracking-tight sm:text-5xl">
          {event.title}
        </h1>
        <dl className="mt-6 grid gap-4 sm:grid-cols-2">
          <div>
            <dt className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              When
            </dt>
            <dd className="mt-1 text-sm font-medium text-foreground">
              {formatDateTime(event.date)}
              {event.endDate ? ` – ${formatDateTime(event.endDate)}` : ''}
            </dd>
          </div>
          {event.location && (
            <div>
              <dt className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Where
              </dt>
              <dd className="mt-1 text-sm font-medium text-foreground">{event.location}</dd>
            </div>
          )}
        </dl>
      </header>

      {image?.url && (
        <div className="relative mt-10 aspect-[16/9] w-full overflow-hidden rounded-2xl bg-muted">
          <Image
            src={image.url}
            alt={image.alt ?? event.title}
            fill
            sizes="(min-width: 768px) 768px, 100vw"
            className="object-cover"
            priority
          />
        </div>
      )}

      {event.description && (
        <div className="mt-12">
          <RichTextRenderer data={event.description as unknown as SerializedEditorState} />
        </div>
      )}

      {isUpcoming && event.registrationUrl && (
        <div className="mt-12 rounded-2xl border border-primary/20 bg-primary/5 p-8 text-center">
          <p className="text-base font-semibold">RSVP or get tickets</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Registration is handled on our event partner&apos;s site.
          </p>
          <a
            href={event.registrationUrl}
            target="_blank"
            rel="noreferrer noopener"
            className="mt-6 inline-flex items-center rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary-dark"
          >
            Register now
          </a>
        </div>
      )}
    </article>
  )
}
