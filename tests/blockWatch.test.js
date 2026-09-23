const { test } = require('node:test')
const assert = require('node:assert/strict')
const {
	BLOCK_WATCH,
	blockWatchPins,
	exampleNightlyCents,
} = require('../apps/app/tour/blockWatch')

test('block watch example is 5 to 10 houses at $5, nightly total in the example band', () => {
	assert.ok(BLOCK_WATCH.houseCount >= 5 && BLOCK_WATCH.houseCount <= 10)
	assert.equal(BLOCK_WATCH.pricePerHouseCents, 500)
	assert.equal(BLOCK_WATCH.walksPerNight, 2)
	const total = exampleNightlyCents()
	assert.equal(total, 4000)
	assert.ok(total >= 2500 && total <= 5000)
	const pins = blockWatchPins()
	assert.equal(pins.length, BLOCK_WATCH.houseCount)
	assert.ok(pins.every(pin => pin.kind === 'example' && String(pin.id).startsWith('example-')))
})
