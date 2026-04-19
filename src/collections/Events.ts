import type { CollectionConfig } from 'payload'

import { publicReadAdminWrite } from './access'
import { metaField } from './fields/meta'
import { publishedAtField, slugField, statusField } from './fields/publishing'

export const Events: CollectionConfig = {
  slug: 'events',
  labels: { singular: 'Event', plural: 'Events' },
  admin: {
    useAsTitle: 'title',
    group: 'Content',
    defaultColumns: ['title', 'date', 'location', 'status'],
  },
  access: publicReadAdminWrite,
  fields: [
    { name: 'title', type: 'text', required: true },
    slugField(),
    { name: 'description', type: 'richText' },
    {
      name: 'date',
      type: 'date',
      required: true,
      admin: { date: { pickerAppearance: 'dayAndTime' } },
    },
    {
      name: 'endDate',
      type: 'date',
      admin: { date: { pickerAppearance: 'dayAndTime' } },
    },
    { name: 'location', type: 'text' },
    {
      name: 'registrationUrl',
      type: 'text',
      admin: { description: 'External link for RSVPs or ticket purchases.' },
    },
    {
      name: 'featuredImage',
      type: 'upload',
      relationTo: 'media',
    },
    metaField,
    statusField,
    publishedAtField,
  ],
}
