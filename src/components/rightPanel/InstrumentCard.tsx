import { type Instrument } from '../../types'
import { useAppStore } from '../../store/useAppStore'
import { ORCHESTRA_MAX_PER_ZONE } from '../../styles/constants'

interface InstrumentCardProps {
  instrument: Instrument
  isPreviewed: boolean
  isInOrchestra: boolean
  orchestraCount: number
}

export function InstrumentCard({ instrument, isPreviewed, isInOrchestra, orchestraCount }: InstrumentCardProps) {
  const addToOrchestra  = useAppStore((s) => s.addToOrchestra)
  const previewInstrument = useAppStore((s) => s.previewInstrument)
  const atZoneMax = orchestraCount >= ORCHESTRA_MAX_PER_ZONE

  const handlePreview = () => previewInstrument(isPreviewed ? null : instrument.id)
  const handleAdd     = () => { if (!isInOrchestra && !atZoneMax) addToOrchestra(instrument) }

  return (
    <div
      onClick={handlePreview}
      role="button"
      aria-pressed={isPreviewed}
      className="flex items-center gap-3 px-4 py-3 transition-colors"
      style={{
        backgroundColor: isPreviewed ? 'var(--color-surface-card)' : 'transparent',
        cursor: 'pointer',
        borderBottom: '1px solid var(--color-surface-card)',
      }}
    >
      {/* Country label */}
      <span
        className="text-xs shrink-0"
        style={{ color: 'var(--color-text-secondary)', minWidth: 40 }}
      >
        {instrument.countryLabel}
      </span>

      {/* Instrument name */}
      <span
        className="flex-1 text-sm font-medium"
        style={{ color: 'var(--color-text-primary)' }}
      >
        {instrument.name}
      </span>

      {/* Add / In-orchestra button */}
      <button
        onClick={(e) => { e.stopPropagation(); handleAdd() }}
        disabled={isInOrchestra || atZoneMax}
        className="shrink-0 rounded-full text-xs font-semibold transition-all px-3 py-1"
        style={{
          backgroundColor: isInOrchestra
            ? 'var(--color-surface-card)'
            : atZoneMax
              ? 'transparent'
              : 'var(--color-accent-brown)',
          color: isInOrchestra
            ? 'var(--color-text-secondary)'
            : atZoneMax
              ? 'var(--color-border-soft)'
              : 'var(--color-surface-inner)',
          border: atZoneMax && !isInOrchestra ? '1px solid var(--color-border-soft)' : 'none',
          cursor: isInOrchestra || atZoneMax ? 'not-allowed' : 'pointer',
          opacity: atZoneMax && !isInOrchestra ? 0.5 : 1,
        }}
      >
        {isInOrchestra ? 'נוסף' : '+'}
      </button>
    </div>
  )
}
