import { useEffect, useRef, useState } from 'react'
import { useAppStore } from '../../store/useAppStore'
import { type OrchestraCategory, type OrchestraSlot } from '../../types'
import { ORCHESTRA_CENTER_X, ORCHESTRA_CENTER_Y, ORCHESTRA_ZONE_RADII } from '../../styles/constants'
import { buildArcSlicePath } from '../../utils/arcPath'
import { ArcZone } from './ArcZone'
import { RotaryKnob } from './RotaryKnob'

const CATEGORIES: OrchestraCategory[] = ['megaphones', 'string', 'brass', 'percussion', 'chorus']

const SVG_VIEWBOX = '0 160 1366 740'

function formatTime(s: number): string {
  const m = Math.floor(s / 60)
  const sec = Math.floor(s % 60)
  return `${m}:${sec.toString().padStart(2, '0')}`
}

export function OrchestraView() {
  const selectedCategory = useAppStore((s) => s.selectedCategory)
  const orchestraMode    = useAppStore((s) => s.orchestraMode)
  const orchestraSlots   = useAppStore((s) => s.orchestraSlots)
  const selectCategory   = useAppStore((s) => s.selectCategory)
  const setOrchestraMode = useAppStore((s) => s.setOrchestraMode)
  const addToSelection   = useAppStore((s) => s.addToSelection)

  const audioRef = useRef<HTMLAudioElement>(null)
  const [activeSlot, setActiveSlot]     = useState<OrchestraSlot | null>(null)
  const [isPlaying, setIsPlaying]       = useState(false)
  const [currentTime, setCurrentTime]   = useState(0)
  const [duration, setDuration]         = useState(0)

  // Load + autoplay when a new instrument is selected
  useEffect(() => {
    const el = audioRef.current
    if (!el || !activeSlot) return
    el.src = activeSlot.video.videoUrl
    el.load()
    el.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false))
  }, [activeSlot?.video.videoUrl])

  // Stop + reset when leaving play mode
  useEffect(() => {
    if (orchestraMode !== 'play') {
      const el = audioRef.current
      if (el) { el.pause(); el.currentTime = 0 }
      setActiveSlot(null)
      setIsPlaying(false)
      setCurrentTime(0)
      setDuration(0)
    }
  }, [orchestraMode])

  const togglePlay = () => {
    const el = audioRef.current
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
    const el = audioRef.current
    if (!el) return
    const t = Number(e.target.value)
    el.currentTime = t
    setCurrentTime(t)
  }

  const cx = ORCHESTRA_CENTER_X
  const cy = ORCHESTRA_CENTER_Y
  const outerMost = ORCHESTRA_ZONE_RADII['chorus'].outer

  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden">

      {/* Rotary knob — right side */}
      <div className="absolute top-3 z-10" style={{ right: 12 }}>
        <RotaryKnob />
      </div>

        {/* Mini audio player — left side, play mode only */}
        {orchestraMode === 'play' && (
          <div
            className="absolute top-3 z-10 flex items-center gap-2 rounded-full px-3"
            style={{
              left: 12,
              height: 32,
              backgroundColor: 'var(--color-surface-card)',
              border: '1px solid var(--color-border-soft)',
              minWidth: 220,
            }}
          >
            {/* Play / pause */}
            <button
              onClick={togglePlay}
              disabled={!activeSlot}
              style={{
                background: 'none',
                border: 'none',
                color: activeSlot ? 'var(--color-text-primary)' : 'var(--color-border-soft)',
                fontSize: 13,
                cursor: activeSlot ? 'pointer' : 'default',
                padding: 0,
                lineHeight: 1,
                flexShrink: 0,
              }}
            >
              {isPlaying ? '⏸' : '▶'}
            </button>

            {/* Instrument name */}
            <span
              className="text-xs truncate"
              style={{
                color: activeSlot ? 'var(--color-text-primary)' : 'var(--color-border-soft)',
                minWidth: 0,
                flex: '0 1 auto',
                maxWidth: 90,
              }}
            >
              {activeSlot ? activeSlot.video.title : 'לחץ על כלי לנגינה'}
            </span>

            {/* Seek bar */}
            <input
              type="range"
              min={0}
              max={duration || 0}
              step={0.05}
              value={currentTime}
              onChange={handleSeek}
              disabled={!activeSlot || duration === 0}
              style={{
                flex: 1,
                accentColor: 'var(--color-accent-brown)',
                cursor: activeSlot ? 'pointer' : 'default',
                direction: 'ltr',
                minWidth: 40,
              }}
            />

            {/* Time */}
            <span
              style={{
                color: 'var(--color-border-soft)',
                fontSize: 10,
                minWidth: 28,
                textAlign: 'end',
                fontVariantNumeric: 'tabular-nums',
                flexShrink: 0,
              }}
            >
              {formatTime(currentTime)}
            </span>
          </div>
        )}

      {/* Hidden audio element */}
      <audio
        ref={audioRef}
        onTimeUpdate={() => setCurrentTime(audioRef.current?.currentTime ?? 0)}
        onLoadedMetadata={() => setDuration(audioRef.current?.duration ?? 0)}
        onEnded={() => setIsPlaying(false)}
      />

      <svg
        viewBox={SVG_VIEWBOX}
        preserveAspectRatio="xMidYMax meet"
        className="w-full h-full"
        style={{ display: 'block' }}
      >
        <path
          d={buildArcSlicePath(cx, cy, outerMost + 2, outerMost + 18, 180, 0)}
          fill="var(--color-surface-card)"
          stroke="var(--color-border-soft)"
          strokeWidth={1}
          opacity={0.6}
        />

        {[...CATEGORIES].reverse().map((category) => {
          const slotsInZone = orchestraSlots.filter((s) => s.category === category)
          return (
            <ArcZone
              key={category}
              category={category}
              mode={orchestraMode}
              isSelected={selectedCategory === category}
              slots={slotsInZone}
              onZoneClick={() => {
                selectCategory(selectedCategory === category ? null : category)
              }}
              onSliceClick={(slotId) => {
                if (orchestraMode === 'play') {
                  const slot = orchestraSlots.find((s) => s.slotId === slotId)
                  if (slot) setActiveSlot(slot)
                } else {
                  addToSelection(slotId)
                }
              }}
            />
          )
        })}

        <circle cx={cx} cy={cy} r={8} fill="var(--color-accent-brown)" opacity={0.5} />

        <line
          x1={cx - outerMost - 30}
          y1={cy}
          x2={cx + outerMost + 30}
          y2={cy}
          stroke="var(--color-border-soft)"
          strokeWidth={1.5}
          opacity={0.4}
        />
      </svg>
    </div>
  )
}
