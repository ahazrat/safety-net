import React from 'react';
import { View } from 'react-native';
import { Text, Button } from 'react-native-paper';
import { AuthUserContext, withAuthorization } from '@safety-net/shared';

const AccountScreen = ({ navigation }) => (
	<AuthUserContext.Consumer>
		{authUser => (
				<View style={{ padding: 16 }}>
					<Text variant='headlineMedium' style={{ marginBottom: 12 }}>Account</Text>
					<Text style={{ fontWeight: 'bold', marginBottom: 12 }}>Email: {authUser.email}</Text>
					<Button mode='text' onPress={() => {navigation.navigate('Home')}}>
						Home
					</Button>
					<Button mode='text' onPress={() => { navigation.navigate('ForgotPassword') }}>
						Forgot Password
					</Button>
					<Button mode='text' onPress={() => { navigation.navigate('ChangePassword') }}>
						Change Password
					</Button>
				</View>
			)
		}
	</AuthUserContext.Consumer>
);

const condition = authUser => !!authUser;

export default withAuthorization(condition, props => props.navigation.navigate('SignIn'))(AccountScreen);
