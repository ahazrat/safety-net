import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { PaperProvider } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Navigation from '../../navigation';
import { StatusBar } from 'expo-status-bar';
import { withAuthentication } from '@safety-net/shared';
import { ensureWebFont, paperTheme } from '../../theme/paper';

const paperIconSettings = {
	icon: (props: { name: string; color: string; size: number }) => (
		<MaterialCommunityIcons {...props} />
	),
};

const AppComponent = () => {
	ensureWebFont();

	return (
		<SafeAreaProvider>
			<PaperProvider theme={paperTheme} settings={paperIconSettings}>
				<Navigation />
				<StatusBar style="dark" />
			</PaperProvider>
		</SafeAreaProvider>
	)
};

export default withAuthentication(AppComponent);
