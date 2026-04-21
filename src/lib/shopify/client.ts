/**
 * Thin GraphQL client over the Shopify Storefront API.
 *
 * Configure via env vars:
 *   - SHOPIFY_STORE_DOMAIN              (e.g. "lets-fight-glio.myshopify.com")
 *   - SHOPIFY_STOREFRONT_ACCESS_TOKEN   (Storefront API token — public or private)
 *
 * The Headless sales channel exposes two kinds of Storefront API tokens:
 *   - Public token (bare hex, e.g. "484e…a69") sent via
 *     `X-Shopify-Storefront-Access-Token`. Rate-limited per buyer IP.
 *   - Private token (prefixed with `shpat_`) sent via
 *     `Shopify-Storefront-Private-Token`. Higher rate limits; server-side only.
 *
 * Since every call in this app is server-side, a private token is strongly
 * preferred. We auto-detect by prefix.
 *
 * When either env var is missing, `isShopifyConfigured()` returns false and
 * callers should fall back to empty-state UI. This keeps the build green during
 * the period before the live store is wired up.
 */

const SHOPIFY_API_VERSION = '2025-01'

interface ShopifyFetchArgs {
  query: string
  variables?: Record<string, unknown>
  cache?: RequestCache
  tags?: string[]
}

export function isShopifyConfigured(): boolean {
  return Boolean(process.env.SHOPIFY_STORE_DOMAIN && process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN)
}

function getEndpoint(): string {
  const domain = process.env.SHOPIFY_STORE_DOMAIN
  if (!domain) {
    throw new Error('SHOPIFY_STORE_DOMAIN is not configured.')
  }
  return `https://${domain}/api/${SHOPIFY_API_VERSION}/graphql.json`
}

function getAuthHeader(token: string): Record<string, string> {
  // Private (server-side) tokens from the Headless channel are prefixed shpat_.
  if (token.startsWith('shpat_')) {
    return { 'Shopify-Storefront-Private-Token': token }
  }
  return { 'X-Shopify-Storefront-Access-Token': token }
}

export async function shopifyFetch<T>({
  query,
  variables,
  cache = 'force-cache',
  tags,
}: ShopifyFetchArgs): Promise<T> {
  const token = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN
  if (!token) {
    throw new Error('SHOPIFY_STOREFRONT_ACCESS_TOKEN is not configured.')
  }

  const response = await fetch(getEndpoint(), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader(token),
    },
    body: JSON.stringify({ query, variables }),
    cache,
    next: tags ? { tags } : undefined,
  })

  if (!response.ok) {
    throw new Error(`Shopify API error: ${response.status} ${response.statusText}`)
  }

  const json = (await response.json()) as { data: T; errors?: { message: string }[] }

  if (json.errors?.length) {
    throw new Error(json.errors.map((e) => e.message).join('\n'))
  }

  return json.data
}
