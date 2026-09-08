import React, { useState } from 'react';
import { View, Text, TextInput, Button } from 'react-native';
import { doPasswordReset } from '@safety-net/shared';
import { styles } from '../Themed';

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
		<View>
			<Text style={styles.title}>Forgot Password</Text>
			<TextInput
				style={styles.input}
				value={email}
				onChangeText={setEmail}
				placeholder='Email'
				autoCompleteType='Email'
			/>
			<View style={styles.margin20}>
				<Button
					title='Reset Password'
					disabled={isInvalid}
					onPress={onSubmit}
				/>
			</View>
			{error && <Text style={styles.errorText}>{error.message}</Text>}
		</View>
	);
};

const ForgotPasswordLink = ({ navigation }) => (
	<Text
		style={styles.textCenter}
		onPress={() => {navigation.navigate('ForgotPassword');}}
	>
		Forgot password?
	</Text>
);

export default ForgotPasswordScreen;

export { ForgotPasswordLink };
