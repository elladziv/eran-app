import { useAppStore } from '../../store/useAppStore'
import { BOTTOM_PANEL_HEIGHT } from '../../styles/constants'
import { Badge } from '../shared/Badge'

export function BottomPanel() {
  const orchestraSlots      = useAppStore((s) => s.orchestraSlots)
  const removeFromOrchestra = useAppStore((s) => s.removeFromOrchestra)

  return (
    <div
      id="bottom-panel"
      className="w-full px-5 flex items-center gap-4"
      style={{
        minHeight: BOTTOM_PANEL_HEIGHT,
        backgroundColor: 'var(--color-surface-inner)',
        borderTop: '1px solid var(--color-surface-card)',
        flexShrink: 0,
      }}
    >
      <div className="flex items-center gap-2 shrink-0">
        <Badge
          label="2"
          className="text-white"
          style={{
            backgroundColor: 'var(--color-text-primary)',
            width: 28,
            height: 28,
            fontSize: 14,
            fontWeight: 700,
          } as React.CSSProperties}
        />
        <span
          className="text-sm font-medium"
          style={{ color: 'var(--color-text-secondary)' }}
        >
          הרכב שנבחר
        </span>
      </div>

      <div className="flex-1 overflow-x-auto">
        {orchestraSlots.length === 0 ? (
          <span className="text-sm" style={{ color: 'var(--color-border-soft)' }}>
            בחר סרטון ממפת התזמורת להוספה
          </span>
        ) : (
          <div className="flex items-center gap-2 py-1" style={{ direction: 'ltr' }}>
            {orchestraSlots.map((slot) => (
              <div
                key={slot.slotId}
                className="flex items-center gap-2 rounded-full px-3 py-1.5 text-sm shrink-0"
                style={{
                  backgroundColor: 'var(--color-surface-card)',
                  color: 'var(--color-text-primary)',
                  fontWeight: 500,
                }}
              >
                <span>{slot.video.title}</span>
                <span className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
                  {slot.video.countryLabel}
                </span>
                <button
                  onClick={() => removeFromOrchestra(slot.slotId)}
                  className="ms-1 opacity-50 hover:opacity-100 transition-opacity"
                  style={{ color: 'var(--color-text-primary)', fontSize: 14 }}
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
