'use client'

import { useEffect } from 'react'

import { getCart } from '@/lib/shopify/cart-actions'
import { useCartStore } from '@/store/cart'

interface CartProviderProps {
  children: React.ReactNode
}

/**
 * Hydrates the Zustand cart store by fetching the current cart via a server
 * action on mount. Doing this client-side (rather than in the server layout)
 * keeps the rest of the app statically renderable — reading the cart cookie
 * in a server component would opt every page into dynamic rendering.
 */
export function CartProvider({ children }: CartProviderProps) {
  const setCart = useCartStore((s) => s.setCart)

  useEffect(() => {
    let cancelled = false
    void getCart().then((cart) => {
      if (!cancelled) setCart(cart)
    })
    return () => {
      cancelled = true
    }
  }, [setCart])

  return <>{children}</>
}
