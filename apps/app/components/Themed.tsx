/**
 * Learn more about Light and Dark modes:
 * https://docs.expo.io/guides/color-schemes/
 */

import * as React from 'react';
import {
	StyleSheet,
	Text as DefaultText,
	View as DefaultView,
	Button as DefaultButton,
	// TextInput as DefaultTextInput,
} from 'react-native';

import Colors from '../constants/Colors';
import useColorScheme from '../hooks/useColorScheme';

export const styles = StyleSheet.create({
	title: {
		backgroundColor: 'black',
		color: 'white',
		textAlign: 'center',
		fontSize: 30,
		fontWeight: '500',
		margin: 10,
	},
	input: {
		height: 40,
		margin: 20,
		borderWidth: 1,
		borderColor: 'white',
		padding: 10,
		color: 'white',
	},
	margin20: {
		margin: 20,
	},
	errorText: {
		color: 'red',
		backgroundColor: 'white',
		fontWeight: 'bold',
		height: 40,
		margin: 12,
		padding: 10,
	},
	text: {
		color: 'white',
	},
	textCenter: {
		backgroundColor: 'black',
		color: 'white',
		margin: 10,
		textAlign: 'center',
	},
	textBold: {
		color: 'white',
		fontWeight: 'bold',
	},
	button: {
		width: 200,
		margin: 'auto',
		marginBottom: 10,
	},
	itemView: {
		borderWidth: 1,
		borderColor: 'green',
		margin: 10,
		padding: 10,
	},
});

export function useThemeColor(
	props: { light?: string; dark?: string },
	colorName: keyof typeof Colors.light & keyof typeof Colors.dark
) {
	const theme = useColorScheme();
	const colorFromProps = props[theme];

	if (colorFromProps) {
		return colorFromProps;
	} else {
		return Colors[theme][colorName];
	}
}

type ThemeProps = {
	lightColor?: string;
	darkColor?: string;
};

export type TextProps = ThemeProps & DefaultText['props'];
export type ViewProps = ThemeProps & DefaultView['props'];

export function Text(props: TextProps) {
	const { style, lightColor, darkColor, ...otherProps } = props;
	const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');

	return <DefaultText style={[{ color }, style]} {...otherProps} />;
}

export function MonoText(props: TextProps) {
	return <Text {...props} style={[props.style, { fontFamily: 'space-mono' }]} />;
}

export function View(props: ViewProps) {
	const { style, lightColor, darkColor, ...otherProps } = props;
	const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'background');

	return <DefaultView style={[{ backgroundColor }, style]} {...otherProps} />;
}

export function TextLink(props: any) {
	return (
		<View
			style={{
				alignItems: 'center',
				padding: 10,
				borderWidth: 1,
				width: '50%',
				marginLeft: '25%',
				marginTop: 20,
			}}
			>
			<Text
				onPress={() => {props.navigation.navigate('Listings')}}
			>{props.title}</Text>
		</View>
	);
}

export function Button(props: any) {
	return (
		<View style={styles.button}>
			<DefaultButton
				{...props}
			/>
		</View>
	);
}
