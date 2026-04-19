import type { Metadata } from 'next'
import Image from 'next/image'

import { EmptyState } from '@/components/content/EmptyState'
import { PageHeader } from '@/components/content/PageHeader'
import { resolveMedia } from '@/lib/media'
import { getTeamMembers } from '@/lib/queries'

export const revalidate = 300

export const metadata: Metadata = {
  title: 'Our team',
  description:
    "Meet the people leading the Let's Fight Glio Foundation — board members, advisors, and volunteers.",
}

const PLATFORM_LABELS: Record<string, string> = {
  linkedin: 'LinkedIn',
  twitter: 'X / Twitter',
  instagram: 'Instagram',
  facebook: 'Facebook',
  github: 'GitHub',
  website: 'Website',
  email: 'Email',
}

export default async function TeamPage() {
  const members = await getTeamMembers()

  return (
    <section className="mx-auto max-w-6xl px-6 py-20 sm:py-24">
      <PageHeader
        eyebrow="Team"
        title="The people behind Let's Fight Glio"
        description="We're a small, dedicated group of volunteers, advisors, and board members united by a single mission."
      />

      {members.length === 0 ? (
        <div className="mt-16">
          <EmptyState
            title="Team members coming soon"
            description="We're publishing bios shortly. Check back in a few days."
          />
        </div>
      ) : (
        <ul className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {members.map((member) => {
            const photo = resolveMedia(member.photo)
            return (
              <li
                key={member.id}
                className="flex flex-col rounded-2xl border border-border bg-card p-6 shadow-sm"
              >
                <div className="relative h-32 w-32 overflow-hidden rounded-full bg-muted">
                  {photo?.url ? (
                    <Image
                      src={photo.url}
                      alt={photo.alt ?? member.name}
                      fill
                      sizes="128px"
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-2xl font-semibold text-primary">
                      {member.name
                        .split(' ')
                        .map((part) => part[0])
                        .slice(0, 2)
                        .join('')}
                    </div>
                  )}
                </div>
                <h3 className="mt-5 text-lg font-semibold">{member.name}</h3>
                <p className="text-sm font-medium text-primary">{member.role}</p>
                {member.bio && (
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{member.bio}</p>
                )}
                {member.socialLinks && member.socialLinks.length > 0 && (
                  <ul className="mt-4 flex flex-wrap gap-x-3 gap-y-1 text-xs">
                    {member.socialLinks.map((link, idx) => (
                      <li key={link.id ?? `${member.id}-${idx}`}>
                        <a
                          href={link.platform === 'email' ? `mailto:${link.url}` : link.url}
                          target={link.platform === 'email' ? undefined : '_blank'}
                          rel={link.platform === 'email' ? undefined : 'noreferrer noopener'}
                          className="font-medium text-primary underline-offset-4 hover:underline"
                        >
                          {PLATFORM_LABELS[link.platform] ?? link.platform}
                        </a>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            )
          })}
        </ul>
      )}
    </section>
  )
}
