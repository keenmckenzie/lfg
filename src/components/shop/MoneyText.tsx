import { formatCurrency } from '@/lib/utils'
import type { Money } from '@/lib/shopify/types'

interface MoneyTextProps {
  value: Money
  className?: string
}

export function MoneyText({ value, className }: MoneyTextProps) {
  const amount = Number.parseFloat(value.amount)
  return <span className={className}>{formatCurrency(amount, value.currencyCode)}</span>
}
