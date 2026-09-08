import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { Text, Chip } from 'react-native-paper';
import { getPublicProfile, earnedBadgeIds, labelForBadge } from '@safety-net/shared';

export default function PublicProfile({ uid, label }) {
	const [profile, setProfile] = useState(null);

	useEffect(() => {
		if (!uid) {
			setProfile(null);
			return;
		}
		getPublicProfile(uid)
			.then(setProfile)
			.catch(err => console.log(err));
	}, [uid]);

	if (!uid) return null;

	const name = (profile && profile.username) || uid;
	const badges = earnedBadgeIds(profile);

	return (
		<View style={{ marginBottom: 12 }}>
			<Text style={{ marginBottom: 4 }}>
				{label}: {name}
			</Text>
			<View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
				{badges.length === 0 ? (
					<Text style={{ opacity: 0.7 }}>No verification badges</Text>
				) : (
					badges.map(id => (
						<Chip key={id} compact style={{ marginRight: 8, marginBottom: 4 }}>
							{labelForBadge(id)}
						</Chip>
					))
				)}
			</View>
		</View>
	);
}
