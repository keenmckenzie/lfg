import type { Field, FieldHook } from 'payload'

import { formatSlug } from '../hooks/formatSlug'

export const statusField: Field = {
  name: 'status',
  type: 'select',
  defaultValue: 'draft',
  required: true,
  options: [
    { label: 'Draft', value: 'draft' },
    { label: 'Published', value: 'published' },
  ],
  admin: { position: 'sidebar' },
}

export const publishedAtField: Field = {
  name: 'publishedAt',
  type: 'date',
  admin: {
    position: 'sidebar',
    date: { pickerAppearance: 'dayAndTime' },
  },
}

interface SlugFieldOptions {
  source?: string
  extraHooks?: FieldHook[]
}

export function slugField({ source = 'title', extraHooks = [] }: SlugFieldOptions = {}): Field {
  return {
    name: 'slug',
    type: 'text',
    required: true,
    unique: true,
    index: true,
    hooks: {
      beforeValidate: [formatSlug(source), ...extraHooks],
    },
    admin: {
      position: 'sidebar',
      description: 'URL-friendly identifier. Auto-generated from the title.',
    },
  }
}
