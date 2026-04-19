import type { ReactNode } from 'react'

interface PageHeaderProps {
  eyebrow?: string
  title: string
  description?: string
  children?: ReactNode
  align?: 'left' | 'center'
}

export function PageHeader({
  eyebrow,
  title,
  description,
  children,
  align = 'center',
}: PageHeaderProps) {
  const isCenter = align === 'center'
  return (
    <header className={isCenter ? 'mx-auto max-w-3xl text-center' : 'max-w-3xl'}>
      {eyebrow && (
        <p className="text-sm font-semibold uppercase tracking-widest text-primary">{eyebrow}</p>
      )}
      <h1 className="mt-3 text-balance text-4xl font-bold tracking-tight sm:text-5xl">
        {title}
      </h1>
      {description && (
        <p
          className={`mt-5 text-pretty text-base text-muted-foreground sm:text-lg ${
            isCenter ? 'mx-auto max-w-2xl' : ''
          }`}
        >
          {description}
        </p>
      )}
      {children && <div className="mt-8">{children}</div>}
    </header>
  )
}
