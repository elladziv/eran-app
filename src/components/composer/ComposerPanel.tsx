import { useEffect, useRef, useCallback } from 'react'
import { useAppStore } from '../../store/useAppStore'
import { TIMELINE_DURATION_S } from '../../styles/constants'
import { TimelineRuler } from './TimelineRuler'
import { TrackRow } from './TrackRow'
import { Playhead } from './Playhead'
import { MixerInstrumentPicker } from './MixerInstrumentPicker'

const PX_PER_SECOND   = 30
const TRACK_ROW_HEIGHT = 44

export function ComposerPanel() {
  const tracks         = useAppStore((s) => s.tracks)
  const isPlaying      = useAppStore((s) => s.isPlaying)
  const playheadS      = useAppStore((s) => s.playheadS)
  const setPlaying     = useAppStore((s) => s.setPlaying)
  const setPlayhead    = useAppStore((s) => s.setPlayhead)
  const toggleComposer = useAppStore((s) => s.toggleComposer)

  const rafRef      = useRef<number | null>(null)
  const lastTimeRef = useRef<number | null>(null)

  const tick = useCallback(
    (now: number) => {
      if (lastTimeRef.current === null) lastTimeRef.current = now
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
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current) }
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

  const totalHeight = tracks.length * TRACK_ROW_HEIGHT + 28

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Transport controls — three columns: playback | close | track info */}
      <div
        className="flex items-center px-5 shrink-0"
        style={{
          height: 52,
          borderBottom: '1px solid var(--color-composer-separator)',
          backgroundColor: 'var(--color-composer-bg)',
        }}
      >
        {/* Left: playback controls + time */}
        <div className="flex items-center gap-4 flex-1">
          <button
            onClick={handlePlayPause}
            className="flex items-center justify-center rounded-full transition-opacity hover:opacity-80"
            style={{
              width: 36,
              height: 36,
              backgroundColor: isPlaying ? 'var(--color-accent-gold)' : 'var(--color-accent-brown)',
              color: 'var(--color-surface-inner)',
              fontSize: 15,
            }}
          >
            {isPlaying ? '⏸' : '▶'}
          </button>

          <button
            onClick={handleStop}
            className="flex items-center justify-center rounded-full transition-opacity hover:opacity-80"
            style={{
              width: 36,
              height: 36,
              backgroundColor: 'transparent',
              color: 'var(--color-border-soft)',
              border: '1px solid var(--color-composer-separator)',
              fontSize: 15,
            }}
          >
            ■
          </button>

          <span
            className="text-base font-medium tabular-nums"
            style={{ color: 'var(--color-surface-card)' }}
          >
            {String(Math.floor(playheadS / 60)).padStart(2, '0')}:
            {String(Math.floor(playheadS % 60)).padStart(2, '0')}.
            {String(Math.floor((playheadS % 1) * 10)).padStart(1, '0')}
          </span>
        </div>

        {/* Center: close button */}
        <button
          onClick={toggleComposer}
          className="flex items-center gap-1.5 rounded-full text-sm transition-opacity hover:opacity-70 shrink-0"
          style={{
            padding: '4px 12px',
            color: 'var(--color-border-soft)',
            border: '1px solid var(--color-composer-separator)',
          }}
        >
          <span style={{ fontSize: 16, lineHeight: 1, display: 'inline-block', transform: 'rotate(90deg)' }}>›</span>
          סגרו
        </button>

        {/* Right: track count */}
        <div className="flex-1 flex justify-end">
          <span className="text-sm" style={{ color: 'var(--color-border-soft)' }}>
            {tracks.length === 0
              ? 'הוסף כלים מהרשימה להלחנה'
              : `${tracks.length} קטעים`}
          </span>
        </div>
      </div>

      {/* Main body: instrument picker + timeline */}
      <div className="flex flex-1 min-h-0">
        {/* Mixer instrument picker — right side in RTL (first in DOM) */}
        <MixerInstrumentPicker />

        {/* Timeline area — forced LTR */}
        {tracks.length === 0 ? (
          <div
            className="flex-1 flex items-center justify-center text-sm"
            style={{ color: 'var(--color-border-soft)' }}
          >
            בחר כלי מהרשימה מימין כדי להתחיל להלחין
          </div>
        ) : (
          <div
            className="flex-1 overflow-auto relative"
            style={{ direction: 'ltr' }}
          >
            <div
              className="relative"
              style={{
                width: TIMELINE_DURATION_S * PX_PER_SECOND + 140,
                minHeight: totalHeight,
              }}
            >
              <Playhead
                positionPx={playheadS * PX_PER_SECOND}
                height={totalHeight}
              />

              <div className="flex">
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
    </div>
  )
}
