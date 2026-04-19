# Let's Fight Glio Foundation

Nonprofit website for the Let's Fight Glio Foundation — funding glioblastoma brain cancer research, supporting patients and families, and raising awareness.

## Stack

- **Next.js 15** (App Router) with **Payload CMS 3** embedded
- **Neon Serverless Postgres** via `@payloadcms/db-postgres`
- **Tailwind CSS v4** + shadcn/ui (added on demand)
- **Stripe** for donations (Phase 2)
- **Shopify Storefront API** for merchandise (Phase 4)
- **Amazon SES** for transactional email (Phase 2)
- **Amazon S3** for media storage (via Payload S3 adapter)
- **AWS Amplify Hosting** for deployment

## Getting started

```bash
# Install
npm install

# Copy env template, then fill in values
cp .env.example .env.local

# Run dev server
npm run dev
```

- App: [http://localhost:3000](http://localhost:3000)
- Payload admin: [http://localhost:3000/admin](http://localhost:3000/admin)

## Required environment variables

See `.env.example`. To boot the admin panel locally you minimally need:

- `DATABASE_URL` — Neon Postgres pooled connection string
- `PAYLOAD_SECRET` — generate with `openssl rand -base64 32`
- `NEXT_PUBLIC_SERVER_URL` — typically `http://localhost:3000`

S3, Stripe, Shopify, and SES credentials are required for their respective features but the app boots without them.

## Project structure

```
src/
├── app/
│   ├── (frontend)/   # Public site (App Router)
│   └── (payload)/    # Payload admin panel + REST/GraphQL routes
├── collections/      # Payload collection configs
├── components/
│   └── shared/       # Header, Footer
├── lib/              # shopify, stripe, ses, utils
├── store/            # Zustand stores (cart)
└── payload.config.ts
```

## Deployment

Push to `main` and AWS Amplify Hosting builds and deploys automatically using `amplify.yml`. All AWS CLI commands must use `--profile personal`.

## License

Source available for transparency. All rights reserved.
