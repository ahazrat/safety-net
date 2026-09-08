import React from 'react';
import { View, Text } from 'react-native'
import { styles, Button } from '../Themed';
import { withAuthorization } from '@safety-net/shared';
import SignOutButton from '../SignOut';

const HomeScreen = ({ navigation }) => (
	<View>
		<Text style={styles.title}>Home</Text>
		<Text style={styles.textCenter}>The home page is accessible by every single signed in user.</Text>
		<Button title='Listings' onPress={() => navigation.navigate('Listings')} />
		<Button title='Account' onPress={() => navigation.navigate('Account')} />
		<Button title='Admin' onPress={() => navigation.navigate('Admin')} />
		<SignOutButton />
	</View>
);

const condition = authUser => !!authUser;

const HomeButton = ({ navigation }) => (
	<Button
		title='Home'
		onPress={() => { navigation.navigate('Home') }}
	/>
);

export default withAuthorization(condition, props => props.navigation.navigate('SignIn'))(HomeScreen);

export { HomeButton };
