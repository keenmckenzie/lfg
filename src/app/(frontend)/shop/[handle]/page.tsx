import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { ProductDetail } from '@/components/shop/ProductDetail'
import { getProductByHandle, getProductHandles } from '@/lib/shopify/products'

export const revalidate = 300

interface PageProps {
  params: Promise<{ handle: string }>
}

export async function generateStaticParams() {
  const handles = await getProductHandles()
  return handles.map((handle) => ({ handle }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { handle } = await params
  const product = await getProductByHandle(handle)
  if (!product) return { title: 'Product not found' }

  const title = product.seo.title ?? product.title
  const description = product.seo.description ?? product.description

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
      images: product.featuredImage?.url
        ? [{ url: product.featuredImage.url }]
        : undefined,
    },
  }
}

export default async function ProductPage({ params }: PageProps) {
  const { handle } = await params
  const product = await getProductByHandle(handle)
  if (!product) notFound()

  return (
    <section className="mx-auto max-w-6xl px-6 py-16 sm:py-20">
      <Link
        href="/shop"
        className="inline-flex items-center text-sm font-medium text-primary hover:text-primary-dark"
      >
        <span aria-hidden className="mr-1">
          ←
        </span>
        Back to shop
      </Link>

      <div className="mt-10">
        <ProductDetail product={product} />
      </div>
    </section>
  )
}
