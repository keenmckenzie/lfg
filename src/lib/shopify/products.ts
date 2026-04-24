import { unstable_cache } from 'next/cache'

import { isShopifyConfigured, shopifyFetch } from './client'
import {
  GET_PRODUCTS_QUERY,
  GET_PRODUCT_BY_HANDLE_QUERY,
  GET_PRODUCT_HANDLES_QUERY,
} from './queries'
import type { Product, ProductSummary, ShopifyImage, ProductVariant } from './types'

interface RawProduct extends Omit<Product, 'images' | 'variants'> {
  images: { edges: { node: ShopifyImage }[] }
  variants: { edges: { node: ProductVariant }[] }
}

interface GetProductsResponse {
  products: { edges: { node: ProductSummary }[] }
}

interface GetProductResponse {
  product: RawProduct | null
}

interface GetProductHandlesResponse {
  products: { edges: { node: { handle: string } }[] }
}

function normalizeProduct(raw: RawProduct): Product {
  return {
    ...raw,
    images: raw.images.edges.map((edge) => edge.node),
    variants: raw.variants.edges.map((edge) => edge.node),
  }
}

/**
 * Fetch a page of products for the shop index. Returns [] when Shopify is
 * unconfigured so the build stays green before the store is wired up.
 */
export const getProducts = unstable_cache(
  async (first = 24): Promise<ProductSummary[]> => {
    if (!isShopifyConfigured()) return []

    try {
      const data = await shopifyFetch<GetProductsResponse>({
        query: GET_PRODUCTS_QUERY,
        variables: { first },
        tags: ['shopify:products'],
      })
      return data.products.edges.map((edge) => edge.node)
    } catch (error) {
      console.error('[shopify.getProducts]', error)
      return []
    }
  },
  ['shopify', 'products'],
  { revalidate: 300, tags: ['shopify:products'] },
)

/**
 * Fetch a single product by its handle (URL slug).
 */
export const getProductByHandle = unstable_cache(
  async (handle: string): Promise<Product | null> => {
    if (!isShopifyConfigured()) return null

    try {
      const data = await shopifyFetch<GetProductResponse>({
        query: GET_PRODUCT_BY_HANDLE_QUERY,
        variables: { handle },
        tags: [`shopify:product:${handle}`],
      })
      return data.product ? normalizeProduct(data.product) : null
    } catch (error) {
      console.error('[shopify.getProductByHandle]', error)
      return null
    }
  },
  ['shopify', 'product-by-handle'],
  { revalidate: 300, tags: ['shopify:products'] },
)

/**
 * Fetch all product handles — used by `generateStaticParams()` on the PDP.
 */
export async function getProductHandles(first = 100): Promise<string[]> {
  if (!isShopifyConfigured()) return []

  try {
    const data = await shopifyFetch<GetProductHandlesResponse>({
      query: GET_PRODUCT_HANDLES_QUERY,
      variables: { first },
    })
    return data.products.edges.map((edge) => edge.node.handle)
  } catch (error) {
    console.error('[shopify.getProductHandles]', error)
    return []
  }
}
