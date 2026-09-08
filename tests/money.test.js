const { test } = require('node:test')
const assert = require('node:assert/strict')
const { formatListedPrice, dollarsTextToCents } = require('../packages/shared/utils/money.js')

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
