import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Text, Card, Chip, FAB } from 'react-native-paper';
import {
	listVisibleListings,
	listingStatusOf,
	formatListedPrice,
	listingTypeOf,
	listingTypeLabel,
	LISTING_TYPE_CHIPS,
} from '@safety-net/shared';

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
	const [loading, setLoading] = useState(true);
	const [typeFilter, setTypeFilter] = useState(null);

	const getListings = () => {
		listVisibleListings()
			.then(setListings)
			.catch(err => console.log(err))
			.finally(() => setLoading(false));
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
					<Chip compact style={{ alignSelf: 'flex-start', marginBottom: 6 }}>
						{listingTypeLabel(listing)}
					</Chip>
					<Text>Status: {listingStatusOf(listing).replace('_', ' ')}</Text>
					<Text>Price: {formatListedPrice(listing) || 'No price set'}</Text>
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

	const visible = typeFilter
		? listings.filter(listing => listingTypeOf(listing) === typeFilter)
		: listings;

	return (
		<View style={styles.view}>
			<Text variant='headlineMedium' style={styles.title}>Listings</Text>
			<View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 12 }}>
				<Chip compact selected={typeFilter == null} onPress={() => setTypeFilter(null)}>All</Chip>
				{LISTING_TYPE_CHIPS.map(({ value, label }) => (
					<Chip
						key={value}
						compact
						selected={typeFilter === value}
						onPress={() => setTypeFilter(value)}
					>
						{label}
					</Chip>
				))}
			</View>
			{!loading && listings.length === 0 && (
				<Text style={{ textAlign: 'center', marginTop: 24 }}>
					No open listings right now. Be the first to post one.
				</Text>
			)}
			{!loading && listings.length > 0 && visible.length === 0 && (
				<Text style={{ textAlign: 'center', marginTop: 24 }}>
					No listings of this type.
				</Text>
			)}
			{visible.map(singleListing)}
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
