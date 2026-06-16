import { type OrchestraCategory, type OrchestraMode, type SelectedInstrument } from '../../types'
import { buildArcSlicePath, arcMidpoint, polarToXY } from '../../utils/arcPath'
import { ORCHESTRA_CENTER_X, ORCHESTRA_CENTER_Y, ORCHESTRA_ZONE_RADII } from '../../styles/constants'

const ZONE_START_ANGLE = 180
const ZONE_END_ANGLE   = 0

const CATEGORY_COLORS: Record<OrchestraCategory, { edit: string; play: string }> = {
  voice:      { edit: 'var(--color-category-voice-edit)',      play: 'var(--color-category-voice-play)' },
  strings:    { edit: 'var(--color-category-strings-edit)',    play: 'var(--color-category-strings-play)' },
  wind:       { edit: 'var(--color-category-wind-edit)',       play: 'var(--color-category-wind-play)' },
  brass:      { edit: 'var(--color-category-brass-edit)',      play: 'var(--color-category-brass-play)' },
  percussion: { edit: 'var(--color-category-percussion-edit)', play: 'var(--color-category-percussion-play)' },
}

const CATEGORY_LABELS: Record<OrchestraCategory, string> = {
  voice:      'קול / שירה',
  strings:    'כלי מיתר',
  wind:       'כלי נשיפה',
  brass:      'כלי נחושת',
  percussion: 'כלי הקשה',
}

interface ArcZoneProps {
  category: OrchestraCategory
  mode: OrchestraMode
  isSelected: boolean
  instruments: SelectedInstrument[]
  onZoneClick: () => void
  onSliceClick: (trackId: string) => void
}

export function ArcZone({ category, mode, isSelected, instruments, onZoneClick, onSliceClick }: ArcZoneProps) {
  const cx = ORCHESTRA_CENTER_X
  const cy = ORCHESTRA_CENTER_Y
  const { inner: innerR, outer: outerR } = ORCHESTRA_ZONE_RADII[category]

  const fill = CATEGORY_COLORS[category][mode]
  const strokeColor = 'var(--color-border-soft)'
  const selectedStroke = 'var(--color-accent-brown)'

  const numSlices = instruments.length > 0 ? instruments.length : 1
  const sliceSpan = (ZONE_START_ANGLE - ZONE_END_ANGLE) / numSlices // degrees per slice

  const midR = innerR + (outerR - innerR) * 0.5
  // Label position: at 90° (top of arc) for a full-zone label
  const labelPt = polarToXY(cx, cy, midR, 90)

  // Font size scales with zone thickness
  const zoneThickness = outerR - innerR
  const fontSize = Math.max(10, Math.min(16, zoneThickness * 0.13))

  return (
    <g
      role="button"
      aria-label={CATEGORY_LABELS[category]}
      onClick={onZoneClick}
      style={{ cursor: 'pointer' }}
    >
      {instruments.length === 0 ? (
        // Empty zone — single arc
        <path
          d={buildArcSlicePath(cx, cy, innerR, outerR, ZONE_START_ANGLE, ZONE_END_ANGLE)}
          fill={fill}
          stroke={isSelected ? selectedStroke : strokeColor}
          strokeWidth={isSelected ? 2.5 : 1}
          opacity={isSelected ? 1 : 0.85}
          style={{ transition: 'all 0.2s ease' }}
        />
      ) : (
        // Sliced zone — one segment per instrument
        instruments.map((sel, i) => {
          const sliceStart = ZONE_START_ANGLE - i * sliceSpan
          const sliceEnd   = ZONE_START_ANGLE - (i + 1) * sliceSpan
          const midPt = arcMidpoint(cx, cy, innerR, outerR, sliceStart, sliceEnd)
          return (
            <g
              key={sel.trackId}
              role="button"
              aria-label={sel.instrument.name}
              onClick={(e) => { e.stopPropagation(); onSliceClick(sel.trackId) }}
            >
              <path
                d={buildArcSlicePath(cx, cy, innerR, outerR, sliceStart, sliceEnd)}
                fill={fill}
                stroke={isSelected ? selectedStroke : strokeColor}
                strokeWidth={1.5}
                opacity={isSelected ? 1 : 0.9}
                style={{ transition: 'all 0.2s ease' }}
              />
              {/* Instrument name inside the slice */}
              <text
                x={midPt.x}
                y={midPt.y}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize={fontSize * 0.85}
                fontWeight="600"
                fill="var(--color-text-dark-brown)"
                pointerEvents="none"
                style={{ fontFamily: 'Urbani, sans-serif' }}
              >
                {sel.instrument.name}
              </text>
            </g>
          )
        })
      )}

      {/* Zone label (shown when no instruments or as overlay) */}
      {instruments.length === 0 && (
        <text
          x={labelPt.x}
          y={labelPt.y}
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize={fontSize}
          fontWeight={isSelected ? '700' : '500'}
          fill={isSelected ? 'var(--color-accent-brown)' : 'var(--color-text-primary)'}
          pointerEvents="none"
          style={{ fontFamily: 'Urbani, sans-serif', transition: 'all 0.2s ease' }}
        >
          {CATEGORY_LABELS[category]}
        </text>
      )}
    </g>
  )
}
