import { useState } from 'react'
import { type OrchestraCategory, type OrchestraMode, type OrchestraSlot } from '../../types'
import { buildArcSlicePath, arcMidpoint, polarToXY } from '../../utils/arcPath'
import { ORCHESTRA_CENTER_X, ORCHESTRA_CENTER_Y, ORCHESTRA_ZONE_RADII } from '../../styles/constants'

const ZONE_START_ANGLE = 180
const ZONE_END_ANGLE   = 0

const CATEGORY_COLORS: Record<OrchestraCategory, { base: string; active: string }> = {
  chorus:     { base: 'var(--color-category-chorus-edit)',     active: 'var(--color-category-chorus-play)' },
  megaphones: { base: 'var(--color-category-megaphones-edit)', active: 'var(--color-category-megaphones-play)' },
  brass:      { base: 'var(--color-category-brass-edit)',      active: 'var(--color-category-brass-play)' },
  string:     { base: 'var(--color-category-string-edit)',     active: 'var(--color-category-string-play)' },
  percussion: { base: 'var(--color-category-percussion-edit)', active: 'var(--color-category-percussion-play)' },
}

const CATEGORY_LABELS: Record<OrchestraCategory, string> = {
  chorus:     'מקהלה / מפגינים',
  megaphones: 'מגפון / מובילי מחאה',
  brass:      'כלי נשיפה',
  string:     'כלי מיתר',
  percussion: 'כלי הקשה',
}

interface ArcZoneProps {
  category: OrchestraCategory
  mode: OrchestraMode
  isSelected: boolean
  slots: OrchestraSlot[]
  onZoneClick: () => void
  onSliceClick: (slotId: string) => void
}

export function ArcZone({ category, mode, isSelected, slots, onZoneClick, onSliceClick }: ArcZoneProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [hoveredSlotId, setHoveredSlotId] = useState<string | null>(null)

  const cx = ORCHESTRA_CENTER_X
  const cy = ORCHESTRA_CENTER_Y
  const { inner: innerR, outer: outerR } = ORCHESTRA_ZONE_RADII[category]

  const colors = CATEGORY_COLORS[category]
  const fill = (mode === 'play' || isHovered || isSelected) ? colors.active : colors.base

  const numSlices = slots.length > 0 ? slots.length : 1
  const sliceSpan = (ZONE_START_ANGLE - ZONE_END_ANGLE) / numSlices

  const zoneThickness = outerR - innerR
  const fontSize = Math.max(10, Math.min(16, zoneThickness * 0.13))
  const iconSize = Math.min(48, zoneThickness * 0.38)

  const labelPt = polarToXY(cx, cy, outerR - 30, 90)

  return (
    <g
      role="button"
      aria-label={CATEGORY_LABELS[category]}
      onClick={onZoneClick}
      onMouseEnter={() => { if (mode !== 'play') setIsHovered(true) }}
      onMouseLeave={() => { setIsHovered(false); setHoveredSlotId(null) }}
      style={{ cursor: 'pointer' }}
    >
      {slots.length === 0 ? (
        <path
          d={buildArcSlicePath(cx, cy, innerR, outerR, ZONE_START_ANGLE, ZONE_END_ANGLE)}
          fill={fill}
          stroke="none"
          style={{ transition: 'fill 0.18s ease' }}
        />
      ) : (
        slots.map((slot, i) => {
          const sliceStart = ZONE_START_ANGLE - i * sliceSpan
          const sliceEnd   = ZONE_START_ANGLE - (i + 1) * sliceSpan
          const midPt = arcMidpoint(cx, cy, innerR, outerR, sliceStart, sliceEnd)
          const iconUrl = slot.video.thumbnailUrl
          const isSliceHovered = hoveredSlotId === slot.slotId && mode !== 'play'

          return (
            <g
              key={slot.slotId}
              role="button"
              aria-label={slot.video.title}
              onClick={(e) => { e.stopPropagation(); onSliceClick(slot.slotId) }}
              onMouseEnter={(e) => { e.stopPropagation(); if (mode !== 'play') setHoveredSlotId(slot.slotId) }}
              onMouseLeave={(e) => { e.stopPropagation(); setHoveredSlotId(null) }}
            >
              <title>{slot.video.title}</title>
              <path
                d={buildArcSlicePath(cx, cy, innerR, outerR, sliceStart, sliceEnd)}
                fill={fill}
                stroke="none"
                style={{ transition: 'fill 0.18s ease' }}
              />
              {iconUrl && (
                <image
                  href={iconUrl}
                  x={midPt.x - iconSize / 2}
                  y={midPt.y - iconSize / 2}
                  width={iconSize}
                  height={iconSize}
                  pointerEvents="none"
                  style={{
                    transformBox: 'fill-box',
                    transformOrigin: 'center',
                    transform: isSliceHovered ? 'scale(1.25)' : 'scale(1)',
                    opacity: isSliceHovered ? 1 : 0.82,
                    transition: 'transform 0.18s ease, opacity 0.18s ease',
                  }}
                />
              )}
            </g>
          )
        })
      )}

      <text
        x={labelPt.x}
        y={labelPt.y}
        textAnchor="middle"
        dominantBaseline="auto"
        fontSize={fontSize}
        fontWeight={isSelected ? '700' : '500'}
        fill={isSelected ? 'var(--color-text-dark-brown)' : 'var(--color-text-primary)'}
        pointerEvents="none"
        style={{ fontFamily: 'Urbani, sans-serif', transition: 'all 0.18s ease' }}
      >
        {CATEGORY_LABELS[category]}
      </text>
    </g>
  )
}
