import Stripe from 'stripe'

const secretKey = process.env.STRIPE_SECRET_KEY

if (!secretKey && process.env.NODE_ENV === 'production') {
  throw new Error('STRIPE_SECRET_KEY is not set. Donations will not work.')
}

export const stripe = new Stripe(secretKey ?? 'sk_test_placeholder', {
  apiVersion: '2026-03-25.dahlia',
  typescript: true,
  appInfo: {
    name: "Let's Fight Glio",
    url: process.env.NEXT_PUBLIC_SERVER_URL ?? 'http://localhost:3000',
  },
})
