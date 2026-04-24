import { create } from 'zustand'

import type { Cart } from '@/lib/shopify/types'

/**
 * Cart state is server-authoritative: the cart lives on Shopify and is keyed
 * by an httpOnly cookie managed by `@/lib/shopify/cart-actions`. This store
 * only mirrors the latest known cart for UI rendering (line count, drawer
 * contents) and tracks drawer open/close state + a pending flag for
 * optimistic UI.
 */
interface CartState {
  cart: Cart | null
  isOpen: boolean
  isPending: boolean
  setCart: (cart: Cart | null) => void
  openCart: () => void
  closeCart: () => void
  toggleCart: () => void
  setPending: (pending: boolean) => void
}

export const useCartStore = create<CartState>()((set) => ({
  cart: null,
  isOpen: false,
  isPending: false,
  setCart: (cart) => set({ cart }),
  openCart: () => set({ isOpen: true }),
  closeCart: () => set({ isOpen: false }),
  toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
  setPending: (isPending) => set({ isPending }),
}))
