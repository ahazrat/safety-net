import React, { useState } from 'react';
import { View } from 'react-native';
import { Text, TextInput, Button, HelperText } from 'react-native-paper';
import { doPasswordReset, validateEmail } from '@safety-net/shared';

const ForgotPasswordScreen = ({ navigation }) => {

	const [email, setEmail] = useState('');
	const [error, setError] = useState(null);

	const emailError = validateEmail(email);
	const isInvalid = !!emailError;

	const onSubmit = () => {
		if (isInvalid) return;
		doPasswordReset(email.trim())
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
				style={{ marginBottom: 4 }}
				value={email}
				onChangeText={setEmail}
				label='Email'
				autoComplete='email'
				autoCapitalize='none'
				keyboardType='email-address'
				textContentType='emailAddress'
			/>
			<HelperText type='error' visible={email.length > 0 && !!emailError}>
				{emailError}
			</HelperText>
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
