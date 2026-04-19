import type { CollectionConfig } from 'payload'

import { publicReadAdminWrite } from './access'
import { slugField } from './fields/publishing'

export const TeamMembers: CollectionConfig = {
  slug: 'team-members',
  labels: { singular: 'Team Member', plural: 'Team Members' },
  admin: {
    useAsTitle: 'name',
    group: 'People',
    defaultColumns: ['name', 'role', 'order'],
  },
  defaultSort: 'order',
  access: publicReadAdminWrite,
  fields: [
    { name: 'name', type: 'text', required: true },
    slugField({ source: 'name' }),
    { name: 'role', type: 'text', required: true },
    { name: 'bio', type: 'textarea' },
    {
      name: 'photo',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'order',
      type: 'number',
      defaultValue: 0,
      admin: { description: 'Lower numbers appear first on the team page.' },
    },
    {
      name: 'socialLinks',
      type: 'array',
      labels: { singular: 'Link', plural: 'Links' },
      fields: [
        {
          name: 'platform',
          type: 'select',
          required: true,
          options: [
            { label: 'LinkedIn', value: 'linkedin' },
            { label: 'X / Twitter', value: 'twitter' },
            { label: 'Instagram', value: 'instagram' },
            { label: 'Facebook', value: 'facebook' },
            { label: 'GitHub', value: 'github' },
            { label: 'Website', value: 'website' },
            { label: 'Email', value: 'email' },
          ],
        },
        { name: 'url', type: 'text', required: true },
      ],
    },
  ],
}
