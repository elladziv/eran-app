interface PlayheadProps {
  positionPx: number
  height: number
}

export function Playhead({ positionPx, height }: PlayheadProps) {
  return (
    <div
      className="absolute top-0 pointer-events-none"
      style={{
        left: positionPx + 140, // offset by track label width
        width: 2,
        height,
        backgroundColor: 'var(--color-accent-gold)',
        zIndex: 10,
      }}
    >
      {/* Playhead triangle indicator */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: -5,
          width: 0,
          height: 0,
          borderLeft: '6px solid transparent',
          borderRight: '6px solid transparent',
          borderTop: '8px solid var(--color-accent-gold)',
        }}
      />
    </div>
  )
}
