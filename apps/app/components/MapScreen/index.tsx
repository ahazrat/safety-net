import React, { useState } from 'react';
import { View } from 'react-native';
import { Switch, Text, Button } from 'react-native-paper';
import Map from '../Map';
import useListingPins from '../../hooks/useListingPins';
import useChicagoCrimePins from '../../hooks/useChicagoCrimePins';
import { usePoliceStationPins, useFireStationPins } from '../../hooks/useChicagoStationPins';
import { CHICAGO_CENTER, CHICAGO_ZOOM } from '@safety-net/shared';

function LayerToggle({ value, onValueChange, label }) {
	return (
		<View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 16, marginBottom: 8 }}>
			<Switch value={value} onValueChange={onValueChange} />
			<Text style={{ marginLeft: 8 }}>{label}</Text>
		</View>
	);
}

export default function MapScreen({ navigation }) {
	const listings = useListingPins();
	const crime = useChicagoCrimePins();
	const police = usePoliceStationPins();
	const fire = useFireStationPins();

	const [showCrime, setShowCrime] = useState(true);
	const [showPolice, setShowPolice] = useState(false);
	const [showFire, setShowFire] = useState(false);

	const pins = [
		...listings,
		...(showCrime ? crime : []),
		...(showPolice ? police : []),
		...(showFire ? fire : []),
	];

	return (
		<View style={{ flex: 1 }}>
			<View style={{ paddingHorizontal: 12, paddingTop: 8, flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center' }}>
				<LayerToggle value={showCrime} onValueChange={setShowCrime} label="Crime (30 days)" />
				<LayerToggle value={showPolice} onValueChange={setShowPolice} label="Police stations" />
				<LayerToggle value={showFire} onValueChange={setShowFire} label="Fire stations" />
				<Button compact onPress={() => navigation.navigate('Scanners')} style={{ marginBottom: 8 }}>
					Scanners
				</Button>
			</View>
			<Map
				pins={pins}
				center={CHICAGO_CENTER}
				zoom={CHICAGO_ZOOM}
				style={{ flex: 1, height: '100%' }}
				onPinPress={(id) => navigation.navigate('Listing', { listingId: id })}
			/>
		</View>
	);
}
