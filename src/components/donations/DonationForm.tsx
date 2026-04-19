'use client'

import { useState, useTransition } from 'react'

import {
  MAX_DONATION_USD,
  MIN_DONATION_USD,
  PRESET_AMOUNTS,
} from '@/lib/donations'
import { cn, formatCurrency } from '@/lib/utils'

type Frequency = 'one-time' | 'monthly'

export function DonationForm() {
  const [frequency, setFrequency] = useState<Frequency>('one-time')
  const [selectedAmount, setSelectedAmount] = useState<number | 'custom'>(100)
  const [customAmount, setCustomAmount] = useState('')
  const [donorEmail, setDonorEmail] = useState('')
  const [donorName, setDonorName] = useState('')
  const [tribute, setTribute] = useState<'none' | 'memory' | 'honor'>('none')
  const [tributeName, setTributeName] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const amount =
    selectedAmount === 'custom' ? Number(customAmount.replace(/[^0-9]/g, '')) : selectedAmount

  const isAmountValid =
    Number.isFinite(amount) && amount >= MIN_DONATION_USD && amount <= MAX_DONATION_USD

  const ctaLabel = isAmountValid
    ? `Donate ${formatCurrency(amount)}${frequency === 'monthly' ? ' / month' : ''}`
    : 'Choose an amount'

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)

    if (!isAmountValid) {
      setError(
        `Please enter an amount between ${formatCurrency(MIN_DONATION_USD)} and ${formatCurrency(
          MAX_DONATION_USD,
        )}.`,
      )
      return
    }

    const payload = {
      amount,
      recurring: frequency === 'monthly',
      donorEmail: donorEmail.trim() || undefined,
      donorName: donorName.trim() || undefined,
      inMemoryOf: tribute === 'memory' ? tributeName.trim() || undefined : undefined,
      inHonorOf: tribute === 'honor' ? tributeName.trim() || undefined : undefined,
    }

    startTransition(async () => {
      try {
        const res = await fetch('/api/stripe/donate', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify(payload),
        })

        if (!res.ok) {
          const data = await res.json().catch(() => ({}))
          throw new Error(data.error ?? 'Could not start checkout. Please try again.')
        }

        const { url } = (await res.json()) as { url: string }
        window.location.href = url
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Something went wrong.')
      }
    })
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-3xl border border-border bg-background p-6 shadow-sm sm:p-8"
      noValidate
    >
      <fieldset className="mb-6">
        <legend className="mb-3 text-sm font-semibold text-foreground">Frequency</legend>
        <div className="grid grid-cols-2 gap-2 rounded-full bg-muted p-1">
          {(['one-time', 'monthly'] as Frequency[]).map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setFrequency(value)}
              aria-pressed={frequency === value}
              className={cn(
                'rounded-full py-2 text-sm font-semibold transition-colors',
                frequency === value
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-foreground/60 hover:text-foreground',
              )}
            >
              {value === 'one-time' ? 'One-time' : 'Monthly'}
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset className="mb-6">
        <legend className="mb-3 text-sm font-semibold text-foreground">Amount</legend>
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
          {PRESET_AMOUNTS.map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => {
                setSelectedAmount(value)
                setCustomAmount('')
              }}
              aria-pressed={selectedAmount === value}
              className={cn(
                'rounded-xl border px-3 py-3 text-base font-semibold transition-colors',
                selectedAmount === value
                  ? 'border-primary bg-primary text-primary-foreground'
                  : 'border-border bg-background text-foreground hover:border-primary/40',
              )}
            >
              ${value}
            </button>
          ))}
          <button
            type="button"
            onClick={() => setSelectedAmount('custom')}
            aria-pressed={selectedAmount === 'custom'}
            className={cn(
              'rounded-xl border px-3 py-3 text-base font-semibold transition-colors',
              selectedAmount === 'custom'
                ? 'border-primary bg-primary text-primary-foreground'
                : 'border-border bg-background text-foreground hover:border-primary/40',
            )}
          >
            Custom
          </button>
        </div>

        {selectedAmount === 'custom' && (
          <div className="mt-3">
            <label htmlFor="custom-amount" className="sr-only">
              Custom amount in US dollars
            </label>
            <div className="flex items-center rounded-xl border border-border bg-background px-4 py-3 focus-within:border-primary">
              <span className="mr-2 text-base text-muted-foreground">$</span>
              <input
                id="custom-amount"
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                placeholder="Enter amount"
                value={customAmount}
                onChange={(e) => setCustomAmount(e.target.value.replace(/[^0-9]/g, ''))}
                className="flex-1 bg-transparent text-base text-foreground placeholder:text-muted-foreground focus:outline-none"
              />
            </div>
          </div>
        )}
      </fieldset>

      <fieldset className="mb-6">
        <legend className="mb-3 text-sm font-semibold text-foreground">
          Tribute <span className="font-normal text-muted-foreground">(optional)</span>
        </legend>
        <div className="grid grid-cols-3 gap-2">
          {(
            [
              { value: 'none', label: 'None' },
              { value: 'memory', label: 'In memory of' },
              { value: 'honor', label: 'In honor of' },
            ] as const
          ).map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setTribute(option.value)}
              aria-pressed={tribute === option.value}
              className={cn(
                'rounded-xl border px-3 py-2 text-sm font-medium transition-colors',
                tribute === option.value
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-border bg-background text-foreground hover:border-primary/40',
              )}
            >
              {option.label}
            </button>
          ))}
        </div>
        {tribute !== 'none' && (
          <div className="mt-3">
            <label htmlFor="tribute-name" className="sr-only">
              Name for tribute
            </label>
            <input
              id="tribute-name"
              type="text"
              maxLength={200}
              placeholder="Their name"
              value={tributeName}
              onChange={(e) => setTributeName(e.target.value)}
              className="w-full rounded-xl border border-border bg-background px-4 py-3 text-base text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
            />
          </div>
        )}
      </fieldset>

      <fieldset className="mb-6 grid gap-3 sm:grid-cols-2">
        <legend className="sr-only">Your details</legend>
        <div>
          <label htmlFor="donor-name" className="mb-1 block text-sm font-medium text-foreground">
            Name <span className="font-normal text-muted-foreground">(optional)</span>
          </label>
          <input
            id="donor-name"
            type="text"
            autoComplete="name"
            maxLength={120}
            value={donorName}
            onChange={(e) => setDonorName(e.target.value)}
            className="w-full rounded-xl border border-border bg-background px-4 py-3 text-base text-foreground focus:border-primary focus:outline-none"
          />
        </div>
        <div>
          <label htmlFor="donor-email" className="mb-1 block text-sm font-medium text-foreground">
            Email <span className="font-normal text-muted-foreground">(for receipt)</span>
          </label>
          <input
            id="donor-email"
            type="email"
            autoComplete="email"
            value={donorEmail}
            onChange={(e) => setDonorEmail(e.target.value)}
            className="w-full rounded-xl border border-border bg-background px-4 py-3 text-base text-foreground focus:border-primary focus:outline-none"
          />
        </div>
      </fieldset>

      {error && (
        <div
          role="alert"
          className="mb-4 rounded-xl border border-destructive/40 bg-destructive/5 px-4 py-3 text-sm text-destructive"
        >
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={isPending || !isAmountValid}
        className="w-full rounded-full bg-primary px-6 py-4 text-base font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPending ? 'Redirecting to checkout…' : ctaLabel}
      </button>
    </form>
  )
}
