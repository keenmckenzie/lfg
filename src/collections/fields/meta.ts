import type { Field } from 'payload'

export const metaField: Field = {
  name: 'meta',
  type: 'group',
  label: 'SEO',
  fields: [
    {
      name: 'title',
      type: 'text',
      admin: { description: 'Overrides the default page title for search engines and social shares.' },
    },
    {
      name: 'description',
      type: 'textarea',
      maxLength: 200,
      admin: { description: '150-160 characters works best for search results.' },
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      admin: { description: 'Open Graph image (1200x630 recommended).' },
    },
  ],
}
