import React from 'react';
import { View, Image } from 'react-native';
import { Text, Button } from 'react-native-paper';
import { AuthUserContext } from '@safety-net/shared';
import SignOutButton from '../SignOut';
import Map from '../Map';
import useListingPins from '../../hooks/useListingPins';

const SignedOutHome = ({ navigation }) => {
	const pins = useListingPins();

	return (
		<View style={{ padding: 16, alignItems: 'center' }}>
			<Image
				source={require('../../assets/images/shield-icon.webp')}
				style={{ width: 96, height: 96, marginBottom: 16 }}
			/>
			<Text variant='headlineMedium'>Welcome to Safety Net</Text>
			<Text style={{ marginBottom: 20 }}>A decentralized marketplace for security</Text>
			<View style={{ flexDirection: 'row', gap: 12, marginBottom: 30 }}>
				<Button mode='contained' onPress={() => navigation.navigate('Services')}>Request</Button>
				<Button mode='outlined' onPress={() => navigation.navigate('Services')}>Provide</Button>
			</View>
			<Map pins={pins} style={{ width: '100%', height: 400 }} />
		</View>
	);
};

const SignedInHome = ({ navigation }) => (
	<View style={{ padding: 16 }}>
		<Text variant='headlineMedium' style={{ marginBottom: 12 }}>Home</Text>
		<Text style={{ marginBottom: 12 }}>The home page is accessible by every single signed in user.</Text>
		<Button mode='text' onPress={() => navigation.navigate('Listings')}>Listings</Button>
		<Button mode='text' onPress={() => navigation.navigate('Account')}>Account</Button>
		<Button mode='text' onPress={() => navigation.navigate('Admin')}>Admin</Button>
		<SignOutButton />
	</View>
);

const HomeScreen = ({ navigation }) => {
	const authUser = React.useContext(AuthUserContext);
	return authUser ? <SignedInHome navigation={navigation} /> : <SignedOutHome navigation={navigation} />;
};

const HomeButton = ({ navigation }) => (
	<Button mode='text' onPress={() => { navigation.navigate('Home') }}>
		Home
	</Button>
);

export default HomeScreen;

export { HomeButton };
