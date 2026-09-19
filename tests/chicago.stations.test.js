const { test } = require('node:test')
const assert = require('node:assert/strict')
const {
  CHICAGO_POLICE_STATIONS,
  CHICAGO_FIRE_STATIONS,
  policeStationPins,
  fireStationPins,
} = require('../packages/shared/chicago/stations.js')
const { CHICAGO_GATE_BOX, pointInBox } = require('../packages/shared/chicago/geo.js')

test('has all 22 CPD districts plus headquarters', () => {
  assert.equal(CHICAGO_POLICE_STATIONS.length, 23)
  const districts = CHICAGO_POLICE_STATIONS.filter(s => s.district !== 'Headquarters')
  assert.equal(districts.length, 22)
  assert.equal(new Set(districts.map(s => s.district)).size, 22)
})

test('has a deepened batch of CFD stations including marine/OHare/T24/HQ', () => {
  assert.ok(CHICAGO_FIRE_STATIONS.length >= 95)
  assert.equal(CHICAGO_FIRE_STATIONS.length, 98)
  assert.equal(new Set(CHICAGO_FIRE_STATIONS.map(s => s.name)).size, CHICAGO_FIRE_STATIONS.length)
  const byName = Object.fromEntries(CHICAGO_FIRE_STATIONS.map(s => [s.name, s]))
  assert.match(byName.E16.address, /Pershing/i)
  assert.match(byName.E18.address, /S Blue Island/i)
  assert.ok(byName.E2)
  assert.ok(byName.T24)
  assert.ok(byName.Headquarters)
  assert.ok(Object.keys(byName).some(n => n.startsWith('OHare')))
})

test('every station has lat/lng inside the Chicago gate box', () => {
  for (const s of [...CHICAGO_POLICE_STATIONS, ...CHICAGO_FIRE_STATIONS]) {
    assert.equal(typeof s.lat, 'number')
    assert.equal(typeof s.lng, 'number')
    assert.equal(pointInBox(s.lat, s.lng, CHICAGO_GATE_BOX), true, `${s.name || s.district} out of gate box`)
  }
})

test('policeStationPins maps to MapPin shape with kind police', () => {
  const pins = policeStationPins()
  assert.equal(pins.length, CHICAGO_POLICE_STATIONS.length)
  for (const p of pins) {
    assert.equal(p.kind, 'police')
    assert.equal(typeof p.lat, 'number')
    assert.equal(typeof p.lng, 'number')
    assert.match(p.title, /^CPD /)
    assert.match(p.id, /^cpd-/)
  }
})

test('fireStationPins maps to MapPin shape with kind fire', () => {
  const pins = fireStationPins()
  assert.equal(pins.length, CHICAGO_FIRE_STATIONS.length)
  for (const p of pins) {
    assert.equal(p.kind, 'fire')
    assert.match(p.title, /^CFD /)
    assert.match(p.id, /^cfd-/)
  }
})
