import { useEffect, useRef } from 'react'
import { type Instrument } from '../../types'

interface VideoPlayerProps {
  instrument: Instrument | null
}

export function VideoPlayer({ instrument }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const el = videoRef.current
    if (!el) return
    el.load()
    el.play().catch(() => { /* autoplay may be blocked — that's fine */ })
  }, [instrument?.videoUrl])

  return (
    <div
      className="w-full relative overflow-hidden"
      style={{ aspectRatio: '4 / 3', backgroundColor: 'var(--color-text-primary)' }}
    >
      {instrument ? (
        <video
          ref={videoRef}
          src={instrument.videoUrl}
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full"
          style={{ objectFit: 'cover', objectPosition: 'center' }}
        />
      ) : (
        /* Empty state placeholder */
        <div
          className="absolute inset-0 flex items-center justify-center text-sm"
          style={{ color: 'var(--color-border-soft)' }}
        >
          בחר כלי לצפייה
        </div>
      )}

      {/* Label overlay at bottom */}
      {instrument && (
        <div
          className="absolute bottom-0 right-0 left-0 px-3 py-2 flex items-end justify-between"
          style={{ background: 'linear-gradient(transparent, rgba(42,22,10,0.7))' }}
        >
          <span
            className="text-xs font-medium"
            style={{ color: 'var(--color-surface-inner)' }}
          >
            {instrument.countryLabel}
          </span>
          <span
            className="text-sm font-semibold"
            style={{ color: 'var(--color-surface-inner)' }}
          >
            {instrument.name}
          </span>
        </div>
      )}
    </div>
  )
}
