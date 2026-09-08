import React, { useState } from 'react';
import { View } from 'react-native';
import { Text, TextInput, Button, HelperText } from 'react-native-paper';
import { doPasswordReset } from '@safety-net/shared';

const ForgotPasswordScreen = ({ navigation }) => {

	const [email, setEmail] = useState('');
	const [error, setError] = useState(null);

	const isInvalid = email === '';

	const onSubmit = () => {
		doPasswordReset(email)
			.then(() => {
				setEmail('');
				navigation.navigate('SignIn');
			})
			.catch(setError);
	};

	return (
		<View style={{ padding: 16 }}>
			<Text variant='headlineMedium' style={{ textAlign: 'center', marginBottom: 20 }}>Forgot Password</Text>
			<TextInput
				style={{ marginBottom: 12 }}
				value={email}
				onChangeText={setEmail}
				label='Email'
				autoComplete='email'
			/>
			<Button
				mode='contained'
				disabled={isInvalid}
				onPress={onSubmit}
				style={{ marginBottom: 12 }}
			>
				Reset Password
			</Button>
			{error && <HelperText type='error' visible>{error.message}</HelperText>}
		</View>
	);
};

const ForgotPasswordLink = ({ navigation }) => (
	<Button mode='text' onPress={() => { navigation.navigate('ForgotPassword'); }}>
		Forgot password?
	</Button>
);

export default ForgotPasswordScreen;

export { ForgotPasswordLink };
