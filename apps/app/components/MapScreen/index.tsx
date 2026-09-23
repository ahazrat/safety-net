import React, { useContext, useState } from 'react';
import { View } from 'react-native';
import { Switch, Text, Button } from 'react-native-paper';
import Map from '../Map';
import useListingPins from '../../hooks/useListingPins';
import useChicagoCrimePins from '../../hooks/useChicagoCrimePins';
import { usePoliceStationPins, useFireStationPins } from '../../hooks/useChicagoStationPins';
import { CHICAGO_CENTER, CHICAGO_ZOOM } from '@safety-net/shared';
import { DemoContext } from '../../tour/DemoContext';
import { BLOCK_WATCH_CENTER, BLOCK_WATCH_ZOOM, blockWatchPins } from '../../tour/blockWatch';
import { color, space } from '../../theme/tokens';
import EmptyRoster from '../EmptyRoster';

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

	const { pinsOn, replayTour } = useContext(DemoContext);
	const [layersOpen, setLayersOpen] = useState(false);
	const [showCrime, setShowCrime] = useState(true);
	const [showPolice, setShowPolice] = useState(false);
	const [showFire, setShowFire] = useState(false);

	const pins = [
		...listings,
		...(pinsOn ? blockWatchPins() : []),
		...(showCrime ? crime : []),
		...(showPolice ? police : []),
		...(showFire ? fire : []),
	];

	return (
		<View testID="tour-map" style={{ flex: 1, backgroundColor: color.background }}>
			<View style={{ paddingHorizontal: space.md, paddingTop: space.sm, borderBottomWidth: 1, borderBottomColor: color.border }}>
				<Button compact mode={layersOpen ? 'contained' : 'outlined'} onPress={() => setLayersOpen(open => !open)} style={{ alignSelf: 'flex-start', marginBottom: space.sm }}>
					Layers
				</Button>
				<Text style={{ color: color.textMuted, marginBottom: space.sm }}>
					Chicago reports by community area (last 30 days). Circles are counts, not individual incidents.
				</Text>
				{layersOpen ? (
					<View style={{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center' }}>
						<LayerToggle value={showCrime} onValueChange={setShowCrime} label="Crime (30 days)" />
						<LayerToggle value={showPolice} onValueChange={setShowPolice} label={`Police stations (${police.length})`} />
						<LayerToggle value={showFire} onValueChange={setShowFire} label={`Fire stations (${fire.length})`} />
						<Button compact onPress={() => navigation.navigate('Scanners')} style={{ marginBottom: 8 }}>
							Scanners
						</Button>
					</View>
				) : null}
			</View>
			<View style={{ paddingHorizontal: space.md, paddingTop: space.sm }}>
				<EmptyRoster navigation={navigation} onReplay={replayTour} />
			</View>
			<Map
				pins={pins}
				center={pinsOn ? BLOCK_WATCH_CENTER : CHICAGO_CENTER}
				zoom={pinsOn ? BLOCK_WATCH_ZOOM : CHICAGO_ZOOM}
				style={{ flex: 1, height: '100%' }}
				onPinPress={(id) => {
					if (String(id).startsWith('example-')) return;
					navigation.navigate('Listing', { listingId: id });
				}}
			/>
		</View>
	);
}
