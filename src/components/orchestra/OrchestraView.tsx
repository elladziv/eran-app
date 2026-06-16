import { useAppStore } from '../../store/useAppStore'
import { type OrchestraCategory } from '../../types'
import { ORCHESTRA_CENTER_X, ORCHESTRA_CENTER_Y, ORCHESTRA_ZONE_RADII } from '../../styles/constants'
import { buildArcSlicePath } from '../../utils/arcPath'
import { ArcZone } from './ArcZone'

const CATEGORIES: OrchestraCategory[] = ['voice', 'strings', 'wind', 'brass', 'percussion']

// Viewbox: shows the full semicircle with some breathing room above
const SVG_VIEWBOX = '0 160 1366 740'

export function OrchestraView() {
  const selectedCategory  = useAppStore((s) => s.selectedCategory)
  const orchestraMode     = useAppStore((s) => s.orchestraMode)
  const orchestra         = useAppStore((s) => s.orchestra)
  const selectCategory    = useAppStore((s) => s.selectCategory)
  const setOrchestraMode  = useAppStore((s) => s.setOrchestraMode)
  const previewInstrument = useAppStore((s) => s.previewInstrument)

  const cx = ORCHESTRA_CENTER_X
  const cy = ORCHESTRA_CENTER_Y

  // Outer boundary of the entire orchestra (for a decorative outer ring)
  const outerMost = ORCHESTRA_ZONE_RADII['percussion'].outer

  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
      {/* Mode toggle — top right corner */}
      <button
        onClick={() => setOrchestraMode(orchestraMode === 'edit' ? 'play' : 'edit')}
        className="absolute top-3 left-3 z-10 rounded-full px-3 py-1 text-xs font-medium transition-all"
        style={{
          backgroundColor: orchestraMode === 'play'
            ? 'var(--color-accent-brown)'
            : 'var(--color-surface-card)',
          color: orchestraMode === 'play'
            ? 'var(--color-surface-inner)'
            : 'var(--color-text-secondary)',
          border: '1px solid var(--color-border-soft)',
        }}
      >
        {orchestraMode === 'play' ? 'מצב נגינה' : 'מצב עריכה'}
      </button>
      <svg
        viewBox={SVG_VIEWBOX}
        preserveAspectRatio="xMidYMax meet"
        className="w-full h-full"
        style={{ display: 'block' }}
      >
        {/* Decorative background arc (faint outer ring) */}
        <path
          d={buildArcSlicePath(cx, cy, outerMost + 2, outerMost + 18, 180, 0)}
          fill="var(--color-surface-card)"
          stroke="var(--color-border-soft)"
          strokeWidth={1}
          opacity={0.6}
        />

        {/* Zone arcs — rendered outermost first so inner zones render on top */}
        {[...CATEGORIES].reverse().map((category) => {
          const instrumentsInZone = orchestra.filter(
            (s) => s.instrument.category === category,
          )
          return (
            <ArcZone
              key={category}
              category={category}
              mode={orchestraMode}
              isSelected={selectedCategory === category}
              instruments={instrumentsInZone}
              onZoneClick={() => {
                selectCategory(selectedCategory === category ? null : category)
              }}
              onSliceClick={(trackId) => {
                const sel = orchestra.find((s) => s.trackId === trackId)
                if (sel) previewInstrument(sel.instrument.id)
              }}
            />
          )
        })}

        {/* Zone boundary rings (visual separators between zones) */}
        {CATEGORIES.map((category) => {
          const { inner: innerR } = ORCHESTRA_ZONE_RADII[category]
          if (innerR === 0) return null
          return (
            <path
              key={`sep-${category}`}
              d={buildArcSlicePath(cx, cy, innerR - 1.5, innerR + 1.5, 180, 0)}
              fill="var(--color-surface-inner)"
              opacity={0.9}
              pointerEvents="none"
            />
          )
        })}

        {/* Center dot (conductor position) */}
        <circle
          cx={cx}
          cy={cy}
          r={8}
          fill="var(--color-accent-brown)"
          opacity={0.5}
        />

        {/* Horizontal baseline */}
        <line
          x1={cx - outerMost - 30}
          y1={cy}
          x2={cx + outerMost + 30}
          y2={cy}
          stroke="var(--color-border-soft)"
          strokeWidth={1.5}
          opacity={0.4}
        />
      </svg>
    </div>
  )
}
