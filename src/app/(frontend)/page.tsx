import Link from 'next/link'

import { ContentCard } from '@/components/content/ContentCard'
import { NewsletterForm } from '@/components/shared/NewsletterForm'
import { resolveMedia } from '@/lib/media'
import { getEvents, getPosts, getStories } from '@/lib/queries'
import { formatDate, formatDateTime } from '@/lib/utils'

export const revalidate = 300

export default async function HomePage() {
  const [stories, posts, { upcoming }] = await Promise.all([
    getStories(3),
    getPosts(3),
    getEvents(),
  ])

  const featuredEvents = upcoming.slice(0, 3)

  return (
    <>
      <section className="relative overflow-hidden bg-gradient-to-b from-primary/10 via-background to-background">
        <div className="mx-auto max-w-4xl px-6 py-24 text-center sm:py-32">
          <p className="inline-block rounded-full bg-primary/10 px-4 py-1 text-xs font-semibold uppercase tracking-wide text-primary">
            Glioblastoma research &amp; awareness
          </p>
          <h1 className="mt-6 text-balance text-4xl font-bold tracking-tight sm:text-6xl">
            Let&apos;s Fight Glio
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-pretty text-lg text-muted-foreground">
            We&apos;re a community of patients, families, doctors, and donors working to fund
            breakthrough research, support those affected by glioblastoma, and raise awareness for
            the most aggressive form of brain cancer.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/donate"
              className="inline-flex items-center justify-center rounded-full bg-primary px-8 py-3 text-base font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary-dark"
            >
              Donate now
            </Link>
            <Link
              href="/about"
              className="inline-flex items-center justify-center rounded-full border border-border bg-background px-8 py-3 text-base font-semibold text-foreground transition-colors hover:bg-muted"
            >
              Our mission
            </Link>
          </div>

          <p className="mt-6 text-xs text-muted-foreground">
            501(c)(3) status pending — donations may become tax-deductible once approved.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="grid gap-6 sm:grid-cols-3">
          {[
            {
              title: 'Fund research',
              body: 'Direct grants to laboratories pursuing novel therapies for glioblastoma.',
            },
            {
              title: 'Support families',
              body: 'Resources, community, and care for patients and their loved ones.',
            },
            {
              title: 'Raise awareness',
              body: 'Stories, education, and events that keep glioblastoma in the conversation.',
            },
          ].map((card) => (
            <article
              key={card.title}
              className="rounded-2xl border border-border bg-card p-6 shadow-sm"
            >
              <h2 className="text-lg font-semibold">{card.title}</h2>
              <p className="mt-2 text-sm text-muted-foreground">{card.body}</p>
            </article>
          ))}
        </div>
      </section>

      {stories.length > 0 && (
        <FeaturedSection
          eyebrow="Stories"
          title="The people behind every dollar"
          ctaHref="/stories"
          ctaLabel="All stories"
        >
          {stories.map((story) => (
            <ContentCard
              key={story.id}
              href={`/stories/${story.slug}`}
              title={story.title}
              description={
                story.relationship
                  ? `${story.relationship} of ${story.patientName}`
                  : `In honor of ${story.patientName}`
              }
              image={resolveMedia(story.featuredImage)}
              meta={story.patientName}
              badge="Story"
            />
          ))}
        </FeaturedSection>
      )}

      {featuredEvents.length > 0 && (
        <FeaturedSection
          eyebrow="Events"
          title="Come together with us"
          ctaHref="/events"
          ctaLabel="All events"
        >
          {featuredEvents.map((event) => (
            <ContentCard
              key={event.id}
              href={`/events/${event.slug}`}
              title={event.title}
              description={event.location ?? undefined}
              image={resolveMedia(event.featuredImage)}
              meta={formatDateTime(event.date)}
              badge="Upcoming"
            />
          ))}
        </FeaturedSection>
      )}

      {posts.length > 0 && (
        <FeaturedSection
          eyebrow="News"
          title="Latest from the foundation"
          ctaHref="/news"
          ctaLabel="All news"
        >
          {posts.map((post) => (
            <ContentCard
              key={post.id}
              href={`/news/${post.slug}`}
              title={post.title}
              description={post.excerpt}
              image={resolveMedia(post.featuredImage)}
              meta={post.publishedAt ? formatDate(post.publishedAt) : undefined}
            />
          ))}
        </FeaturedSection>
      )}

      <section className="mx-auto mt-12 max-w-5xl px-6 py-20">
        <div className="rounded-3xl bg-gradient-to-br from-primary to-primary-dark p-10 text-center text-primary-foreground sm:p-14">
          <h2 className="text-balance text-3xl font-bold tracking-tight sm:text-4xl">
            Stay close to the work
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-pretty text-sm text-primary-foreground/85 sm:text-base">
            Occasional updates on research, stories, and events. We won&apos;t crowd your inbox
            and you can unsubscribe anytime.
          </p>
          <div className="mx-auto mt-8 max-w-md">
            <NewsletterForm />
          </div>
        </div>
      </section>
    </>
  )
}

function FeaturedSection({
  eyebrow,
  title,
  ctaHref,
  ctaLabel,
  children,
}: {
  eyebrow: string
  title: string
  ctaHref: string
  ctaLabel: string
  children: React.ReactNode
}) {
  return (
    <section className="mx-auto max-w-6xl px-6 py-16">
      <div className="flex items-end justify-between gap-6">
        <div>
          <p className="text-sm font-semibold uppercase tracking-widest text-primary">{eyebrow}</p>
          <h2 className="mt-2 text-balance text-3xl font-bold tracking-tight sm:text-4xl">
            {title}
          </h2>
        </div>
        <Link
          href={ctaHref}
          className="hidden text-sm font-medium text-primary hover:text-primary-dark sm:inline-flex"
        >
          {ctaLabel} <span aria-hidden className="ml-1">→</span>
        </Link>
      </div>
      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{children}</div>
      <div className="mt-8 text-center sm:hidden">
        <Link href={ctaHref} className="text-sm font-medium text-primary">
          {ctaLabel} →
        </Link>
      </div>
    </section>
  )
}
