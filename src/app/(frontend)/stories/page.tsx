import type { Metadata } from 'next'

import { ContentCard } from '@/components/content/ContentCard'
import { EmptyState } from '@/components/content/EmptyState'
import { PageHeader } from '@/components/content/PageHeader'
import { resolveMedia } from '@/lib/media'
import { getStories } from '@/lib/queries'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Patient stories',
  description:
    'Stories from patients, families, and friends touched by glioblastoma — the people behind every research dollar.',
}

export default async function StoriesPage() {
  const stories = await getStories()

  return (
    <section className="mx-auto max-w-6xl px-6 py-20 sm:py-24">
      <PageHeader
        eyebrow="Stories"
        title="The people behind every dollar"
        description="Real stories from patients, families, and friends touched by glioblastoma. These are the lives our work honors."
      />

      <div className="mt-16">
        {stories.length === 0 ? (
          <EmptyState
            title="Stories coming soon"
            description="We're collecting stories from our community. Check back soon, or share yours via the contact page."
          />
        ) : (
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {stories.map((story) => (
              <li key={story.id}>
                <ContentCard
                  href={`/stories/${story.slug}`}
                  title={story.title}
                  description={story.relationship ? `${story.relationship} of ${story.patientName}` : `In honor of ${story.patientName}`}
                  image={resolveMedia(story.featuredImage)}
                  meta={story.patientName}
                  badge="Story"
                />
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  )
}
