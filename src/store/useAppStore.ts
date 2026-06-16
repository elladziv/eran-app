import { create } from 'zustand'
import {
  type AppState,
  type Country,
  type Keyframe,
  type MixerInstrument,
  type OrchestraCategory,
  type OrchestraMode,
  type OrchestraSlot,
  type Track,
  type VideoFile,
} from '../types'
import { COMPOSER_MAX_TRACKS, ORCHESTRA_MAX_PER_ZONE, TIMELINE_DURATION_S } from '../styles/constants'

function uuid(): string {
  return Math.random().toString(36).slice(2) + Date.now().toString(36)
}

function snapToGrid(seconds: number, snap: number): number {
  return Math.round(seconds / snap) * snap
}

export const useAppStore = create<AppState>((set, get) => ({
  // Navigation
  selectedCategory: null,
  selectedCountry: null,
  previewedVideoId: null,
  orchestraMode: 'edit',

  // Orchestra
  orchestraSlots: [],

  // Composer
  tracks: [],
  isPlaying: false,
  isComposerOpen: false,
  playheadS: 0,

  // --- Navigation actions ---

  selectCategory: (category: OrchestraCategory | null) =>
    set({ selectedCategory: category, selectedCountry: null }),

  selectCountry: (country: Country | null) =>
    set({ selectedCountry: country, selectedCategory: null }),

  previewVideo: (videoId: string | null) =>
    set({ previewedVideoId: videoId }),

  setOrchestraMode: (mode: OrchestraMode) =>
    set({ orchestraMode: mode }),

  // --- Orchestra actions ---

  addToOrchestra: (video: VideoFile, category: OrchestraCategory) => {
    const state = get()

    const inCategory = state.orchestraSlots.filter((s) => s.category === category)
    if (inCategory.length >= ORCHESTRA_MAX_PER_ZONE) return

    const slot: OrchestraSlot = {
      slotId: uuid(),
      video,
      category,
    }

    set((s) => ({ orchestraSlots: [...s.orchestraSlots, slot] }))
  },

  removeFromOrchestra: (slotId: string) =>
    set((s) => ({
      orchestraSlots: s.orchestraSlots.filter((slot) => slot.slotId !== slotId),
    })),

  // --- Composer track actions ---

  addTrack: (instrument: MixerInstrument) => {
    const state = get()
    if (state.tracks.length >= COMPOSER_MAX_TRACKS) return

    const track: Track = {
      id: uuid(),
      instrument,
      isMuted: false,
      isSoloed: false,
      volume: 1,
      keyframes: [],
    }

    set((s) => ({ tracks: [...s.tracks, track] }))
  },

  removeTrack: (trackId: string) =>
    set((s) => ({
      tracks: s.tracks.filter((t) => t.id !== trackId),
    })),

  setMute: (trackId: string, muted: boolean) =>
    set((s) => ({
      tracks: s.tracks.map((t) =>
        t.id === trackId ? { ...t, isMuted: muted } : t,
      ),
    })),

  setSolo: (trackId: string, soloed: boolean) =>
    set((s) => ({
      tracks: s.tracks.map((t) =>
        t.id === trackId ? { ...t, isSoloed: soloed } : t,
      ),
    })),

  setVolume: (trackId: string, volume: number) =>
    set((s) => ({
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
