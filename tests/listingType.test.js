const { test } = require('node:test')
const assert = require('node:assert/strict')
const {
  LISTING_TYPES,
  listingTypeOf,
  listingTypeLabel,
  normalizeListingType,
  inferListingTypeFromTitle,
  offeringTitleToListingType,
  defaultTitleForListingType,
} = require('../packages/shared/utils/listingType')

test('LISTING_TYPES is watch|event|defense|other', () => {
  assert.deepEqual(LISTING_TYPES, ['watch', 'event', 'defense', 'other'])
})

test('listingTypeOf uses the stored type when valid', () => {
  assert.equal(listingTypeOf({ listingType: 'watch', title: 'x' }), 'watch')
  assert.equal(listingTypeOf({ listingType: 'event' }), 'event')
  assert.equal(listingTypeOf({ listingType: 'defense' }), 'defense')
  assert.equal(listingTypeOf({ listingType: 'other' }), 'other')
})

test('listingTypeOf treats missing or unknown type as other unless title matches an offering', () => {
  assert.equal(listingTypeOf(null), 'other')
  assert.equal(listingTypeOf({}), 'other')
  assert.equal(listingTypeOf({ title: 'Custom job' }), 'other')
  assert.equal(listingTypeOf({ listingType: 'wizard' }), 'other')
  assert.equal(listingTypeOf({ title: 'Neighborhood Watch' }), 'watch')
  assert.equal(listingTypeOf({ title: 'event security' }), 'event')
  assert.equal(listingTypeOf({ title: 'Physical Defense' }), 'defense')
})

test('offering titles map to the three types; later offerings are other', () => {
  assert.equal(offeringTitleToListingType('Neighborhood Watch'), 'watch')
  assert.equal(offeringTitleToListingType('Event Security'), 'event')
  assert.equal(offeringTitleToListingType('Physical Defense'), 'defense')
  assert.equal(offeringTitleToListingType('ID Verification'), 'other')
  assert.equal(offeringTitleToListingType('Safe Rides'), 'other')
  assert.equal(offeringTitleToListingType('Notary'), 'other')
  assert.equal(offeringTitleToListingType('Arbiter'), 'other')
})

test('normalizeListingType prefers an explicit enum value', () => {
  assert.equal(normalizeListingType('watch', 'Event Security'), 'watch')
  assert.equal(normalizeListingType('nope', 'Event Security'), 'event')
  assert.equal(normalizeListingType(undefined, 'Something else'), 'other')
})

test('default titles and labels', () => {
  assert.equal(defaultTitleForListingType('watch'), 'Neighborhood Watch')
  assert.equal(defaultTitleForListingType('event'), 'Event Security')
  assert.equal(defaultTitleForListingType('defense'), 'Physical Defense')
  assert.equal(defaultTitleForListingType('other'), 'My new listing')
  assert.equal(listingTypeLabel('watch'), 'Neighborhood Watch')
  assert.equal(listingTypeLabel({ listingType: 'event' }), 'Event Security')
  assert.equal(listingTypeLabel({ title: 'Physical Defense' }), 'Physical Defense')
  assert.equal(inferListingTypeFromTitle('Neighborhood Watch'), 'watch')
})
