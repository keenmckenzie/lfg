import type { CollectionConfig } from 'payload'

import { publicRead, isAdmin } from './access'

export const Media: CollectionConfig = {
  slug: 'media',
  admin: {
    group: 'Media',
    defaultColumns: ['filename', 'alt', 'updatedAt'],
  },
  access: {
    read: publicRead,
    create: isAdmin,
    update: isAdmin,
    delete: isAdmin,
  },
  upload: {
    mimeTypes: [
      'image/png',
      'image/jpeg',
      'image/webp',
      'image/svg+xml',
      'application/pdf',
    ],
    imageSizes: [
      { name: 'thumbnail', width: 300, height: 300, position: 'centre' },
      { name: 'card', width: 768, height: 512, position: 'centre' },
      { name: 'hero', width: 1920, height: 1080, position: 'centre' },
    ],
    adminThumbnail: 'thumbnail',
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
      admin: { description: 'Required for accessibility. Describe what is in the image.' },
    },
    {
      name: 'caption',
      type: 'text',
      admin: { description: 'Optional caption shown alongside the image.' },
    },
  ],
}
