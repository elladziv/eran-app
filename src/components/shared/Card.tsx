import { type ReactNode } from 'react'

interface CardProps {
  children: ReactNode
  className?: string
  style?: React.CSSProperties
  id?: string
}

export function Card({ children, className = '', style, id }: CardProps) {
  return (
    <div
      id={id}
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
