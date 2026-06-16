import { create } from 'zustand'
import { type AppState, type Country, type Instrument, type Keyframe, type OrchestraCategory, type OrchestraMode, type SelectedInstrument, type Track } from '../types'
import { COMPOSER_MAX_TRACKS, ORCHESTRA_MAX_PER_ZONE, TIMELINE_DURATION_S } from '../styles/constants'

function uuid(): string {
  return Math.random().toString(36).slice(2) + Date.now().toString(36)
}

function snapToGrid(seconds: number, snap: number): number {
  return Math.round(seconds / snap) * snap
}

export const useAppStore = create<AppState>((set, get) => ({
  // Initial navigation state
  selectedCategory: null,
  selectedCountry: null,
  previewedInstrumentId: null,
  orchestraMode: 'edit',

  // Initial orchestra
  orchestra: [],

  // Initial composer
  tracks: [],
  isPlaying: false,
  isComposerOpen: false,
  playheadS: 0,

  // --- Navigation actions ---

  selectCategory: (category: OrchestraCategory | null) =>
    set({ selectedCategory: category, selectedCountry: null }),

  selectCountry: (country: Country | null) =>
    set({ selectedCountry: country, selectedCategory: null }),

  previewInstrument: (instrumentId: string | null) =>
    set({ previewedInstrumentId: instrumentId }),

  setOrchestraMode: (mode: OrchestraMode) =>
    set({ orchestraMode: mode }),

  // --- Orchestra actions ---

  addToOrchestra: (instrument: Instrument) => {
    const state = get()

    // Enforce per-category max
    const inCategory = state.orchestra.filter(
      (s) => s.instrument.category === instrument.category,
    )
    if (inCategory.length >= ORCHESTRA_MAX_PER_ZONE) return

    // Enforce global composer max
    if (state.orchestra.length >= COMPOSER_MAX_TRACKS) return

    const trackId = uuid()
    const selected: SelectedInstrument = {
      instrument,
      trackId,
      isMuted: false,
      isSoloed: false,
      volume: 1,
    }

    const track: Track = {
      id: trackId,
      instrument,
      isMuted: false,
      isSoloed: false,
      volume: 1,
      keyframes: [],
    }

    set((s) => ({
      orchestra: [...s.orchestra, selected],
      tracks: [...s.tracks, track],
    }))
  },

  removeFromOrchestra: (trackId: string) =>
    set((s) => ({
      orchestra: s.orchestra.filter((sel) => sel.trackId !== trackId),
      tracks: s.tracks.filter((t) => t.id !== trackId),
    })),

  setMute: (trackId: string, muted: boolean) =>
    set((s) => ({
      orchestra: s.orchestra.map((sel) =>
        sel.trackId === trackId ? { ...sel, isMuted: muted } : sel,
      ),
      tracks: s.tracks.map((t) =>
        t.id === trackId ? { ...t, isMuted: muted } : t,
      ),
    })),

  setSolo: (trackId: string, soloed: boolean) =>
    set((s) => ({
      orchestra: s.orchestra.map((sel) =>
        sel.trackId === trackId ? { ...sel, isSoloed: soloed } : sel,
      ),
      tracks: s.tracks.map((t) =>
        t.id === trackId ? { ...t, isSoloed: soloed } : t,
      ),
    })),

  setVolume: (trackId: string, volume: number) =>
    set((s) => ({
      orchestra: s.orchestra.map((sel) =>
        sel.trackId === trackId ? { ...sel, volume } : sel,
      ),
      tracks: s.tracks.map((t) =>
        t.id === trackId ? { ...t, volume } : t,
      ),
    })),

  // --- Keyframe actions ---

  addKeyframe: (trackId: string, startS: number, durationS: number) => {
    const snapped = snapToGrid(Math.max(0, Math.min(startS, TIMELINE_DURATION_S - durationS)), 0.25)
    const keyframe: Keyframe = { id: uuid(), trackId, startS: snapped, durationS }
    set((s) => ({
      tracks: s.tracks.map((t) =>
        t.id === trackId ? { ...t, keyframes: [...t.keyframes, keyframe] } : t,
      ),
    }))
  },

  removeKeyframe: (keyframeId: string) =>
    set((s) => ({
      tracks: s.tracks.map((t) => ({
        ...t,
        keyframes: t.keyframes.filter((k) => k.id !== keyframeId),
      })),
    })),

  moveKeyframe: (keyframeId: string, startS: number) => {
    const snapped = snapToGrid(Math.max(0, startS), 0.25)
    set((s) => ({
      tracks: s.tracks.map((t) => ({
        ...t,
        keyframes: t.keyframes.map((k) =>
          k.id === keyframeId ? { ...k, startS: snapped } : k,
        ),
      })),
    }))
  },

  // --- Playback actions ---

  setPlaying: (playing: boolean) => set({ isPlaying: playing }),

  setPlayhead: (seconds: number) =>
    set({ playheadS: Math.max(0, Math.min(seconds, TIMELINE_DURATION_S)) }),

  toggleComposer: () => set((s) => ({ isComposerOpen: !s.isComposerOpen })),
}))
