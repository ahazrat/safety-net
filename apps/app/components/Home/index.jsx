import React, { useContext } from 'react';
import { View, Image } from 'react-native';
import { Text, Button } from 'react-native-paper';
import { AuthUserContext } from '@safety-net/shared';
import { DemoContext } from '../../tour/DemoContext';
import { color, space, type } from '../../theme/tokens';
import Screen from '../Screen';
import SignOutButton from '../SignOut';
import Map from '../Map';
import useListingPins from '../../hooks/useListingPins';
import useChicagoCrimePins from '../../hooks/useChicagoCrimePins';
import { CHICAGO_CENTER, CHICAGO_ZOOM } from '@safety-net/shared';
import { blockWatchPins } from '../../tour/blockWatch';

function HomeMap({ navigation }) {
	const listings = useListingPins();
	const crime = useChicagoCrimePins();
	const { pinsOn } = useContext(DemoContext);
	return (
		<Map
			pins={[...(pinsOn ? blockWatchPins() : []), ...crime, ...listings]}
			center={CHICAGO_CENTER}
			zoom={CHICAGO_ZOOM}
			style={{ width: '100%', height: 400 }}
			onPinPress={(id) => {
				if (String(id).startsWith('example-')) return;
				navigation.navigate('Listing', { listingId: id });
			}}
		/>
	);
}

const OFFERINGS = [
	{ label: 'Neighborhood Watch', listingType: 'watch', title: 'Neighborhood Watch' },
	{ label: 'Event Security', listingType: 'event', title: 'Event Security' },
	{ label: 'Physical Defense', listingType: 'defense', title: 'Physical Defense' },
];

const SignedOutHome = ({ navigation }) => {
	const { replayTour } = useContext(DemoContext);
	const post = (listingType, title) => navigation.navigate('ListingCreate', { listingType, title });
	return (
	<Screen>
		<Image
			source={require('../../assets/images/shield-icon.webp')}
			style={{ width: 96, height: 96, marginBottom: 16 }}
			accessibilityLabel="Safety Net"
		/>
		<Text variant='headlineMedium' style={[{ textAlign: 'center', color: color.text }, type.display]}>Hire a neighbor</Text>
		<Text style={{ marginBottom: 16, textAlign: 'center' }}>
			Private contracts. A public map of jobs and risk.
		</Text>
		<Button
			testID="tour-request"
			mode='contained'
			style={{ marginBottom: 16 }}
			onPress={() => post('watch', 'Neighborhood Watch')}
		>
			Post a watch
		</Button>
		<View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 8, marginBottom: 20 }}>
			{OFFERINGS.map(item => (
				<Button
					key={item.listingType}
					compact
					mode='outlined'
					onPress={() => post(item.listingType, item.title)}
				>
					{item.label}
				</Button>
			))}
		</View>
		<Text style={{ alignSelf: 'stretch', marginBottom: space.sm, color: color.textMuted }}>
			Chicago reports by community area (last 30 days). Circles are counts, not individual incidents.
		</Text>
		<HomeMap navigation={navigation} />
		<Button compact style={{ marginTop: 8 }} onPress={() => navigation.navigate('Map')}>Open the map</Button>
		<Button compact style={{ marginTop: 4 }} onPress={replayTour}>Replay tour</Button>
	</Screen>
	);
};

const SignedInHome = ({ navigation }) => {
	const { replayTour } = useContext(DemoContext);
	return (
	<View style={{ padding: 16 }}>
		<Text variant='headlineMedium' style={{ marginBottom: 12 }}>Home</Text>
		<Text style={{ marginBottom: 12 }}>The home page is accessible by every single signed in user.</Text>
		<Button mode='text' onPress={() => navigation.navigate('Listings')}>Listings</Button>
		<Button mode='text' onPress={() => navigation.navigate('Account')}>Account</Button>
		<Button mode='text' onPress={() => navigation.navigate('Feedback')}>Feedback</Button>
		<Button mode='text' onPress={() => navigation.navigate('Admin')}>Admin</Button>
		<SignOutButton />
		<Text style={{ marginTop: 16, marginBottom: 8 }}>
			Chicago reports by community area (last 30 days). Circles are counts, not individual incidents.
		</Text>
		<HomeMap navigation={navigation} />
		<Button compact style={{ marginTop: 12 }} onPress={replayTour}>Replay tour</Button>
	</View>
	);
};

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
