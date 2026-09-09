const { test } = require('node:test')
const assert = require('node:assert/strict')
const {
  formatListedPrice,
  formatCents,
  dollarsTextToCents,
  offPlatformAgreedCents,
} = require('../packages/shared/utils/money.js')

test('formatListedPrice: omit / volunteer / dollars', () => {
  assert.equal(formatListedPrice({}), null)
  assert.equal(formatListedPrice({ listedPriceCents: 0 }), 'Volunteer (no charge)')
  assert.equal(formatListedPrice({ listedPriceCents: 1500 }), '$15.00')
})

test('dollarsTextToCents', () => {
  assert.equal(dollarsTextToCents(''), undefined)
  assert.equal(dollarsTextToCents('15'), 1500)
  assert.equal(dollarsTextToCents('not'), null)
})

test('offPlatformAgreedCents requires equal acked amounts', () => {
  assert.equal(offPlatformAgreedCents({
    proposedExecutedPriceCentsOwner: 1000,
    proposedExecutedPriceCentsAssignee: 1000,
    executedPriceAckOwner: true,
    executedPriceAckAssignee: true,
  }), 1000)
  assert.equal(offPlatformAgreedCents({
    proposedExecutedPriceCentsOwner: 1000,
    proposedExecutedPriceCentsAssignee: 2000,
    executedPriceAckOwner: true,
    executedPriceAckAssignee: true,
  }), null)
  assert.equal(offPlatformAgreedCents({
    proposedExecutedPriceCentsOwner: 1000,
    proposedExecutedPriceCentsAssignee: 1000,
    executedPriceAckOwner: true,
    executedPriceAckAssignee: false,
  }), null)
})
