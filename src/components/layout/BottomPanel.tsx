import { useAppStore } from '../../store/useAppStore'
import { BOTTOM_PANEL_HEIGHT } from '../../styles/constants'
import { Badge } from '../shared/Badge'

export function BottomPanel() {
  const orchestra         = useAppStore((s) => s.orchestra)
  const removeFromOrchestra = useAppStore((s) => s.removeFromOrchestra)

  return (
    <div
      className="w-full px-6 flex items-center gap-4"
      style={{
        minHeight: BOTTOM_PANEL_HEIGHT,
        backgroundColor: 'var(--color-surface-inner)',
        borderTop: '1px solid var(--color-surface-card)',
        flexShrink: 0,
      }}
    >
      {/* Step indicator */}
      <div className="flex items-center gap-2 shrink-0">
        <Badge
          label="2"
          className="text-white"
          style={{
            backgroundColor: 'var(--color-text-primary)',
            width: 26,
            height: 26,
            fontSize: 13,
            fontWeight: 700,
          } as React.CSSProperties}
        />
        <span
          className="text-xs font-medium"
          style={{ color: 'var(--color-text-secondary)' }}
        >
          הרכב שנבחר
        </span>
      </div>

      {/* Instrument chips scroll area */}
      <div className="flex-1 overflow-x-auto">
        {orchestra.length === 0 ? (
          <span
            className="text-xs"
            style={{ color: 'var(--color-border-soft)' }}
          >
            בחר כלי נגינה להוסיף לתזמורת
          </span>
        ) : (
          <div className="flex items-center gap-2 py-1" style={{ direction: 'ltr' }}>
            {orchestra.map((sel) => (
              <div
                key={sel.trackId}
                className="flex items-center gap-2 rounded-full px-3 py-1 text-xs shrink-0"
                style={{
                  backgroundColor: 'var(--color-surface-card)',
                  color: 'var(--color-text-primary)',
                  fontWeight: 500,
                }}
              >
                <span>{sel.instrument.name}</span>
                <span
                  className="text-xs"
                  style={{ color: 'var(--color-text-secondary)' }}
                >
                  {sel.instrument.countryLabel}
                </span>
                <button
                  onClick={() => removeFromOrchestra(sel.trackId)}
                  className="ms-1 opacity-50 hover:opacity-100 transition-opacity"
                  style={{ color: 'var(--color-text-primary)', fontSize: 12 }}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
