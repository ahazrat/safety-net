export type MapPin = {
	lat: number;
	lng: number;
	title?: string;
};

const DEFAULT_CENTER: [number, number] = [51.505, -0.09];
const DEFAULT_ZOOM = 13;

// Builds a standalone HTML document that renders an OSM/Leaflet map with the
// given pins, loading Leaflet from a CDN. Used by Map.native.tsx inside a
// WebView, where there's no npm-bundled `leaflet` DOM access.
export function buildLeafletHtml(
	pins: MapPin[] = [],
	center: [number, number] = DEFAULT_CENTER,
	zoom: number = DEFAULT_ZOOM
): string {
	const markers = pins
		.map(
			pin => `L.marker([${pin.lat}, ${pin.lng}])${
				pin.title ? `.bindPopup(${JSON.stringify(pin.title)})` : ''
			}.addTo(map);`
		)
		.join('\n');

	return `<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8" />
	<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
	<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
	<style>html, body, #map { height: 100%; margin: 0; padding: 0; }</style>
</head>
<body>
	<div id="map"></div>
	<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
	<script>
		// OSM's license (ODbL) requires attribution, but not necessarily on the
		// map itself -- it's surfaced instead via the app's Attribution screen.
		var map = L.map('map', { attributionControl: false }).setView([${center[0]}, ${center[1]}], ${zoom});
		L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
			maxZoom: 19
		}).addTo(map);
		${markers}
	</script>
</body>
</html>`;
}
