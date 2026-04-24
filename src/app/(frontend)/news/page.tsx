import type { Metadata } from 'next'

import { ContentCard } from '@/components/content/ContentCard'
import { EmptyState } from '@/components/content/EmptyState'
import { PageHeader } from '@/components/content/PageHeader'
import { resolveMedia } from '@/lib/media'
import { getPosts } from '@/lib/queries'
import { formatDate } from '@/lib/utils'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'News & updates',
  description:
    "Updates from the Let's Fight Glio Foundation — research milestones, fundraising progress, and announcements.",
}

export default async function NewsPage() {
  const posts = await getPosts()

  return (
    <section className="mx-auto max-w-6xl px-6 py-20 sm:py-24">
      <PageHeader
        eyebrow="News"
        title="What we&rsquo;re working on"
        description="Research milestones, fundraising progress, and updates from the foundation."
      />

      <div className="mt-16">
        {posts.length === 0 ? (
          <EmptyState
            title="No posts yet"
            description="We're publishing our first updates soon. Subscribe in the footer to be notified."
          />
        ) : (
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <li key={post.id}>
                <ContentCard
                  href={`/news/${post.slug}`}
                  title={post.title}
                  description={post.excerpt}
                  image={resolveMedia(post.featuredImage)}
                  meta={post.publishedAt ? formatDate(post.publishedAt) : undefined}
                />
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  )
}
