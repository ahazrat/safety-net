import React from 'react';
import { View } from 'react-native';
import { Text, Button, Chip } from 'react-native-paper';
import {
	AuthUserContext,
	withAuthorization,
	Badges,
	earnedBadgeIds,
	labelForBadge,
} from '@safety-net/shared';

const AccountScreen = ({ navigation }) => (
	<AuthUserContext.Consumer>
		{authUser => {
			const earned = new Set(earnedBadgeIds(authUser));
			return (
				<View style={{ padding: 16 }}>
					<Text variant='headlineMedium' style={{ marginBottom: 12 }}>Account</Text>
					<Text style={{ fontWeight: 'bold', marginBottom: 12 }}>Email: {authUser.email}</Text>
					<Text variant='titleMedium' style={{ marginBottom: 8 }}>Badges</Text>
					<Text style={{ marginBottom: 8 }}>
						Verification badges are granted by an admin. Yours appear filled in.
					</Text>
					<View style={{ flexDirection: 'row', flexWrap: 'wrap', marginBottom: 16 }}>
						{Badges.map(id => (
							<Chip
								key={id}
								style={{ marginRight: 8, marginBottom: 8 }}
								mode={earned.has(id) ? 'flat' : 'outlined'}
								selected={earned.has(id)}
							>
								{labelForBadge(id)}
							</Chip>
						))}
					</View>
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
			);
		}}
	</AuthUserContext.Consumer>
);

const condition = authUser => !!authUser;

export default withAuthorization(condition, props => props.navigation.navigate('SignIn'))(AccountScreen);
