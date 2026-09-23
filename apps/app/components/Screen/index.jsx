import React from 'react';
import { ScrollView, View } from 'react-native';
import { color, layout, space } from '../../theme/tokens';

export default function Screen({ children, scroll = true }) {
	const style = {
		padding: space.lg,
		width: '100%',
		maxWidth: layout.pageMaxWidth,
		alignSelf: 'center',
		backgroundColor: color.background,
	};
	if (!scroll) return <View style={[style, { flex: 1 }]}>{children}</View>;
	return <ScrollView contentContainerStyle={style}>{children}</ScrollView>;
}
