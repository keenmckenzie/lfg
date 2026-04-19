import type { CollectionConfig } from 'payload'

import { publicReadAdminWrite } from './access'
import { metaField } from './fields/meta'
import { publishedAtField, slugField, statusField } from './fields/publishing'

export const Posts: CollectionConfig = {
  slug: 'posts',
  labels: { singular: 'Post', plural: 'Posts' },
  admin: {
    useAsTitle: 'title',
    group: 'Content',
    defaultColumns: ['title', 'status', 'publishedAt', 'updatedAt'],
  },
  access: publicReadAdminWrite,
  fields: [
    { name: 'title', type: 'text', required: true },
    slugField(),
    {
      name: 'excerpt',
      type: 'textarea',
      maxLength: 280,
      admin: { description: 'Short summary used in listings and SEO previews.' },
    },
    {
      name: 'featuredImage',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'content',
      type: 'richText',
      required: true,
    },
    metaField,
    statusField,
    publishedAtField,
  ],
}
