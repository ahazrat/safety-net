import React, { useState } from 'react';
import { View } from 'react-native';
import { Text, TextInput, Button, HelperText } from 'react-native-paper';
import { doSignInWithEmailAndPassword } from '@safety-net/shared';
import { SignUpLink } from '../SignUp';
import { ForgotPasswordLink } from '../PasswordForget';

const SignIn = ({ navigation }) => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState(null);

	const isInvalid =
		email === '' ||
		password === '';

	const onSubmit = () => {
		doSignInWithEmailAndPassword(email, password)
			.then(() => {
				setEmail('');
				setPassword('');
				setError(null);
				navigation.navigate('Home');
			})
			.catch(setError);
	};

	return (
		<View style={{ padding: 16 }}>
			<Text variant='headlineMedium' style={{ textAlign: 'center', marginBottom: 20 }}>Sign In</Text>
			<TextInput
				style={{ marginBottom: 12 }}
				value={email}
				onChangeText={setEmail}
				label='Email'
				autoComplete='email'
			/>
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
