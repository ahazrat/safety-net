import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Text, Card, FAB } from 'react-native-paper';
import { listVisibleListings } from '@safety-net/shared';

const styles = StyleSheet.create({
	view: {
		height: '100%',
		padding: 20,
	},
	title: {
		textAlign: 'center',
		marginBottom: 10,
	},
	singleListing: {
		marginBottom: 10,
	},
	fab: {
		position: 'absolute',
		margin: 16,
		right: 0,
		bottom: 0,
	},
});

const Listings = ({ navigation }) => {
	const [listings, setListings] = useState([]);

	const getListings = () => {
		listVisibleListings()
			.then(setListings)
			.catch(err => console.log(err));
	};

	useEffect(getListings, []);

	// Firestore's `listings` collection may still hold documents from before
	// the Listing shape was canonicalized (title/dateRange/requirements) —
	// see packages/shared/types/Listing.ts. Render defensively for those.
	const singleListing = (listing, i) => {
		const startDate = listing.dateRange
			? `${listing.dateRange.start.year}-${listing.dateRange.start.month}-${listing.dateRange.start.day}`
			: null;
		const endDate = listing.dateRange
			? `${listing.dateRange.end.year}-${listing.dateRange.end.month}-${listing.dateRange.end.day}`
			: null;

		return (
			<Card
				key={i}
				style={styles.singleListing}
				onPress={() => {
					navigation.navigate('Listing', {
						listingId: listing.id,
					})
				}}
			>
				<Card.Title title={listing.title || 'Legacy listing'} />
				<Card.Content>
					{startDate && <Text>Start: {startDate}</Text>}
					{endDate && <Text>End: {endDate}</Text>}
					{listing.requirements && (
						<View>
							<Text>Authentication: {listing.requirements.authentication}</Text>
							<Text>Proximity: {listing.requirements.proximity}</Text>
							<Text>Reputation: {listing.requirements.reputation}</Text>
							<Text>Stake: {listing.requirements.stake}</Text>
						</View>
					)}
				</Card.Content>
			</Card>
		);
	};

	return (
		<View style={styles.view}>
			<Text variant='headlineMedium' style={styles.title}>Listings</Text>
			{listings.map(singleListing)}
			<FAB
				icon='plus'
				label='Create a listing'
				style={styles.fab}
				onPress={() => navigation.navigate('ListingCreate')}
			/>
		</View>
	);
};

export default Listings;
