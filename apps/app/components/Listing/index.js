import React, { useContext, useEffect, useState } from 'react';
import { View, ScrollView } from 'react-native';
import { Text, Card, ActivityIndicator, Button } from 'react-native-paper';
import {
	AuthUserContext,
	getDocument,
	listingStatusOf,
	acceptListing,
	setListingStatus,
	formatListedPrice,
} from '@safety-net/shared';
import Map from '../Map';
import PublicProfile from '../PublicProfile';

const Listing = ({ route, navigation }) => {
	const authUser = useContext(AuthUserContext);
	const listingId = route?.params?.listingId;
	const [listing, setListing] = useState(null);
	const [loading, setLoading] = useState(true);
	const [jobError, setJobError] = useState(null);
	const [jobBusy, setJobBusy] = useState(false);

	const load = () => {
		if (!listingId) {
			setLoading(false);
			return Promise.resolve();
		}
		return getDocument('listings', listingId)
			.then(setListing)
			.catch(err => console.log(err))
			.finally(() => setLoading(false));
	};

	useEffect(() => {
		load();
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

	const status = listingStatusOf(listing);
	const uid = authUser && authUser.uid;
	const isOwner = uid && listing.ownerUid === uid;
	const isAssignee = uid && listing.assigneeUid === uid;
	const canAccept = uid && !isOwner && status === 'open';
	const canStart = uid && isAssignee && status === 'accepted';
	const canComplete = uid && (isAssignee || isOwner) && (status === 'accepted' || status === 'in_progress');

	const runJob = (fn) => {
		setJobBusy(true);
		setJobError(null);
		fn()
			.then(load)
			.catch(setJobError)
			.finally(() => setJobBusy(false));
	};

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
			<Text style={{ marginBottom: 8 }}>Status: {status.replace('_', ' ')}</Text>
			<Text style={{ marginBottom: 8 }}>
				Price: {formatListedPrice(listing) || 'No price set'}
			</Text>
			<PublicProfile uid={listing.ownerUid} label='Posted by' />
			{listing.assigneeUid ? (
				<PublicProfile uid={listing.assigneeUid} label='Assigned to' />
			) : (
				<Text style={{ marginBottom: 8 }}>No assignee yet</Text>
			)}
			{canAccept && (
				<Button mode='contained' disabled={jobBusy} style={{ marginBottom: 8 }} onPress={() => runJob(() => acceptListing(listingId))}>
					Accept job
				</Button>
			)}
			{canStart && (
				<Button mode='contained' disabled={jobBusy} style={{ marginBottom: 8 }} onPress={() => runJob(() => setListingStatus(listingId, 'in_progress'))}>
					Start job
				</Button>
			)}
			{canComplete && (
				<Button mode='contained' disabled={jobBusy} style={{ marginBottom: 8 }} onPress={() => runJob(() => setListingStatus(listingId, 'done'))}>
					Mark done
				</Button>
			)}
			{jobError && <Text style={{ color: '#b00020', marginBottom: 8 }}>{jobError.message}</Text>}
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
