import React from 'react';
import { View } from 'react-native';
import { Chip, Text } from 'react-native-paper';
import { earnedBadgeIds, labelForBadge } from '@safety-net/shared';

export default function BadgeChips({ profile, emptyLabel }) {
	const badges = earnedBadgeIds(profile);
	if (badges.length === 0) {
		return emptyLabel
			? <Text style={{ opacity: 0.7 }}>{emptyLabel}</Text>
			: null;
	}
	return (
		<View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
			{badges.map(id => (
				<Chip key={id} compact>{labelForBadge(id)}</Chip>
			))}
		</View>
	);
}
