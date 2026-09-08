const { test, beforeEach } = require('node:test')
const assert = require('node:assert/strict')

const {
  chicagoCrimeAggregateUrl,
  chicagoCrimeSinceIso,
  mapCrimeRows,
  radiusForCount,
  fetchChicagoCrimeAreas,
  clearChicagoCrimeCache,
} = require('../packages/shared/chicago/crime')
const { nameForCommunityArea } = require('../packages/shared/chicago/communityAreas')

beforeEach(() => {
  clearChicagoCrimeCache()
})

test('aggregate URL groups by community area on the Chicago SODA dataset', () => {
  const now = new Date('2026-09-08T12:00:00.000Z')
  const url = chicagoCrimeAggregateUrl({ now, days: 30 })
  assert.match(url, /ijzp-q8t2\.json/)
  assert.match(url, /%24group=community_area/)
  assert.match(url, /count%28\*%29/)
  assert.equal(chicagoCrimeSinceIso(30, now), '2026-08-09T12:00:00')
})

test('mapCrimeRows drops bad rows and sizes circles by relative count', () => {
  const pins = mapCrimeRows([
    { community_area: '8', lat: '41.9', lng: '-87.63', count: '100' },
    { community_area: '25', lat: '41.89', lng: '-87.76', count: '50' },
    { community_area: '1', lat: 'nope', lng: '-87.6', count: '9' },
  ])
  assert.equal(pins.length, 2)
  assert.equal(pins[0].kind, 'crime')
  assert.match(pins[0].title, /Near North Side/)
  assert.equal(pins[0].count, 100)
  assert.ok(pins[0].radius > pins[1].radius)
  assert.ok(radiusForCount(100, 100) > radiusForCount(1, 100))
})

test('nameForCommunityArea covers the 77 areas', () => {
  assert.equal(nameForCommunityArea('32'), 'Loop')
  assert.equal(nameForCommunityArea(99), 'Area 99')
})

test('fetchChicagoCrimeAreas uses SODA rows and caches', async () => {
  let calls = 0
  const fetchImpl = async () => {
    calls += 1
    return {
      ok: true,
      json: async () => [{ community_area: '32', lat: '41.88', lng: '-87.63', count: '12' }],
    }
  }
  const first = await fetchChicagoCrimeAreas({ fetchImpl, now: new Date('2026-09-08T00:00:00Z') })
  const second = await fetchChicagoCrimeAreas({ fetchImpl, now: new Date('2026-09-08T01:00:00Z') })
  assert.equal(calls, 1)
  assert.equal(first.length, 1)
  assert.equal(second[0].title.includes('Loop'), true)
})
