export const LISTING_TYPES = ['watch', 'event', 'defense', 'other']

export const LISTING_TYPE_LABELS = {
  watch: 'Neighborhood Watch',
  event: 'Event Security',
  defense: 'Physical Defense',
  other: 'Other',
}

export const LISTING_TYPE_CHIPS = [
  { value: 'watch', label: 'Watch' },
  { value: 'event', label: 'Event' },
  { value: 'defense', label: 'Defense' },
  { value: 'other', label: 'Other' },
]

const TITLE_TO_TYPE = {
  'neighborhood watch': 'watch',
  'event security': 'event',
  'physical defense': 'defense',
}

export function inferListingTypeFromTitle(title) {
  if (typeof title !== 'string') return 'other'
  const key = title.trim().toLowerCase()
  return TITLE_TO_TYPE[key] || 'other'
}

export function defaultTitleForListingType(type) {
  if (type && LISTING_TYPE_LABELS[type] && type !== 'other') {
    return LISTING_TYPE_LABELS[type]
  }
  return 'My new listing'
}

export function normalizeListingType(value, title) {
  if (LISTING_TYPES.includes(value)) return value
  return inferListingTypeFromTitle(title)
}

/** Missing or unknown listingType: infer from title, else 'other'. */
export function listingTypeOf(listing) {
  if (!listing) return 'other'
  return normalizeListingType(listing.listingType, listing.title)
}

export function listingTypeLabel(listingOrType) {
  const type = typeof listingOrType === 'string'
    ? normalizeListingType(listingOrType)
    : listingTypeOf(listingOrType)
  return LISTING_TYPE_LABELS[type] || LISTING_TYPE_LABELS.other
}

export function offeringTitleToListingType(title) {
  return inferListingTypeFromTitle(title)
}
