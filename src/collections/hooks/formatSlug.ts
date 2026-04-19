import type { FieldHook } from 'payload'

const slugify = (input: string): string =>
  input
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

export const formatSlug =
  (sourceField: string): FieldHook =>
  ({ data, operation, value }) => {
    if (typeof value === 'string' && value.length > 0) {
      return slugify(value)
    }

    if (operation === 'create' || operation === 'update') {
      const fallback = data?.[sourceField]
      if (typeof fallback === 'string' && fallback.length > 0) {
        return slugify(fallback)
      }
    }

    return value
  }
