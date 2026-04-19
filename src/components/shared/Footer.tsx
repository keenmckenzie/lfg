import Link from 'next/link'

import { Logo } from './Logo'
import { NewsletterForm } from './NewsletterForm'

const FOOTER_LINKS = [
  {
    heading: 'Foundation',
    links: [
      { label: 'About', href: '/about' },
      { label: 'Team', href: '/team' },
      { label: 'Contact', href: '/contact' },
    ],
  },
  {
    heading: 'Get Involved',
    links: [
      { label: 'Donate', href: '/donate' },
      { label: 'Events', href: '/events' },
      { label: 'Shop', href: '/shop' },
    ],
  },
  {
    heading: 'Resources',
    links: [
      { label: 'News', href: '/news' },
      { label: 'Stories', href: '/stories' },
      { label: 'Privacy', href: '/privacy' },
    ],
  },
]

export function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer className="mt-24 border-t border-border bg-muted/40">
      <div className="mx-auto max-w-6xl px-6 py-14">
        <div className="grid gap-10 md:grid-cols-12">
          <div className="md:col-span-5">
            <Link href="/" aria-label="Let's Fight Glio Foundation — home" className="inline-flex">
              <Logo height={44} alt="" />
            </Link>
            <p className="mt-4 max-w-sm text-sm text-muted-foreground">
              Funding research, supporting families, and raising awareness for glioblastoma brain
              cancer.
            </p>

            <div className="mt-6">
              <h3 className="text-sm font-semibold text-foreground">Stay in the loop</h3>
              <p className="mt-1 text-xs text-muted-foreground">
                Occasional updates on research, stories, and events. Unsubscribe anytime.
              </p>
              <div className="mt-3 max-w-md">
                <NewsletterForm />
              </div>
            </div>
          </div>

          <div className="grid gap-8 md:col-span-7 md:grid-cols-3">
            {FOOTER_LINKS.map((column) => (
              <div key={column.heading}>
                <h3 className="text-sm font-semibold text-foreground">{column.heading}</h3>
                <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                  {column.links.map((link) => (
                    <li key={link.href}>
                      <Link className="transition-colors hover:text-foreground" href={link.href}>
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 border-t border-border pt-6 text-xs text-muted-foreground">
          <p>
            Let&apos;s Fight Glio Foundation has applied for 501(c)(3) tax-exempt status with the
            IRS. Donations may be tax-deductible retroactive to our date of incorporation once our
            status is approved.
          </p>
          <p className="mt-2">
            &copy; {year} Let&apos;s Fight Glio Foundation. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
