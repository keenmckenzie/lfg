'use client'

import { cn } from '@/lib/utils'
import type { ProductOption, ProductVariant } from '@/lib/shopify/types'

interface VariantPickerProps {
  options: ProductOption[]
  variants: ProductVariant[]
  selectedOptions: Record<string, string>
  onOptionChange: (name: string, value: string) => void
}

/**
 * Disables option values that would combine with the current selection to
 * produce an out-of-stock or non-existent variant. This is a simplification of
 * Shopify's official "combined listings" algorithm — it covers the common case
 * of single-axis variance (e.g. Size only) cleanly.
 */
function isOptionValueAvailable(
  optionName: string,
  optionValue: string,
  selectedOptions: Record<string, string>,
  variants: ProductVariant[],
): boolean {
  const candidate = { ...selectedOptions, [optionName]: optionValue }
  return variants.some(
    (variant) =>
      variant.availableForSale &&
      variant.selectedOptions.every((opt) => candidate[opt.name] === opt.value),
  )
}

export function VariantPicker({
  options,
  variants,
  selectedOptions,
  onOptionChange,
}: VariantPickerProps) {
  if (options.length === 0) return null
  // Shopify returns a single "Title" option for products without real variants.
  if (options.length === 1 && options[0].name === 'Title' && options[0].values.length === 1) {
    return null
  }

  return (
    <div className="space-y-4">
      {options.map((option) => (
        <fieldset key={option.id} className="space-y-2">
          <legend className="text-sm font-medium text-foreground">
            {option.name}
            {selectedOptions[option.name] ? (
              <span className="ml-2 text-muted-foreground">
                — {selectedOptions[option.name]}
              </span>
            ) : null}
          </legend>
          <div className="flex flex-wrap gap-2">
            {option.values.map((value) => {
              const isSelected = selectedOptions[option.name] === value
              const isAvailable = isOptionValueAvailable(
                option.name,
                value,
                selectedOptions,
                variants,
              )
              return (
                <button
                  key={value}
                  type="button"
                  onClick={() => onOptionChange(option.name, value)}
                  aria-pressed={isSelected}
                  disabled={!isAvailable}
                  className={cn(
                    'rounded-full border px-4 py-1.5 text-sm transition-colors',
                    'focus-visible:outline-2 focus-visible:outline-primary',
                    isSelected
                      ? 'border-primary bg-primary text-primary-foreground'
                      : 'border-border bg-background text-foreground hover:border-primary',
                    !isAvailable && 'cursor-not-allowed opacity-40 line-through',
                  )}
                >
                  {value}
                </button>
              )
            })}
          </div>
        </fieldset>
      ))}
    </div>
  )
}
