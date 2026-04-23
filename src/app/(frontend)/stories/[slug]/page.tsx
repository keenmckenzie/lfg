import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'

import { RichTextRenderer } from '@/components/content/RichTextRenderer'
import { metaImage, resolveMedia } from '@/lib/media'
import { getStoryBySlug } from '@/lib/queries'

export const dynamic = 'force-dynamic'

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const story = await getStoryBySlug(slug)
  if (!story) return { title: 'Story not found' }

  const ogImage = metaImage(story.meta) ?? resolveMedia(story.featuredImage)

  return {
    title: story.meta?.title ?? story.title,
    description: story.meta?.description ?? `A story honoring ${story.patientName}.`,
    openGraph: {
      title: story.meta?.title ?? story.title,
      description: story.meta?.description ?? `A story honoring ${story.patientName}.`,
      type: 'article',
      images: ogImage?.url ? [{ url: ogImage.url }] : undefined,
    },
  }
}

export default async function StoryDetailPage({ params }: PageProps) {
  const { slug } = await params
  const story = await getStoryBySlug(slug)
  if (!story) notFound()

  const image = resolveMedia(story.featuredImage)

  return (
    <article className="mx-auto max-w-3xl px-6 py-16 sm:py-20">
      <Link
        href="/stories"
        className="inline-flex items-center text-sm font-medium text-primary hover:text-primary-dark"
      >
        <span aria-hidden className="mr-1">
          ←
        </span>
        All stories
      </Link>

      <header className="mt-6">
        <p className="text-sm font-semibold uppercase tracking-widest text-primary">
          In honor of {story.patientName}
          {story.relationship ? ` · ${story.relationship}` : ''}
        </p>
        <h1 className="mt-3 text-balance text-4xl font-bold tracking-tight sm:text-5xl">
          {story.title}
        </h1>
      </header>

      {image?.url && (
        <div className="relative mt-10 aspect-[16/9] w-full overflow-hidden rounded-2xl bg-muted">
          <Image
            src={image.url}
            alt={image.alt ?? story.title}
            fill
            sizes="(min-width: 768px) 768px, 100vw"
            className="object-cover"
            priority
          />
        </div>
      )}

      <div className="mt-12">
        <RichTextRenderer data={story.content as unknown as SerializedEditorState} />
      </div>

      <footer className="mt-16 rounded-2xl border border-primary/20 bg-primary/5 p-8 text-center">
        <p className="text-base font-semibold">Honor {story.patientName} with a gift</p>
        <p className="mt-2 text-sm text-muted-foreground">
          Every donation directly funds glioblastoma research and family support.
        </p>
        <Link
          href={`/donate?inMemoryOf=${encodeURIComponent(story.patientName)}`}
          className="mt-6 inline-flex items-center rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary-dark"
        >
          Donate in their honor
        </Link>
      </footer>
    </article>
  )
}
