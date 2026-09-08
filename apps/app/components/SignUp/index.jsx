import React, { useState } from 'react';
import {
	doCreateUserWithEmailAndPassword,
	createUser,
	validateEmail,
	validatePassword,
	validatePasswordConfirm,
	PASSWORD_REQUIREMENTS,
} from '@safety-net/shared'
import { SafeAreaView, View } from 'react-native';
import { Text, TextInput, Button, HelperText } from 'react-native-paper';

const SignUp = ({ navigation }) => {

	const [username, setUsername] = useState('');
	const [email, setEmail] = useState('');
	const [passwordOne, setPasswordOne] = useState('');
	const [passwordTwo, setPasswordTwo] = useState('');
	const [error, setError] = useState(null);

	const emailError = validateEmail(email);
	const passwordError = validatePasswordConfirm(passwordOne, passwordTwo);
	const isInvalid =
		username === '' ||
		!!emailError ||
		!!passwordError;

	const onSubmit = event => {
		if (isInvalid) return;
		doCreateUserWithEmailAndPassword(email.trim(), passwordOne)
			.then(authUser => {
				let userData = {
					uid: authUser.user.uid,
					username: username,
					email: email.trim(),
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
					style={{ marginBottom: 4 }}
					value={passwordOne}
					onChangeText={setPasswordOne}
					label='Password'
					autoComplete='password'
					secureTextEntry
					textContentType='newPassword'
				/>
				<HelperText type={passwordOne && validatePassword(passwordOne) ? 'error' : 'info'} visible>
					{PASSWORD_REQUIREMENTS}
				</HelperText>
				<TextInput
					style={{ marginBottom: 4 }}
					value={passwordTwo}
					onChangeText={setPasswordTwo}
					label='Confirm Password'
					autoComplete='password'
					secureTextEntry
					textContentType='newPassword'
				/>
				<HelperText type='error' visible={passwordTwo.length > 0 && passwordOne !== passwordTwo}>
					Passwords do not match
				</HelperText>
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
