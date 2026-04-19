import { fileURLToPath } from 'node:url'
import path from 'node:path'

import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { s3Storage } from '@payloadcms/storage-s3'
import { buildConfig } from 'payload'
import sharp from 'sharp'

import { Donations } from './collections/Donations'
import { Donors } from './collections/Donors'
import { Events } from './collections/Events'
import { Media } from './collections/Media'
import { Pages } from './collections/Pages'
import { Posts } from './collections/Posts'
import { Stories } from './collections/Stories'
import { Subscribers } from './collections/Subscribers'
import { TeamMembers } from './collections/TeamMembers'
import { Users } from './collections/Users'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    meta: {
      title: "Let's Fight Glio Admin",
      description: 'Content management for the Let\'s Fight Glio Foundation.',
      icons: [
        { rel: 'icon', type: 'image/svg+xml', url: '/favicon.svg' },
        { rel: 'apple-touch-icon', type: 'image/svg+xml', url: '/favicon.svg' },
      ],
    },
  },
  editor: lexicalEditor(),
  collections: [
    Users,
    Posts,
    Donations,
    Donors,
    Events,
    Pages,
    Stories,
    TeamMembers,
    Subscribers,
    Media,
  ],
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'types/payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL || '',
    },
  }),
  plugins: [
    s3Storage({
      collections: { media: true },
      bucket: process.env.S3_BUCKET_NAME || '',
      config: {
        credentials: {
          accessKeyId: process.env.S3_ACCESS_KEY_ID || '',
          secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || '',
        },
        region: process.env.S3_REGION || 'us-east-1',
      },
    }),
  ],
  sharp,
  cors: [process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'],
  csrf: [process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'],
})
