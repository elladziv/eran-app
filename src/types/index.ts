export type OrchestraCategory = 'chorus' | 'percussion' | 'brass' | 'string' | 'megaphones'

export type Country = 'israel' | 'palestine' | 'jordan' | 'lebanon' | 'egypt' | 'syria' | 'iraq' | 'turkey' | 'iran'

export type InstrumentType =
  | 'air-horn'
  | 'crowd'
  | 'darbuka'
  | 'drum'
  | 'megaphone'
  | 'oud'
  | 'pot'
  | 'tambourine'
  | 'vuvuzela'
  | 'whistle'

// A video file browsed in the orchestra/geo map views
export interface VideoFile {
  id: string
  title: string               // Hebrew display title
  country: Country
  countryLabel: string        // Hebrew country name
  categories: OrchestraCategory[]
  instruments: InstrumentType[] // instrument types audible in this video
  videoUrl: string
  thumbnailUrl?: string
}

// One of the fixed mixer instruments (for composer + orchestra play mode)
export interface MixerInstrument {
  id: string
  name: string                // Hebrew display name
  category: OrchestraCategory
  instrumentType: InstrumentType
  country: Country
  countryLabel: string
  audioUrl: string            // relative path — .mp3 or .m4a
  durationS: number           // clip duration in seconds
  iconUrl: string
}

// A video placed in an orchestra category zone
export interface OrchestraSlot {
  slotId: string
  video: VideoFile
  category: OrchestraCategory
  instrumentType?: InstrumentType // present for instrument-backed slots
}

export interface Keyframe {
  id: string
  trackId: string
  startS: number
  durationS: number
}

export interface Track {
  id: string
  instrument: MixerInstrument
  isMuted: boolean
  isSoloed: boolean
  volume: number
  keyframes: Keyframe[]
}

export type OrchestraMode = 'edit' | 'play'

export interface AppState {
  selectedCategory: OrchestraCategory | null
  selectedCountry: Country | null
  previewedVideoId: string | null
  orchestraMode: OrchestraMode

  orchestraSlots: OrchestraSlot[]
  selectedSlots: OrchestraSlot[]

  tracks: Track[]
  isPlaying: boolean
  isComposerOpen: boolean
  playheadS: number

  selectCategory: (category: OrchestraCategory | null) => void
  selectCountry: (country: Country | null) => void
  previewVideo: (videoId: string | null) => void
  setOrchestraMode: (mode: OrchestraMode) => void

  addToOrchestra: (video: VideoFile, category: OrchestraCategory) => void
  removeFromOrchestra: (slotId: string) => void

  addToSelection: (slotId: string) => void
  removeFromSelection: (slotId: string) => void

  addTrack: (instrument: MixerInstrument) => void
  removeTrack: (trackId: string) => void
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
