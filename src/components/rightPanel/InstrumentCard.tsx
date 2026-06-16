import { type VideoFile, type OrchestraCategory } from '../../types'
import { useAppStore } from '../../store/useAppStore'
import { ORCHESTRA_MAX_PER_ZONE } from '../../styles/constants'

interface VideoCardProps {
  video: VideoFile
  targetCategory: OrchestraCategory | null
  isPreviewed: boolean
}

export function InstrumentCard({ video, targetCategory, isPreviewed }: VideoCardProps) {
  const previewVideo    = useAppStore((s) => s.previewVideo)
  const addToOrchestra  = useAppStore((s) => s.addToOrchestra)
  const orchestraSlots  = useAppStore((s) => s.orchestraSlots)
  const previewedVideoId = useAppStore((s) => s.previewedVideoId)

  // Determine which category to add this video into
  const addCategory: OrchestraCategory | null =
    targetCategory && video.categories.includes(targetCategory)
      ? targetCategory
      : video.categories[0] ?? null

  const isInOrchestra = orchestraSlots.some(
    (s) => s.video.id === video.id && s.category === addCategory,
  )

  const zoneCount = addCategory
    ? orchestraSlots.filter((s) => s.category === addCategory).length
    : 0

  const atZoneMax = zoneCount >= ORCHESTRA_MAX_PER_ZONE
  const canAdd = !isInOrchestra && !atZoneMax && addCategory !== null

  const handlePreview = () => previewVideo(isPreviewed ? null : video.id)
  const handleAdd = () => {
    if (canAdd && addCategory) addToOrchestra(video, addCategory)
  }

  return (
    <div
      onClick={handlePreview}
      role="button"
      aria-pressed={previewedVideoId === video.id}
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
        style={{ color: 'var(--color-text-secondary)', minWidth: 44 }}
      >
        {video.countryLabel}
      </span>

      {/* Video title */}
      <span
        className="flex-1 text-sm font-medium leading-tight"
        style={{ color: 'var(--color-text-primary)' }}
      >
        {video.title}
      </span>

      {/* Add button */}
      <button
        onClick={(e) => { e.stopPropagation(); handleAdd() }}
        disabled={!canAdd}
        className="shrink-0 rounded-full text-xs font-semibold transition-all"
        style={{
          padding: '4px 12px',
          backgroundColor: isInOrchestra
            ? 'var(--color-surface-card)'
            : canAdd
              ? 'var(--color-accent-brown)'
              : 'transparent',
          color: isInOrchestra
            ? 'var(--color-text-secondary)'
            : canAdd
              ? 'var(--color-surface-inner)'
              : 'var(--color-border-soft)',
          border: !canAdd && !isInOrchestra ? '1px solid var(--color-border-soft)' : 'none',
          cursor: canAdd ? 'pointer' : 'not-allowed',
          opacity: !canAdd && !isInOrchestra ? 0.5 : 1,
        }}
      >
        {isInOrchestra ? 'נוסף' : '+'}
      </button>
    </div>
  )
}
