import React, { useContext, useEffect, useState } from 'react';
import { View, FlatList } from 'react-native';
import { Text, Button, TextInput, HelperText, List } from 'react-native-paper';
import {
	AuthUserContext,
	withAuthorization,
	listMyConversations,
	getOrCreateConversation,
	otherParticipant,
} from '@safety-net/shared';

const MessagesScreen = ({ navigation, route }) => {
	const authUser = useContext(AuthUserContext);
	const [conversations, setConversations] = useState([]);
	const [otherUid, setOtherUid] = useState(route?.params?.otherUid || '');
	const [error, setError] = useState(null);
	const [loading, setLoading] = useState(true);

	const load = () => {
		setError(null);
		return listMyConversations()
			.then(setConversations)
			.catch(setError)
			.finally(() => setLoading(false));
	};

	useEffect(() => {
		load();
	}, []);

	const openConversation = (conversationId, peerUid) => {
		navigation.navigate('Conversation', { conversationId, otherUid: peerUid });
	};

	const onStart = () => {
		setError(null);
		getOrCreateConversation(otherUid.trim())
			.then(id => openConversation(id, otherUid.trim()))
			.catch(setError);
	};

	return (
		<View style={{ padding: 16, flex: 1 }}>
			<Text variant='headlineMedium' style={{ marginBottom: 8 }}>Messages</Text>
			<Text style={{ marginBottom: 12 }}>
				Conversations are private to the two participants. Start one with a user id, or from a listing.
			</Text>
			<TextInput
				label='Recipient user id'
				value={otherUid}
				onChangeText={setOtherUid}
				style={{ marginBottom: 8 }}
			/>
			<Button mode='contained' onPress={onStart} style={{ marginBottom: 16 }}>
				Open conversation
			</Button>
			{error && <HelperText type='error' visible>{error.message}</HelperText>}
			{loading && <Text>Loading..</Text>}
			<FlatList
				data={conversations}
				keyExtractor={item => item.id}
				renderItem={({ item }) => {
					const peer = otherParticipant(item, authUser.uid);
					return (
						<List.Item
							title={peer}
							description='Tap to open'
							onPress={() => openConversation(item.id, peer)}
						/>
					);
				}}
			/>
		</View>
	);
};

const condition = authUser => !!authUser;

export default withAuthorization(condition, props => props.navigation.navigate('Home'))(MessagesScreen);
