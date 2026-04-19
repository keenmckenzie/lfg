import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}

export function formatCurrency(
  amount: number,
  currency: string = 'USD',
  locale: string = 'en-US',
): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  }).format(amount)
}

export function centsToDollars(cents: number): number {
  return Math.round(cents) / 100
}

export function formatCents(cents: number, currency: string = 'USD'): string {
  return formatCurrency(centsToDollars(cents), currency)
}
