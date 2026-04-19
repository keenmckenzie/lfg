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

export function formatDate(
  date: string | Date,
  options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' },
  locale: string = 'en-US',
): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat(locale, options).format(d)
}

export function formatDateTime(date: string | Date, locale: string = 'en-US'): string {
  return formatDate(
    date,
    { year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' },
    locale,
  )
}
