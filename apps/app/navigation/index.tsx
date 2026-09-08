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
import JobsScreen from '../components/Jobs';
import ServicesScreen from '../components/Services';
import MapScreen from '../components/MapScreen';
import ScannersScreen from '../components/Scanners';
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

const hiddenItem = { display: 'none' as const };

function RootNavigator() {
	const authUser = React.useContext(AuthUserContext);
	const { width } = useWindowDimensions();
	// The bundled Drawer falls back to its "legacy" (reanimated v1 API)
	// implementation under react-native-reanimated v3, whose backdrop
	// overlay stays mounted full-screen and intercepts clicks even when
	// the drawer is only ever shown as a sidebar. `permanent` drops that
	// backdrop entirely, so use it above the mobile breakpoint.
	const drawerType = width >= 768 ? 'permanent' : 'front';
	// Keep every route mounted so /listings, /signin, /listing/:id, etc.
	// still resolve after auth changes. Hide drawer rows that do not apply.
	const signedIn = { drawerItemStyle: authUser ? undefined : hiddenItem };
	const signedOut = { drawerItemStyle: authUser ? hiddenItem : undefined };
	const neverInDrawer = { drawerItemStyle: hiddenItem };

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
			<Drawer.Screen
				name='Listings'
				component={Listings}
				options={{ title: 'Listings', drawerIcon: drawerIcon('format-list-bulleted'), ...signedIn }}
			/>
			<Drawer.Screen
				name='Listing'
				component={Listing}
				options={{ title: 'Listing', ...neverInDrawer }}
			/>
			<Drawer.Screen
				name='ListingCreate'
				component={ListingCreate}
				options={{ title: 'Create Listing', drawerIcon: drawerIcon('plus-box-outline'), ...signedIn }}
			/>
			<Drawer.Screen
				name='Jobs'
				component={JobsScreen}
				options={{ title: 'Jobs', drawerIcon: drawerIcon('briefcase-outline'), ...signedIn }}
			/>
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
				name='Scanners'
				component={ScannersScreen}
				options={{ title: 'Scanners', drawerIcon: drawerIcon('radio') }}
			/>
			<Drawer.Screen
				name='Attribution'
				component={AttributionScreen}
				options={{ title: 'Map Attribution', drawerIcon: drawerIcon('information-outline') }}
			/>
			<Drawer.Screen
				name='Messages'
				component={MessagesScreen}
				options={{ title: 'Messages', drawerIcon: drawerIcon('message-text-outline'), ...signedIn }}
			/>
			<Drawer.Screen
				name='Conversation'
				component={ConversationScreen}
				options={{ title: 'Conversation', ...neverInDrawer }}
			/>
			<Drawer.Screen
				name='Account'
				component={AccountScreen}
				options={{ title: 'Account', drawerIcon: drawerIcon('account-circle-outline'), ...signedIn }}
			/>
			<Drawer.Screen
				name="ChangePassword"
				component={ChangePasswordScreen}
				options={{ title: 'Change Password', drawerIcon: drawerIcon('lock-reset'), ...signedIn }}
			/>
			<Drawer.Screen
				name="Admin"
				component={AdminScreen}
				options={{ title: 'Admin', drawerIcon: drawerIcon('shield-account-outline'), ...signedIn }}
			/>
			<Drawer.Screen
				name='SignIn'
				component={SignIn}
				options={{ title: 'Sign In', drawerIcon: drawerIcon('login'), ...signedOut }}
			/>
			<Drawer.Screen
				name='SignUp'
				component={SignUp}
				options={{ title: 'Sign Up', drawerIcon: drawerIcon('account-plus-outline'), ...signedOut }}
			/>
			<Drawer.Screen
				name="ForgotPassword"
				component={ForgotPasswordScreen}
				options={{ title: 'Forgot Password', drawerIcon: drawerIcon('lock-question'), ...signedOut }}
			/>
			<Drawer.Screen
				name="NotFound"
				component={NotFoundScreen}
				options={{ title: 'Oops!', ...neverInDrawer }}
			/>
		</Drawer.Navigator>
	);
}
