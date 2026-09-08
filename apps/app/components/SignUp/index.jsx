import React, { useState } from 'react';
import { doCreateUserWithEmailAndPassword, createUser, Roles as ROLES } from '@safety-net/shared'
import { SafeAreaView, View, Text, TextInput, Switch, Button } from 'react-native';
// import { SignInLink } from '../SignIn';
import { styles } from '../Themed';

const SignUp = ({ navigation }) => {

	const [username, setUsername] = useState('');
	const [email, setEmail] = useState('');
	const [passwordOne, setPasswordOne] = useState('');
	const [passwordTwo, setPasswordTwo] = useState('');
	const [isAdmin, setIsAdmin] = useState(false);
	const [error, setError] = useState(null);

	const isInvalid =
		username === '' ||
		email === '' ||
		passwordOne === '' ||
		passwordOne !== passwordTwo;

	const onSubmit = event => {
		const roles = {
			[ROLES.USER]: ROLES.USER,
		};
		if (isAdmin) {
			roles[ROLES.ADMIN] = ROLES.ADMIN;
		}
		doCreateUserWithEmailAndPassword(email, passwordOne)
			.then(authUser => {
				let userData = {
					uid: authUser.user.uid,
					username: username,
					email: email,
					roles: roles,
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
			<Text style={styles.title}>Sign Up</Text>
			<TextInput
				style={styles.input}
				value={username}
				onChangeText={setUsername}
				placeholder='Username'
				autoCompleteType='username'
			/>
			<TextInput
				style={styles.input}
				value={email}
				onChangeText={setEmail}
				placeholder='Email'
				autoCompleteType='email'
			/>
			<TextInput
				style={styles.input}
				value={passwordOne}
				onChangeText={setPasswordOne}
				placeholder='Password'
				autoCompleteType='password'
				secureTextEntry='true'  // this is flagged but works on web
				textContentType='password'
			/>
			<TextInput
				style={styles.input}
				value={passwordTwo}
				onChangeText={setPasswordTwo}
				placeholder='Confirm Password'
				autoCompleteType='password'
				secureTextEntry='true'  // this is flagged but works on web
				textContentType='password'
			/>
			<View style={[styles.margin20, { display: 'inline', marginTop: 0 }]}>
				<Switch value={isAdmin} style={{ display: 'inline-block' }} />
				<Text style={[styles.text, { display: 'inline-block', marginLeft: 10 }]}>Set Admin</Text>
			</View>
			<View style={styles.margin20}>
				<Button
					title='Sign Up'
					onPress={onSubmit}
					disabled={isInvalid}
				/>
			</View>
			{error && <Text style={styles.errorText}>{error.message}</Text>}
			{/* <SignInLink navigation={navigation} /> */}
		</SafeAreaView>
	);
};

const SignUpLink = ({ navigation }) => (
	<Text style={styles.textCenter}>
		Don't have an account?
		<Text
			style={styles.text}
			onPress={() => {navigation.navigate('SignUp');}}
		> Sign Up</Text>
	</Text>
);

export default SignUp;

export { SignUpLink };
