export type OrchestraCategory = 'chorus' | 'percussion' | 'brass' | 'whistles' | 'megaphones'

export type Country = 'israel' | 'palestine' | 'jordan' | 'lebanon' | 'egypt' | 'syria' | 'iraq' | 'turkey' | 'iran'

// A video file browsed in the orchestra/geo map views
export interface VideoFile {
  id: string
  title: string               // Hebrew display title
  country: Country
  countryLabel: string        // Hebrew country name
  categories: OrchestraCategory[]  // which instrument families appear in this video
  videoUrl: string            // relative path, e.g. '/instruments/israel-wind.mp4'
  thumbnailUrl?: string
}

// One of the 10 fixed mixer instruments (for composer + orchestra play mode)
export interface MixerInstrument {
  id: string
  name: string                // Hebrew display name
  category: OrchestraCategory
  mp3Url: string              // relative path, e.g. '/audio/oud.mp3'
  iconUrl: string             // path to icon served from /public, e.g. '/icons/small/Asset 1.svg'
}

// A video placed in an orchestra category zone (no audio — visual only)
export interface OrchestraSlot {
  slotId: string              // UUID
  video: VideoFile
  category: OrchestraCategory // which zone it's placed in (must be in video.categories)
}

export interface Keyframe {
  id: string
  trackId: string
  startS: number              // seconds from timeline start
  durationS: number           // clip duration in seconds
}

// A composer track — always uses a MixerInstrument (mp3-based)
export interface Track {
  id: string
  instrument: MixerInstrument
  isMuted: boolean
  isSoloed: boolean
  volume: number              // 0–1
  keyframes: Keyframe[]
}

export type OrchestraMode = 'edit' | 'play'

export interface AppState {
  // Navigation
  selectedCategory: OrchestraCategory | null
  selectedCountry: Country | null
  previewedVideoId: string | null
  orchestraMode: OrchestraMode

  // Orchestra (video files placed in zones — visual only)
  orchestraSlots: OrchestraSlot[]

  // Composer (MP3 mixer instruments on a timeline)
  tracks: Track[]
  isPlaying: boolean
  isComposerOpen: boolean
  playheadS: number

  // Actions
  selectCategory: (category: OrchestraCategory | null) => void
  selectCountry: (country: Country | null) => void
  previewVideo: (videoId: string | null) => void
  setOrchestraMode: (mode: OrchestraMode) => void

  addToOrchestra: (video: VideoFile, category: OrchestraCategory) => void
  removeFromOrchestra: (slotId: string) => void

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
