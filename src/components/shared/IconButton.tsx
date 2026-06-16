import { type ReactNode } from 'react'

interface IconButtonProps {
  onClick?: () => void
  children: ReactNode
  className?: string
  title?: string
  disabled?: boolean
}

export function IconButton({ onClick, children, className = '', title, disabled }: IconButtonProps) {
  return (
    <button
      onClick={onClick}
      title={title}
      disabled={disabled}
      className={`flex items-center justify-center rounded-full transition-opacity hover:opacity-70 active:opacity-50 disabled:opacity-30 disabled:cursor-not-allowed ${className}`}
    >
      {children}
    </button>
  )
}
