import { type VideoFile } from '../types'

export const VIDEO_FILES: VideoFile[] = [
  {
    id: 'israel-1',
    title: 'ישראל - ויוזלה, משרוקיות ומגפון',
    country: 'israel',
    countryLabel: 'ישראל',
    categories: ['brass', 'megaphones'],
    instruments: ['vuvuzela', 'whistle', 'megaphone'],
    videoUrl: '/archive/israel-tel-aviv.mp4',
  },
  {
    id: 'jordan-1',
    title: 'ירדן - תופים, תוף-מרים, ויוזלה ומפגינים',
    country: 'jordan',
    countryLabel: 'ירדן',
    categories: ['percussion', 'brass', 'chorus'],
    instruments: ['drum', 'tambourine', 'vuvuzela', 'crowd'],
    videoUrl: '/archive/jordan.mp4',
  },
  {
    id: 'syria-latakia-1',
    title: 'לטקיה - מפגינים',
    country: 'syria',
    countryLabel: 'סוריה',
    categories: ['chorus'],
    instruments: ['crowd'],
    videoUrl: '/archive/syria-latakia.mp4',
  },
  {
    id: 'syria-1',
    title: 'סוריה - מפגינים, מגפון, תופים, משרוקיות וסירים',
    country: 'syria',
    countryLabel: 'סוריה',
    categories: ['chorus', 'megaphones', 'percussion', 'brass'],
    instruments: ['crowd', 'megaphone', 'drum', 'whistle', 'pot'],
    videoUrl: '/archive/syria.mp4',
  },
]
