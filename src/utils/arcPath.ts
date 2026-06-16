/**
 * Converts polar coordinates to SVG cartesian coordinates.
 * angleDeg: 0° = right, 90° = top (because SVG y-axis is inverted).
 */
export function polarToXY(
  cx: number,
  cy: number,
  r: number,
  angleDeg: number,
): { x: number; y: number } {
  const rad = (angleDeg * Math.PI) / 180
  return {
    x: cx + r * Math.cos(rad),
    y: cy - r * Math.sin(rad), // subtract: SVG y increases downward
  }
}

/**
 * Builds an SVG path string for an annular sector (donut slice).
 *
 * The arc sweeps clockwise in SVG screen space from startAngleDeg to endAngleDeg,
 * passing through the TOP of the circle (e.g. from 180° to 0° goes through 90°=up).
 *
 * When innerR === 0 the result is a solid pie wedge (no inner hole).
 *
 * @param cx            Center x
 * @param cy            Center y
 * @param innerR        Inner radius (0 for a solid wedge)
 * @param outerR        Outer radius
 * @param startAngleDeg Start angle in degrees (e.g. 180 for left edge)
 * @param endAngleDeg   End angle in degrees   (e.g. 0   for right edge)
 */
export function buildArcSlicePath(
  cx: number,
  cy: number,
  innerR: number,
  outerR: number,
  startAngleDeg: number,
  endAngleDeg: number,
): string {
  const spanDeg = Math.abs(startAngleDeg - endAngleDeg)
  const largeArc = spanDeg > 180 ? 1 : 0

  const outerStart = polarToXY(cx, cy, outerR, startAngleDeg)
  const outerEnd   = polarToXY(cx, cy, outerR, endAngleDeg)

  if (innerR <= 0) {
    // Solid wedge: center → outer arc → back to center
    return [
      `M ${cx} ${cy}`,
      `L ${outerStart.x} ${outerStart.y}`,
      `A ${outerR} ${outerR} 0 ${largeArc} 1 ${outerEnd.x} ${outerEnd.y}`,
      'Z',
    ].join(' ')
  }

  const innerStart = polarToXY(cx, cy, innerR, startAngleDeg)
  const innerEnd   = polarToXY(cx, cy, innerR, endAngleDeg)

  // Annular sector: outer arc CW → radial line → inner arc CCW → radial line
  return [
    `M ${outerStart.x} ${outerStart.y}`,
    `A ${outerR} ${outerR} 0 ${largeArc} 1 ${outerEnd.x} ${outerEnd.y}`,
    `L ${innerEnd.x} ${innerEnd.y}`,
    `A ${innerR} ${innerR} 0 ${largeArc} 0 ${innerStart.x} ${innerStart.y}`,
    'Z',
  ].join(' ')
}

/**
 * Returns the midpoint (label position) of an arc slice.
 * Uses the angular midpoint and the radial midpoint.
 */
export function arcMidpoint(
  cx: number,
  cy: number,
  innerR: number,
  outerR: number,
  startAngleDeg: number,
  endAngleDeg: number,
): { x: number; y: number } {
  const midAngle = (startAngleDeg + endAngleDeg) / 2
  const midR     = innerR + (outerR - innerR) * 0.5
  return polarToXY(cx, cy, midR, midAngle)
}
