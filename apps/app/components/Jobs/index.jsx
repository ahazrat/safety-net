import React, { useEffect, useState } from 'react';
import { View, FlatList } from 'react-native';
import { Text, Card, Chip, HelperText } from 'react-native-paper';
import { listMyJobs, listingStatusOf, withAuthorization } from '@safety-net/shared';

const JobsScreen = ({ navigation }) => {
	const [jobs, setJobs] = useState([]);
	const [error, setError] = useState(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		listMyJobs()
			.then(setJobs)
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
						</Card.Content>
					</Card>
				)}
			/>
		</View>
	);
};

const condition = authUser => !!authUser;

export default withAuthorization(condition, props => props.navigation.navigate('Home'))(JobsScreen);
