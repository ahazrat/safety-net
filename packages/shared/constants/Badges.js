// Ported from safety-net-expo's components/Badge/index.js
export default [
  'professional-demeanor',
  'complete-profile',
  'de-escalation',
  'self-defense',
  'personal-defense',
  'weapons-non-lethal',
  'weapons-lethal',
  'emergency-response',
  'cpr',
]

export function labelForBadge(id) {
  return String(id).replace(/-/g, ' ')
}

export function earnedBadgeIds(user) {
  const badges = (user && user.badges) || {}
  return Object.keys(badges).filter(id => badges[id])
}
