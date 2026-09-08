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
			<Text variant='titleMedium' style={{ marginTop: 24, marginBottom: 8 }}>Chicago crime overlay</Text>
			<Text style={{ marginBottom: 12 }}>
				Reported-incident counts by community area come from the City of Chicago
				Data Portal (Chicago Police Department, Crimes 2001 to Present). The
				city withholds the most recent seven days. This app shows 30-day
				aggregates, not individual incident pins.
			</Text>
			<Button mode='text' onPress={() => Linking.openURL('https://data.cityofchicago.org/Public-Safety/Crimes-2001-to-Present/ijzp-q8t2')}>
				City of Chicago crimes dataset
			</Button>
			<Text variant='titleMedium' style={{ marginTop: 24, marginBottom: 8 }}>Scanner links</Text>
			<Text style={{ marginBottom: 12 }}>
				The Scanners screen links to Broadcastify and OpenMHz. Those sites
				host the audio. SafetyNet does not embed or autoplay streams.
			</Text>
		</ScrollView>
	);
}
