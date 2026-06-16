import { useAppStore } from '../../store/useAppStore'
import { INSTRUMENTS } from '../../data/instruments'
import { VideoPlayer } from './VideoPlayer'
import { InstrumentCard } from './InstrumentCard'

export function RightPanel() {
  const selectedCategory    = useAppStore((s) => s.selectedCategory)
  const selectedCountry     = useAppStore((s) => s.selectedCountry)
  const previewedId         = useAppStore((s) => s.previewedInstrumentId)
  const orchestra           = useAppStore((s) => s.orchestra)

  // Filter instruments by active selection
  const visibleInstruments = INSTRUMENTS.filter((inst) => {
    if (selectedCategory) return inst.category === selectedCategory
    if (selectedCountry)  return inst.country  === selectedCountry
    return true
  })

  // Determine which instrument to show in the video player
  const previewedInstrument =
    INSTRUMENTS.find((i) => i.id === previewedId) ??
    (visibleInstruments.length === 1 ? visibleInstruments[0] : null)

  // Label for the instrument list section
  const listLabel = selectedCategory
    ? 'כלים בקטגוריה'
    : selectedCountry
      ? 'כלים מהמדינה'
      : 'כל הכלים'

  return (
    <div className="flex flex-col h-full">
      {/* Video player — 4:3 */}
      <VideoPlayer instrument={previewedInstrument} />

      {/* List label */}
      <div
        className="px-4 py-2 text-xs font-semibold shrink-0"
        style={{
          color: 'var(--color-text-secondary)',
          borderBottom: '1px solid var(--color-surface-card)',
          letterSpacing: '0.05em',
        }}
      >
        {listLabel}
      </div>

      {/* Instrument list */}
      <div className="flex-1 overflow-y-auto">
        {visibleInstruments.length === 0 ? (
          <div
            className="p-4 text-xs"
            style={{ color: 'var(--color-border-soft)' }}
          >
            אין כלים להצגה
          </div>
        ) : (
          visibleInstruments.map((inst) => {
            const orchestraEntry = orchestra.find((s) => s.instrument.id === inst.id)
            const zoneCount = orchestra.filter(
              (s) => s.instrument.category === inst.category,
            ).length
            return (
              <InstrumentCard
                key={inst.id}
                instrument={inst}
                isPreviewed={previewedId === inst.id}
                isInOrchestra={!!orchestraEntry}
                orchestraCount={zoneCount}
              />
            )
          })
        )}
      </div>
    </div>
  )
}
