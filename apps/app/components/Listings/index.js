import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Button } from 'react-native';
import { getCollection } from '@safety-net/shared';

const styles = StyleSheet.create({
	view: {
		backgroundColor: 'white',
		height: '100%',
		padding: 20,
	},
	title: {
		textAlign: 'center',
		fontSize: 30,
		fontWeight: 'bold',
		marginBottom: 10,
	},
	singleListing: {
		borderWidth: 1,
		padding: 10,
		marginBottom: 10,
		display: 'flex',
		flexDirection: 'row',
	},
});

const Listings = ({ navigation }) => {
	const [listings, setListings] = useState([]);

	const getListings = () => {
		getCollection('listings')
			.then(setListings)
			.catch(err => console.log(err));
	};

	useEffect(getListings, []);

	// Firestore's `listings` collection holds both mobile's shape (title/
	// dateRange/requirements) and web's shape (jobTitle/fullName/location) —
	// see packages/shared/types/Listing.ts. Render defensively.
	const singleListing = (listing, i) => {
		const startDate = listing.dateRange
			? `${listing.dateRange.start.year}-${listing.dateRange.start.month}-${listing.dateRange.start.day}`
			: null;
		const endDate = listing.dateRange
			? `${listing.dateRange.end.year}-${listing.dateRange.end.month}-${listing.dateRange.end.day}`
			: null;

		return (
			<TouchableOpacity key={i} onPress={() => {
				navigation.navigate('Listing', {
					listingId: listing.id,
				})
			}}>
				<View style={styles.singleListing}>
					<View style={{ marginRight: 20 }}>
						<Text style={{ fontWeight: 'bold' }}>{listing.title || listing.jobTitle}</Text>
						{startDate && <Text>Start: {startDate}</Text>}
						{endDate && <Text>End: {endDate}</Text>}
					</View>
					{listing.requirements && (
						<View>
							<Text>Authentication: {listing.requirements.authentication}</Text>
							<Text>Proximity: {listing.requirements.proximity}</Text>
							<Text>Reputation: {listing.requirements.reputation}</Text>
							<Text>Stake: {listing.requirements.stake}</Text>
						</View>
					)}
				</View>
			</TouchableOpacity>
		);
	};

	return (
		<View style={styles.view}>
			<Text style={styles.title}>Listings</Text>
			{listings.map(singleListing)}
			<Button
				title='Create a listing'
				onPress={() => navigation.navigate('ListingCreate')}
			/>
		</View>
	);
};

export default Listings;
