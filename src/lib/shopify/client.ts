// TODO: Wire this up in Phase 4 (Shopify storefront integration).
// Reads SHOPIFY_STORE_DOMAIN and SHOPIFY_STOREFRONT_ACCESS_TOKEN from env
// and posts GraphQL queries to the Storefront API.

const SHOPIFY_API_VERSION = '2025-01'

interface ShopifyFetchArgs {
  query: string
  variables?: Record<string, unknown>
  cache?: RequestCache
  tags?: string[]
}

export async function shopifyFetch<T>({
  query,
  variables,
  cache = 'force-cache',
  tags,
}: ShopifyFetchArgs): Promise<T> {
  const domain = process.env.SHOPIFY_STORE_DOMAIN
  const token = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN

  if (!domain || !token) {
    throw new Error('Shopify environment variables are not configured.')
  }

  const endpoint = `https://${domain}/api/${SHOPIFY_API_VERSION}/graphql.json`

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': token,
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
