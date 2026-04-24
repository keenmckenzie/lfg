import Link from 'next/link'

import { Logo } from './Logo'
import { MobileNav } from './MobileNav'
import { NavDropdown } from './NavDropdown'
import { ABOUT_ITEMS, NAV_LEAF_ITEMS, UPDATES_ITEMS } from './nav-config'

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:rounded focus:bg-primary focus:px-3 focus:py-2 focus:text-primary-foreground"
      >
        Skip to content
      </a>
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-6 py-4">
        <Link
          href="/"
          aria-label="Let's Fight Glio Foundation — home"
          className="flex items-center"
        >
          <Logo height={40} alt="" />
        </Link>

        <nav aria-label="Primary" className="hidden md:block">
          <ul className="flex items-center gap-6 text-sm font-medium text-foreground/80">
            <li>
              <NavDropdown label="About" items={ABOUT_ITEMS} />
            </li>
            <li>
              <NavDropdown label="Updates" items={UPDATES_ITEMS} />
            </li>
            {NAV_LEAF_ITEMS.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="transition-colors hover:text-foreground"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/donate"
            className="inline-flex items-center rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary-dark sm:px-5"
          >
            Donate
          </Link>
          <MobileNav />
        </div>
      </div>
    </header>
  )
}
