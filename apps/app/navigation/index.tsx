/**
 * If you are not familiar with React Navigation, check out the "Fundamentals" guide:
 * https://reactnavigation.org/docs/getting-started
 *
 */
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import * as React from 'react';
import { ColorSchemeName, Text } from 'react-native';

import SignUp from '../components/SignUp';
import SignIn from '../components/SignIn';
import HomeScreen from '../components/Home';
import AccountScreen from '../components/Account';
import Listings from '../components/Listings';
import Listing from '../components/Listing';
import ListingCreate from '../components/ListingCreate';
import ServicesScreen from '../components/Services';
import MapScreen from '../components/MapScreen';
import ForgotPasswordScreen from '../components/PasswordForget';
import ChangePasswordScreen from '../components/PasswordChange';
import AdminScreen from '../components/Admin';
import NotFoundScreen from '../components/NotFound';

import { RootStackParamList } from '../types';
import LinkingConfiguration from './LinkingConfiguration';
import { AuthUserContext } from '../auth/session';

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

function RootNavigator() {
	const authUser = React.useContext(AuthUserContext);

	return (
		<Drawer.Navigator
			initialRouteName="Home"
			screenOptions={{ headerShown: true }}
		>
			<Drawer.Screen
				name='Home'
				component={HomeScreen}
				options={{ title: 'SafetyNet: Home' }}
			/>
			{authUser ? (
				<>
					<Drawer.Screen
						name='Listings'
						component={Listings}
						options={{ title: 'SafetyNet: Listings' }}
					/>
					<Drawer.Screen
						name='Listing'
						component={Listing}
						options={{ title: 'SafetyNet: Listing' }}
					/>
					<Drawer.Screen
						name='ListingCreate'
						component={ListingCreate}
						options={{ title: 'SafetyNet: Create Listing' }}
					/>
				</>
			) : null}
			<Drawer.Screen
				name='Services'
				component={ServicesScreen}
				options={{ title: 'SafetyNet: Services' }}
			/>
			<Drawer.Screen
				name='Map'
				component={MapScreen}
				options={{ title: 'SafetyNet: Map' }}
			/>
			{authUser ? (
				<>
					<Drawer.Screen
						name='Account'
						component={AccountScreen}
						options={{ title: 'SafetyNet: Account' }}
					/>
					<Drawer.Screen
						name="ChangePassword"
						component={ChangePasswordScreen}
						options={{ title: 'SafetyNet: Change Password' }}
					/>
					<Drawer.Screen
						name="Admin"
						component={AdminScreen}
						options={{ title: 'SafetyNet: Admin' }}
					/>
				</>
			) : (
				<>
					<Drawer.Screen
						name='SignIn'
						component={SignIn}
						options={{ title: 'SafetyNet: Sign In' }}
					/>
					<Drawer.Screen
						name='SignUp'
						component={SignUp}
						options={{ title: 'SafetyNet: Sign Up!' }}
					/>
					<Drawer.Screen
						name="ForgotPassword"
						component={ForgotPasswordScreen}
						options={{ title: 'SafetyNet: Forgot Password' }}
					/>
				</>
			)}
			<Drawer.Screen
				name="NotFound"
				component={NotFoundScreen}
				options={{ title: 'Oops!' }}
			/>
		</Drawer.Navigator>
	);
}
