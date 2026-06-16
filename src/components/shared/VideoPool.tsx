import { useRef, useEffect } from 'react'
import { useAppStore } from '../../store/useAppStore'
import { INSTRUMENTS } from '../../data/instruments'

/**
 * Renders a pool of hidden <video> elements (one per unique instrument videoUrl).
 * During playback, fires audio whenever the playhead crosses a keyframe boundary.
 * Mount once at the App root.
 */
export function VideoPool() {
  const tracks    = useAppStore((s) => s.tracks)
  const isPlaying = useAppStore((s) => s.isPlaying)
  const playheadS = useAppStore((s) => s.playheadS)

  // Map videoUrl → HTMLVideoElement ref
  const videoRefs = useRef<Map<string, HTMLVideoElement>>(new Map())

  // Unique video URLs needed across all tracks
  const uniqueUrls = Array.from(
    new Set(
      tracks.map((t) => t.instrument.videoUrl).filter(Boolean),
    ),
  )

  // Fire audio when playhead crosses a keyframe start
  useEffect(() => {
    if (!isPlaying) return

    tracks.forEach((track) => {
      if (track.isMuted) return

      track.keyframes.forEach((kf) => {
        const delta = playheadS - kf.startS
        // Trigger within one 60fps frame window (~17ms = 0.017s)
        if (delta >= 0 && delta < 0.05) {
          const video = videoRefs.current.get(track.instrument.videoUrl)
          if (video) {
            video.currentTime = 0
            video.volume = track.volume
            video.play().catch(() => { /* blocked by browser — ignore */ })
          }
        }
      })
    })
  }, [isPlaying, playheadS, tracks])

  return (
    <div
      aria-hidden
      style={{ position: 'absolute', left: -9999, top: -9999, pointerEvents: 'none' }}
    >
      {uniqueUrls.map((url) => (
        <video
          key={url}
          src={url}
          ref={(el) => {
            if (el) videoRefs.current.set(url, el)
            else videoRefs.current.delete(url)
          }}
          preload="auto"
          playsInline
        />
      ))}
    </div>
  )
}
