import { useAppStore } from '../../store/useAppStore'
import { VIDEO_FILES } from '../../data/videos'
import { VideoPlayer } from './VideoPlayer'
import { InstrumentCard } from './InstrumentCard'

export function RightPanel() {
  const selectedCategory = useAppStore((s) => s.selectedCategory)
  const selectedCountry  = useAppStore((s) => s.selectedCountry)
  const previewedVideoId = useAppStore((s) => s.previewedVideoId)

  // Filter video files by active selection
  const visibleVideos = VIDEO_FILES.filter((v) => {
    if (selectedCategory) return v.categories.includes(selectedCategory)
    if (selectedCountry)  return v.country === selectedCountry
    return true
  })

  // Determine which video to show in the player
  const previewedVideo =
    VIDEO_FILES.find((v) => v.id === previewedVideoId) ??
    (visibleVideos.length === 1 ? visibleVideos[0] : null)

  const listLabel = selectedCategory
    ? 'סרטונים בקטגוריה'
    : selectedCountry
      ? 'סרטונים מהמדינה'
      : 'כל הסרטונים'

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
          <div className="p-4 text-xs" style={{ color: 'var(--color-border-soft)' }}>
            אין סרטונים להצגה
          </div>
        ) : (
          visibleVideos.map((video) => (
            <InstrumentCard
              key={video.id}
              video={video}
              targetCategory={selectedCategory}
              isPreviewed={previewedVideoId === video.id}
            />
          ))
        )}
      </div>
    </div>
  )
}
