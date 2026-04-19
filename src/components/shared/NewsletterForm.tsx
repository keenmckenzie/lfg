'use client'

import { useState, type FormEvent } from 'react'

type Status = 'idle' | 'submitting' | 'success' | 'error'

interface NewsletterFormProps {
  variant?: 'inline' | 'stacked'
}

export function NewsletterForm({ variant = 'inline' }: NewsletterFormProps) {
  const [status, setStatus] = useState<Status>('idle')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setStatus('submitting')
    setErrorMessage(null)

    const formData = new FormData(event.currentTarget)
    const payload = {
      email: String(formData.get('email') ?? ''),
      firstName: String(formData.get('firstName') ?? ''),
    }

    try {
      const response = await fetch('/api/subscribers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const json = await response.json().catch(() => ({}))
      if (!response.ok) {
        throw new Error(json?.error ?? 'Could not subscribe.')
      }
      setStatus('success')
      event.currentTarget.reset()
    } catch (error) {
      setStatus('error')
      setErrorMessage(error instanceof Error ? error.message : 'Could not subscribe.')
    }
  }

  if (status === 'success') {
    return (
      <p className="text-sm text-foreground">
        Thanks — check your inbox for a welcome note.
      </p>
    )
  }

  const isInline = variant === 'inline'

  return (
    <form
      onSubmit={handleSubmit}
      className={isInline ? 'flex w-full flex-col gap-2 sm:flex-row sm:items-center' : 'space-y-3'}
      noValidate
    >
      {variant === 'stacked' && (
        <input
          type="text"
          name="firstName"
          placeholder="First name (optional)"
          autoComplete="given-name"
          className={inputClass}
        />
      )}
      <input
        type="email"
        name="email"
        required
        placeholder="you@example.com"
        autoComplete="email"
        aria-label="Email address"
        className={`${inputClass} flex-1`}
      />
      <button
        type="submit"
        disabled={status === 'submitting'}
        className="inline-flex items-center justify-center rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-60"
      >
        {status === 'submitting' ? 'Joining…' : 'Subscribe'}
      </button>
      {status === 'error' && errorMessage && (
        <p role="alert" className="basis-full text-xs text-destructive sm:mt-1">
          {errorMessage}
        </p>
      )}
    </form>
  )
}

const inputClass =
  'block w-full rounded-full border border-border bg-background px-4 py-2 text-sm text-foreground shadow-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30'
