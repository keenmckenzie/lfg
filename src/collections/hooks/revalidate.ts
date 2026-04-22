import { revalidatePath, revalidateTag } from 'next/cache'
import type {
  CollectionAfterChangeHook,
  CollectionAfterDeleteHook,
} from 'payload'

/**
 * Shared config describing how to invalidate Next.js caches when a collection
 * document is created, updated, or deleted in Payload.
 */
export interface RevalidateConfig {
  /**
   * The `unstable_cache` tag used by `src/lib/queries.ts` for this collection's
   * fetchers (e.g. "stories", "team-members"). Revalidating the tag
   * invalidates both list and detail queries that share it.
   */
  tag: string
  /**
   * Fixed page paths to revalidate (e.g. `/team`, `/news`, `/stories`).
   */
  paths?: string[]
  /**
   * If set, the hook also revalidates `${slugPathPrefix}${doc.slug}` so the
   * detail page refreshes. If the slug changed, the old path is revalidated
   * too to clear the stale HTML.
   */
  slugPathPrefix?: string
}

interface WithSlug {
  slug?: string | null
}

function revalidateSlugPath(
  prefix: string,
  doc: WithSlug | undefined,
  previousDoc?: WithSlug,
) {
  if (doc?.slug) revalidatePath(`${prefix}${doc.slug}`)
  if (
    previousDoc?.slug &&
    previousDoc.slug !== doc?.slug
  ) {
    revalidatePath(`${prefix}${previousDoc.slug}`)
  }
}

export function revalidateAfterChange(
  config: RevalidateConfig,
): CollectionAfterChangeHook {
  const { tag, paths = [], slugPathPrefix } = config
  return async ({ doc, previousDoc }) => {
    revalidateTag(tag)
    for (const path of paths) revalidatePath(path)
    if (slugPathPrefix) {
      revalidateSlugPath(slugPathPrefix, doc as WithSlug, previousDoc as WithSlug)
    }
    return doc
  }
}

export function revalidateAfterDelete(
  config: RevalidateConfig,
): CollectionAfterDeleteHook {
  const { tag, paths = [], slugPathPrefix } = config
  return async ({ doc }) => {
    revalidateTag(tag)
    for (const path of paths) revalidatePath(path)
    if (slugPathPrefix) {
      revalidateSlugPath(slugPathPrefix, doc as WithSlug)
    }
    return doc
  }
}

/**
 * Convenience: returns both hooks wired with the same config.
 */
export function revalidateHooks(config: RevalidateConfig) {
  return {
    afterChange: [revalidateAfterChange(config)],
    afterDelete: [revalidateAfterDelete(config)],
  }
}
