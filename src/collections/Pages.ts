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
    description:
      'Editable static pages rendered by slug. Known slugs the site looks for: "about" (/about), "mission" (/mission). Create a page with that exact slug to override the default content. Leave a slug blank to see it auto-generated from the title.',
  },
  access: publicReadAdminWrite,
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      admin: {
        description:
          'Shown as the page heading on the public site.',
      },
    },
    slugField(),
    {
      name: 'content',
      type: 'richText',
      required: true,
      admin: {
        description:
          'Main body of the page. Supports headings, lists, links, and rich formatting.',
      },
    },
    metaField,
    statusField,
    publishedAtField,
  ],
}
