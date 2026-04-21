'use client'

import Link from 'next/link'
import { useCallback, useEffect, useRef, useState } from 'react'

import { cn } from '@/lib/utils'

interface NavDropdownItem {
  label: string
  href: string
}

interface NavDropdownProps {
  label: string
  items: NavDropdownItem[]
}

/**
 * Accessible hover/focus dropdown used in the primary nav.
 *
 * - Opens on hover and on keyboard focus-within so tabbing through the nav
 *   reveals the panel for keyboard users.
 * - A short close delay bridges the gap between trigger and panel so the menu
 *   doesn't snap shut when the cursor travels over the small vertical offset.
 * - Escape closes and returns focus to the trigger.
 * - Clicks outside close the menu.
 */
export function NavDropdown({ label, items }: NavDropdownProps) {
  const [open, setOpen] = useState(false)
  const wrapperRef = useRef<HTMLDivElement | null>(null)
  const triggerRef = useRef<HTMLButtonElement | null>(null)
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const clearCloseTimer = useCallback(() => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current)
      closeTimer.current = null
    }
  }, [])

  const scheduleClose = useCallback(() => {
    clearCloseTimer()
    closeTimer.current = setTimeout(() => setOpen(false), 120)
  }, [clearCloseTimer])

  const openNow = useCallback(() => {
    clearCloseTimer()
    setOpen(true)
  }, [clearCloseTimer])

  useEffect(() => {
    if (!open) return
    function handleClickOutside(event: MouseEvent) {
      if (!wrapperRef.current?.contains(event.target as Node)) {
        setOpen(false)
      }
    }
    function handleKey(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setOpen(false)
        triggerRef.current?.focus()
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleKey)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleKey)
    }
  }, [open])

  useEffect(() => clearCloseTimer, [clearCloseTimer])

  return (
    <div
      ref={wrapperRef}
      className="relative"
      onMouseEnter={openNow}
      onMouseLeave={scheduleClose}
      onFocus={openNow}
      onBlur={(event) => {
        if (!wrapperRef.current?.contains(event.relatedTarget as Node)) {
          setOpen(false)
        }
      }}
    >
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((prev) => !prev)}
        className={cn(
          'inline-flex items-center gap-1 transition-colors hover:text-foreground',
          open ? 'text-foreground' : 'text-foreground/80',
        )}
      >
        {label}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={cn('h-3.5 w-3.5 transition-transform', open && 'rotate-180')}
          aria-hidden
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      <div
        role="menu"
        aria-label={label}
        aria-hidden={!open}
        className={cn(
          'absolute top-full left-1/2 z-50 min-w-44 -translate-x-1/2 pt-3 transition-[opacity,transform] duration-150',
          open
            ? 'pointer-events-auto translate-y-0 opacity-100'
            : 'pointer-events-none translate-y-1 opacity-0',
        )}
      >
        <ul className="overflow-hidden rounded-xl border border-border bg-background p-1 shadow-lg">
          {items.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                role="menuitem"
                onClick={() => setOpen(false)}
                className="block rounded-lg px-3 py-2 text-sm text-foreground/80 transition-colors hover:bg-muted hover:text-foreground focus-visible:bg-muted focus-visible:text-foreground focus-visible:outline-none"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
