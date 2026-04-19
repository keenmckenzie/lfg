import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface CartItem {
  id: string
  variantId: string
  title: string
  productTitle: string
  handle: string
  quantity: number
  price: string
  currency: string
  image?: { url: string; altText: string | null }
}

interface CartState {
  cartId: string | null
  items: CartItem[]
  totalQuantity: number
  totalAmount: string
  currency: string
  checkoutUrl: string | null
  isOpen: boolean
  // TODO: Phase 4 — replace these stubs with calls to Shopify Storefront API
  // (cartCreate, cartLinesAdd, cartLinesUpdate, cartLinesRemove).
  setCartId: (cartId: string | null) => void
  openCart: () => void
  closeCart: () => void
  clearCart: () => void
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      cartId: null,
      items: [],
      totalQuantity: 0,
      totalAmount: '0.00',
      currency: 'USD',
      checkoutUrl: null,
      isOpen: false,
      setCartId: (cartId) => set({ cartId }),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      clearCart: () =>
        set({
          cartId: null,
          items: [],
          totalQuantity: 0,
          totalAmount: '0.00',
          checkoutUrl: null,
        }),
    }),
    {
      name: 'lfg-cart',
      partialize: (state) => ({ cartId: state.cartId }),
    },
  ),
)
