import { z } from 'zod'

export const PRESET_AMOUNTS = [25, 50, 100, 250, 500] as const

export const MIN_DONATION_USD = 1
export const MAX_DONATION_USD = 100_000

export const donateSchema = z.object({
  amount: z
    .number()
    .int('Amount must be a whole dollar value.')
    .min(MIN_DONATION_USD, `Minimum donation is $${MIN_DONATION_USD}.`)
    .max(MAX_DONATION_USD, `Maximum donation is $${MAX_DONATION_USD.toLocaleString()}.`),
  recurring: z.boolean().default(false),
  donorEmail: z.string().email().optional().or(z.literal('').transform(() => undefined)),
  donorName: z.string().max(120).optional().or(z.literal('').transform(() => undefined)),
  inMemoryOf: z.string().max(200).optional().or(z.literal('').transform(() => undefined)),
  inHonorOf: z.string().max(200).optional().or(z.literal('').transform(() => undefined)),
})

export type DonateInput = z.infer<typeof donateSchema>
