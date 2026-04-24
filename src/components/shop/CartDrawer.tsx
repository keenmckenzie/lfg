'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useTransition } from 'react'

import { MoneyText } from './MoneyText'
import { removeCartLine, updateCartLine } from '@/lib/shopify/cart-actions'
import { useCartStore } from '@/store/cart'
import type { CartLine } from '@/lib/shopify/types'

export function CartDrawer() {
  const cart = useCartStore((s) => s.cart)
  const isOpen = useCartStore((s) => s.isOpen)
  const closeCart = useCartStore((s) => s.closeCart)

  useEffect(() => {
    if (!isOpen) return
    function handleKey(event: KeyboardEvent) {
      if (event.key === 'Escape') closeCart()
    }
    window.addEventListener('keydown', handleKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', handleKey)
      document.body.style.overflow = ''
    }
  }, [isOpen, closeCart])

  const isEmpty = !cart || cart.totalQuantity === 0

  return (
    <>
      <div
        aria-hidden={!isOpen}
        onClick={closeCart}
        className={`fixed inset-0 z-50 bg-foreground/40 backdrop-blur-sm transition-opacity ${
          isOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
      />
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Cart"
        aria-hidden={!isOpen}
        className={`fixed top-0 right-0 z-50 flex h-full w-full max-w-md flex-col bg-background shadow-xl transition-transform duration-200 ease-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <header className="flex items-center justify-between border-b border-border px-6 py-4">
          <h2 className="text-lg font-semibold text-foreground">Your cart</h2>
          <button
            type="button"
            onClick={closeCart}
            aria-label="Close cart"
            className="rounded-full p-2 text-foreground/60 transition-colors hover:bg-muted hover:text-foreground"
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
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          </button>
        </header>

        <div className="flex-1 overflow-y-auto px-6 py-4">
          {isEmpty ? (
            <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
              <p className="text-muted-foreground">Your cart is empty.</p>
              <Link
                href="/shop"
                onClick={closeCart}
                className="rounded-full border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:border-primary hover:text-primary"
              >
                Browse the shop
              </Link>
            </div>
          ) : (
            <ul className="divide-y divide-border">
              {cart!.lines.map((line) => (
                <CartLineRow key={line.id} line={line} />
              ))}
            </ul>
          )}
        </div>

        {!isEmpty ? (
          <footer className="border-t border-border px-6 py-4">
            <div className="mb-3 flex items-center justify-between text-sm text-muted-foreground">
              <span>Subtotal</span>
              <MoneyText
                value={cart!.cost.subtotalAmount}
                className="text-base font-semibold text-foreground"
              />
            </div>
            <p className="mb-4 text-xs text-muted-foreground">
              Taxes and shipping calculated at checkout.
            </p>
            <a
              href={cart!.checkoutUrl}
              className="inline-flex w-full items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary-dark focus-visible:outline-2 focus-visible:outline-primary"
            >
              Checkout
            </a>
          </footer>
        ) : null}
      </aside>
    </>
  )
}

function CartLineRow({ line }: { line: CartLine }) {
  const setCart = useCartStore((s) => s.setCart)
  const [isPending, startTransition] = useTransition()

  const { merchandise } = line
  const image = merchandise.image ?? merchandise.product.featuredImage
  const optionSummary = merchandise.selectedOptions
    .filter((opt) => opt.name !== 'Title')
    .map((opt) => opt.value)
    .join(' · ')

  function handleQuantity(next: number) {
    startTransition(async () => {
      const result = await updateCartLine(line.id, next)
      if (result.cart) setCart(result.cart)
    })
  }

  function handleRemove() {
    startTransition(async () => {
      const result = await removeCartLine(line.id)
      if (result.cart) setCart(result.cart)
    })
  }

  return (
    <li className="flex gap-4 py-4">
      <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-muted">
        {image ? (
          <Image
            src={image.url}
            alt={image.altText ?? merchandise.product.title}
            fill
            sizes="80px"
            className="object-cover"
          />
        ) : null}
      </div>
      <div className="flex flex-1 flex-col justify-between gap-2">
        <div>
          <Link
            href={`/shop/${merchandise.product.handle}`}
            className="text-sm font-medium text-foreground hover:text-primary"
          >
            {merchandise.product.title}
          </Link>
          {optionSummary ? (
            <p className="text-xs text-muted-foreground">{optionSummary}</p>
          ) : null}
          <MoneyText
            value={merchandise.price}
            className="text-sm text-foreground"
          />
        </div>
        <div className="flex items-center justify-between gap-2">
          <div className="inline-flex items-center rounded-full border border-border">
            <button
              type="button"
              onClick={() => handleQuantity(line.quantity - 1)}
              disabled={isPending}
              aria-label="Decrease quantity"
              className="h-8 w-8 rounded-full text-foreground/80 transition-colors hover:text-foreground disabled:opacity-50"
            >
              −
            </button>
            <span className="w-6 text-center text-sm font-medium">
              {line.quantity}
            </span>
            <button
              type="button"
              onClick={() => handleQuantity(line.quantity + 1)}
              disabled={isPending}
              aria-label="Increase quantity"
              className="h-8 w-8 rounded-full text-foreground/80 transition-colors hover:text-foreground disabled:opacity-50"
            >
              +
            </button>
          </div>
          <button
            type="button"
            onClick={handleRemove}
            disabled={isPending}
            className="text-xs font-medium text-muted-foreground hover:text-destructive disabled:opacity-50"
          >
            Remove
          </button>
        </div>
      </div>
    </li>
  )
}
