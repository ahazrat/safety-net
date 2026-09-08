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

const DEFAULT_CENTER: [number, number] = [51.505, -0.09];
const DEFAULT_ZOOM = 13;

export default function Map({ pins = [], center = DEFAULT_CENTER, zoom = DEFAULT_ZOOM, style }: MapProps) {
	const containerRef = useRef<HTMLDivElement>(null);
	const mapRef = useRef<L.Map | null>(null);

	useEffect(() => {
		if (!containerRef.current) return;

		const map = L.map(containerRef.current).setView(center, zoom);
		mapRef.current = map;

		L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
			maxZoom: 19,
			attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors',
		}).addTo(map);

		pins.forEach(pin => {
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
