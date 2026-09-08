/**
 * If you are not familiar with React Navigation, check out the "Fundamentals" guide:
 * https://reactnavigation.org/docs/getting-started
 *
 */
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import * as React from 'react';
import { ColorSchemeName, Text, useWindowDimensions } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import SignUp from '../components/SignUp';
import SignIn from '../components/SignIn';
import HomeScreen from '../components/Home';
import AccountScreen from '../components/Account';
import Listings from '../components/Listings';
import Listing from '../components/Listing';
import ListingCreate from '../components/ListingCreate';
import ServicesScreen from '../components/Services';
import MapScreen from '../components/MapScreen';
import AttributionScreen from '../components/Attribution';
import ForgotPasswordScreen from '../components/PasswordForget';
import ChangePasswordScreen from '../components/PasswordChange';
import AdminScreen from '../components/Admin';
import MessagesScreen from '../components/Messages';
import ConversationScreen from '../components/Conversation';
import NotFoundScreen from '../components/NotFound';

import { RootStackParamList } from '../types';
import LinkingConfiguration from './LinkingConfiguration';
import { AuthUserContext } from '@safety-net/shared';

export default function Navigation({ colorScheme }: { colorScheme: ColorSchemeName }) {
	return (
		<NavigationContainer
			linking={LinkingConfiguration}
			fallback={<Text>Loading...</Text>}
			theme={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
			<RootNavigator />
		</NavigationContainer>
	);
}

const Drawer = createDrawerNavigator<RootStackParamList>();

type IconName = React.ComponentProps<typeof MaterialCommunityIcons>['name'];
const drawerIcon = (name: IconName) =>
	({ color, size }: { color: string; size: number }) => (
		<MaterialCommunityIcons name={name} color={color} size={size} />
	);

function RootNavigator() {
	const authUser = React.useContext(AuthUserContext);
	const { width } = useWindowDimensions();
	// The bundled Drawer falls back to its "legacy" (reanimated v1 API)
	// implementation under react-native-reanimated v3, whose backdrop
	// overlay stays mounted full-screen and intercepts clicks even when
	// the drawer is only ever shown as a sidebar. `permanent` drops that
	// backdrop entirely, so use it above the mobile breakpoint.
	const drawerType = width >= 768 ? 'permanent' : 'front';

	return (
		<Drawer.Navigator
			initialRouteName="Home"
			screenOptions={{ headerShown: true, drawerType }}
		>
			<Drawer.Screen
				name='Home'
				component={HomeScreen}
				options={{ title: 'Home', drawerIcon: drawerIcon('home-outline') }}
			/>
			{authUser ? (
				<>
					<Drawer.Screen
						name='Listings'
						component={Listings}
						options={{ title: 'Listings', drawerIcon: drawerIcon('format-list-bulleted') }}
					/>
					<Drawer.Screen
						name='Listing'
						component={Listing}
						options={{ title: 'Listing', drawerIcon: drawerIcon('file-document-outline') }}
					/>
					<Drawer.Screen
						name='ListingCreate'
						component={ListingCreate}
						options={{ title: 'Create Listing', drawerIcon: drawerIcon('plus-box-outline') }}
					/>
				</>
			) : null}
			<Drawer.Screen
				name='Services'
				component={ServicesScreen}
				options={{ title: 'Services', drawerIcon: drawerIcon('store-outline') }}
			/>
			<Drawer.Screen
				name='Map'
				component={MapScreen}
				options={{ title: 'Map', drawerIcon: drawerIcon('map-outline') }}
			/>
			<Drawer.Screen
				name='Attribution'
				component={AttributionScreen}
				options={{ title: 'Map Attribution', drawerIcon: drawerIcon('information-outline') }}
			/>
			{authUser ? (
				<>
					<Drawer.Screen
						name='Messages'
						component={MessagesScreen}
						options={{ title: 'Messages', drawerIcon: drawerIcon('message-text-outline') }}
					/>
					<Drawer.Screen
						name='Conversation'
						component={ConversationScreen}
						options={{ title: 'Conversation', drawerItemStyle: { display: 'none' } }}
					/>
					<Drawer.Screen
						name='Account'
						component={AccountScreen}
						options={{ title: 'Account', drawerIcon: drawerIcon('account-circle-outline') }}
					/>
					<Drawer.Screen
						name="ChangePassword"
						component={ChangePasswordScreen}
						options={{ title: 'Change Password', drawerIcon: drawerIcon('lock-reset') }}
					/>
					<Drawer.Screen
						name="Admin"
						component={AdminScreen}
						options={{ title: 'Admin', drawerIcon: drawerIcon('shield-account-outline') }}
					/>
				</>
			) : (
				<>
					<Drawer.Screen
						name='SignIn'
						component={SignIn}
						options={{ title: 'Sign In', drawerIcon: drawerIcon('login') }}
					/>
					<Drawer.Screen
						name='SignUp'
						component={SignUp}
						options={{ title: 'Sign Up', drawerIcon: drawerIcon('account-plus-outline') }}
					/>
					<Drawer.Screen
						name="ForgotPassword"
						component={ForgotPasswordScreen}
						options={{ title: 'Forgot Password', drawerIcon: drawerIcon('lock-question') }}
					/>
				</>
			)}
			<Drawer.Screen
				name="NotFound"
				component={NotFoundScreen}
				options={{ title: 'Oops!', drawerIcon: drawerIcon('help-circle-outline') }}
			/>
		</Drawer.Navigator>
	);
}
