import { BOTTOM_BAR_HEIGHT } from '../../styles/constants'

interface ComposerTriggerBarProps {
  isOpen: boolean
  onToggle: () => void
}

export function ComposerTriggerBar({ isOpen, onToggle }: ComposerTriggerBarProps) {
  return (
    <button
      onClick={onToggle}
      className="w-full flex items-center justify-center gap-3 transition-opacity hover:opacity-80"
      style={{
        height: BOTTOM_BAR_HEIGHT,
        backgroundColor: 'var(--color-composer-bg)',
        color: 'var(--color-surface-inner)',
        fontWeight: 500,
        fontSize: 15,
        flexShrink: 0,
      }}
    >
      {/* Chevron indicator */}
      <span
        className="text-lg transition-transform duration-300"
        style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
      >
        ›
      </span>
      <span>{isOpen ? 'סגרו את הסיקוונסר' : 'פתחו את הסיקוונסר למצב נגינה'}</span>
    </button>
  )
}
