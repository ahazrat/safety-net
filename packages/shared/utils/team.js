export const TEAM_SIZE_MIN = 1
export const TEAM_SIZE_MAX = 8

export function teamSizeOf(listing) {
  const n = listing && listing.teamSize
  if (Number.isInteger(n) && n >= TEAM_SIZE_MIN && n <= TEAM_SIZE_MAX) return n
  return TEAM_SIZE_MIN
}

export function normalizeTeamSize(value) {
  const n = Number(value)
  if (!Number.isInteger(n) || n < TEAM_SIZE_MIN) return TEAM_SIZE_MIN
  if (n > TEAM_SIZE_MAX) return TEAM_SIZE_MAX
  return n
}

export function rosterOf(listing) {
  const raw = listing && listing.rosterUids
  if (!Array.isArray(raw)) return []
  return raw.filter(uid => typeof uid === 'string' && uid.length > 0)
}

export function captainUidOf(listing) {
  return (listing && listing.assigneeUid) || rosterOf(listing)[0] || ''
}

export function isRosterFull(listing) {
  return rosterOf(listing).length >= teamSizeOf(listing)
}

export function teamLabel(listing) {
  const size = teamSizeOf(listing)
  if (size <= 1) return 'Solo'
  return `Team ${rosterOf(listing).length}/${size}`
}
