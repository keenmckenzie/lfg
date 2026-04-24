import type { Metadata } from 'next'

import { PageHeader } from '@/components/content/PageHeader'
import { RichTextRenderer } from '@/components/content/RichTextRenderer'
import { getPageBySlug } from '@/lib/queries'
import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'

export const dynamic = 'force-dynamic'

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageBySlug('about')
  return {
    title: page?.meta?.title ?? page?.title ?? 'About',
    description:
      page?.meta?.description ??
      "Learn about the Let's Fight Glio Foundation — our mission, values, and the people behind the work.",
  }
}

export default async function AboutPage() {
  const page = await getPageBySlug('about')

  if (!page) {
    return (
      <section className="mx-auto max-w-4xl px-6 py-20 sm:py-24">
        <PageHeader
          eyebrow="About"
          title="About Let's Fight Glio"
          description="We're a coalition of patients, families, doctors, and donors working together to fund breakthrough research into glioblastoma."
        />
        <div className="mt-12 prose prose-slate mx-auto max-w-none">
          <p>
            Glioblastoma (GBM) is the most aggressive form of brain cancer. Median survival
            remains under two years, despite decades of treatment standards that have barely
            moved. We believe the next decade can be different.
          </p>
          <p>
            Our foundation directs every dollar to three priorities: funding promising research
            grants, supporting patients and families navigating diagnosis, and building public
            awareness so glioblastoma gets the attention it deserves.
          </p>
          <p>
            <em>
              This page can be customized in the Payload admin under <strong>Pages</strong>.
              Create a page with the slug <code>about</code> to replace this default content.
            </em>
          </p>
        </div>
      </section>
    )
  }

  return (
    <article className="mx-auto max-w-4xl px-6 py-20 sm:py-24">
      <PageHeader eyebrow="About" title={page.title} description={page.meta?.description ?? undefined} />
      <div className="mt-12">
        <RichTextRenderer data={page.content as unknown as SerializedEditorState} />
      </div>
    </article>
  )
}
