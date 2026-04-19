import { cn } from '@/lib/utils'

const ASPECT_RATIO = 1194 / 578

interface LogoProps {
  /** Rendered height in pixels. Width is calculated from the logo aspect ratio. */
  height?: number
  className?: string
  /** Defaults to a descriptive label; pass an empty string when the logo is purely decorative. */
  alt?: string
}

export function Logo({
  height = 40,
  className,
  alt = "Let's Fight Glio Foundation",
}: LogoProps) {
  const width = Math.round(height * ASPECT_RATIO)

  return (
    // eslint-disable-next-line @next/next/no-img-element -- SVG: next/image would require `dangerouslyAllowSVG` and provides no optimization benefit for vector files.
    <img
      src="/logo.svg"
      alt={alt}
      width={width}
      height={height}
      className={cn('block h-auto w-auto select-none', className)}
      style={{ height, width }}
      draggable={false}
    />
  )
}
