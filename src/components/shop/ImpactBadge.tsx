import { cn } from '@/lib/utils'

interface ImpactBadgeProps {
  className?: string
}

export function ImpactBadge({ className }: ImpactBadgeProps) {
  return (
    <p
      className={cn(
        'inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-medium text-primary',
        className,
      )}
    >
      <span
        aria-hidden
        className="inline-block h-1.5 w-1.5 rounded-full bg-primary"
      />
      Profits fund glioblastoma research
    </p>
  )
}
