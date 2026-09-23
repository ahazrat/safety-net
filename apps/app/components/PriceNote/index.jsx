import React from 'react';
import { Text } from 'react-native-paper';
import { color, space } from '../../theme/tokens';

export const PRICE_NOTE = 'Listed USD. You agree the amount off-platform. No card charge.';

export default function PriceNote() {
	return (
		<Text style={{ color: color.textMuted, marginBottom: space.sm }}>
			{PRICE_NOTE}
		</Text>
	);
}
