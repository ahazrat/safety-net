import React from 'react';
import { Linking, ScrollView, View } from 'react-native';
import { Text, Card, Button } from 'react-native-paper';
import { chicagoScannerFeeds } from '@safety-net/shared';

export default function ScannersScreen() {
	const feeds = chicagoScannerFeeds();

	return (
		<ScrollView contentContainerStyle={{ padding: 16 }}>
			<Text variant='headlineMedium' style={{ marginBottom: 8 }}>Scanners</Text>
			<Text style={{ marginBottom: 12 }}>
				Chicago public-safety radio, as links. This app does not play audio.
				Feeds open in your browser. This is not 911 and not a dispatch product.
			</Text>
			{feeds.map(feed => (
				<Card key={feed.id} style={{ marginBottom: 10 }}>
					<Card.Title title={feed.title} subtitle={`${feed.area} · ${feed.source}`} />
					<Card.Content>
						{feed.notes ? <Text style={{ marginBottom: 8 }}>{feed.notes}</Text> : null}
						<Button mode='outlined' onPress={() => Linking.openURL(feed.url)}>
							Open feed
						</Button>
					</Card.Content>
				</Card>
			))}
			<View style={{ height: 24 }} />
		</ScrollView>
	);
}
