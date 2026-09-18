import React from 'react';
import { View } from 'react-native';
import { Card, Text } from 'react-native-paper';

type BasicCardProps = {
	text1?: string;
	text2?: string;
	text3?: string;
	text4?: string;
	onPress?: () => void;
	actionLabel?: string;
};

export default function BasicCard({ text1, text2, text3, text4, onPress, actionLabel }: BasicCardProps) {
	return (
		<Card style={{ width: 300, margin: 8 }} onPress={onPress}>
			<Card.Content>
				<Text variant='labelMedium' style={{ marginBottom: 4 }}>{text1}</Text>
				<Text variant='titleLarge'>{text2}</Text>
				<Text variant='bodyMedium' style={{ marginBottom: 6 }}>{text3}</Text>
				<Text variant='bodySmall'>{text4}</Text>
				{onPress && (
					<Text variant='labelMedium' style={{ marginTop: 8 }}>
						{actionLabel || 'Tap to request →'}
					</Text>
				)}
			</Card.Content>
		</Card>
	);
}
