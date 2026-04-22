import type { CollectionConfig } from 'payload'

import { publicReadAdminWrite } from './access'
import { metaField } from './fields/meta'
import { publishedAtField, slugField, statusField } from './fields/publishing'
import { revalidateHooks } from './hooks/revalidate'

export const Stories: CollectionConfig = {
  slug: 'stories',
  labels: { singular: 'Story', plural: 'Stories' },
  admin: {
    useAsTitle: 'title',
    group: 'Content',
    defaultColumns: ['title', 'patientName', 'status', 'publishedAt'],
  },
  access: publicReadAdminWrite,
  hooks: revalidateHooks({
    tag: 'stories',
    paths: ['/stories', '/'],
    slugPathPrefix: '/stories/',
  }),
  fields: [
    { name: 'title', type: 'text', required: true },
    slugField(),
    {
      name: 'patientName',
      type: 'text',
      required: true,
      admin: { description: 'The name of the patient or family member this story honors.' },
    },
    {
      name: 'relationship',
      type: 'text',
      admin: { description: 'How the storyteller knew the patient (e.g., "Spouse", "Daughter", "Friend").' },
    },
    {
      name: 'featuredImage',
      type: 'upload',
      relationTo: 'media',
    },
    { name: 'content', type: 'richText', required: true },
    metaField,
    statusField,
    publishedAtField,
  ],
}
