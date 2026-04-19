import type { CollectionConfig } from 'payload'

export const Donors: CollectionConfig = {
  slug: 'donors',
  labels: { singular: 'Donor', plural: 'Donors' },
  admin: {
    useAsTitle: 'email',
    group: 'Fundraising',
    defaultColumns: ['name', 'email', 'totalDonated', 'donationCount'],
  },
  access: {
    read: ({ req: { user } }) => Boolean(user),
    create: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => Boolean(user),
  },
  fields: [
    { name: 'name', type: 'text' },
    { name: 'email', type: 'email', required: true, unique: true, index: true },
    {
      name: 'totalDonated',
      type: 'number',
      defaultValue: 0,
      admin: { description: 'Lifetime total in the smallest currency unit (cents).' },
    },
    {
      name: 'donationCount',
      type: 'number',
      defaultValue: 0,
    },
    {
      name: 'donations',
      type: 'relationship',
      relationTo: 'donations',
      hasMany: true,
    },
  ],
  timestamps: true,
}
