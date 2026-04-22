import { getPayloadClient } from '@/lib/payload'
import type { Event, Page, Post, Story, TeamMember } from '@/types/payload-types'

/**
 * All content pages that consume these queries are declared `dynamic = 'force-dynamic'`,
 * so Next.js hits Payload on every request. We intentionally do NOT wrap these in
 * `unstable_cache` or ISR: Amplify's managed Next.js compute does not reliably
 * honor time-based revalidation or `revalidateTag/Path` calls for prerendered
 * pages, which left freshly-added CMS content invisible until the next deploy.
 */

const PUBLISHED = { status: { equals: 'published' as const } }

export async function getPageBySlug(slug: string): Promise<Page | null> {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'pages',
    where: { ...PUBLISHED, slug: { equals: slug } },
    limit: 1,
  })
  return (result.docs[0] as Page) ?? null
}

export async function getPosts(limit = 24): Promise<Post[]> {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'posts',
    where: PUBLISHED,
    sort: '-publishedAt',
    depth: 1,
    limit,
  })
  return result.docs as Post[]
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'posts',
    where: { ...PUBLISHED, slug: { equals: slug } },
    depth: 1,
    limit: 1,
  })
  return (result.docs[0] as Post) ?? null
}

export async function getStories(limit = 24): Promise<Story[]> {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'stories',
    where: PUBLISHED,
    sort: '-publishedAt',
    depth: 1,
    limit,
  })
  return result.docs as Story[]
}

export async function getStoryBySlug(slug: string): Promise<Story | null> {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'stories',
    where: { ...PUBLISHED, slug: { equals: slug } },
    depth: 1,
    limit: 1,
  })
  return (result.docs[0] as Story) ?? null
}

export async function getEvents(): Promise<{ upcoming: Event[]; past: Event[] }> {
  const payload = await getPayloadClient()
  const now = new Date().toISOString()

  const [upcoming, past] = await Promise.all([
    payload.find({
      collection: 'events',
      where: { ...PUBLISHED, date: { greater_than_equal: now } },
      sort: 'date',
      depth: 1,
      limit: 50,
    }),
    payload.find({
      collection: 'events',
      where: { ...PUBLISHED, date: { less_than: now } },
      sort: '-date',
      depth: 1,
      limit: 12,
    }),
  ])

  return {
    upcoming: upcoming.docs as Event[],
    past: past.docs as Event[],
  }
}

export async function getEventBySlug(slug: string): Promise<Event | null> {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'events',
    where: { ...PUBLISHED, slug: { equals: slug } },
    depth: 1,
    limit: 1,
  })
  return (result.docs[0] as Event) ?? null
}

export async function getTeamMembers(): Promise<TeamMember[]> {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'team-members',
    sort: 'order',
    depth: 1,
    limit: 100,
  })
  return result.docs as TeamMember[]
}
