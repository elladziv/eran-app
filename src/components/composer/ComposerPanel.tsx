import { useEffect, useRef, useCallback } from 'react'
import { useAppStore } from '../../store/useAppStore'
import { TIMELINE_DURATION_S } from '../../styles/constants'
import { TimelineRuler } from './TimelineRuler'
import { TrackRow } from './TrackRow'
import { Playhead } from './Playhead'

const PX_PER_SECOND = 30   // timeline zoom level
const TRACK_ROW_HEIGHT = 44 // px per track

export function ComposerPanel() {
  const tracks     = useAppStore((s) => s.tracks)
  const isPlaying  = useAppStore((s) => s.isPlaying)
  const playheadS  = useAppStore((s) => s.playheadS)
  const setPlaying = useAppStore((s) => s.setPlaying)
  const setPlayhead = useAppStore((s) => s.setPlayhead)

  const rafRef       = useRef<number | null>(null)
  const lastTimeRef  = useRef<number | null>(null)
  const scrollRef    = useRef<HTMLDivElement>(null)

  // requestAnimationFrame playback loop
  const tick = useCallback(
    (now: number) => {
      if (lastTimeRef.current === null) {
        lastTimeRef.current = now
      }
      const delta = (now - lastTimeRef.current) / 1000
      lastTimeRef.current = now

      const currentS = useAppStore.getState().playheadS
      const next = currentS + delta

      if (next >= TIMELINE_DURATION_S) {
        setPlayhead(0)
        setPlaying(false)
        lastTimeRef.current = null
        return
      }
      setPlayhead(next)
      rafRef.current = requestAnimationFrame(tick)
    },
    [setPlayhead, setPlaying],
  )

  useEffect(() => {
    if (isPlaying) {
      rafRef.current = requestAnimationFrame(tick)
    } else {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      lastTimeRef.current = null
    }
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [isPlaying, tick])

  const handlePlayPause = () => {
    if (isPlaying) {
      setPlaying(false)
    } else {
      if (playheadS >= TIMELINE_DURATION_S) setPlayhead(0)
      setPlaying(true)
    }
  }

  const handleStop = () => {
    setPlaying(false)
    setPlayhead(0)
  }

  const totalHeight = tracks.length * TRACK_ROW_HEIGHT + 28 // tracks + ruler

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Transport controls */}
      <div
        className="flex items-center gap-4 px-4 shrink-0"
        style={{
          height: 48,
          borderBottom: '1px solid var(--color-composer-separator)',
          backgroundColor: 'var(--color-composer-bg)',
        }}
      >
        <button
          onClick={handlePlayPause}
          className="flex items-center justify-center rounded-full transition-opacity hover:opacity-80"
          style={{
            width: 32,
            height: 32,
            backgroundColor: isPlaying ? 'var(--color-accent-gold)' : 'var(--color-accent-brown)',
            color: 'var(--color-surface-inner)',
            fontSize: 14,
          }}
        >
          {isPlaying ? '⏸' : '▶'}
        </button>

        <button
          onClick={handleStop}
          className="flex items-center justify-center rounded-full transition-opacity hover:opacity-80"
          style={{
            width: 32,
            height: 32,
            backgroundColor: 'transparent',
            color: 'var(--color-border-soft)',
            border: '1px solid var(--color-composer-separator)',
            fontSize: 14,
          }}
        >
          ■
        </button>

        {/* Playhead time display */}
        <span
          className="text-sm font-medium tabular-nums"
          style={{ color: 'var(--color-surface-card)' }}
        >
          {String(Math.floor(playheadS / 60)).padStart(2, '0')}:
          {String(Math.floor(playheadS % 60)).padStart(2, '0')}.
          {String(Math.floor((playheadS % 1) * 10)).padStart(1, '0')}
        </span>

        <span
          className="text-xs ms-auto"
          style={{ color: 'var(--color-border-soft)' }}
        >
          {tracks.length === 0
            ? 'הוסף כלים לתזמורת כדי להלחין'
            : `${tracks.length} קטעים`}
        </span>
      </div>

      {/* Timeline scroll area */}
      {tracks.length === 0 ? (
        <div
          className="flex-1 flex items-center justify-center text-sm"
          style={{ color: 'var(--color-border-soft)' }}
        >
          אין קטעים — בחר כלים ממפת התזמורת
        </div>
      ) : (
        <div
          ref={scrollRef}
          className="flex-1 overflow-auto relative"
          style={{ direction: 'ltr' }} // always LTR for a timeline
        >
          <div
            className="relative"
            style={{
              width: TIMELINE_DURATION_S * PX_PER_SECOND + 140,
              minHeight: totalHeight,
            }}
          >
            {/* Playhead line */}
            <Playhead
              positionPx={playheadS * PX_PER_SECOND}
              height={totalHeight}
            />

            {/* Ruler header */}
            <div className="flex">
              {/* Empty label column above ruler */}
              <div
                className="shrink-0"
                style={{
                  width: 140,
                  height: 28,
                  backgroundColor: 'var(--color-composer-bg)',
                  borderRight: '1px solid var(--color-composer-separator)',
                  borderBottom: '1px solid var(--color-composer-separator)',
                }}
              />
              <TimelineRuler pxPerSecond={PX_PER_SECOND} />
            </div>

            {/* Track rows */}
            {tracks.map((track) => (
              <TrackRow
                key={track.id}
                track={track}
                pxPerSecond={PX_PER_SECOND}
                rowHeight={TRACK_ROW_HEIGHT}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
