import { useRef, useEffect } from 'react'
import { useAppStore } from '../../store/useAppStore'

export function VideoPool() {
  const tracks    = useAppStore((s) => s.tracks)
  const isPlaying = useAppStore((s) => s.isPlaying)
  const playheadS = useAppStore((s) => s.playheadS)

  const audioRefs    = useRef<Map<string, HTMLAudioElement>>(new Map())
  const prevPlayhead = useRef(playheadS)

  const stopAll = () => {
    audioRefs.current.forEach((audio) => {
      audio.pause()
      audio.currentTime = 0
    })
  }

  // Flat list of { keyframeId, audioUrl } for all tracks
  const kfAudioList = tracks.flatMap((t) =>
    t.keyframes.map((kf) => ({ id: kf.id, audioUrl: t.instrument.audioUrl })),
  )

  // Keep audio map in sync with current keyframes
  useEffect(() => {
    kfAudioList.forEach(({ id, audioUrl }) => {
      if (!audioRefs.current.has(id)) {
        const audio = new Audio(audioUrl)
        audio.preload = 'auto'
        audioRefs.current.set(id, audio)
      }
    })
    const liveIds = new Set(kfAudioList.map((k) => k.id))
    for (const id of audioRefs.current.keys()) {
      if (!liveIds.has(id)) {
        audioRefs.current.get(id)?.pause()
        audioRefs.current.delete(id)
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [kfAudioList.map((k) => k.id).join(',')])

  // Stop all audio on pause / stop / end
  useEffect(() => {
    if (!isPlaying) stopAll()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPlaying])

  // Stop all audio on seek (playhead jumps more than one normal tick)
  useEffect(() => {
    const delta = Math.abs(playheadS - prevPlayhead.current)
    if (delta > 0.1) stopAll()
    prevPlayhead.current = playheadS
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playheadS])

  // Trigger each keyframe's audio when the playhead crosses its start
  useEffect(() => {
    if (!isPlaying) return

    const anySoloed = tracks.some((t) => t.isSoloed)
    tracks.forEach((track) => {
      const effectivelyMuted = anySoloed ? !track.isSoloed : track.isMuted
      if (effectivelyMuted) return
      track.keyframes.forEach((kf) => {
        const delta = playheadS - kf.startS
        if (delta >= 0 && delta < 0.05) {
          const audio = audioRefs.current.get(kf.id)
          if (audio) {
            audio.currentTime = 0
            audio.volume = track.volume
            audio.play().catch(() => { /* autoplay blocked */ })
          }
        }
      })
    })
  }, [isPlaying, playheadS, tracks])

  // React immediately to mute/solo changes while playing
  useEffect(() => {
    if (!isPlaying) return

    const currentS = useAppStore.getState().playheadS
    const anySoloed = tracks.some((t) => t.isSoloed)

    tracks.forEach((track) => {
      const effectivelyMuted = anySoloed ? !track.isSoloed : track.isMuted
      track.keyframes.forEach((kf) => {
        const audio = audioRefs.current.get(kf.id)
        if (!audio) return

        if (effectivelyMuted) {
          if (!audio.paused) {
            audio.pause()
            audio.currentTime = 0
          }
        } else {
          const delta = currentS - kf.startS
          if (delta >= 0 && delta < kf.durationS && audio.paused) {
            audio.currentTime = delta
            audio.volume = track.volume
            audio.play().catch(() => { /* autoplay blocked */ })
          }
        }
      })
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tracks, isPlaying])

  return null
}
