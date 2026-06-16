import { useRef, useEffect } from 'react'
import { useAppStore } from '../../store/useAppStore'

// Audio playback pool for the composer. Uses Web Audio API (Audio objects)
// so no DOM elements are needed. Mount once at the App root.
export function VideoPool() {
  const tracks    = useAppStore((s) => s.tracks)
  const isPlaying = useAppStore((s) => s.isPlaying)
  const playheadS = useAppStore((s) => s.playheadS)

  // Map mp3Url → HTMLAudioElement
  const audioRefs = useRef<Map<string, HTMLAudioElement>>(new Map())

  // Unique MP3 URLs in use across all tracks
  const uniqueUrls = [...new Set(tracks.map((t) => t.instrument.mp3Url))]

  // Keep the audio element map in sync with current tracks
  useEffect(() => {
    uniqueUrls.forEach((url) => {
      if (!audioRefs.current.has(url)) {
        const audio = new Audio(url)
        audio.preload = 'auto'
        audioRefs.current.set(url, audio)
      }
    })
    for (const url of audioRefs.current.keys()) {
      if (!uniqueUrls.includes(url)) {
        audioRefs.current.get(url)?.pause()
        audioRefs.current.delete(url)
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tracks.map((t) => t.instrument.mp3Url).join(',')])

  // Fire audio when playhead crosses a keyframe start
  useEffect(() => {
    if (!isPlaying) return

    tracks.forEach((track) => {
      if (track.isMuted) return
      track.keyframes.forEach((kf) => {
        const delta = playheadS - kf.startS
        if (delta >= 0 && delta < 0.05) {
          const audio = audioRefs.current.get(track.instrument.mp3Url)
          if (audio) {
            audio.currentTime = 0
            audio.volume = track.volume
            audio.play().catch(() => { /* blocked by browser */ })
          }
        }
      })
    })
  }, [isPlaying, playheadS, tracks])

  return null
}
