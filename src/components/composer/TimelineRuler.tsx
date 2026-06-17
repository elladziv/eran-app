import { TIMELINE_DURATION_S } from '../../styles/constants'

const MAJOR_TICK_EVERY_S = 5   // label every 5 seconds
const MINOR_TICK_EVERY_S = 1   // tick mark every second

interface TimelineRulerProps {
  pxPerSecond: number
  onSeek: (seconds: number) => void
}

export function TimelineRuler({ pxPerSecond, onSeek }: TimelineRulerProps) {
  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const clickX = e.clientX - rect.left
    const seconds = Math.max(0, Math.min(clickX / pxPerSecond, TIMELINE_DURATION_S))
    onSeek(seconds)
  }
  const majorTicks: number[] = []
  const minorTicks: number[] = []

  for (let s = 0; s <= TIMELINE_DURATION_S; s += MINOR_TICK_EVERY_S) {
    if (s % MAJOR_TICK_EVERY_S === 0) {
      majorTicks.push(s)
    } else {
      minorTicks.push(s)
    }
  }

  return (
    <div
      className="relative flex items-end shrink-0"
      style={{
        width: TIMELINE_DURATION_S * pxPerSecond,
        height: 28,
        borderBottom: '1px solid var(--color-composer-separator)',
        cursor: 'pointer',
      }}
      onClick={handleClick}
    >
      {minorTicks.map((s) => (
        <div
          key={s}
          className="absolute bottom-0"
          style={{
            left: s * pxPerSecond,
            width: 1,
            height: 6,
            backgroundColor: 'var(--color-composer-separator)',
          }}
        />
      ))}
      {majorTicks.map((s) => (
        <div
          key={s}
          className="absolute bottom-0 flex flex-col items-center"
          style={{ left: s * pxPerSecond }}
        >
          <span
            className="text-xs"
            style={{
              color: 'var(--color-surface-card)',
              fontSize: 9,
              marginBottom: 2,
              transform: 'translateX(-50%)',
              whiteSpace: 'nowrap',
            }}
          >
            {s}s
          </span>
          <div
            style={{
              width: 1,
              height: 10,
              backgroundColor: 'var(--color-surface-card)',
            }}
          />
        </div>
      ))}
    </div>
  )
}
