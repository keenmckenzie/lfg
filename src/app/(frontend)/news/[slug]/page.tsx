import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'

import { RichTextRenderer } from '@/components/content/RichTextRenderer'
import { metaImage, resolveMedia } from '@/lib/media'
import { getPostBySlug } from '@/lib/queries'
import { formatDate } from '@/lib/utils'

export const revalidate = 300

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const post = await getPostBySlug(slug)
  if (!post) return { title: 'Post not found' }

  const ogImage = metaImage(post.meta) ?? resolveMedia(post.featuredImage)

  return {
    title: post.meta?.title ?? post.title,
    description: post.meta?.description ?? post.excerpt ?? undefined,
    openGraph: {
      title: post.meta?.title ?? post.title,
      description: post.meta?.description ?? post.excerpt ?? undefined,
      type: 'article',
      publishedTime: post.publishedAt ?? undefined,
      images: ogImage?.url ? [{ url: ogImage.url }] : undefined,
    },
  }
}

export default async function PostDetailPage({ params }: PageProps) {
  const { slug } = await params
  const post = await getPostBySlug(slug)
  if (!post) notFound()

  const image = resolveMedia(post.featuredImage)

  return (
    <article className="mx-auto max-w-3xl px-6 py-16 sm:py-20">
      <Link
        href="/news"
        className="inline-flex items-center text-sm font-medium text-primary hover:text-primary-dark"
      >
        <span aria-hidden className="mr-1">
          ←
        </span>
        All news
      </Link>

      <header className="mt-6">
        {post.publishedAt && (
          <p className="text-sm font-medium uppercase tracking-widest text-muted-foreground">
            {formatDate(post.publishedAt)}
          </p>
        )}
        <h1 className="mt-3 text-balance text-4xl font-bold tracking-tight sm:text-5xl">
          {post.title}
        </h1>
        {post.excerpt && (
          <p className="mt-4 text-pretty text-lg text-muted-foreground">{post.excerpt}</p>
        )}
      </header>

      {image?.url && (
        <div className="relative mt-10 aspect-[16/9] w-full overflow-hidden rounded-2xl bg-muted">
          <Image
            src={image.url}
            alt={image.alt ?? post.title}
            fill
            sizes="(min-width: 768px) 768px, 100vw"
            className="object-cover"
            priority
          />
        </div>
      )}

      <div className="mt-12">
        <RichTextRenderer data={post.content as unknown as SerializedEditorState} />
      </div>
    </article>
  )
}
