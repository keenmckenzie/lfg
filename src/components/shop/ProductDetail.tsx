'use client'

import Image from 'next/image'
import { useMemo, useState } from 'react'

import { AddToCartButton } from './AddToCartButton'
import { ImpactBadge } from './ImpactBadge'
import { MoneyText } from './MoneyText'
import { VariantPicker } from './VariantPicker'
import type { Product, ProductVariant } from '@/lib/shopify/types'

interface ProductDetailProps {
  product: Product
}

function findVariant(
  variants: ProductVariant[],
  selectedOptions: Record<string, string>,
): ProductVariant | null {
  return (
    variants.find((variant) =>
      variant.selectedOptions.every((opt) => selectedOptions[opt.name] === opt.value),
    ) ?? null
  )
}

function defaultSelectedOptions(product: Product): Record<string, string> {
  const firstAvailable = product.variants.find((v) => v.availableForSale) ?? product.variants[0]
  if (!firstAvailable) return {}
  return Object.fromEntries(firstAvailable.selectedOptions.map((opt) => [opt.name, opt.value]))
}

export function ProductDetail({ product }: ProductDetailProps) {
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>(() =>
    defaultSelectedOptions(product),
  )
  const [activeImageIndex, setActiveImageIndex] = useState(0)

  const selectedVariant = useMemo(
    () => findVariant(product.variants, selectedOptions),
    [product.variants, selectedOptions],
  )

  const gallery = product.images.length > 0
    ? product.images
    : product.featuredImage
    ? [product.featuredImage]
    : []

  const activeImage = gallery[activeImageIndex] ?? gallery[0] ?? null
  const displayPrice = selectedVariant?.price ?? product.priceRange.minVariantPrice
  const compareAt = selectedVariant?.compareAtPrice ?? null
  const isOnSale =
    compareAt &&
    Number.parseFloat(compareAt.amount) > Number.parseFloat(displayPrice.amount)
  const canPurchase = Boolean(selectedVariant?.availableForSale)

  function handleOptionChange(name: string, value: string) {
    setSelectedOptions((prev) => ({ ...prev, [name]: value }))
  }

  return (
    <div className="grid gap-10 lg:grid-cols-2">
      <div className="space-y-4">
        <div className="relative aspect-square overflow-hidden rounded-2xl bg-muted">
          {activeImage ? (
            <Image
              src={activeImage.url}
              alt={activeImage.altText ?? product.title}
              fill
              sizes="(min-width: 1024px) 40vw, 100vw"
              priority
              className="object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-sm text-muted-foreground">
              No image
            </div>
          )}
        </div>
        {gallery.length > 1 ? (
          <div className="flex flex-wrap gap-2">
            {gallery.map((image, index) => (
              <button
                key={image.url}
                type="button"
                onClick={() => setActiveImageIndex(index)}
                aria-label={`View image ${index + 1}`}
                aria-current={index === activeImageIndex}
                className={`relative h-20 w-20 overflow-hidden rounded-lg border transition-colors ${
                  index === activeImageIndex
                    ? 'border-primary'
                    : 'border-border hover:border-primary/60'
                }`}
              >
                <Image
                  src={image.url}
                  alt={image.altText ?? ''}
                  fill
                  sizes="80px"
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        ) : null}
      </div>

      <div className="space-y-6">
        <ImpactBadge />
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground lg:text-4xl">
            {product.title}
          </h1>
          <div className="flex items-baseline gap-3">
            <MoneyText
              value={displayPrice}
              className="text-2xl font-semibold text-foreground"
            />
            {isOnSale && compareAt ? (
              <MoneyText
                value={compareAt}
                className="text-lg text-muted-foreground line-through"
              />
            ) : null}
          </div>
        </div>

        {product.descriptionHtml ? (
          <div
            className="prose prose-sm max-w-none text-foreground/80"
            dangerouslySetInnerHTML={{ __html: product.descriptionHtml }}
          />
        ) : null}

        <VariantPicker
          options={product.options}
          variants={product.variants}
          selectedOptions={selectedOptions}
          onOptionChange={handleOptionChange}
        />

        <div className="flex flex-col gap-3 pt-2">
          <AddToCartButton
            variantId={selectedVariant?.id ?? null}
            disabled={!canPurchase}
            label={canPurchase ? 'Add to cart' : 'Sold out'}
          />
          <p className="text-xs text-muted-foreground">
            Free U.S. shipping on orders over $75. Every purchase funds
            glioblastoma research.
          </p>
        </div>
      </div>
    </div>
  )
}
