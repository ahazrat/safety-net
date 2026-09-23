/** Client-side example only. Never written to Firestore or Auth. */

export const BLOCK_WATCH = {
	neighborhood: 'Bridgeport',
	street: 'W 31st Street near S Halsted',
	walksPerNight: 2,
	houseCount: 8,
	pricePerHouseCents: 500,
}

export const BLOCK_WATCH_CENTER = [41.83815, -87.6464]
export const BLOCK_WATCH_ZOOM = 17

export function exampleNightlyCents(scenario = BLOCK_WATCH) {
	return scenario.houseCount * scenario.pricePerHouseCents
}

export function blockWatchPins(scenario = BLOCK_WATCH) {
	const startLat = 41.83815
	const startLng = -87.64715
	const pins = []
	for (let i = 0; i < scenario.houseCount; i++) {
		pins.push({
			id: `example-house-${i + 1}`,
			lat: startLat + (i % 2) * 0.00003,
			lng: startLng + i * 0.00022,
			kind: 'example',
			title: `Example house ${i + 1} · $5 listed`,
		})
	}
	return pins
}
