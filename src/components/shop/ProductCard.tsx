import Image from 'next/image'
import Link from 'next/link'

import { MoneyText } from './MoneyText'
import type { ProductSummary } from '@/lib/shopify/types'

interface ProductCardProps {
  product: ProductSummary
}

export function ProductCard({ product }: ProductCardProps) {
  const { handle, title, featuredImage, priceRange, availableForSale } = product
  const hasPriceRange =
    priceRange.minVariantPrice.amount !== priceRange.maxVariantPrice.amount

  return (
    <Link
      href={`/shop/${handle}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-shadow hover:shadow-md focus-visible:outline-2 focus-visible:outline-primary"
    >
      <div className="relative aspect-square overflow-hidden bg-muted">
        {featuredImage ? (
          <Image
            src={featuredImage.url}
            alt={featuredImage.altText ?? title}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-sm text-muted-foreground">
            No image
          </div>
        )}
        {!availableForSale ? (
          <span className="absolute top-3 left-3 rounded-full bg-background/90 px-2.5 py-1 text-xs font-medium text-foreground/80">
            Sold out
          </span>
        ) : null}
      </div>
      <div className="flex flex-1 flex-col gap-1 p-4">
        <h3 className="font-semibold text-foreground">{title}</h3>
        <p className="text-sm text-muted-foreground">
          {hasPriceRange ? 'From ' : null}
          <MoneyText
            value={priceRange.minVariantPrice}
            className="font-medium text-foreground"
          />
        </p>
      </div>
    </Link>
  )
}
