import Link from 'next/link'

const FOOTER_LINKS = [
  {
    heading: 'Foundation',
    links: [
      { label: 'About', href: '/about' },
      { label: 'Mission', href: '/mission' },
      { label: 'Team', href: '/team' },
      { label: 'Financials', href: '/financials' },
    ],
  },
  {
    heading: 'Get Involved',
    links: [
      { label: 'Donate', href: '/donate' },
      { label: 'Events', href: '/events' },
      { label: 'Shop', href: '/shop' },
      { label: 'Contact', href: '/contact' },
    ],
  },
  {
    heading: 'Resources',
    links: [
      { label: 'News', href: '/news' },
      { label: 'Stories', href: '/stories' },
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Terms', href: '/terms' },
    ],
  },
]

export function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer className="mt-24 border-t border-border bg-muted/40">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid gap-8 md:grid-cols-4">
          <div>
            <p className="flex items-center gap-2 text-base font-semibold">
              <span aria-hidden className="inline-block h-3 w-3 rounded-full bg-primary" />
              Let&apos;s Fight Glio
            </p>
            <p className="mt-3 text-sm text-muted-foreground">
              Funding research, supporting families, and raising awareness for glioblastoma brain
              cancer.
            </p>
          </div>
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

        <div className="mt-12 border-t border-border pt-6 text-xs text-muted-foreground">
          <p>
            Let&apos;s Fight Glio Foundation has applied for 501(c)(3) tax-exempt status with the IRS.
            Donations may be tax-deductible retroactive to our date of incorporation once our
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
