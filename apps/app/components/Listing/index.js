import React, { useContext, useEffect, useState } from 'react';
import { View, ScrollView } from 'react-native';
import { Text, Card, ActivityIndicator, Button } from 'react-native-paper';
import { AuthUserContext, getDocument } from '@safety-net/shared';
import Map from '../Map';

const Listing = ({ route, navigation }) => {
	const authUser = useContext(AuthUserContext);
	const listingId = route?.params?.listingId;
	const [listing, setListing] = useState(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		if (!listingId) {
			setLoading(false);
			return;
		}
		getDocument('listings', listingId)
			.then(setListing)
			.catch(err => console.log(err))
			.finally(() => setLoading(false));
	}, [listingId]);

	if (loading) {
		return (
			<View style={{ padding: 16 }}>
				<ActivityIndicator animating />
			</View>
		);
	}

	if (!listing) {
		return (
			<View style={{ padding: 16 }}>
				<Text>Listing not found.</Text>
			</View>
		);
	}

	const startDate = listing.dateRange
		? `${listing.dateRange.start.year}-${listing.dateRange.start.month}-${listing.dateRange.start.day}`
		: null;
	const endDate = listing.dateRange
		? `${listing.dateRange.end.year}-${listing.dateRange.end.month}-${listing.dateRange.end.day}`
		: null;

	return (
		<ScrollView style={{ padding: 16 }}>
			<Text variant='headlineMedium' style={{ marginBottom: 12 }}>{listing.title || 'Legacy listing'}</Text>
			{authUser && listing.ownerUid && listing.ownerUid !== authUser.uid && (
				<Button
					mode='outlined'
					style={{ marginBottom: 12 }}
					onPress={() => navigation.navigate('Messages', { otherUid: listing.ownerUid })}
				>
					Message owner
				</Button>
			)}
			{startDate && <Text>Start: {startDate}</Text>}
			{endDate && <Text>End: {endDate}</Text>}
			{listing.requirements && (
				<Card style={{ marginVertical: 12 }}>
					<Card.Title title='Requirements' />
					<Card.Content>
						<Text>Authentication: {listing.requirements.authentication}</Text>
						<Text>Proximity: {listing.requirements.proximity}</Text>
						<Text>Reputation: {listing.requirements.reputation}</Text>
						<Text>Stake: {listing.requirements.stake}</Text>
					</Card.Content>
				</Card>
			)}
			{listing.location && (
				<Map
					pins={[{ lat: listing.location.lat, lng: listing.location.lng, title: listing.title }]}
					center={[listing.location.lat, listing.location.lng]}
					style={{ marginTop: 12 }}
				/>
			)}
		</ScrollView>
	);
};

export default Listing;
