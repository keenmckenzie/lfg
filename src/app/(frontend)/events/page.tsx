import type { Metadata } from 'next'

import { ContentCard } from '@/components/content/ContentCard'
import { EmptyState } from '@/components/content/EmptyState'
import { PageHeader } from '@/components/content/PageHeader'
import { resolveMedia } from '@/lib/media'
import { getEvents } from '@/lib/queries'
import { formatDateTime } from '@/lib/utils'

export const revalidate = 300

export const metadata: Metadata = {
  title: 'Events',
  description:
    "Upcoming and past Let's Fight Glio Foundation events — fundraisers, awareness walks, and community gatherings.",
}

export default async function EventsPage() {
  const { upcoming, past } = await getEvents()

  return (
    <section className="mx-auto max-w-6xl px-6 py-20 sm:py-24">
      <PageHeader
        eyebrow="Events"
        title="Come together with us"
        description="Fundraisers, awareness walks, and community gatherings supporting glioblastoma research."
      />

      <div className="mt-16">
        <h2 className="text-2xl font-bold tracking-tight">Upcoming</h2>
        <div className="mt-6">
          {upcoming.length === 0 ? (
            <EmptyState
              title="No upcoming events"
              description="We're planning new events for this season. Subscribe in the footer to be the first to know."
            />
          ) : (
            <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {upcoming.map((event) => (
                <li key={event.id}>
                  <ContentCard
                    href={`/events/${event.slug}`}
                    title={event.title}
                    description={event.location ?? undefined}
                    image={resolveMedia(event.featuredImage)}
                    meta={formatDateTime(event.date)}
                    badge="Upcoming"
                  />
                </li>
              ))}
            </ul>
          )}
        </div>

        {past.length > 0 && (
          <div className="mt-20">
            <h2 className="text-2xl font-bold tracking-tight">Past events</h2>
            <ul className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {past.map((event) => (
                <li key={event.id}>
                  <ContentCard
                    href={`/events/${event.slug}`}
                    title={event.title}
                    description={event.location ?? undefined}
                    image={resolveMedia(event.featuredImage)}
                    meta={formatDateTime(event.date)}
                  />
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  )
}
