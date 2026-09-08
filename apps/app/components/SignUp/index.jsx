import React, { useState } from 'react';
import { doCreateUserWithEmailAndPassword, createUser } from '@safety-net/shared'
import { SafeAreaView, View } from 'react-native';
import { Text, TextInput, Button, HelperText } from 'react-native-paper';

const SignUp = ({ navigation }) => {

	const [username, setUsername] = useState('');
	const [email, setEmail] = useState('');
	const [passwordOne, setPasswordOne] = useState('');
	const [passwordTwo, setPasswordTwo] = useState('');
	const [error, setError] = useState(null);

	const isInvalid =
		username === '' ||
		email === '' ||
		passwordOne === '' ||
		passwordOne !== passwordTwo;

	const onSubmit = event => {
		doCreateUserWithEmailAndPassword(email, passwordOne)
			.then(authUser => {
				let userData = {
					uid: authUser.user.uid,
					username: username,
					email: email,
				};
				setUsername('');
				setEmail('');
				setPasswordOne('');
				setPasswordTwo('');
				createUser(userData);
				navigation.navigate('Home');
			})
			.catch(setError);
	}

	return (
		<SafeAreaView>
			<View style={{ padding: 16 }}>
				<Text variant='headlineMedium' style={{ textAlign: 'center', marginBottom: 20 }}>Sign Up</Text>
				<TextInput
					style={{ marginBottom: 12 }}
					value={username}
					onChangeText={setUsername}
					label='Username'
					autoComplete='username'
				/>
				<TextInput
					style={{ marginBottom: 12 }}
					value={email}
					onChangeText={setEmail}
					label='Email'
					autoComplete='email'
				/>
				<TextInput
					style={{ marginBottom: 12 }}
					value={passwordOne}
					onChangeText={setPasswordOne}
					label='Password'
					autoComplete='password'
					secureTextEntry
					textContentType='password'
				/>
				<TextInput
					style={{ marginBottom: 12 }}
					value={passwordTwo}
					onChangeText={setPasswordTwo}
					label='Confirm Password'
					autoComplete='password'
					secureTextEntry
					textContentType='password'
				/>
				<Button
					mode='contained'
					onPress={onSubmit}
					disabled={isInvalid}
					style={{ marginBottom: 12 }}
				>
					Sign Up
				</Button>
				{error && <HelperText type='error' visible>{error.message}</HelperText>}
			</View>
		</SafeAreaView>
	);
};

const SignUpLink = ({ navigation }) => (
	<Button mode='text' onPress={() => { navigation.navigate('SignUp'); }}>
		Don't have an account? Sign Up
	</Button>
);

export default SignUp;

export { SignUpLink };
