// ── POEMS DATA ──────────────────────────────────────────────
// lon  = left/right in the sky (-180 to 180)
// lat  = up/down (-60 to 60, 0 = horizon, positive = up)
// size = star radius in px (1–12)
// brightness = 0.0 to 1.0
// hidden = true means no label, very faint, found only by curiosity
//
// To add a new poem:
// 1. Use the 📍 coords button on the site to find lon/lat
// 2. Copy the entry below, fill in your values
// 3. Push to GitHub

const poems = [
  {
    id: 'still-water',
    lon: -40, lat: 18,
    size: 10, brightness: 1.0,
    title: 'Still Water',
    date: 'March 14, 2024',
    constellation: 'Constellation of Rain',
    hidden: false,
    lines: [
      { text: 'I still keep your laughter', comment: 'this line — I cried.' },
      { text: 'inside unfinished evenings,' },
      { text: 'a held breath between' },
      { text: 'the last light and the dark.', comment: 'the dark always felt safer with you.' }
    ]
  },
  {
    id: 'november',
    lon: 60, lat: 25,
    size: 8, brightness: 0.8,
    title: 'November',
    date: 'November 3, 2023',
    constellation: 'Constellation of Missing You',
    hidden: false,
    lines: [
      { text: 'Every city I have been to' },
      { text: 'has a street that reminds me of you —', comment: 'there is one in every city.' },
      { text: 'the way November light' },
      { text: 'falls on something ordinary' },
      { text: 'and makes it unbearable.', comment: 'yes. exactly this.' }
    ]
  },
  {
    id: 'unsent',
    lon: 140, lat: 35,
    size: 6, brightness: 0.5,
    title: 'Unsent',
    date: 'July 7, 2025',
    constellation: 'Constellation of Unsent Things',
    hidden: false,
    lines: [
      { text: 'I wrote this at 2am' },
      { text: 'and deleted it four times.' },
      { text: 'This is the fifth version.', comment: 'what were the other four?' },
      { text: 'All of them were true.' }
    ]
  },
  {
    id: 'wednesday',
    lon: -120, lat: 8,
    size: 5, brightness: 0.4,
    title: 'Wednesday',
    date: 'February 19, 2026',
    constellation: 'Constellation of Late Nights',
    hidden: false,
    lines: [
      { text: 'Some days I do not miss you loudly.' },
      { text: 'Just quietly, like a room' },
      { text: 'that is slightly too big now.', comment: 'this is what it is.' }
    ]
  },
  {
    id: 'firsts',
    lon: -170, lat: 30,
    size: 9, brightness: 0.9,
    title: 'Firsts',
    date: 'August 22, 2023',
    constellation: 'Constellation of Firsts',
    hidden: false,
    lines: [
      { text: 'The first time you laughed at something I said,' },
      { text: "I thought: ah, so this is what it's for —", comment: 'I felt this.' },
      { text: 'all that quiet collecting of words,' },
      { text: 'all those years of noticing.' }
    ]
  },
  {
    id: 'hidden-1',
    lon: 90, lat: 42,
    size: 4, brightness: 0.15,
    title: '?',
    date: 'hidden',
    constellation: '',
    hidden: true,
    lines: [
      { text: 'You found this one.' },
      { text: "I wasn't sure you would." },
      { text: "I'm glad you did.", comment: 'some things are only for the ones who look.' }
    ]
  },
  {
    id: 'softer',
    lon: 20, lat: 15,
    size: 6, brightness: 0.55,
    title: 'Softer Now',
    date: 'May 1, 2025',
    constellation: 'Constellation of Hope',
    hidden: false,
    lines: [
      { text: 'I am learning to hold things' },
      { text: 'without gripping them.' },
      { text: 'You taught me that.', comment: 'without knowing you did.' }
    ]
  }
];
