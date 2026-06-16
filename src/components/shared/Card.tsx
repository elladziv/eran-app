import { type ReactNode } from 'react'

interface CardProps {
  children: ReactNode
  className?: string
  style?: React.CSSProperties
}

export function Card({ children, className = '', style }: CardProps) {
  return (
    <div
      className={`rounded-xl ${className}`}
      style={{
        backgroundColor: 'var(--color-surface-card)',
        boxShadow: '1px 1px 20px rgba(0,0,0,0.15)',
        ...style,
      }}
    >
      {children}
    </div>
  )
}
