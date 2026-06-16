import { type VideoFile } from '../types'

// Update this file to add more videos to the browse library.
// Each entry has a single location and may cover multiple instrument categories.
export const VIDEO_FILES: VideoFile[] = [
  {
    id: 'israel-brass-1',
    title: 'כלי נשיפה ישראליים',
    country: 'israel',
    countryLabel: 'ישראל',
    categories: ['brass'],
    videoUrl: '/instruments/israel-wind.mp4',
  },
  {
    id: 'palestine-megaphones-1',
    title: 'מובילי מחאה פלסטיניים',
    country: 'palestine',
    countryLabel: 'פלסטין',
    categories: ['megaphones'],
    videoUrl: '/instruments/israel-wind.mp4',
  },
  {
    id: 'jordan-percussion-1',
    title: 'כלי הקשה ירדניים',
    country: 'jordan',
    countryLabel: 'ירדן',
    categories: ['percussion'],
    videoUrl: '/instruments/israel-wind.mp4',
  },
  {
    id: 'lebanon-chorus-1',
    title: 'מקהלה לבנונית',
    country: 'lebanon',
    countryLabel: 'לבנון',
    categories: ['chorus', 'megaphones'],
    videoUrl: '/instruments/israel-wind.mp4',
  },
  {
    id: 'egypt-whistles-1',
    title: 'משרוקיות מצריות',
    country: 'egypt',
    countryLabel: 'מצרים',
    categories: ['whistles', 'percussion'],
    videoUrl: '/instruments/israel-wind.mp4',
  },
]
