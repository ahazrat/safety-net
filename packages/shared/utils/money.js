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

export function formatCents(cents) {
  if (!Number.isInteger(cents) || cents < 0) return null
  if (cents === 0) return 'Volunteer (no charge)'
  return `$${(cents / 100).toFixed(2)}`
}

/** Both parties acked the same integer cents. Not paymentStatus. */
export function offPlatformAgreedCents(listing) {
  if (!listing || listing.executedPriceAckOwner !== true || listing.executedPriceAckAssignee !== true) {
    return null
  }
  const ownerCents = listing.proposedExecutedPriceCentsOwner
  const assigneeCents = listing.proposedExecutedPriceCentsAssignee
  if (!Number.isInteger(ownerCents) || !Number.isInteger(assigneeCents)) return null
  if (ownerCents !== assigneeCents || ownerCents < 0) return null
  return ownerCents
}

export function dollarsTextToCents(text) {
  const trimmed = String(text == null ? '' : text).trim()
  if (!trimmed) return undefined
  const n = Number(trimmed)
  if (!Number.isFinite(n) || n < 0) return null
  return Math.round(n * 100)
}
