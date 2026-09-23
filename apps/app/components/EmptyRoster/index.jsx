import React from 'react';
import { View } from 'react-native';
import { Button, Text } from 'react-native-paper';
import { usePublicListingPins } from '../../hooks/useListingPins';
import { color, space } from '../../theme/tokens';

export default function EmptyRoster({ navigation, showMapLink, onReplay }) {
	const { pins, ready } = usePublicListingPins();
	if (!ready || pins.length > 0) return null;
	return (
		<View style={{ alignSelf: 'stretch', marginBottom: space.md }}>
			<Text style={{ color: color.text, marginBottom: space.sm }}>
				No block watches posted yet. Hire a neighbor to walk the block.
			</Text>
			<View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
				<Button
					mode='contained'
					compact
					onPress={() => navigation.navigate('ListingCreate', { listingType: 'watch', title: 'Neighborhood Watch' })}
				>
					Post a watch
				</Button>
				{showMapLink ? (
					<Button compact mode='outlined' onPress={() => navigation.navigate('Map')}>Open the map</Button>
				) : null}
				{onReplay ? (
					<Button compact mode='text' onPress={onReplay}>See the example tour</Button>
				) : null}
			</View>
		</View>
	);
}
