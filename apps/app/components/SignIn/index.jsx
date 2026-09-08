import React, { useState } from 'react';
import { View, Text, TextInput, Button } from 'react-native';
import { doSignInWithEmailAndPassword } from '@safety-net/shared';
import { SignUpLink } from '../SignUp';
import { ForgotPasswordLink } from '../PasswordForget';
import { styles } from '../Themed';

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
		<View>
			<Text style={styles.title}>Sign In</Text>
			<TextInput
				style={styles.input}
				value={email}
				onChangeText={setEmail}
				placeholder='Email'
				autoCompleteType='email'
			/>
			<TextInput
				style={styles.input}
				value={password}
				onChangeText={setPassword}
				placeholder='Password'
				autoCompleteType='password'
				secureTextEntry='true'
				textContentType='password'
			/>
			<View style={styles.margin20}>
				<Button
					title='Sign In'
					disabled={isInvalid}
					onPress={onSubmit}
				/>
			</View>
			{error && <Text style={styles.errorText}>{error.message}</Text>}
			<SignUpLink navigation={navigation} />
			<ForgotPasswordLink navigation={navigation} />
		</View>
	);
};

const SignInLink = ({ navigation }) => (
	<Text style={styles.textCenter}>
		Already have an account?
		<Text
			style={styles.text}
			onPress={() => {navigation.navigate('SignIn');}}
		> Sign In</Text>
	</Text>
);

export default SignIn;

export { SignInLink };
