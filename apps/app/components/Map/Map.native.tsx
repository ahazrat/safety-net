import React from 'react';
import { View, ViewStyle } from 'react-native';
import { WebView } from 'react-native-webview';
import { buildLeafletHtml, MapPin } from './leafletTemplate';

type MapProps = {
	pins?: MapPin[];
	center?: [number, number];
	zoom?: number;
	style?: ViewStyle;
};

export default function Map({ pins = [], center, zoom, style }: MapProps) {
	return (
		<View style={[{ height: 400 }, style]}>
			<WebView
				originWhitelist={['*']}
				source={{ html: buildLeafletHtml(pins, center, zoom) }}
				style={{ flex: 1 }}
			/>
		</View>
	);
}
