import type { Media } from '@/types/payload-types'

export function resolveMedia(value: unknown): Media | null {
  if (!value) return null
  if (typeof value === 'object' && 'url' in (value as object)) {
    return value as Media
  }
  return null
}

export function metaImage(meta: { image?: number | Media | null } | null | undefined): Media | null {
  if (!meta) return null
  return resolveMedia(meta.image)
}
