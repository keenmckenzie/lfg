import type { Metadata } from 'next'
import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'

import { PageHeader } from '@/components/content/PageHeader'
import { RichTextRenderer } from '@/components/content/RichTextRenderer'
import { getPageBySlug } from '@/lib/queries'

export const revalidate = 300

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageBySlug('mission')
  return {
    title: page?.meta?.title ?? page?.title ?? 'Mission',
    description:
      page?.meta?.description ??
      'Our mission: fund breakthrough glioblastoma research, support the families living through it, and raise the awareness this disease deserves.',
  }
}

export default async function MissionPage() {
  const page = await getPageBySlug('mission')

  if (!page) {
    return (
      <section className="mx-auto max-w-4xl px-6 py-20 sm:py-24">
        <PageHeader
          eyebrow="Mission"
          title="Fund the research. Fight the disease."
          description="Glioblastoma has taken too much for too long. Our mission is to change that — one grant, one family, one story at a time."
        />
        <div className="prose prose-slate mx-auto mt-12 max-w-none">
          <h2>Why we exist</h2>
          <p>
            Glioblastoma (GBM) is the most aggressive form of brain cancer.
            Median survival remains under two years, and treatment standards
            have barely changed in decades. That has to change.
          </p>

          <h2>Our three priorities</h2>
          <ul>
            <li>
              <strong>Research.</strong> We fund high-impact research grants
              focused on novel GBM therapies, immunotherapy, and early
              detection.
            </li>
            <li>
              <strong>Family support.</strong> We provide resources,
              connections, and practical help for patients and caregivers
              navigating a GBM diagnosis.
            </li>
            <li>
              <strong>Awareness.</strong> We amplify the stories of people
              affected by GBM so the disease gets the public attention and
              research dollars it deserves.
            </li>
          </ul>

          <h2>Our commitment</h2>
          <p>
            Every dollar you donate is tracked, reported, and directed at one
            of those three priorities. Our 501(c)(3) status is pending; all
            donations are recorded and will be retroactively recognized as
            tax-deductible once approved.
          </p>

          <p>
            <em>
              This page can be customized in the Payload admin under{' '}
              <strong>Pages</strong>. Create a page with the slug{' '}
              <code>mission</code> to replace this default content.
            </em>
          </p>
        </div>
      </section>
    )
  }

  return (
    <article className="mx-auto max-w-4xl px-6 py-20 sm:py-24">
      <PageHeader
        eyebrow="Mission"
        title={page.title}
        description={page.meta?.description ?? undefined}
      />
      <div className="mt-12">
        <RichTextRenderer data={page.content as unknown as SerializedEditorState} />
      </div>
    </article>
  )
}
