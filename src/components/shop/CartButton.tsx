'use client'

import { useCartStore } from '@/store/cart'

export function CartButton() {
  const totalQuantity = useCartStore((s) => s.cart?.totalQuantity ?? 0)
  const openCart = useCartStore((s) => s.openCart)

  return (
    <button
      type="button"
      onClick={openCart}
      aria-label={`Open cart${totalQuantity > 0 ? ` — ${totalQuantity} item${totalQuantity === 1 ? '' : 's'}` : ''}`}
      className="relative inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-background text-foreground transition-colors hover:border-primary hover:text-primary focus-visible:outline-2 focus-visible:outline-primary"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-5 w-5"
        aria-hidden
      >
        <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
        <path d="M3 6h18" />
        <path d="M16 10a4 4 0 0 1-8 0" />
      </svg>
      {totalQuantity > 0 ? (
        <span className="absolute -top-1 -right-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-[11px] font-semibold text-primary-foreground">
          {totalQuantity}
        </span>
      ) : null}
    </button>
  )
}
