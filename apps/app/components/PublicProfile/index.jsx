import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { Text } from 'react-native-paper';
import { getPublicProfile } from '@safety-net/shared';
import BadgeChips from '../BadgeChips';

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

	return (
		<View style={{ marginBottom: 12 }}>
			<Text style={{ marginBottom: 4 }}>
				{label}: {name}
			</Text>
			<BadgeChips profile={profile} emptyLabel='No verification badges' />
		</View>
	);
}
