import React from 'react';
import { View } from 'react-native';
import { Button, Text } from 'react-native-paper';
import { usePublicListingPins } from '../../hooks/useListingPins';
import { color, space } from '../../theme/tokens';

export default function EmptyRoster({ navigation, showMapLink, showPost = true, onReplay }) {
	const { pins, ready } = usePublicListingPins();
	if (!ready) return null;
	if (pins.length > 0) {
		return (
			<View style={{ alignSelf: 'stretch', flexDirection: 'row', alignItems: 'center', marginBottom: space.md }}>
				<View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: color.navy, marginRight: space.sm }} />
				<Text style={{ color: color.text, fontWeight: '600' }}>
					{pins.length} open {pins.length === 1 ? 'job' : 'jobs'} on the map right now
				</Text>
			</View>
		);
	}
	return (
		<View style={{ alignSelf: 'stretch', marginBottom: space.md }}>
			<Text style={{ color: color.text, marginBottom: space.sm }}>
				No block watches posted yet. Hire a neighbor to walk the block.
			</Text>
			<View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
				{showPost ? (
					<Button
						mode='contained'
						compact
						onPress={() => navigation.navigate('ListingCreate', { listingType: 'watch', title: 'Neighborhood Watch' })}
					>
						Post a watch
					</Button>
				) : null}
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
