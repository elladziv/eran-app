import { type Track, type Keyframe } from '../../types'
import { useAppStore } from '../../store/useAppStore'
import { TIMELINE_DURATION_S, TIMELINE_SNAP_S } from '../../styles/constants'

const KEYFRAME_DEFAULT_DURATION_S = 3

interface TrackRowProps {
  track: Track
  pxPerSecond: number
  rowHeight: number
}

export function TrackRow({ track, pxPerSecond, rowHeight }: TrackRowProps) {
  const addKeyframe    = useAppStore((s) => s.addKeyframe)
  const removeKeyframe = useAppStore((s) => s.removeKeyframe)
  const removeTrack    = useAppStore((s) => s.removeTrack)
  const setMute        = useAppStore((s) => s.setMute)
  const setSolo        = useAppStore((s) => s.setSolo)

  const timelineWidth = TIMELINE_DURATION_S * pxPerSecond

  const handleTrackClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const clickX = e.clientX - rect.left
    const startS = Math.max(0, clickX / pxPerSecond)
    const snapped = Math.round(startS / TIMELINE_SNAP_S) * TIMELINE_SNAP_S
    addKeyframe(track.id, snapped, KEYFRAME_DEFAULT_DURATION_S)
  }

  return (
    <div
      className="flex shrink-0"
      style={{
        height: rowHeight,
        borderBottom: '1px solid var(--color-composer-separator)',
      }}
    >
      {/* Track label / controls */}
      <div
        className="flex items-center gap-2 px-3 shrink-0"
        style={{
          width: 140,
          backgroundColor: 'var(--color-composer-bg)',
          borderRight: '1px solid var(--color-composer-separator)',
        }}
      >
        <img
          src={track.instrument.iconUrl}
          alt={track.instrument.name}
          className="w-5 h-5 object-contain shrink-0"
          style={{ filter: 'invert(1) brightness(0.7)' }}
        />
        <span
          className="flex-1 text-xs truncate"
          style={{ color: 'var(--color-surface-card)' }}
        >
          {track.instrument.name}
        </span>
        <button
          onClick={() => setMute(track.id, !track.isMuted)}
          className="text-xs rounded transition-opacity hover:opacity-80"
          style={{
            padding: '4px',
            backgroundColor: track.isMuted ? 'var(--color-accent-gold)' : 'transparent',
            color: track.isMuted ? 'var(--color-text-primary)' : 'var(--color-border-soft)',
            border: '1px solid var(--color-border-soft)',
            fontSize: 9,
          }}
        >
          M
        </button>
        <button
          onClick={() => setSolo(track.id, !track.isSoloed)}
          className="text-xs rounded transition-opacity hover:opacity-80"
          style={{
            padding: '4px',
            backgroundColor: track.isSoloed ? 'var(--color-accent-brown)' : 'transparent',
            color: track.isSoloed ? 'var(--color-surface-inner)' : 'var(--color-border-soft)',
            border: '1px solid var(--color-border-soft)',
            fontSize: 9,
          }}
        >
          S
        </button>
        <button
          onClick={() => removeTrack(track.id)}
          className="opacity-40 hover:opacity-80 transition-opacity shrink-0"
          style={{ padding: '4px', color: 'var(--color-surface-card)', fontSize: 14 }}
        >
          ×
        </button>
      </div>

      {/* Timeline lane */}
      <div
        className="relative overflow-hidden"
        style={{
          width: timelineWidth,
          backgroundColor: track.isMuted
            ? 'rgba(59,59,60,0.4)'
            : 'var(--color-composer-bg)',
          cursor: 'crosshair',
        }}
        onClick={handleTrackClick}
      >
        {track.keyframes.map((kf: Keyframe) => (
          <KeyframeBlock
            key={kf.id}
            keyframe={kf}
            pxPerSecond={pxPerSecond}
            rowHeight={rowHeight}
            onRemove={() => removeKeyframe(kf.id)}
          />
        ))}
      </div>
    </div>
  )
}

interface KeyframeBlockProps {
  keyframe: Keyframe
  pxPerSecond: number
  rowHeight: number
  onRemove: () => void
}

function KeyframeBlock({ keyframe, pxPerSecond, rowHeight, onRemove }: KeyframeBlockProps) {
  const left  = keyframe.startS * pxPerSecond
  const width = Math.max(4, keyframe.durationS * pxPerSecond)
  const pad = 4

  return (
    <div
      className="absolute flex items-center justify-between rounded"
      style={{
        left,
        top: pad,
        width,
        height: rowHeight - pad * 2,
        backgroundColor: 'var(--color-accent-brown)',
        opacity: 0.85,
        overflow: 'hidden',
      }}
      onClick={(e) => e.stopPropagation()}
    >
      <span
        className="px-1 truncate"
        style={{ color: 'var(--color-surface-inner)', fontSize: 9 }}
      >
        {keyframe.durationS}s
      </span>
      <button
        onClick={(e) => { e.stopPropagation(); onRemove() }}
        className="opacity-60 hover:opacity-100 shrink-0"
        style={{ padding: '4px', color: 'var(--color-surface-inner)', fontSize: 12 }}
      >
        ×
      </button>
    </div>
  )
}
