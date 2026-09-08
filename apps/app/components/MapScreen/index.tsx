import React from 'react';
import { View } from 'react-native';
import Map from '../Map';
import useListingPins from '../../hooks/useListingPins';

export default function MapScreen() {
	const pins = useListingPins();

	return (
		<View style={{ flex: 1 }}>
			<Map pins={pins} style={{ height: '100%' }} />
		</View>
	);
}
