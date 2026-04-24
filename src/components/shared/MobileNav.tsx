'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useId, useState } from 'react'
import { createPortal } from 'react-dom'

import { Logo } from './Logo'
import { NAV_GROUPS, NAV_LEAF_ITEMS } from './nav-config'

/**
 * Hamburger nav shown below the `md` breakpoint, where the desktop nav is
 * hidden. Opens as a full-viewport overlay so the layout doesn't have to
 * know the header's pixel height — avoids drift across devices / font sizes.
 *
 * The overlay is rendered via a portal into `document.body`. This is
 * required because the site header uses `backdrop-blur`, and any element
 * with a `backdrop-filter` establishes a containing block for its
 * `position: fixed` descendants — so a fixed overlay nested inside the
 * header would be clipped to the header's bounds instead of covering the
 * viewport, which is the bug that was shipping: hamburger visible,
 * options "invisible".
 *
 * Behavior:
 * - Closes on route change, Escape, and link tap.
 * - Locks body scroll while open so iOS doesn't rubber-band the backdrop.
 * - The donate CTA is mirrored at the bottom of the sheet for thumb reach.
 */
export function MobileNav() {
  const [open, setOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const panelId = useId()
  const pathname = usePathname()

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    setOpen(false)
  }, [pathname])

  useEffect(() => {
    if (!open) return
    function handleKey(event: KeyboardEvent) {
      if (event.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [open])

  useEffect(() => {
    if (!open) return
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previous
    }
  }, [open])

  return (
    <div className="md:hidden">
      <button
        type="button"
        aria-label="Open menu"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen(true)}
        className="inline-flex h-10 w-10 items-center justify-center rounded-full text-foreground/80 transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-6 w-6"
          aria-hidden
        >
          <line x1="3" y1="6" x2="21" y2="6" />
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="18" x2="21" y2="18" />
        </svg>
      </button>

      {open && mounted && createPortal(
        <div
          id={panelId}
          role="dialog"
          aria-modal="true"
          aria-label="Site navigation"
          className="fixed inset-0 z-50 flex flex-col overflow-y-auto bg-background md:hidden"
        >
          <div className="flex items-center justify-between gap-6 border-b border-border px-6 py-4">
            <Link
              href="/"
              aria-label="Let's Fight Glio Foundation — home"
              onClick={() => setOpen(false)}
              className="flex items-center"
            >
              <Logo height={40} alt="" />
            </Link>
            <button
              type="button"
              aria-label="Close menu"
              onClick={() => setOpen(false)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full text-foreground/80 transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-6 w-6"
                aria-hidden
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          <nav aria-label="Mobile" className="mx-auto w-full max-w-6xl flex-1 px-6 py-8">
            <ul className="flex flex-col gap-6">
              {NAV_GROUPS.map((group) => (
                <li key={group.label}>
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    {group.label}
                  </p>
                  <ul className="mt-2 flex flex-col divide-y divide-border rounded-xl border border-border bg-card">
                    {group.items.map((item) => (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          onClick={() => setOpen(false)}
                          className="block px-4 py-3 text-base font-medium text-foreground transition-colors hover:bg-muted focus-visible:bg-muted focus-visible:outline-none"
                        >
                          {item.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </li>
              ))}

              {NAV_LEAF_ITEMS.length > 0 && (
                <li>
                  <ul className="flex flex-col divide-y divide-border rounded-xl border border-border bg-card">
                    {NAV_LEAF_ITEMS.map((item) => (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          onClick={() => setOpen(false)}
                          className="block px-4 py-3 text-base font-medium text-foreground transition-colors hover:bg-muted focus-visible:bg-muted focus-visible:outline-none"
                        >
                          {item.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </li>
              )}
            </ul>
          </nav>

          <div className="border-t border-border bg-background px-6 py-4">
            <Link
              href="/donate"
              onClick={() => setOpen(false)}
              className="flex w-full items-center justify-center rounded-full bg-primary px-5 py-3 text-base font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary-dark"
            >
              Donate
            </Link>
          </div>
        </div>,
        document.body,
      )}
    </div>
  )
}
