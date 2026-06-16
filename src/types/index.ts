export type OrchestraCategory = 'voice' | 'strings' | 'wind' | 'brass' | 'percussion'

export type Country = 'israel' | 'palestine' | 'jordan' | 'lebanon' | 'egypt' | 'syria' | 'iraq' | 'turkey' | 'iran'

export interface Instrument {
  id: string
  name: string            // Hebrew display name
  category: OrchestraCategory
  country: Country
  countryLabel: string    // Hebrew country name
  videoUrl: string        // relative path, e.g. '/instruments/israel-wind.mp4'
  description?: string    // Hebrew description
}

export interface SelectedInstrument {
  instrument: Instrument
  trackId: string         // UUID assigned when added to orchestra
  isMuted: boolean
  isSoloed: boolean
  volume: number          // 0–1
}

export interface Keyframe {
  id: string
  trackId: string
  startS: number          // seconds from timeline start
  durationS: number       // clip duration in seconds
}

export interface Track {
  id: string
  instrument: Instrument
  isMuted: boolean
  isSoloed: boolean
  volume: number
  keyframes: Keyframe[]
}

export type OrchestraMode = 'edit' | 'play'

export interface AppState {
  // Navigation
  selectedCategory: OrchestraCategory | null
  selectedCountry: Country | null
  previewedInstrumentId: string | null
  orchestraMode: OrchestraMode

  // Orchestra (selected instruments)
  orchestra: SelectedInstrument[]

  // Composer
  tracks: Track[]
  isPlaying: boolean
  isComposerOpen: boolean
  playheadS: number

  // Actions
  selectCategory: (category: OrchestraCategory | null) => void
  selectCountry: (country: Country | null) => void
  previewInstrument: (instrumentId: string | null) => void
  setOrchestraMode: (mode: OrchestraMode) => void

  addToOrchestra: (instrument: Instrument) => void
  removeFromOrchestra: (trackId: string) => void
  setMute: (trackId: string, muted: boolean) => void
  setSolo: (trackId: string, soloed: boolean) => void
  setVolume: (trackId: string, volume: number) => void

  addKeyframe: (trackId: string, startS: number, durationS: number) => void
  removeKeyframe: (keyframeId: string) => void
  moveKeyframe: (keyframeId: string, startS: number) => void

  setPlaying: (playing: boolean) => void
  setPlayhead: (seconds: number) => void
  toggleComposer: () => void
}
