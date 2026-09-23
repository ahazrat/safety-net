const { test } = require('node:test')
const assert = require('node:assert/strict')
const {
  teamSizeOf,
  normalizeTeamSize,
  rosterOf,
  captainUidOf,
  isRosterFull,
  teamLabel,
} = require('../packages/shared/utils/team')

test('missing team size is a solo job', () => {
  assert.equal(teamSizeOf(null), 1)
  assert.equal(teamSizeOf({}), 1)
  assert.equal(teamSizeOf({ teamSize: 0 }), 1)
  assert.equal(teamSizeOf({ teamSize: 9 }), 1)
  assert.equal(teamSizeOf({ teamSize: 4 }), 4)
})

test('normalizeTeamSize clamps to 1..8', () => {
  assert.equal(normalizeTeamSize(undefined), 1)
  assert.equal(normalizeTeamSize(1.5), 1)
  assert.equal(normalizeTeamSize(0), 1)
  assert.equal(normalizeTeamSize(8), 8)
  assert.equal(normalizeTeamSize(12), 8)
})

test('roster, captain, and full', () => {
  const listing = { assigneeUid: 'cap', teamSize: 3, rosterUids: ['cap', 'bob', ''] }
  assert.deepEqual(rosterOf(listing), ['cap', 'bob'])
  assert.equal(captainUidOf(listing), 'cap')
  assert.equal(isRosterFull(listing), false)
  assert.equal(isRosterFull({ teamSize: 2, rosterUids: ['cap', 'bob'], assigneeUid: 'cap' }), true)
  assert.equal(teamLabel({ teamSize: 1 }), 'Solo')
  assert.equal(teamLabel({ teamSize: 3, rosterUids: ['cap'] }), 'Team 1/3')
  assert.deepEqual(rosterOf({ rosterUids: 'nope' }), [])
})
