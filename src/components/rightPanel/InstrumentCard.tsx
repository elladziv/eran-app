import { type VideoFile } from '../../types'
import { useAppStore } from '../../store/useAppStore'

interface VideoCardProps {
  video: VideoFile
  isPreviewed: boolean
}

export function InstrumentCard({ video, isPreviewed }: VideoCardProps) {
  const previewVideo = useAppStore((s) => s.previewVideo)

  return (
    <div
      onClick={() => previewVideo(video.id)}
      role="button"
      className="flex items-center gap-3 px-4 py-3 transition-colors"
      style={{
        backgroundColor: isPreviewed ? 'var(--color-surface-card)' : 'transparent',
        cursor: 'pointer',
        borderBottom: '1px solid var(--color-surface-card)',
      }}
    >
      <span
        className="text-xs shrink-0"
        style={{ color: 'var(--color-text-secondary)', minWidth: 44 }}
      >
        {video.countryLabel}
      </span>

      <span
        className="flex-1 text-sm font-medium leading-tight"
        style={{ color: 'var(--color-text-primary)' }}
      >
        {video.title}
      </span>

      <button
        onClick={(e) => { e.stopPropagation(); previewVideo(video.id) }}
        className="shrink-0 rounded-full text-sm transition-all"
        style={{
          padding: '4px 10px',
          backgroundColor: isPreviewed ? 'var(--color-accent-brown)' : 'var(--color-surface-card)',
          color: isPreviewed ? 'var(--color-surface-inner)' : 'var(--color-text-secondary)',
          border: 'none',
          cursor: 'pointer',
        }}
      >
        ▶
      </button>
    </div>
  )
}
