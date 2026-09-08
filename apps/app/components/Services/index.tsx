import React from 'react';
import { ScrollView, View } from 'react-native';
import { Text } from 'react-native-paper';
import BasicCard from '../BasicCard';

const CARDS = [
	{ text1: 'Service', text2: 'Marketplace', text3: 'foundation', text4: 'a live marketplace for providers to interact directly with buyers' },
	{ text1: 'Service', text2: 'Live Situational Map', text3: 'free/public', text4: 'real-time, dynamic icons shown on a localized map provides critical information at a glance' },
	{ text1: 'Service', text2: 'Price API', text3: 'data platform', text4: 'a free and open flow of information from/to buyers/sellers. Updated pricing for offering based on authentication, proximity, reputation, and stake' },

	{ text1: 'Feature', text2: 'Listings', text3: 'freelance work', text4: 'earn money by providing safety and security for your local neighborhood' },
	{ text1: 'Feature', text2: 'Badges', text3: 'verification', text4: 'badges that can be earned by providers include: professional-demeanor, complete-profile, de-escalation, self-defense, personal-defense, weapons-non-lethal, weapons-lethal, emergency-response, cpr' },
	{ text1: 'Feature', text2: 'Teams', text3: 'feature', text4: 'combine strengths and needs into Teams to maximize value for all sides' },

	{ text1: 'Offering', text2: 'Neighborhood Watch', text3: 'pay-per-contract', text4: 'hire a local, trusted agent to monitor a given area provide surveillance at a given time' },
	{ text1: 'Offering', text2: 'Event Security', text3: 'pay-per-contract', text4: 'real, human presence with specific directives to handle rare occurances' },
	{ text1: 'Offering', text2: 'Physical Defense', text3: 'pay-per-contract', text4: 'professionally trained and certified agents when you need them' },

	{ text1: 'Offering', text2: 'ID Verification', text3: 'pay-per-contract', text4: '' },
	{ text1: 'Offering', text2: 'Safe Rides', text3: 'pay-per-contract', text4: '' },
	{ text1: 'Offering', text2: 'Notary', text3: 'pay-per-contract', text4: '' },

	{ text1: 'Offering', text2: 'Credit Check', text3: 'pay-per-contract', text4: '' },
	{ text1: 'Offering', text2: 'Arbiter', text3: 'pay-per-contract', text4: '' },
	{ text1: 'Offering', text2: 'Assessment', text3: 'pay-per-contract', text4: '' },

	{ text1: 'Outcome', text2: 'Reliability', text3: 'value', text4: 'synonymous with stability, streamlined development and operations, and a better user experience' },
	{ text1: 'Outcome', text2: 'Ease of mind', text3: 'value', text4: 'security, confidence, certainty, comfort, safety, assurance, reassurance, conviction, happiness and sureness' },
	{ text1: 'Service', text2: 'Natural Freedom', text3: 'moral objective', text4: 'No state intervention. We strengthen ourselves.' },
];

export default function ServicesScreen() {
	return (
		<ScrollView contentContainerStyle={{ padding: 16 }}>
			<Text variant='headlineMedium' style={{ marginBottom: 16 }}>What is Safety Net</Text>
			<View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' }}>
				{CARDS.map((card, i) => (
					<BasicCard key={i} {...card} />
				))}
			</View>
		</ScrollView>
	);
}
