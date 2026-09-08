/** Format listing listedPriceCents for UI. Missing = no price set. 0 = volunteer. */
export function formatListedPrice(listing) {
  if (!listing || listing.listedPriceCents == null || listing.listedPriceCents === '') {
    return null
  }
  const cents = Number(listing.listedPriceCents)
  if (!Number.isFinite(cents) || cents < 0) return null
  if (cents === 0) return 'Volunteer (no charge)'
  return `$${(cents / 100).toFixed(2)}`
}

export function dollarsTextToCents(text) {
  const trimmed = String(text == null ? '' : text).trim()
  if (!trimmed) return undefined
  const n = Number(trimmed)
  if (!Number.isFinite(n) || n < 0) return null
  return Math.round(n * 100)
}
