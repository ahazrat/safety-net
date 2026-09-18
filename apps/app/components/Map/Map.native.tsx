import React from 'react';
import { View, ViewStyle } from 'react-native';
import { WebView, WebViewMessageEvent } from 'react-native-webview';
import { buildLeafletHtml, MapPin } from './leafletTemplate';

type MapProps = {
	pins?: MapPin[];
	center?: [number, number];
	zoom?: number;
	style?: ViewStyle;
	onLocationPress?: (lat: number, lng: number) => void;
};

export default function Map({ pins = [], center, zoom, style, onLocationPress }: MapProps) {
	const onMessage = (event: WebViewMessageEvent) => {
		if (!onLocationPress) return;
		try {
			const { lat, lng } = JSON.parse(event.nativeEvent.data);
			if (typeof lat === 'number' && typeof lng === 'number') onLocationPress(lat, lng);
		} catch (e) {
			// Ignore malformed messages rather than crash the screen over a tap.
		}
	};

	return (
		<View style={[{ height: 400 }, style]}>
			<WebView
				originWhitelist={['*']}
				source={{ html: buildLeafletHtml(pins, center, zoom, { interactive: !!onLocationPress }) }}
				style={{ flex: 1 }}
				onMessage={onMessage}
			/>
		</View>
	);
}
