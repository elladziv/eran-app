import { useAppStore } from "../../store/useAppStore";
import { BOTTOM_PANEL_HEIGHT } from "../../styles/constants";
import { type Country } from "../../types";

const COUNTRY_LABELS: Record<Country, string> = {
  syria:     'סוריה',
  lebanon:   'לבנון',
  israel:    'ישראל',
  palestine: 'פלסטין',
  jordan:    'ירדן',
  egypt:     'מצרים',
  iraq:      'עיראק',
  turkey:    'טורקיה',
  iran:      'איראן',
}

export function BottomPanel() {
  const selectedSlots       = useAppStore((s) => s.selectedSlots)
  const removeFromSelection = useAppStore((s) => s.removeFromSelection)
  const selectedCountry     = useAppStore((s) => s.selectedCountry)
  const selectCountry       = useAppStore((s) => s.selectCountry)

  const totalCount = selectedSlots.length + (selectedCountry ? 1 : 0)
  const isEmpty = totalCount === 0

  return (
    <div
      id="bottom-panel"
      className="w-full px-5 flex items-center gap-4"
      style={{
        minHeight: BOTTOM_PANEL_HEIGHT,
        backgroundColor: "var(--color-surface-inner)",
        borderTop: "1px solid var(--color-surface-card)",
        flexShrink: 0,
      }}
    >
      <div className="flex items-center gap-2 shrink-0">
        <span
          className="text-sm font-medium"
          style={{ color: "var(--color-text-secondary)" }}
        >
          הרכב שנבחר
        </span>
        {totalCount > 0 && (
          <span
            className="text-xs rounded-full px-1.5 py-0.5 font-semibold"
            style={{
              backgroundColor: "var(--color-accent-brown)",
              color: "var(--color-surface-inner)",
            }}
          >
            {totalCount}
          </span>
        )}
      </div>

      <div className="flex-1 overflow-x-auto">
        {isEmpty ? (
          <span className="text-sm" style={{ color: "var(--color-border-soft)" }}>
            לחץ על כלי בתזמורת או מדינה במפה להוספה להרכב
          </span>
        ) : (
          <div className="flex items-center gap-2 py-1" style={{ direction: "ltr" }}>

            {/* Country chip */}
            {selectedCountry && (
              <div
                className="flex items-center gap-2 rounded-full px-3 py-1.5 text-sm shrink-0"
                style={{
                  backgroundColor: "var(--color-surface-card)",
                  color: "var(--color-text-primary)",
                  fontWeight: 500,
                  border: "1px solid var(--color-border-soft)",
                }}
              >
                <span>📍 {COUNTRY_LABELS[selectedCountry]}</span>
                <button
                  onClick={() => selectCountry(null)}
                  className="ms-1 opacity-60 hover:opacity-100 transition-opacity"
                  style={{ color: "var(--color-text-primary)", fontSize: 18, lineHeight: 1 }}
                >
                  ×
                </button>
              </div>
            )}

            {/* Instrument chips */}
            {selectedSlots.map((slot) => (
              <div
                key={slot.slotId}
                className="flex items-center gap-2 rounded-full px-3 py-1.5 text-sm shrink-0"
                style={{
                  backgroundColor: `var(--color-category-${slot.category}-edit)`,
                  color: "var(--color-text-primary)",
                  fontWeight: 500,
                }}
              >
                <span>{slot.video.title}</span>
                <button
                  onClick={() => removeFromSelection(slot.slotId)}
                  className="ms-1 opacity-60 hover:opacity-100 transition-opacity"
                  style={{ color: "var(--color-text-primary)", fontSize: 18, lineHeight: 1 }}
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
