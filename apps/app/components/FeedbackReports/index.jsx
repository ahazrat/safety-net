import React, { useEffect, useState } from 'react';
import { ScrollView, View } from 'react-native';
import { Button, Chip, HelperText, Text } from 'react-native-paper';
import {
	listFeedback,
	setFeedbackStatus,
	withAuthorization,
	Roles as ROLES,
} from '@safety-net/shared';
import { layout, space } from '../../theme/tokens';

const TYPES = ['bug', 'idea', 'praise', 'other'];
const STATUSES = ['open', 'reviewed', 'closed'];

function when(value) {
	if (!value) return '';
	if (value.seconds) return new Date(value.seconds * 1000).toLocaleString();
	if (value.toDate) return value.toDate().toLocaleString();
	return '';
}

const FeedbackReportsScreen = () => {
	const [rows, setRows] = useState([]);
	const [typeFilter, setTypeFilter] = useState(null);
	const [statusFilter, setStatusFilter] = useState(null);
	const [error, setError] = useState(null);
	const [loading, setLoading] = useState(true);
	const [pending, setPending] = useState(null);

	const load = () => {
		setError(null);
		return listFeedback()
			.then(setRows)
			.catch(setError)
			.finally(() => setLoading(false));
	};

	useEffect(() => { load(); }, []);

	const visible = rows.filter(row => {
		if (typeFilter && row.type !== typeFilter) return false;
		if (statusFilter && row.status !== statusFilter) return false;
		return true;
	});

	const mark = (id, status) => {
		setPending(id);
		setError(null);
		setFeedbackStatus(id, status)
			.then(load)
			.catch(setError)
			.finally(() => setPending(null));
	};

	return (
		<ScrollView contentContainerStyle={{ padding: space.lg, width: '100%', maxWidth: layout.pageMaxWidth, alignSelf: 'center' }}>
			<Text variant='headlineMedium'>Feedback reports</Text>
			<Text style={{ marginBottom: 12 }}>Newest first. Admins only.</Text>
			<View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 8 }}>
				<Chip compact selected={typeFilter == null} onPress={() => setTypeFilter(null)}>All types</Chip>
				{TYPES.map(type => (
					<Chip key={type} compact selected={typeFilter === type} onPress={() => setTypeFilter(type)}>{type}</Chip>
				))}
			</View>
			<View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 12 }}>
				<Chip compact selected={statusFilter == null} onPress={() => setStatusFilter(null)}>All statuses</Chip>
				{STATUSES.map(status => (
					<Chip key={status} compact selected={statusFilter === status} onPress={() => setStatusFilter(status)}>{status}</Chip>
				))}
			</View>
			{loading && <Text>Loading..</Text>}
			{error && <HelperText type='error' visible>{error.message}</HelperText>}
			{!loading && visible.length === 0 && <Text>No feedback in this filter.</Text>}
			{visible.map(row => (
				<View key={row.id} style={{ marginBottom: 16, paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: '#ddd' }}>
					<Text>{row.type} · {row.stars} stars · {row.status}</Text>
					<Text style={{ marginVertical: 4 }}>{String(row.body || '').slice(0, 280)}</Text>
					<Text style={{ opacity: 0.7 }}>
						{row.uid}{row.contactEmail ? ` · ${row.contactEmail}` : ''}{when(row.createdAt) ? ` · ${when(row.createdAt)}` : ''}
					</Text>
					<View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 8 }}>
						{STATUSES.filter(status => status !== row.status).map(status => (
							<Button
								key={status}
								compact
								mode='outlined'
								disabled={pending === row.id}
								onPress={() => mark(row.id, status)}
							>
								Mark {status}
							</Button>
						))}
					</View>
				</View>
			))}
		</ScrollView>
	);
};

const condition = authUser => authUser && authUser.roles && !!authUser.roles[ROLES.ADMIN];

export default withAuthorization(condition, props => props.navigation.navigate('Home'))(FeedbackReportsScreen);
