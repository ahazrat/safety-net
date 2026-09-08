/**
 * If you are not familiar with React Navigation, check out the "Fundamentals" guide:
 * https://reactnavigation.org/docs/getting-started
 *
 */
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import * as React from 'react';
import { ColorSchemeName, Text } from 'react-native';

import SignUp from '../components/SignUp';
import SignIn from '../components/SignIn';
import HomeScreen from '../components/Home';
import AccountScreen from '../components/Account';
import Listings from '../components/Listings';
import Listing from '../components/Listing';
import ListingCreate from '../components/ListingCreate';
import ForgotPasswordScreen from '../components/PasswordForget';
import ChangePasswordScreen from '../components/PasswordChange';
import AdminScreen from '../components/Admin';
import NotFoundScreen from '../components/NotFound';

import { RootStackParamList } from '../types';
import LinkingConfiguration from './LinkingConfiguration';

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

const Stack = createStackNavigator<RootStackParamList>();

function RootNavigator() {
	return (
		<Stack.Navigator
			initialRouteName="SignIn"
			screenOptions={{ headerShown: false }}
		>
			<Stack.Screen
				name='SignUp'
				component={SignUp}
				options={{ title: 'SafetyNet: Sign Up!' }}
			/>
			<Stack.Screen
				name='SignIn'
				component={SignIn}
				options={{ title: 'SafetyNet: Sign In' }}
			/>
			<Stack.Screen
				name='Home'
				component={HomeScreen}
				options={{ title: 'SafetyNet: Home' }}
			/>
			<Stack.Screen
				name='Account'
				component={AccountScreen}
				options={{ title: 'SafetyNet: Account' }}
			/>
			<Stack.Screen
				name='Listings'
				component={Listings}
				options={{ title: 'SafetyNet: Listings' }}
			/>
			<Stack.Screen
				name='Listing'
				component={Listing}
				options={{ title: 'SafetyNet: Listing' }}
			/>
			<Stack.Screen
				name='ListingCreate'
				component={ListingCreate}
				options={{ title: 'SafetyNet: Create Listing' }}
			/>
			<Stack.Screen
				name="ForgotPassword"
				component={ForgotPasswordScreen}
				options={{ title: 'SafetyNet: Forgot Password' }}
			/>
			<Stack.Screen
				name="ChangePassword"
				component={ChangePasswordScreen}
				options={{ title: 'SafetyNet: Change Password' }}
			/>
			<Stack.Screen
				name="Admin"
				component={AdminScreen}
				options={{ title: 'SafetyNet: Admin' }}
			/>
			<Stack.Screen
				name="NotFound"
				component={NotFoundScreen}
				options={{ title: 'Oops!' }}
			/>
		</Stack.Navigator>
	);
}
