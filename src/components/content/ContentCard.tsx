import Image from 'next/image'
import Link from 'next/link'

import type { Media } from '@/types/payload-types'

interface ContentCardProps {
  href: string
  title: string
  description?: string | null
  image?: Media | null
  meta?: string
  badge?: string
}

export function ContentCard({ href, title, description, image, meta, badge }: ContentCardProps) {
  return (
    <Link
      href={href}
      className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
    >
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-muted">
        {image?.url ? (
          <Image
            src={image.url}
            alt={image.alt ?? title}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-gradient-to-br from-primary/10 via-accent/10 to-secondary/10">
            <span className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
              Let&apos;s Fight Glio
            </span>
          </div>
        )}
        {badge && (
          <span className="absolute left-4 top-4 inline-flex items-center rounded-full bg-primary/90 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-primary-foreground shadow">
            {badge}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        {meta && (
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            {meta}
          </p>
        )}
        <h3 className="mt-1 text-lg font-semibold leading-snug text-foreground transition-colors group-hover:text-primary">
          {title}
        </h3>
        {description && (
          <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">{description}</p>
        )}
        <span className="mt-4 inline-flex items-center text-sm font-medium text-primary">
          Read more
          <span aria-hidden className="ml-1 transition-transform group-hover:translate-x-0.5">
            →
          </span>
        </span>
      </div>
    </Link>
  )
}
