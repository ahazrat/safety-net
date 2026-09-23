import React, { useContext, useEffect, useRef, useState } from 'react';
import { View, ScrollView } from 'react-native';
import { Text, Card, Chip, ActivityIndicator, Button, TextInput } from 'react-native-paper';
import {
	AuthUserContext,
	getDocument,
	listingStatusOf,
	acceptListing,
	requestToJoin,
	listJoinRequests,
	addRosterMember,
	setListingStatus,
	formatListedPrice,
	formatCents,
	dollarsTextToCents,
	offPlatformAgreedCents,
	proposeOffPlatformPrice,
	ackOffPlatformPrice,
	listingTypeLabel,
	teamSizeOf,
	rosterOf,
	removeRosterMember,
} from '@safety-net/shared';
import Map from '../Map';
import PublicProfile from '../PublicProfile';
import SentinelPulse from '../SentinelPulse';
import PriceNote from '../PriceNote';

const CONFIRM_PULSE_MS = 900;

const Listing = ({ route, navigation }) => {
	const authUser = useContext(AuthUserContext);
	const listingId = route?.params?.listingId;
	const [listing, setListing] = useState(null);
	const [loading, setLoading] = useState(true);
	const [jobError, setJobError] = useState(null);
	const [jobBusy, setJobBusy] = useState(false);
	const [offerDollars, setOfferDollars] = useState('');
	const [joinRequests, setJoinRequests] = useState([]);
	const [pulseVisible, setPulseVisible] = useState(false);
	const [pulseKey, setPulseKey] = useState(0);
	const pulseTimer = useRef(null);

	const load = () => {
		if (!listingId) {
			setLoading(false);
			return Promise.resolve();
		}
		return getDocument('listings', listingId)
			.then(doc => {
				setListing(doc);
				if (doc && authUser && doc.assigneeUid === authUser.uid && teamSizeOf(doc) > 1) {
					return listJoinRequests(listingId).then(setJoinRequests).catch(() => setJoinRequests([]));
				}
				setJoinRequests([]);
			})
			.catch(err => console.log(err))
			.finally(() => setLoading(false));
	};

	useEffect(() => {
		load();
	}, [listingId]);

	useEffect(() => () => clearTimeout(pulseTimer.current), []);

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
	const teamSize = teamSizeOf(listing);
	const roster = rosterOf(listing);
	const onRoster = uid && roster.includes(uid);
	const rosterFull = roster.length >= teamSize;
	const canAccept = uid && !isOwner && status === 'open';
	const canRequest = uid && !isOwner && !isAssignee && !onRoster && !rosterFull
		&& teamSize > 1 && status === 'accepted';
	const canStart = uid && isAssignee && status === 'accepted' && (teamSize <= 1 || rosterFull);
	const canComplete = uid && (isAssignee || isOwner) && (status === 'accepted' || status === 'in_progress');

	const runJob = (fn) => {
		setJobBusy(true);
		setJobError(null);
		fn()
			.then(load)
			.then(() => {
				setPulseKey(k => k + 1);
				setPulseVisible(true);
				clearTimeout(pulseTimer.current);
				pulseTimer.current = setTimeout(() => setPulseVisible(false), CONFIRM_PULSE_MS);
			})
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
			{pulseVisible && (
				<View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
					<SentinelPulse key={pulseKey} status='confirmed' label='Updated' size={40} />
					<Text style={{ marginLeft: 8 }}>Updated</Text>
				</View>
			)}
			<Text variant='headlineMedium' style={{ marginBottom: 8 }}>{listing.title || 'Legacy listing'}</Text>
			<Chip compact style={{ alignSelf: 'flex-start', marginBottom: 12 }}>
				{listingTypeLabel(listing)}
			</Chip>
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
			<Text style={{ marginBottom: 4 }}>
				Price: {formatListedPrice(listing) || 'No price set'}
			</Text>
			<PriceNote />
			<PublicProfile uid={listing.ownerUid} label='Posted by' />
			{teamSize > 1 ? (
				<View style={{ marginBottom: 12 }}>
					<Text style={{ marginBottom: 8 }}>
						Team {roster.length} of {teamSize}. The first person to accept is captain.
					</Text>
					{roster.length === 0 && <Text style={{ marginBottom: 8 }}>No one on the roster yet</Text>}
					{roster.map((memberUid, index) => (
						<View key={memberUid} style={{ marginBottom: 8 }}>
							<PublicProfile uid={memberUid} label={index === 0 ? 'Captain' : 'Roster'} />
							{isAssignee && index > 0 && status === 'accepted' && (
								<Button
									mode='text'
									disabled={jobBusy}
									onPress={() => runJob(() => removeRosterMember(listingId, memberUid))}
								>
									Remove from roster
								</Button>
							)}
						</View>
					))}
					{isAssignee && joinRequests.map(request => (
						<View key={request.uid} style={{ marginBottom: 8 }}>
							<PublicProfile uid={request.uid} label='Wants to join' />
							<Button
								mode='outlined'
								disabled={jobBusy || rosterFull}
								onPress={() => runJob(() => addRosterMember(listingId, request.uid))}
							>
								Add to roster
							</Button>
						</View>
					))}
					{isAssignee && !rosterFull && status === 'accepted' && (
						<Text style={{ marginBottom: 8 }}>Fill the roster before starting this job.</Text>
					)}
				</View>
			) : listing.assigneeUid ? (
				<PublicProfile uid={listing.assigneeUid} label='Assigned to' />
			) : (
				<Text style={{ marginBottom: 8 }}>No assignee yet</Text>
			)}
			{canAccept && (
				<Button mode='contained' disabled={jobBusy} style={{ marginBottom: 8 }} onPress={() => runJob(() => acceptListing(listingId))}>
					{teamSize > 1 ? 'Accept as captain' : 'Accept job'}
				</Button>
			)}
			{canRequest && (
				<Button mode='contained' disabled={jobBusy} style={{ marginBottom: 8 }} onPress={() => runJob(() => requestToJoin(listingId))}>
					Ask to join
				</Button>
			)}
			{!authUser && (status === 'open' || (teamSize > 1 && status === 'accepted' && !rosterFull)) && (
				<View style={{ marginBottom: 8 }}>
					<Text style={{ marginBottom: 8 }}>Sign in to accept this job.</Text>
					<View style={{ flexDirection: 'row', gap: 12 }}>
						<Button mode='contained' onPress={() => navigation.navigate('SignUp')}>Sign Up</Button>
						<Button mode='outlined' onPress={() => navigation.navigate('SignIn')}>Sign In</Button>
					</View>
				</View>
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
			{(isOwner || isAssignee) && status !== 'open' && (
				<Card style={{ marginBottom: 12 }}>
					<Card.Title title='Off-platform price' />
					<Card.Content>
						{offPlatformAgreedCents(listing) != null ? (
							<Text style={{ marginBottom: 8 }}>
								We agreed {formatCents(offPlatformAgreedCents(listing))} off-platform.
							</Text>
						) : (
							<Text style={{ marginBottom: 8 }}>
								Record cash/Venmo here. Both of you propose the same amount and tap agree. This does not mark the job paid in-app.
							</Text>
						)}
						<Text>
							Poster proposed: {formatCents(listing.proposedExecutedPriceCentsOwner) || '—'}
							{listing.executedPriceAckOwner ? ' (agreed)' : ''}
						</Text>
						<Text style={{ marginBottom: 8 }}>
							Assignee proposed: {formatCents(listing.proposedExecutedPriceCentsAssignee) || '—'}
							{listing.executedPriceAckAssignee ? ' (agreed)' : ''}
						</Text>
						<TextInput
							label='Your amount USD'
							value={offerDollars}
							onChangeText={setOfferDollars}
							keyboardType='numeric'
							style={{ marginBottom: 8 }}
						/>
						<Button
							mode='outlined'
							disabled={jobBusy}
							style={{ marginBottom: 8 }}
							onPress={() => {
								const cents = dollarsTextToCents(offerDollars);
								if (cents === undefined || cents === null) {
									setJobError(new Error('Enter a dollar amount to propose'));
									return;
								}
								runJob(() => proposeOffPlatformPrice(listingId, cents));
							}}
						>
							Propose amount
						</Button>
						<Button
							mode='contained'
							disabled={jobBusy}
							onPress={() => runJob(() => ackOffPlatformPrice(listingId))}
						>
							I agree to my proposed amount
						</Button>
					</Card.Content>
				</Card>
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
