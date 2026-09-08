import React, { useContext, useEffect, useState } from 'react';
import { View, FlatList } from 'react-native';
import { Text, TextInput, Button, HelperText, Card } from 'react-native-paper';
import {
	AuthUserContext,
	withAuthorization,
	listMessages,
	sendMessage,
} from '@safety-net/shared';

const ConversationScreen = ({ route, navigation }) => {
	const authUser = useContext(AuthUserContext);
	const otherUid = route?.params?.otherUid;
	const [messages, setMessages] = useState([]);
	const [text, setText] = useState('');
	const [error, setError] = useState(null);
	const [sending, setSending] = useState(false);

	const load = () => {
		if (!route?.params?.conversationId) return Promise.resolve();
		return listMessages(route.params.conversationId)
			.then(setMessages)
			.catch(setError);
	};

	useEffect(() => {
		load();
	}, [route?.params?.conversationId]);

	const onSend = () => {
		if (!otherUid) {
			setError(new Error('Missing recipient'));
			return;
		}
		setSending(true);
		setError(null);
		sendMessage(otherUid, text)
			.then(() => {
				setText('');
				return load();
			})
			.catch(setError)
			.finally(() => setSending(false));
	};

	return (
		<View style={{ padding: 16, flex: 1 }}>
			<Text variant='headlineMedium' style={{ marginBottom: 8 }}>Conversation</Text>
			<Text style={{ marginBottom: 12 }}>With {otherUid || 'unknown'}</Text>
			<FlatList
				data={messages}
				keyExtractor={item => item.id}
				style={{ flex: 1, marginBottom: 12 }}
				renderItem={({ item }) => {
					const mine = item.fromUid === authUser.uid;
					return (
						<Card style={{ marginBottom: 8, alignSelf: mine ? 'flex-end' : 'flex-start', maxWidth: '85%' }}>
							<Card.Content>
								<Text variant='labelSmall'>{mine ? 'You' : item.fromUid}</Text>
								<Text>{item.text}</Text>
							</Card.Content>
						</Card>
					);
				}}
			/>
			<TextInput
				label='Message'
				value={text}
				onChangeText={setText}
				style={{ marginBottom: 8 }}
			/>
			<Button mode='contained' onPress={onSend} disabled={sending}>
				Send
			</Button>
			{error && <HelperText type='error' visible>{error.message}</HelperText>}
			<Button mode='text' onPress={() => navigation.navigate('Messages')} style={{ marginTop: 8 }}>
				All conversations
			</Button>
		</View>
	);
};

const condition = authUser => !!authUser;

export default withAuthorization(condition, props => props.navigation.navigate('Home'))(ConversationScreen);
