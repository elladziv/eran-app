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
  megaphones: { inner: 0,   outer: 152 },
  whistles:   { inner: 163, outer: 298 },
  brass:      { inner: 309, outer: 428 },
  percussion: { inner: 439, outer: 558 },
  chorus:     { inner: 569, outer: 678 },
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
