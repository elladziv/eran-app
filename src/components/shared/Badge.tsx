interface BadgeProps {
  label: string | number
  className?: string
}

export function Badge({ label, className = '' }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center justify-center rounded-full text-xs font-bold leading-none ${className}`}
      style={{ minWidth: '1.4em', minHeight: '1.4em', padding: '0 4px' }}
    >
      {label}
    </span>
  )
}
