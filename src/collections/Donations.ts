import type { CollectionConfig } from 'payload'

export const Donations: CollectionConfig = {
  slug: 'donations',
  labels: { singular: 'Donation', plural: 'Donations' },
  admin: {
    useAsTitle: 'donorEmail',
    group: 'Fundraising',
    defaultColumns: ['donorEmail', 'amount', 'recurring', 'status', 'createdAt'],
    description: 'Donation records are created automatically by the Stripe webhook. Do not create them manually.',
  },
  access: {
    read: ({ req: { user } }) => Boolean(user),
    create: () => true,
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => Boolean(user),
  },
  fields: [
    { name: 'stripeSessionId', type: 'text', unique: true, index: true },
    { name: 'stripePaymentIntentId', type: 'text', index: true },
    { name: 'stripeInvoiceId', type: 'text', unique: true, index: true },
    { name: 'stripeSubscriptionId', type: 'text', index: true },
    { name: 'stripeCustomerId', type: 'text', index: true },
    {
      name: 'amount',
      type: 'number',
      required: true,
      admin: { description: 'Donation amount in the smallest currency unit (cents).' },
    },
    { name: 'currency', type: 'text', required: true, defaultValue: 'usd' },
    { name: 'donorEmail', type: 'email' },
    { name: 'donorName', type: 'text' },
    { name: 'donor', type: 'relationship', relationTo: 'donors' },
    { name: 'inMemoryOf', type: 'text', maxLength: 200 },
    { name: 'inHonorOf', type: 'text', maxLength: 200 },
    {
      name: 'recurring',
      type: 'checkbox',
      defaultValue: false,
      admin: { description: 'True for monthly subscription donations.' },
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'pending',
      options: [
        { label: 'Pending', value: 'pending' },
        { label: 'Succeeded', value: 'succeeded' },
        { label: 'Failed', value: 'failed' },
        { label: 'Refunded', value: 'refunded' },
      ],
    },
    {
      name: 'receiptSent',
      type: 'checkbox',
      defaultValue: false,
      admin: { description: 'Set to true once the receipt email has been delivered via SES.' },
    },
  ],
  timestamps: true,
}
