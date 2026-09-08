import React, { useState } from 'react';
import { doPasswordUpdate } from '@safety-net/shared';
import { View, Text, TextInput, Button } from 'react-native';
import { styles } from '../Themed';

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
		<View>
			<Text style={styles.title}>Change Password</Text>
			<TextInput
				style={styles.input}
				value={passwordOne}
				onChangeText={setPasswordOne}
				placeholder='New Password'
				autoCompleteType='password'
				secureTextEntry='true'
				textContentType='password'
			/>
			<TextInput
				style={styles.input}
				value={passwordTwo}
				onChangeText={setPasswordTwo}
				placeholder='Confirm New Password'
				autoCompleteType='password'
				secureTextEntry='true'
				textContentType='password'
			/>
			<View style={styles.margin20}>
				<Button
					title='Change Password'
					disabled={isInvalid}
					onPress={onSubmit}
				/>
			</View>
			{error && <Text style={styles.errorText}>{error.message}</Text>}
		</View>
	);
};

export default ChangePasswordScreen;
