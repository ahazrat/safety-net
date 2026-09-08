// Chicago-area scanner catalogue. Links only — the app does not embed
// or autoplay audio. Feed IDs from Broadcastify Cook County (ctid 606)
// as of 2026-09. Zone 05 is not listed on the official CPD set.

export const CHICAGO_SCANNER_FEEDS = [
  {
    id: 'openmhz-chi-cpd',
    title: 'Chicago Police (OpenMHz)',
    area: 'Citywide',
    source: 'OpenMHz',
    url: 'https://openmhz.com/system/chi_cpd',
    notes: 'Talkgroup archive. Audio plays on OpenMHz, not in this app.',
  },
  {
    id: 'broadcastify-cook',
    title: 'Cook County live feeds',
    area: 'Cook County',
    source: 'Broadcastify',
    url: 'https://www.broadcastify.com/listen/ctid/606/publicsafety',
    notes: 'Directory of official and volunteer public-safety streams.',
  },
  {
    id: 'broadcastify-cfd',
    title: 'Chicago Fire — Digital',
    area: 'Citywide',
    source: 'Broadcastify',
    url: 'https://www.broadcastify.com/listen/feed/909',
  },
  {
    id: 'broadcastify-cpd-citywide',
    title: 'CPD citywide dispatch',
    area: 'Citywide',
    source: 'Broadcastify',
    url: 'https://www.broadcastify.com/listen/feed/41210',
  },
  {
    id: 'broadcastify-cpd-z01',
    title: 'CPD Zone 01',
    area: 'Districts 16–17',
    source: 'Broadcastify',
    url: 'https://www.broadcastify.com/listen/feed/37354',
  },
  {
    id: 'broadcastify-cpd-z02',
    title: 'CPD Zone 02',
    area: 'North Side',
    source: 'Broadcastify',
    url: 'https://www.broadcastify.com/listen/feed/37355',
  },
  {
    id: 'broadcastify-cpd-z03',
    title: 'CPD Zone 03',
    area: 'North / Near North',
    source: 'Broadcastify',
    url: 'https://www.broadcastify.com/listen/feed/37356',
  },
  {
    id: 'broadcastify-cpd-z04',
    title: 'CPD Zone 04',
    area: 'Northwest',
    source: 'Broadcastify',
    url: 'https://www.broadcastify.com/listen/feed/37357',
  },
  {
    id: 'broadcastify-cpd-z06',
    title: 'CPD Zone 06',
    area: 'West Side',
    source: 'Broadcastify',
    url: 'https://www.broadcastify.com/listen/feed/37359',
  },
  {
    id: 'broadcastify-cpd-z07',
    title: 'CPD Zone 07',
    area: 'West / Southwest',
    source: 'Broadcastify',
    url: 'https://www.broadcastify.com/listen/feed/37360',
  },
  {
    id: 'broadcastify-cpd-z08',
    title: 'CPD Zone 08',
    area: 'Southwest',
    source: 'Broadcastify',
    url: 'https://www.broadcastify.com/listen/feed/37361',
  },
  {
    id: 'broadcastify-cpd-z09',
    title: 'CPD Zone 09',
    area: 'South Side',
    source: 'Broadcastify',
    url: 'https://www.broadcastify.com/listen/feed/37362',
  },
  {
    id: 'broadcastify-cpd-z10',
    title: 'CPD Zone 10',
    area: 'South Side',
    source: 'Broadcastify',
    url: 'https://www.broadcastify.com/listen/feed/37363',
  },
  {
    id: 'broadcastify-cpd-z11',
    title: 'CPD Zone 11',
    area: 'Far South',
    source: 'Broadcastify',
    url: 'https://www.broadcastify.com/listen/feed/37364',
  },
  {
    id: 'broadcastify-cpd-z12',
    title: 'CPD Zone 12',
    area: 'Far South',
    source: 'Broadcastify',
    url: 'https://www.broadcastify.com/listen/feed/37365',
  },
  {
    id: 'broadcastify-cpd-z13',
    title: 'CPD Zone 13',
    area: 'Far Southeast',
    source: 'Broadcastify',
    url: 'https://www.broadcastify.com/listen/feed/37366',
  },
]

export function chicagoScannerFeeds() {
  return CHICAGO_SCANNER_FEEDS
}
