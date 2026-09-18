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
	onPinPress?: (id: string) => void;
};

export default function Map({ pins = [], center, zoom, style, onLocationPress, onPinPress }: MapProps) {
	const onMessage = (event: WebViewMessageEvent) => {
		try {
			const data = JSON.parse(event.nativeEvent.data);
			if (data.type === 'location' && onLocationPress && typeof data.lat === 'number' && typeof data.lng === 'number') {
				onLocationPress(data.lat, data.lng);
			} else if (data.type === 'pin' && onPinPress && typeof data.id === 'string') {
				onPinPress(data.id);
			}
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
