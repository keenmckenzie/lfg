import { unstable_cache } from 'next/cache'

import { getPayloadClient } from '@/lib/payload'
import type { Event, Page, Post, Story, TeamMember } from '@/types/payload-types'

const FIVE_MINUTES = 60 * 5

const PUBLISHED = { status: { equals: 'published' as const } }

export const getPageBySlug = unstable_cache(
  async (slug: string): Promise<Page | null> => {
    const payload = await getPayloadClient()
    const result = await payload.find({
      collection: 'pages',
      where: { ...PUBLISHED, slug: { equals: slug } },
      limit: 1,
    })
    return (result.docs[0] as Page) ?? null
  },
  ['page-by-slug'],
  { tags: ['pages'], revalidate: FIVE_MINUTES },
)

export const getPosts = unstable_cache(
  async (limit = 24): Promise<Post[]> => {
    const payload = await getPayloadClient()
    const result = await payload.find({
      collection: 'posts',
      where: PUBLISHED,
      sort: '-publishedAt',
      depth: 1,
      limit,
    })
    return result.docs as Post[]
  },
  ['posts-list'],
  { tags: ['posts'], revalidate: FIVE_MINUTES },
)

export const getPostBySlug = unstable_cache(
  async (slug: string): Promise<Post | null> => {
    const payload = await getPayloadClient()
    const result = await payload.find({
      collection: 'posts',
      where: { ...PUBLISHED, slug: { equals: slug } },
      depth: 1,
      limit: 1,
    })
    return (result.docs[0] as Post) ?? null
  },
  ['post-by-slug'],
  { tags: ['posts'], revalidate: FIVE_MINUTES },
)

export const getStories = unstable_cache(
  async (limit = 24): Promise<Story[]> => {
    const payload = await getPayloadClient()
    const result = await payload.find({
      collection: 'stories',
      where: PUBLISHED,
      sort: '-publishedAt',
      depth: 1,
      limit,
    })
    return result.docs as Story[]
  },
  ['stories-list'],
  { tags: ['stories'], revalidate: FIVE_MINUTES },
)

export const getStoryBySlug = unstable_cache(
  async (slug: string): Promise<Story | null> => {
    const payload = await getPayloadClient()
    const result = await payload.find({
      collection: 'stories',
      where: { ...PUBLISHED, slug: { equals: slug } },
      depth: 1,
      limit: 1,
    })
    return (result.docs[0] as Story) ?? null
  },
  ['story-by-slug'],
  { tags: ['stories'], revalidate: FIVE_MINUTES },
)

export const getEvents = unstable_cache(
  async (): Promise<{ upcoming: Event[]; past: Event[] }> => {
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
  },
  ['events-list'],
  { tags: ['events'], revalidate: FIVE_MINUTES },
)

export const getEventBySlug = unstable_cache(
  async (slug: string): Promise<Event | null> => {
    const payload = await getPayloadClient()
    const result = await payload.find({
      collection: 'events',
      where: { ...PUBLISHED, slug: { equals: slug } },
      depth: 1,
      limit: 1,
    })
    return (result.docs[0] as Event) ?? null
  },
  ['event-by-slug'],
  { tags: ['events'], revalidate: FIVE_MINUTES },
)

export const getTeamMembers = unstable_cache(
  async (): Promise<TeamMember[]> => {
    const payload = await getPayloadClient()
    const result = await payload.find({
      collection: 'team-members',
      sort: 'order',
      depth: 1,
      limit: 100,
    })
    return result.docs as TeamMember[]
  },
  ['team-members'],
  { tags: ['team-members'], revalidate: FIVE_MINUTES },
)
