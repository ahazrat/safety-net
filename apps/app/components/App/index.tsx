import React from 'react';
import useColorScheme from '../../hooks/useColorScheme';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { PaperProvider, MD3LightTheme, MD3DarkTheme } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Navigation from '../../navigation';
import { StatusBar } from 'expo-status-bar';
import { withAuthentication } from '../../auth/session';
import Colors from '../../constants/Colors';

const paperIconSettings = {
	icon: (props: { name: string; color: string; size: number }) => (
		<MaterialCommunityIcons {...props} />
	),
};

const lightTheme = {
	...MD3LightTheme,
	colors: {
		...MD3LightTheme.colors,
		primary: Colors.light.tint,
		background: Colors.light.background,
	},
};

const darkTheme = {
	...MD3DarkTheme,
	colors: {
		...MD3DarkTheme.colors,
		primary: Colors.dark.tint,
		background: Colors.dark.background,
	},
};

const AppComponent = () => {

	const colorScheme = useColorScheme();

	return (
		<SafeAreaProvider>
			<PaperProvider theme={colorScheme === 'dark' ? darkTheme : lightTheme} settings={paperIconSettings}>
				<Navigation
					colorScheme={colorScheme}
				/>
				<StatusBar />
			</PaperProvider>
		</SafeAreaProvider>
	)
};

export default withAuthentication(AppComponent);
