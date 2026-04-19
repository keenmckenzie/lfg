import type { CollectionConfig } from 'payload'

export const Subscribers: CollectionConfig = {
  slug: 'subscribers',
  labels: { singular: 'Subscriber', plural: 'Subscribers' },
  admin: {
    useAsTitle: 'email',
    group: 'People',
    defaultColumns: ['email', 'firstName', 'lastName', 'active', 'subscribedAt'],
  },
  access: {
    read: ({ req: { user } }) => Boolean(user),
    create: () => true,
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => Boolean(user),
  },
  fields: [
    {
      name: 'email',
      type: 'email',
      required: true,
      unique: true,
      index: true,
    },
    { name: 'firstName', type: 'text' },
    { name: 'lastName', type: 'text' },
    {
      name: 'subscribedAt',
      type: 'date',
      defaultValue: () => new Date().toISOString(),
      admin: { date: { pickerAppearance: 'dayAndTime' } },
    },
    {
      name: 'active',
      type: 'checkbox',
      defaultValue: true,
      admin: { description: 'Uncheck to unsubscribe.' },
    },
  ],
  timestamps: true,
}
