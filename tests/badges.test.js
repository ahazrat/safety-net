const { test } = require('node:test')
const assert = require('node:assert/strict')
const { earnedBadgeIds, labelForBadge } = require('../packages/shared/constants/Badges')

test('earnedBadgeIds returns only granted badge ids', () => {
  assert.deepEqual(earnedBadgeIds(null), [])
  assert.deepEqual(earnedBadgeIds({}), [])
  assert.deepEqual(earnedBadgeIds({ badges: { cpr: 'cpr', 'de-escalation': '' } }), ['cpr'])
  assert.deepEqual(
    earnedBadgeIds({ badges: { cpr: 'cpr', 'de-escalation': 'de-escalation' } }).sort(),
    ['cpr', 'de-escalation']
  )
})

test('labelForBadge turns slugs into words', () => {
  assert.equal(labelForBadge('de-escalation'), 'de escalation')
  assert.equal(labelForBadge('cpr'), 'cpr')
})
