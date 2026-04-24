'use client'

import { useTransition } from 'react'

import { addToCart } from '@/lib/shopify/cart-actions'
import { useCartStore } from '@/store/cart'
import { cn } from '@/lib/utils'

interface AddToCartButtonProps {
  variantId: string | null
  disabled?: boolean
  label?: string
  className?: string
  quantity?: number
}

export function AddToCartButton({
  variantId,
  disabled,
  label = 'Add to cart',
  className,
  quantity = 1,
}: AddToCartButtonProps) {
  const [isPending, startTransition] = useTransition()
  const setCart = useCartStore((s) => s.setCart)
  const openCart = useCartStore((s) => s.openCart)

  const isDisabled = disabled || !variantId || isPending

  function handleClick() {
    if (!variantId) return
    startTransition(async () => {
      const result = await addToCart(variantId, quantity)
      if (result.cart) {
        setCart(result.cart)
        openCart()
      } else if (result.error) {
        // Surface simple error feedback. A toast would be a nice upgrade.
        window.alert(result.error)
      }
    })
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isDisabled}
      className={cn(
        'inline-flex items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-sm transition-colors',
        'hover:bg-primary-dark focus-visible:outline-2 focus-visible:outline-primary',
        'disabled:cursor-not-allowed disabled:opacity-50',
        className,
      )}
    >
      {isPending ? 'Adding…' : disabled && !variantId ? 'Unavailable' : label}
    </button>
  )
}
