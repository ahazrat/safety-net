import React, { useContext, useState } from 'react';
import { Platform, ScrollView, View } from 'react-native';
import { Button, Chip, HelperText, Text, TextInput } from 'react-native-paper';
import { AuthUserContext, submitFeedback, withAuthorization } from '@safety-net/shared';
import { layout, space } from '../../theme/tokens';

const TYPES = [
	{ value: 'bug', label: 'Bug' },
	{ value: 'idea', label: 'Idea' },
	{ value: 'praise', label: 'Praise' },
	{ value: 'other', label: 'Other' },
];

const FeedbackScreen = ({ navigation }) => {
	const authUser = useContext(AuthUserContext);
	const [type, setType] = useState('idea');
	const [stars, setStars] = useState(5);
	const [body, setBody] = useState('');
	const [contactEmail, setContactEmail] = useState((authUser && authUser.email) || '');
	const [error, setError] = useState(null);
	const [sent, setSent] = useState(false);
	const [busy, setBusy] = useState(false);

	const onSubmit = () => {
		setError(null);
		setBusy(true);
		const appPath = Platform.OS === 'web' && typeof window !== 'undefined'
			? window.location.pathname
			: '';
		const userAgent = Platform.OS === 'web' && typeof navigator !== 'undefined'
			? navigator.userAgent
			: Platform.OS;
		submitFeedback({ type, stars, body, contactEmail, appPath, userAgent })
			.then(() => {
				setSent(true);
				setBody('');
			})
			.catch(err => setError(err))
			.finally(() => setBusy(false));
	};

	return (
		<ScrollView contentContainerStyle={{ padding: space.lg, width: '100%', maxWidth: layout.pageMaxWidth, alignSelf: 'center' }}>
			<Text variant='headlineMedium' style={{ marginBottom: 8 }}>Feedback</Text>
			<Text style={{ marginBottom: 12 }}>
				Tell us what broke or what to build next. Signed-in only.
			</Text>
			<Text variant='titleSmall'>Type</Text>
			<View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginVertical: 8 }}>
				{TYPES.map(item => (
					<Chip key={item.value} compact selected={type === item.value} onPress={() => setType(item.value)}>
						{item.label}
					</Chip>
				))}
			</View>
			<Text variant='titleSmall'>Stars</Text>
			<View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginVertical: 8 }}>
				{[1, 2, 3, 4, 5].map(n => (
					<Chip key={n} compact selected={stars === n} onPress={() => setStars(n)}>
						{String(n)}
					</Chip>
				))}
			</View>
			<TextInput
				label='What happened'
				value={body}
				onChangeText={setBody}
				multiline
				style={{ marginBottom: 12 }}
			/>
			<TextInput
				label='Contact email (optional)'
				value={contactEmail}
				onChangeText={setContactEmail}
				autoCapitalize='none'
				keyboardType='email-address'
				style={{ marginBottom: 12 }}
			/>
			{error && <HelperText type='error' visible>{error.message}</HelperText>}
			{sent && <Text style={{ marginBottom: 8 }}>Thanks. We saved your note.</Text>}
			<Button mode='contained' disabled={busy} onPress={onSubmit}>Submit</Button>
		</ScrollView>
	);
};

const condition = authUser => !!authUser;

export default withAuthorization(condition, props => props.navigation.navigate('SignIn'))(FeedbackScreen);
