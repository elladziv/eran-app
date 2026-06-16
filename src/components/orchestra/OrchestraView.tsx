import { useAppStore } from '../../store/useAppStore'
import { type OrchestraCategory } from '../../types'
import { ORCHESTRA_CENTER_X, ORCHESTRA_CENTER_Y, ORCHESTRA_ZONE_RADII } from '../../styles/constants'
import { buildArcSlicePath } from '../../utils/arcPath'
import { ArcZone } from './ArcZone'

// innermost → outermost; rendering uses .reverse() so outer draws first (behind inner)
const CATEGORIES: OrchestraCategory[] = ['megaphones', 'whistles', 'brass', 'percussion', 'chorus']

const SVG_VIEWBOX = '0 160 1366 740'

export function OrchestraView() {
  const selectedCategory = useAppStore((s) => s.selectedCategory)
  const orchestraMode    = useAppStore((s) => s.orchestraMode)
  const orchestraSlots   = useAppStore((s) => s.orchestraSlots)
  const selectCategory   = useAppStore((s) => s.selectCategory)
  const setOrchestraMode = useAppStore((s) => s.setOrchestraMode)
  const previewVideo     = useAppStore((s) => s.previewVideo)

  const cx = ORCHESTRA_CENTER_X
  const cy = ORCHESTRA_CENTER_Y

  const outerMost = ORCHESTRA_ZONE_RADII['chorus'].outer

  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
      <button
        onClick={() => setOrchestraMode(orchestraMode === 'edit' ? 'play' : 'edit')}
        className="absolute top-3 start-3 z-10 rounded-full text-sm font-medium transition-all"
        style={{
          padding: '4px 12px',
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
        <path
          d={buildArcSlicePath(cx, cy, outerMost + 2, outerMost + 18, 180, 0)}
          fill="var(--color-surface-card)"
          stroke="var(--color-border-soft)"
          strokeWidth={1}
          opacity={0.6}
        />

        {[...CATEGORIES].reverse().map((category) => {
          const slotsInZone = orchestraSlots.filter((s) => s.category === category)
          return (
            <ArcZone
              key={category}
              category={category}
              mode={orchestraMode}
              isSelected={selectedCategory === category}
              slots={slotsInZone}
              onZoneClick={() => {
                selectCategory(selectedCategory === category ? null : category)
              }}
              onSliceClick={(slotId) => {
                const slot = orchestraSlots.find((s) => s.slotId === slotId)
                if (slot) previewVideo(slot.video.id)
              }}
            />
          )
        })}

        <circle
          cx={cx}
          cy={cy}
          r={8}
          fill="var(--color-accent-brown)"
          opacity={0.5}
        />

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
