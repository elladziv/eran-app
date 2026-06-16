import { useEffect, useRef } from 'react'
import { type VideoFile } from '../../types'

interface VideoPlayerProps {
  video: VideoFile | null
}

export function VideoPlayer({ video }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const el = videoRef.current
    if (!el) return
    el.load()
    el.play().catch(() => { /* autoplay may be blocked */ })
  }, [video?.videoUrl])

  return (
    <div
      className="w-full relative overflow-hidden shrink-0"
      style={{ aspectRatio: '4 / 3', backgroundColor: 'var(--color-text-primary)' }}
    >
      {video ? (
        <video
          ref={videoRef}
          src={video.videoUrl}
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full"
          style={{ objectFit: 'cover', objectPosition: 'center' }}
        />
      ) : (
        <div
          className="absolute inset-0 flex items-center justify-center text-sm"
          style={{ color: 'var(--color-border-soft)' }}
        >
          בחר סרטון לצפייה
        </div>
      )}

      {video && (
        <div
          className="absolute bottom-0 right-0 left-0 px-3 py-2 flex items-end justify-between"
          style={{ background: 'linear-gradient(transparent, rgba(42,22,10,0.75))' }}
        >
          <span className="text-xs font-medium" style={{ color: 'var(--color-surface-inner)' }}>
            {video.countryLabel}
          </span>
          <span className="text-sm font-semibold" style={{ color: 'var(--color-surface-inner)' }}>
            {video.title}
          </span>
        </div>
      )}
    </div>
  )
}
