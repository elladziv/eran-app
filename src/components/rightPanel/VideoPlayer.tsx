import { useEffect, useRef, useState } from 'react'
import { type VideoFile } from '../../types'

interface VideoPlayerProps {
  video: VideoFile | null
}

function formatTime(s: number): string {
  const m = Math.floor(s / 60)
  const sec = Math.floor(s % 60)
  return `${m}:${sec.toString().padStart(2, '0')}`
}

export function VideoPlayer({ video }: VideoPlayerProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const videoRef     = useRef<HTMLVideoElement>(null)
  const [isPlaying, setIsPlaying]       = useState(false)
  const [currentTime, setCurrentTime]   = useState(0)
  const [duration, setDuration]         = useState(0)
  const [isFullscreen, setIsFullscreen] = useState(false)

  useEffect(() => {
    const el = videoRef.current
    if (!el) return
    el.load()
    setCurrentTime(0)
    setDuration(0)
    el.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false))
  }, [video?.videoUrl])

  useEffect(() => {
    const onChange = () => setIsFullscreen(!!document.fullscreenElement)
    document.addEventListener('fullscreenchange', onChange)
    return () => document.removeEventListener('fullscreenchange', onChange)
  }, [])

  const togglePlay = () => {
    const el = videoRef.current
    if (!el) return
    if (el.paused) {
      el.play().catch(() => {})
      setIsPlaying(true)
    } else {
      el.pause()
      setIsPlaying(false)
    }
  }

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const el = videoRef.current
    if (!el) return
    const t = Number(e.target.value)
    el.currentTime = t
    setCurrentTime(t)
  }

  const toggleFullscreen = () => {
    if (!containerRef.current) return
    if (document.fullscreenElement) {
      document.exitFullscreen()
    } else {
      containerRef.current.requestFullscreen()
    }
  }

  return (
    <div
      ref={containerRef}
      className="w-full shrink-0"
      style={{
        backgroundColor: '#000',
        // In fullscreen: fill the screen and stack video + controls vertically
        display: isFullscreen ? 'flex' : 'block',
        flexDirection: 'column',
      }}
    >
      {/* Video area */}
      <div
        className="w-full relative overflow-hidden"
        style={{
          aspectRatio: isFullscreen ? undefined : '4 / 3',
          flex: isFullscreen ? 1 : undefined,
          backgroundColor: 'var(--color-text-primary)',
        }}
      >
        {video ? (
          <video
            ref={videoRef}
            src={video.videoUrl}
            playsInline
            onTimeUpdate={() => setCurrentTime(videoRef.current?.currentTime ?? 0)}
            onLoadedMetadata={() => setDuration(videoRef.current?.duration ?? 0)}
            onEnded={() => setIsPlaying(false)}
            className="absolute inset-0 w-full h-full"
            style={{ objectFit: isFullscreen ? 'contain' : 'cover', objectPosition: 'center' }}
          />
        ) : (
          <div
            className="absolute inset-0 flex items-center justify-center text-sm"
            style={{ color: 'var(--color-border-soft)' }}
          >
            בחר סרטון לצפייה
          </div>
        )}

        {/* Title overlay */}
        {video && (
          <div
            className="absolute bottom-0 inset-x-0 px-3 py-2 flex items-end justify-between"
            style={{ background: 'linear-gradient(transparent, rgba(42,22,10,0.75))' }}
          >
            <span className="text-xs" style={{ color: 'var(--color-surface-inner)' }}>
              {video.countryLabel}
            </span>
            <span className="text-sm font-semibold" style={{ color: 'var(--color-surface-inner)' }}>
              {video.title}
            </span>
          </div>
        )}

        {/* Fullscreen close button */}
        {isFullscreen && (
          <button
            onClick={toggleFullscreen}
            style={{
              position: 'absolute',
              top: 16,
              right: 16,
              background: 'rgba(0,0,0,0.55)',
              border: 'none',
              borderRadius: '50%',
              width: 40,
              height: 40,
              color: 'white',
              fontSize: 20,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              lineHeight: 1,
            }}
            aria-label="Close fullscreen"
          >
            ✕
          </button>
        )}
      </div>

      {/* Controls bar */}
      <div
        className="flex items-center gap-2 px-3 py-2"
        style={{
          backgroundColor: 'rgba(0,0,0,0.85)',
          minHeight: 40,
          flexShrink: 0,
        }}
      >
        <button
          onClick={togglePlay}
          disabled={!video}
          style={{
            color: video ? 'white' : 'var(--color-border-soft)',
            fontSize: 16,
            lineHeight: 1,
            background: 'none',
            border: 'none',
            cursor: video ? 'pointer' : 'default',
            padding: '0 4px',
            flexShrink: 0,
          }}
        >
          {isPlaying ? '⏸' : '▶'}
        </button>

        <span
          style={{
            color: 'var(--color-border-soft)',
            fontSize: 11,
            minWidth: 32,
            flexShrink: 0,
            fontVariantNumeric: 'tabular-nums',
          }}
        >
          {formatTime(currentTime)}
        </span>

        <input
          type="range"
          min={0}
          max={duration || 0}
          step={0.1}
          value={currentTime}
          onChange={handleSeek}
          disabled={!video || duration === 0}
          className="flex-1"
          style={{
            accentColor: 'var(--color-accent-brown)',
            cursor: video ? 'pointer' : 'default',
            direction: 'ltr',
          }}
        />

        <span
          style={{
            color: 'var(--color-border-soft)',
            fontSize: 11,
            minWidth: 32,
            flexShrink: 0,
            textAlign: 'end',
            fontVariantNumeric: 'tabular-nums',
          }}
        >
          {formatTime(duration)}
        </span>

        {/* Fullscreen button */}
        <button
          onClick={toggleFullscreen}
          disabled={!video}
          style={{
            color: video ? 'var(--color-border-soft)' : 'var(--color-border-soft)',
            fontSize: 14,
            lineHeight: 1,
            background: 'none',
            border: 'none',
            cursor: video ? 'pointer' : 'default',
            padding: '0 4px',
            flexShrink: 0,
            opacity: video ? 1 : 0.4,
          }}
          aria-label="Toggle fullscreen"
        >
          {isFullscreen ? '⊡' : '⛶'}
        </button>
      </div>
    </div>
  )
}
