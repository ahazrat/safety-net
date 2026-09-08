import React from 'react';
import useColorScheme from '../../hooks/useColorScheme';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Navigation from '../../navigation';
import { StatusBar } from 'expo-status-bar';
import { withAuthentication } from '../../auth/session';

const AppComponent = () => {

	const colorScheme = useColorScheme();

	return (
		<SafeAreaProvider>
			<Navigation
				colorScheme={colorScheme}
			/>
			<StatusBar />
		</SafeAreaProvider>
	)
};

export default withAuthentication(AppComponent);
