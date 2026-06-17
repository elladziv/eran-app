import { useEffect } from 'react'
import { useAppStore } from '../../store/useAppStore'
import { VIDEO_FILES } from '../../data/videos'
import { VideoPlayer } from './VideoPlayer'
import { InstrumentCard } from './InstrumentCard'

export function RightPanel() {
  const selectedCountry  = useAppStore((s) => s.selectedCountry)
  const selectedSlots    = useAppStore((s) => s.selectedSlots)
  const previewedVideoId = useAppStore((s) => s.previewedVideoId)
  const previewVideo     = useAppStore((s) => s.previewVideo)

  // Unique instrument types from selected orchestra instruments
  const selectedTypes = [...new Set(
    selectedSlots.map((s) => s.instrumentType).filter(Boolean)
  )]
  const hasFilters = selectedCountry !== null || selectedTypes.length > 0

  const visibleVideos = VIDEO_FILES.filter((v) => {
    if (selectedCountry && v.country !== selectedCountry) return false
    if (selectedTypes.length > 0) {
      return selectedTypes.every((type) => v.instruments.includes(type!))
    }
    return true
  })

  // Clear player when the currently previewed video is filtered out
  const filterKey = `${selectedCountry ?? ''}|${[...selectedTypes].sort().join(',')}`
  useEffect(() => {
    if (previewedVideoId && !visibleVideos.some((v) => v.id === previewedVideoId)) {
      previewVideo(null)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterKey, previewedVideoId])

  const previewedVideo = VIDEO_FILES.find((v) => v.id === previewedVideoId) ?? null

  const listLabel = hasFilters ? 'סרטונים מסוננים' : 'כל הסרטונים'

  return (
    <div className="flex flex-col h-full">
      <VideoPlayer video={previewedVideo} />

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

      <div className="flex-1 overflow-y-auto">
        {visibleVideos.length === 0 ? (
          <div className="p-4 text-sm" style={{ color: 'var(--color-border-soft)' }}>
            {hasFilters ? 'אין סרטונים התואמים לבחירה' : 'אין סרטונים להצגה'}
          </div>
        ) : (
          visibleVideos.map((video) => (
            <InstrumentCard
              key={video.id}
              video={video}
              isPreviewed={previewedVideoId === video.id}
            />
          ))
        )}
      </div>
    </div>
  )
}
