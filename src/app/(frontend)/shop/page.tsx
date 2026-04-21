import type { Metadata } from 'next'

import { EmptyState } from '@/components/content/EmptyState'
import { PageHeader } from '@/components/content/PageHeader'
import { ImpactBadge } from '@/components/shop/ImpactBadge'
import { ProductCard } from '@/components/shop/ProductCard'
import { getProducts } from '@/lib/shopify/products'

export const revalidate = 300

export const metadata: Metadata = {
  title: 'Shop',
  description:
    'Wear the mission. Every purchase from the Let\u2019s Fight Glio Foundation shop funds glioblastoma research and family support.',
}

export default async function ShopPage() {
  const products = await getProducts()

  return (
    <section className="mx-auto max-w-6xl px-6 py-20 sm:py-24">
      <PageHeader
        eyebrow="Shop"
        title="Wear the mission"
        description="Every purchase funds glioblastoma research and supports families navigating a GBM diagnosis."
      >
        <ImpactBadge />
      </PageHeader>

      <div className="mt-16">
        {products.length === 0 ? (
          <EmptyState
            title="Shop opening soon"
            description="Our first drop is almost ready. Subscribe below to be the first to know when it lands."
          />
        ) : (
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <li key={product.id}>
                <ProductCard product={product} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  )
}
