'use server'

import { cookies } from 'next/headers'

import { isShopifyConfigured, shopifyFetch } from './client'
import {
  CART_CREATE_MUTATION,
  CART_LINES_ADD_MUTATION,
  CART_LINES_REMOVE_MUTATION,
  CART_LINES_UPDATE_MUTATION,
} from './mutations'
import { GET_CART_QUERY } from './queries'
import type { Cart, CartLine } from './types'

const CART_COOKIE = 'lfg_cart_id'
const CART_COOKIE_MAX_AGE = 60 * 60 * 24 * 30

interface RawCart extends Omit<Cart, 'lines'> {
  lines: { edges: { node: CartLine }[] }
}

interface UserError {
  field: string[] | null
  message: string
  code?: string | null
}

interface CartMutationPayload {
  cart: RawCart | null
  userErrors: UserError[]
}

interface CartCreateResponse {
  cartCreate: CartMutationPayload
}

interface CartLinesAddResponse {
  cartLinesAdd: CartMutationPayload
}

interface CartLinesUpdateResponse {
  cartLinesUpdate: CartMutationPayload
}

interface CartLinesRemoveResponse {
  cartLinesRemove: CartMutationPayload
}

interface GetCartResponse {
  cart: RawCart | null
}

export interface CartActionResult {
  cart: Cart | null
  error?: string
}

function normalizeCart(raw: RawCart): Cart {
  return {
    ...raw,
    lines: raw.lines.edges.map((edge) => edge.node),
  }
}

async function readCartCookie(): Promise<string | null> {
  const store = await cookies()
  return store.get(CART_COOKIE)?.value ?? null
}

async function writeCartCookie(cartId: string): Promise<void> {
  const store = await cookies()
  store.set(CART_COOKIE, cartId, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: CART_COOKIE_MAX_AGE,
  })
}

async function clearCartCookie(): Promise<void> {
  const store = await cookies()
  store.delete(CART_COOKIE)
}

function firstUserErrorMessage(errors: UserError[]): string | undefined {
  return errors.length > 0 ? errors[0].message : undefined
}

/**
 * Returns the current cart for this browser session, or null when there is
 * none or Shopify is unconfigured. Safe to call from server components.
 */
export async function getCart(): Promise<Cart | null> {
  if (!isShopifyConfigured()) return null

  const cartId = await readCartCookie()
  if (!cartId) return null

  try {
    const data = await shopifyFetch<GetCartResponse>({
      query: GET_CART_QUERY,
      variables: { cartId },
      cache: 'no-store',
    })
    if (!data.cart) {
      // Cart was deleted or completed on Shopify's side; clear stale cookie.
      await clearCartCookie()
      return null
    }
    return normalizeCart(data.cart)
  } catch (error) {
    console.error('[shopify.getCart]', error)
    return null
  }
}

/**
 * Adds a variant to the cart, creating a cart first if one doesn't exist.
 */
export async function addToCart(
  variantId: string,
  quantity = 1,
): Promise<CartActionResult> {
  if (!isShopifyConfigured()) {
    return { cart: null, error: 'Shop is not configured.' }
  }

  try {
    const existingCartId = await readCartCookie()

    if (!existingCartId) {
      const data = await shopifyFetch<CartCreateResponse>({
        query: CART_CREATE_MUTATION,
        variables: {
          input: { lines: [{ merchandiseId: variantId, quantity }] },
        },
        cache: 'no-store',
      })
      const err = firstUserErrorMessage(data.cartCreate.userErrors)
      if (err || !data.cartCreate.cart) return { cart: null, error: err ?? 'Could not create cart.' }
      await writeCartCookie(data.cartCreate.cart.id)
      return { cart: normalizeCart(data.cartCreate.cart) }
    }

    const data = await shopifyFetch<CartLinesAddResponse>({
      query: CART_LINES_ADD_MUTATION,
      variables: {
        cartId: existingCartId,
        lines: [{ merchandiseId: variantId, quantity }],
      },
      cache: 'no-store',
    })
    const err = firstUserErrorMessage(data.cartLinesAdd.userErrors)
    if (err || !data.cartLinesAdd.cart) return { cart: null, error: err ?? 'Could not add to cart.' }
    return { cart: normalizeCart(data.cartLinesAdd.cart) }
  } catch (error) {
    console.error('[shopify.addToCart]', error)
    return { cart: null, error: 'Something went wrong.' }
  }
}

/**
 * Updates the quantity for an existing cart line. A quantity of 0 removes the
 * line entirely.
 */
export async function updateCartLine(
  lineId: string,
  quantity: number,
): Promise<CartActionResult> {
  if (!isShopifyConfigured()) {
    return { cart: null, error: 'Shop is not configured.' }
  }

  if (quantity <= 0) return removeCartLine(lineId)

  const cartId = await readCartCookie()
  if (!cartId) return { cart: null, error: 'No active cart.' }

  try {
    const data = await shopifyFetch<CartLinesUpdateResponse>({
      query: CART_LINES_UPDATE_MUTATION,
      variables: { cartId, lines: [{ id: lineId, quantity }] },
      cache: 'no-store',
    })
    const err = firstUserErrorMessage(data.cartLinesUpdate.userErrors)
    if (err || !data.cartLinesUpdate.cart) return { cart: null, error: err ?? 'Could not update cart.' }
    return { cart: normalizeCart(data.cartLinesUpdate.cart) }
  } catch (error) {
    console.error('[shopify.updateCartLine]', error)
    return { cart: null, error: 'Something went wrong.' }
  }
}

export async function removeCartLine(lineId: string): Promise<CartActionResult> {
  if (!isShopifyConfigured()) {
    return { cart: null, error: 'Shop is not configured.' }
  }

  const cartId = await readCartCookie()
  if (!cartId) return { cart: null, error: 'No active cart.' }

  try {
    const data = await shopifyFetch<CartLinesRemoveResponse>({
      query: CART_LINES_REMOVE_MUTATION,
      variables: { cartId, lineIds: [lineId] },
      cache: 'no-store',
    })
    const err = firstUserErrorMessage(data.cartLinesRemove.userErrors)
    if (err || !data.cartLinesRemove.cart) return { cart: null, error: err ?? 'Could not remove item.' }
    return { cart: normalizeCart(data.cartLinesRemove.cart) }
  } catch (error) {
    console.error('[shopify.removeCartLine]', error)
    return { cart: null, error: 'Something went wrong.' }
  }
}
