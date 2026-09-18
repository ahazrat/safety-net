import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { Text, TextInput, Button, HelperText } from 'react-native-paper';
import { doSignInWithEmailAndPassword, validateEmail } from '@safety-net/shared';
import { SignUpLink } from '../SignUp';
import { ForgotPasswordLink } from '../PasswordForget';
import SentinelPulse, { SentinelMuteToggle } from '../SentinelPulse';

const SIGN_IN_PULSE_MS = 850;

const SignIn = ({ navigation }) => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState(null);
	const [signedIn, setSignedIn] = useState(false);

	const emailError = validateEmail(email);
	const isInvalid = !!emailError || password === '';

	const onSubmit = () => {
		if (isInvalid) return;
		doSignInWithEmailAndPassword(email.trim(), password)
			.then(() => {
				setEmail('');
				setPassword('');
				setError(null);
				setSignedIn(true);
			})
			.catch(setError);
	};

	useEffect(() => {
		if (!signedIn) return;
		const timer = setTimeout(() => navigation.navigate('Home'), SIGN_IN_PULSE_MS);
		return () => clearTimeout(timer);
	}, [signedIn]);

	if (signedIn) {
		return (
			<View style={{ padding: 16, alignItems: 'center', justifyContent: 'center', flex: 1 }}>
				<SentinelPulse status='confirmed' label='Signed in' size={80} />
				<Text style={{ marginTop: 12 }}>Signed in</Text>
				<SentinelMuteToggle />
			</View>
		);
	}

	return (
		<View style={{ padding: 16 }}>
			<Text variant='headlineMedium' style={{ textAlign: 'center', marginBottom: 20 }}>Sign In</Text>
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
			<TextInput
				style={{ marginBottom: 12 }}
				value={password}
				onChangeText={setPassword}
				label='Password'
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
				Sign In
			</Button>
			{error && <HelperText type='error' visible>{error.message}</HelperText>}
			<SignUpLink navigation={navigation} />
			<ForgotPasswordLink navigation={navigation} />
		</View>
	);
};

const SignInLink = ({ navigation }) => (
	<Button mode='text' onPress={() => { navigation.navigate('SignIn'); }}>
		Already have an account? Sign In
	</Button>
);

export default SignIn;

export { SignInLink };
