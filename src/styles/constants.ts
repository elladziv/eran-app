// Layout
export const RIGHT_PANEL_WIDTH   = 315;   // px
export const HEADER_HEIGHT        = 72;    // px — visible content row
export const BOTTOM_BAR_HEIGHT    = 56;    // px — composer trigger bar
export const BOTTOM_PANEL_HEIGHT  = 120;   // px — selected instruments strip
export const COMPOSER_HEIGHT_VH   = 65;    // vh — composer slide-up panel

// Orchestra map
export const ORCHESTRA_MAX_PER_ZONE = 4;
export const ORCHESTRA_CENTER_X     = 683; // SVG units — horizontal center
export const ORCHESTRA_CENTER_Y     = 900; // SVG units — bottom anchor point
export const ORCHESTRA_ZONE_RADII: Record<string, { inner: number; outer: number }> = {
  voice:      { inner: 0,   outer: 160 },
  strings:    { inner: 165, outer: 300 },
  wind:       { inner: 305, outer: 430 },
  brass:      { inner: 435, outer: 555 },
  percussion: { inner: 560, outer: 680 },
};
export const ORCHESTRA_ARC_START_DEG = 180; // left end of semicircle
export const ORCHESTRA_ARC_END_DEG   = 0;   // right end

// Composer / timeline
export const TIMELINE_DURATION_S  = 30;
export const TIMELINE_SNAP_S      = 0.25;
export const COMPOSER_MAX_TRACKS  = 10;

// Z-indices
export const Z_COMPOSER = 50;
export const Z_HEADER   = 10;
