const { test } = require('node:test')
const assert = require('node:assert/strict')
const {
  CHICAGO_GATE_BOX,
  pointInBox,
  pointInCircle,
  pointInPolygon,
  pointInChicagoGate,
} = require('../packages/shared/chicago/geo.js')

test('default box includes Loop, excludes Milwaukee', () => {
  assert.equal(pointInBox(41.88, -87.63, CHICAGO_GATE_BOX), true)
  assert.equal(pointInChicagoGate(41.88, -87.63), true)
  assert.equal(pointInChicagoGate(43.04, -87.91), false)
})

test('circle radius around CHICAGO_CENTER', () => {
  const loop = { kind: 'circle', lat: 41.8781, lng: -87.6298, radiusKm: 8 }
  assert.equal(pointInChicagoGate(41.88, -87.63, loop), true)
  assert.equal(pointInCircle(42.5, -87.63, loop), false)
})

test('polygon ring (rough downtown square)', () => {
  const ring = [
    { lat: 41.86, lng: -87.66 },
    { lat: 41.86, lng: -87.60 },
    { lat: 41.90, lng: -87.60 },
    { lat: 41.90, lng: -87.66 },
  ]
  assert.equal(pointInPolygon(41.88, -87.63, ring), true)
  assert.equal(pointInChicagoGate(41.82, -87.63, { kind: 'polygon', ring }), false)
})
