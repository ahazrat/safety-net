import { nameForCommunityArea } from './communityAreas.js'

export const CHICAGO_CENTER = [41.85, -87.65]
export const CHICAGO_ZOOM = 11

export const CHICAGO_CRIMES_SODA_URL = 'https://data.cityofchicago.org/resource/ijzp-q8t2.json'
export const CHICAGO_CRIME_WINDOW_DAYS = 30
export const CHICAGO_CRIME_CACHE_MS = 6 * 60 * 60 * 1000

const MIN_RADIUS_M = 250
const MAX_RADIUS_M = 1600

let memoryCache = null

export function chicagoCrimeSinceIso(days = CHICAGO_CRIME_WINDOW_DAYS, now = new Date()) {
  const d = new Date(now.getTime())
  d.setUTCDate(d.getUTCDate() - days)
  return d.toISOString().slice(0, 19)
}

export function chicagoCrimeAggregateUrl({
  days = CHICAGO_CRIME_WINDOW_DAYS,
  now = new Date(),
} = {}) {
  const since = chicagoCrimeSinceIso(days, now)
  const params = new URLSearchParams({
    $select: 'community_area,avg(latitude) as lat,avg(longitude) as lng,count(*) as count',
    $where: `date >= '${since}' AND latitude IS NOT NULL AND community_area IS NOT NULL`,
    $group: 'community_area',
    $order: 'count DESC',
    $limit: '77',
  })
  return `${CHICAGO_CRIMES_SODA_URL}?${params.toString()}`
}

export function radiusForCount(count, maxCount) {
  const n = Number(count) || 0
  const max = Math.max(Number(maxCount) || 1, 1)
  return Math.round(MIN_RADIUS_M + (n / max) * (MAX_RADIUS_M - MIN_RADIUS_M))
}

export function mapCrimeRows(rows) {
  const parsed = (rows || [])
    .map(row => {
      const lat = Number(row.lat)
      const lng = Number(row.lng)
      const count = Number(row.count)
      const area = row.community_area != null ? String(row.community_area) : ''
      if (!area || !Number.isFinite(lat) || !Number.isFinite(lng) || !Number.isFinite(count)) {
        return null
      }
      return { area, lat, lng, count }
    })
    .filter(Boolean)

  const maxCount = parsed.reduce((m, r) => Math.max(m, r.count), 1)

  return parsed.map(r => ({
    lat: r.lat,
    lng: r.lng,
    kind: 'crime',
    count: r.count,
    radius: radiusForCount(r.count, maxCount),
    title: `${nameForCommunityArea(r.area)}: ${r.count} reports (last ${CHICAGO_CRIME_WINDOW_DAYS} days)`,
  }))
}

export async function fetchChicagoCrimeAreas({ fetchImpl = fetch, now = new Date() } = {}) {
  if (memoryCache && now.getTime() - memoryCache.at < CHICAGO_CRIME_CACHE_MS) {
    return memoryCache.pins
  }
  const res = await fetchImpl(chicagoCrimeAggregateUrl({ now }))
  if (!res.ok) {
    throw new Error(`Chicago crime SODA ${res.status}`)
  }
  const rows = await res.json()
  const pins = mapCrimeRows(rows)
  memoryCache = { at: now.getTime(), pins }
  return pins
}

export function clearChicagoCrimeCache() {
  memoryCache = null
}
