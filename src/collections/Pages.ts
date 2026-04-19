import type { CollectionConfig } from 'payload'

import { publicReadAdminWrite } from './access'
import { metaField } from './fields/meta'
import { publishedAtField, slugField, statusField } from './fields/publishing'

export const Pages: CollectionConfig = {
  slug: 'pages',
  labels: { singular: 'Page', plural: 'Pages' },
  admin: {
    useAsTitle: 'title',
    group: 'Content',
    defaultColumns: ['title', 'slug', 'status', 'updatedAt'],
  },
  access: publicReadAdminWrite,
  fields: [
    { name: 'title', type: 'text', required: true },
    slugField(),
    { name: 'content', type: 'richText', required: true },
    metaField,
    statusField,
    publishedAtField,
  ],
}
