import { RichText } from '@payloadcms/richtext-lexical/react'
import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'

interface RichTextRendererProps {
  data: SerializedEditorState | null | undefined
  className?: string
}

export function RichTextRenderer({ data, className }: RichTextRendererProps) {
  if (!data) return null

  return (
    <div
      className={
        className ??
        'prose prose-slate max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-h2:mt-12 prose-h2:text-3xl prose-h3:mt-8 prose-h3:text-2xl prose-p:leading-relaxed prose-a:text-primary hover:prose-a:text-primary-dark prose-img:rounded-xl'
      }
    >
      <RichText data={data} />
    </div>
  )
}
