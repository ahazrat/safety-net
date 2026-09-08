import React, { useEffect, useState } from 'react';
import { View, FlatList } from 'react-native';
import { Text, Card, Chip, HelperText } from 'react-native-paper';
import { listMyJobs, listingStatusOf, withAuthorization, getPublicProfile, formatListedPrice } from '@safety-net/shared';

const JobsScreen = ({ navigation }) => {
	const [jobs, setJobs] = useState([]);
	const [names, setNames] = useState({});
	const [error, setError] = useState(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		listMyJobs()
			.then(async items => {
				setJobs(items);
				const uids = [...new Set(items.flatMap(j => [j.ownerUid, j.assigneeUid].filter(Boolean)))];
				const entries = await Promise.all(
					uids.map(async uid => {
						const profile = await getPublicProfile(uid).catch(() => null);
						return [uid, (profile && profile.username) || uid];
					})
				);
				setNames(Object.fromEntries(entries));
			})
			.catch(setError)
			.finally(() => setLoading(false));
	}, []);

	return (
		<View style={{ padding: 16, flex: 1 }}>
			<Text variant='headlineMedium' style={{ marginBottom: 8 }}>Jobs</Text>
			<Text style={{ marginBottom: 12 }}>
				Listings you posted or accepted. Open a job to accept it, start it, or mark it done.
			</Text>
			{loading && <Text>Loading..</Text>}
			{error && <HelperText type='error' visible>{error.message}</HelperText>}
			<FlatList
				data={jobs}
				keyExtractor={item => item.id}
				renderItem={({ item }) => (
					<Card
						style={{ marginBottom: 10 }}
						onPress={() => navigation.navigate('Listing', { listingId: item.id })}
					>
						<Card.Title title={item.title || 'Legacy listing'} />
						<Card.Content>
							<Chip compact>{listingStatusOf(item).replace('_', ' ')}</Chip>
							<Text style={{ marginTop: 8 }}>
								Price: {formatListedPrice(item) || 'No price set'}
							</Text>
							<Text style={{ marginTop: 8 }}>
								Posted by {names[item.ownerUid] || item.ownerUid || 'unknown'}
							</Text>
							{item.assigneeUid ? (
								<Text>Assigned to {names[item.assigneeUid] || item.assigneeUid}</Text>
							) : null}
						</Card.Content>
					</Card>
				)}
			/>
		</View>
	);
};

const condition = authUser => !!authUser;

export default withAuthorization(condition, props => props.navigation.navigate('Home'))(JobsScreen);
