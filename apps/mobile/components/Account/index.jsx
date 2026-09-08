import React from 'react';
import { View, Text } from 'react-native';
import { styles, Button } from '../Themed';
import { AuthUserContext, withAuthorization } from '../../auth/session';

const AccountScreen = ({ navigation }) => (
	<AuthUserContext.Consumer>
		{authUser => (
				<View>
					<Text style={styles.title}>Account</Text>
					<Text style={styles.textBold}>Email: {authUser.email}</Text>
					<Button
						title='Home'
						onPress={() => {navigation.navigate('Home')}}
						/>
					<Button
						title='Forgot Password'
						onPress={() => { navigation.navigate('ForgotPassword') }}
						/>
					<Button
						title='Change Password'
						onPress={() => { navigation.navigate('ChangePassword') }}
						/>
				</View>
			)
		}
	</AuthUserContext.Consumer>
);

const condition = authUser => !!authUser;

export default withAuthorization(condition, props => props.navigation.navigate('SignIn'))(AccountScreen);
