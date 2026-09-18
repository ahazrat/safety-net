import React, { useEffect, useRef } from 'react';
import { View, ViewStyle } from 'react-native';
import * as L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin } from './leafletTemplate';

type MapProps = {
	pins?: MapPin[];
	center?: [number, number];
	zoom?: number;
	style?: ViewStyle;
};

const DEFAULT_CENTER: [number, number] = [41.85, -87.65];
const DEFAULT_ZOOM = 11;

// Kept in sync with leafletTemplate.ts's STATION_STYLE (native WebView path).
const STATION_STYLE: Record<string, { color: string; fillColor: string }> = {
	police: { color: '#1a4d8f', fillColor: '#2e6fd6' },
	fire: { color: '#a03d00', fillColor: '#e8590c' },
};

export default function Map({ pins = [], center = DEFAULT_CENTER, zoom = DEFAULT_ZOOM, style }: MapProps) {
	const containerRef = useRef<HTMLDivElement>(null);
	const mapRef = useRef<L.Map | null>(null);

	useEffect(() => {
		if (!containerRef.current) return;

		// OSM's license (ODbL) requires attribution, but not necessarily on the
		// map itself — it's surfaced instead via the Attribution screen
		// (navigation/index.tsx), reachable from the drawer.
		const map = L.map(containerRef.current, { attributionControl: false }).setView(center, zoom);
		mapRef.current = map;

		L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
			maxZoom: 19,
		}).addTo(map);

		pins.forEach(pin => {
			if (pin.kind === 'crime') {
				const circle = L.circle([pin.lat, pin.lng], {
					radius: pin.radius || 400,
					color: '#922b21',
					fillColor: '#c0392b',
					fillOpacity: 0.28,
					weight: 1,
				}).addTo(map);
				if (pin.title) circle.bindPopup(pin.title);
				return;
			}
			if (pin.kind === 'police' || pin.kind === 'fire') {
				const style = STATION_STYLE[pin.kind];
				const marker = L.circleMarker([pin.lat, pin.lng], {
					radius: 7,
					color: style.color,
					fillColor: style.fillColor,
					fillOpacity: 0.9,
					weight: 2,
				}).addTo(map);
				if (pin.title) marker.bindPopup(pin.title);
				return;
			}
			const marker = L.marker([pin.lat, pin.lng]).addTo(map);
			if (pin.title) marker.bindPopup(pin.title);
		});

		return () => {
			map.remove();
			mapRef.current = null;
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [JSON.stringify(pins), center[0], center[1], zoom]);

	return (
		<View style={[{ height: 400 }, style]}>
			{/* @ts-ignore - react-native-web passes View style through to a plain div */}
			<div ref={containerRef} style={{ height: '100%', width: '100%' }} />
		</View>
	);
}
