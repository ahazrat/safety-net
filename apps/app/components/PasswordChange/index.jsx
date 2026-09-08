import React, { useState } from 'react';
import { doPasswordUpdate } from '@safety-net/shared';
import { View } from 'react-native';
import { Text, TextInput, Button, HelperText } from 'react-native-paper';

const ChangePasswordScreen = ({ navigation }) => {

	const [passwordOne, setPasswordOne] = useState('');
	const [passwordTwo, setPasswordTwo] = useState('');
	const [error, setError] = useState(null);

	const isInvalid =
		passwordOne === '' ||
		passwordOne !== passwordTwo;

	const onSubmit = () => {
		doPasswordUpdate(passwordOne)
			.then(() => {
				setPasswordOne('');
				setPasswordTwo('');
				setError(null);
				navigation.navigate('Home');
			})
			.catch(setError);
	};

	return (
		<View style={{ padding: 16 }}>
			<Text variant='headlineMedium' style={{ textAlign: 'center', marginBottom: 20 }}>Change Password</Text>
			<TextInput
				style={{ marginBottom: 12 }}
				value={passwordOne}
				onChangeText={setPasswordOne}
				label='New Password'
				autoComplete='password'
				secureTextEntry
				textContentType='password'
			/>
			<TextInput
				style={{ marginBottom: 12 }}
				value={passwordTwo}
				onChangeText={setPasswordTwo}
				label='Confirm New Password'
				autoComplete='password'
				secureTextEntry
				textContentType='password'
			/>
			<Button
				mode='contained'
				disabled={isInvalid}
				onPress={onSubmit}
				style={{ marginBottom: 12 }}
			>
				Change Password
			</Button>
			{error && <HelperText type='error' visible>{error.message}</HelperText>}
		</View>
	);
};

export default ChangePasswordScreen;
