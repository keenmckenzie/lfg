/**
 * Subset of Shopify Storefront API types we care about. Hand-written to avoid the
 * heavy codegen toolchain — broaden as new fields are needed.
 */

export interface Money {
  amount: string
  currencyCode: string
}

export interface ShopifyImage {
  url: string
  altText: string | null
  width: number | null
  height: number | null
}

export interface SelectedOption {
  name: string
  value: string
}

export interface ProductOption {
  id: string
  name: string
  values: string[]
}

export interface ProductVariant {
  id: string
  title: string
  availableForSale: boolean
  quantityAvailable: number | null
  selectedOptions: SelectedOption[]
  price: Money
  compareAtPrice: Money | null
  image: ShopifyImage | null
}

export interface ProductSummary {
  id: string
  handle: string
  title: string
  description: string
  availableForSale: boolean
  priceRange: {
    minVariantPrice: Money
    maxVariantPrice: Money
  }
  featuredImage: ShopifyImage | null
}

export interface Product extends ProductSummary {
  descriptionHtml: string
  options: ProductOption[]
  images: ShopifyImage[]
  variants: ProductVariant[]
  tags: string[]
  seo: { title: string | null; description: string | null }
}

export interface CartLine {
  id: string
  quantity: number
  cost: {
    totalAmount: Money
    subtotalAmount: Money
  }
  merchandise: {
    id: string
    title: string
    selectedOptions: SelectedOption[]
    image: ShopifyImage | null
    price: Money
    product: {
      id: string
      handle: string
      title: string
      featuredImage: ShopifyImage | null
    }
  }
}

export interface Cart {
  id: string
  checkoutUrl: string
  totalQuantity: number
  cost: {
    subtotalAmount: Money
    totalAmount: Money
    totalTaxAmount: Money | null
  }
  lines: CartLine[]
}

export interface ShopifyEdges<T> {
  edges: { node: T }[]
}

export type ShopifyResponse<T> = T

export function flattenEdges<T>(edges: ShopifyEdges<T>): T[] {
  return edges.edges.map((edge) => edge.node)
}
