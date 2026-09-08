import React from 'react';
import { Linking, ScrollView, View } from 'react-native';
import { Text, Button } from 'react-native-paper';

export default function AttributionScreen() {
	return (
		<ScrollView contentContainerStyle={{ padding: 16 }}>
			<Text variant='headlineMedium' style={{ marginBottom: 16 }}>Map Attribution</Text>
			<Text style={{ marginBottom: 12 }}>
				Map tiles and data throughout this app are provided by OpenStreetMap,
				a free, editable map of the world built by volunteers and released
				under the Open Database License (ODbL).
			</Text>
			<View style={{ marginBottom: 8 }}>
				<Text>© OpenStreetMap contributors</Text>
			</View>
			<Button mode='text' onPress={() => Linking.openURL('https://www.openstreetmap.org/copyright')}>
				View full OpenStreetMap copyright &amp; license
			</Button>
		</ScrollView>
	);
}
