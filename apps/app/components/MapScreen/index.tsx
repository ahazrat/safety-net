import React, { useState } from 'react';
import { View } from 'react-native';
import { Switch, Text, Button } from 'react-native-paper';
import Map from '../Map';
import useListingPins from '../../hooks/useListingPins';
import useChicagoCrimePins from '../../hooks/useChicagoCrimePins';
import { CHICAGO_CENTER, CHICAGO_ZOOM } from '@safety-net/shared';

export default function MapScreen({ navigation }) {
	const listings = useListingPins();
	const crime = useChicagoCrimePins();
	const [showCrime, setShowCrime] = useState(true);
	const pins = showCrime ? [...crime, ...listings] : listings;

	return (
		<View style={{ flex: 1 }}>
			<View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 8 }}>
				<Switch value={showCrime} onValueChange={setShowCrime} />
				<Text style={{ marginLeft: 8, flex: 1 }}>
					Chicago reports by community area (30 days)
				</Text>
				<Button compact onPress={() => navigation.navigate('Scanners')}>
					Scanners
				</Button>
			</View>
			<Map
				pins={pins}
				center={CHICAGO_CENTER}
				zoom={CHICAGO_ZOOM}
				style={{ flex: 1, height: '100%' }}
			/>
		</View>
	);
}
