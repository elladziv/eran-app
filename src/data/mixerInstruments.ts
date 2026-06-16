import { type MixerInstrument } from '../types'

// Update this file to change the 10 fixed mixer instruments.
// Place the corresponding MP3 files in /public/audio/ and update mp3Url.
// Icons are served from /public/icons/small/ — replace Asset files to swap icons.
export const MIXER_INSTRUMENTS: MixerInstrument[] = [
  {
    id: 'choir',
    name: 'שירה / מקהלה',
    category: 'chorus',
    mp3Url: '/audio/choir.mp3',
    iconUrl: '/icons/small/Asset 1.svg',
  },
  {
    id: 'chant',
    name: 'קריאות מפגינים',
    category: 'chorus',
    mp3Url: '/audio/chant.mp3',
    iconUrl: '/icons/small/Asset 2.svg',
  },
  {
    id: 'megaphone-lead',
    name: 'מגפון מוביל',
    category: 'megaphones',
    mp3Url: '/audio/megaphone-lead.mp3',
    iconUrl: '/icons/small/Asset 3.svg',
  },
  {
    id: 'megaphone-crowd',
    name: 'מגפון קהל',
    category: 'megaphones',
    mp3Url: '/audio/megaphone-crowd.mp3',
    iconUrl: '/icons/small/Asset 4.svg',
  },
  {
    id: 'trumpet',
    name: 'חצוצרה',
    category: 'brass',
    mp3Url: '/audio/trumpet.mp3',
    iconUrl: '/icons/small/Asset 5.svg',
  },
  {
    id: 'shofar',
    name: 'שופר',
    category: 'brass',
    mp3Url: '/audio/shofar.mp3',
    iconUrl: '/icons/small/Asset 6.svg',
  },
  {
    id: 'whistle-ref',
    name: 'משרוקית שופט',
    category: 'whistles',
    mp3Url: '/audio/whistle-ref.mp3',
    iconUrl: '/icons/small/Asset 7.svg',
  },
  {
    id: 'whistle-crowd',
    name: 'משרוקיות קהל',
    category: 'whistles',
    mp3Url: '/audio/whistle-crowd.mp3',
    iconUrl: '/icons/small/Asset 8.svg',
  },
  {
    id: 'darbuka',
    name: 'דרבוקה',
    category: 'percussion',
    mp3Url: '/audio/darbuka.mp3',
    iconUrl: '/icons/small/Asset 9.svg',
  },
  {
    id: 'drumline',
    name: 'תופים / צעדה',
    category: 'percussion',
    mp3Url: '/audio/drumline.mp3',
    iconUrl: '/icons/small/Asset 10.svg',
  },
]
