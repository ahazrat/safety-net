import React, { useCallback, useContext, useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Text, TextInput, Button, HelperText, Switch, Chip } from 'react-native-paper';
import { useFocusEffect } from '@react-navigation/native';

import {
	AuthUserContext,
	createListing as submitListing,
	dollarsTextToCents,
	CHICAGO_CENTER,
	CHICAGO_ZOOM,
	LISTING_TYPE_CHIPS,
	normalizeListingType,
	defaultTitleForListingType,
	TEAM_SIZE_MAX,
} from '@safety-net/shared';
import SentinelPulse from '../SentinelPulse';
import PriceNote from '../PriceNote';
import DateTimeField from '../DateTimeField';
import Map from '../Map';

const CREATE_PULSE_MS = 850;
const DAY_CODES = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

const styles = StyleSheet.create({
	view: {
		padding: 20,
	},
	title: {
		textAlign: 'center',
		marginBottom: 10,
	},
	textInput: {
		marginVertical: 10,
	},
	sectionLabel: {
		marginTop: 4,
		marginBottom: 4,
	},
	row: {
		flexDirection: 'row',
		gap: 12,
	},
	dayRow: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		gap: 8,
		marginBottom: 10,
	},
	createButton: {
		marginTop: 20,
		marginBottom: 20,
	},
});

const SignedOutPrompt = ({ navigation, route }) => {
	const listingType = typeFromRoute(route?.params);
	return (
		<ScrollView contentContainerStyle={styles.view}>
			<Text variant='headlineMedium' style={styles.title}>Create Listing</Text>
			<Text style={{ marginBottom: 8 }}>
				Example: a block walk is about $5 a house, listed USD. This preview does not post a job.
			</Text>
			<PriceNote />
			<Text variant='titleMedium' style={styles.sectionLabel}>Type</Text>
			<View testID="tour-listing-type" style={styles.dayRow}>
				{LISTING_TYPE_CHIPS.map(({ value, label }) => (
					<Chip key={value} selected={listingType === value} compact>
						{label}
					</Chip>
				))}
			</View>
			<Text testID="tour-price" style={{ marginBottom: 16 }}>Example listed price: $5</Text>
			<View testID="tour-create-gate">
				<Text variant='titleMedium' style={{ marginBottom: 8 }}>Sign in to post</Text>
				<View style={{ flexDirection: 'row', gap: 12 }}>
					<Button mode='contained' onPress={() => navigation.navigate('SignIn')}>Sign in</Button>
					<Button mode='outlined' onPress={() => navigation.navigate('SignUp')}>Sign up</Button>
				</View>
			</View>
		</ScrollView>
	);
};

function defaultStart() {
	const d = new Date();
	d.setDate(d.getDate() + 1);
	d.setHours(8, 30, 0, 0);
	return d;
}

function defaultEnd() {
	const d = defaultStart();
	d.setHours(16, 30, 0, 0);
	return d;
}

function typeFromRoute(params) {
	return normalizeListingType(params?.listingType, params?.title);
}

function titleFromRoute(params) {
	if (params?.title) return params.title;
	return defaultTitleForListingType(typeFromRoute(params));
}

const ListingCreate = ({ navigation, route }) => {
	const authUser = useContext(AuthUserContext);
	const [listingType, setListingType] = useState(() => typeFromRoute(route?.params));
	const [title, setTitle] = useState(() => titleFromRoute(route?.params));
	const [startDate, setStartDate] = useState(defaultStart);
	const [endDate, setEndDate] = useState(defaultEnd);
	const [repeatDays, setRepeatDays] = useState(['Mo', 'We', 'Fr']);
	const [location, setLocation] = useState(null);
	const [isPublic, setIsPublic] = useState(true);
	const [teamSize, setTeamSize] = useState(1);
	const [priceDollars, setPriceDollars] = useState('');
	const [error, setError] = useState(null);
	const [created, setCreated] = useState(false);

	useFocusEffect(useCallback(() => {
		setCreated(false);
	}, []));

	useEffect(() => {
		const params = route?.params;
		if (params && (params.listingType != null || params.title != null)) {
			setListingType(typeFromRoute(params));
			setTitle(titleFromRoute(params));
		}
	}, [route?.params?.listingType, route?.params?.title]);

	useEffect(() => {
		if (!created) return;
		const timer = setTimeout(() => navigation.navigate('Listings'), CREATE_PULSE_MS);
		return () => clearTimeout(timer);
	}, [created]);

	const selectType = (next) => {
		setListingType(next);
		setTitle(prev => {
			const prevDefault = defaultTitleForListingType(listingType);
			if (!String(prev).trim() || prev === prevDefault) {
				return defaultTitleForListingType(next);
			}
			return prev;
		});
	};

	if (!authUser) {
		return <SignedOutPrompt navigation={navigation} route={route} />;
	}

	if (created) {
		return (
			<View style={[styles.view, { alignItems: 'center', justifyContent: 'center', flex: 1 }]}>
				<SentinelPulse status='confirmed' label='Listing posted' size={80} />
				<Text style={{ marginTop: 12 }}>Listing posted</Text>
			</View>
		);
	}

	const toggleDay = (code) => {
		setRepeatDays(prev => (prev.includes(code) ? prev.filter(d => d !== code) : [...prev, code]));
	};

	const onCreate = () => {
		if (!String(title).trim()) {
			setError(new Error('Title is required'));
			return;
		}
		if (!location) {
			setError(new Error('Tap the map to set where this job is'));
			return;
		}
		const listedPriceCents = dollarsTextToCents(priceDollars);
		if (listedPriceCents === null) {
			setError(new Error('Price must be a number of dollars (blank = no price, 0 = volunteer)'));
			return;
		}
		const newListing = {
			title: String(title).trim(),
			listingType,
			teamSize,
			visibility: isPublic ? 'public' : 'private',
			dateRange: {
				start: {
					year: startDate.getFullYear(),
					month: startDate.getMonth() + 1,
					day: startDate.getDate(),
				},
				end: {
					year: endDate.getFullYear(),
					month: endDate.getMonth() + 1,
					day: endDate.getDate(),
				},
			},
			timeSchedule: [
				{
					start: {
						hour: startDate.getHours(),
						minute: startDate.getMinutes(),
					},
					end: {
						hour: endDate.getHours(),
						minute: endDate.getMinutes(),
					},
					repeat: {
						daysOfWeek: DAY_CODES.filter(d => repeatDays.includes(d)).join(''),
					}
				}
			],
			requirements: {
				authentication: 100,
				proximity: 90,
				reputation: 75,
				stake: 15,
			},
			location: {
				lat: location.lat,
				lng: location.lng,
			},
		};
		if (listedPriceCents !== undefined) {
			newListing.listedPriceCents = listedPriceCents;
			newListing.currency = 'usd';
		}
		setError(null);
		submitListing(newListing)
			.then(() => setCreated(true))
			.catch(setError);
	};

	return (
		<ScrollView contentContainerStyle={styles.view}>
			<Text variant='headlineMedium' style={styles.title}>Create Listing</Text>
			<Text variant='titleMedium' style={styles.sectionLabel}>Type</Text>
			<View testID="tour-listing-type" style={styles.dayRow}>
				{LISTING_TYPE_CHIPS.map(({ value, label }) => (
					<Chip
						key={value}
						selected={listingType === value}
						onPress={() => selectType(value)}
						compact
					>
						{label}
					</Chip>
				))}
			</View>
			<TextInput
				style={styles.textInput}
				label='Title (optional override)'
				value={title}
				onChangeText={setTitle}
			/>

			<Text variant='titleMedium' style={styles.sectionLabel}>Start</Text>
			<View style={styles.row}>
				<DateTimeField label='Date' mode='date' value={startDate} onChange={setStartDate} />
				<DateTimeField label='Time' mode='time' value={startDate} onChange={setStartDate} />
			</View>

			<Text variant='titleMedium' style={styles.sectionLabel}>End</Text>
			<View style={styles.row}>
				<DateTimeField label='Date' mode='date' value={endDate} onChange={setEndDate} />
				<DateTimeField label='Time' mode='time' value={endDate} onChange={setEndDate} />
			</View>

			<Text variant='titleMedium' style={styles.sectionLabel}>Team size</Text>
			<Text style={{ marginBottom: 8 }}>
				1 is a solo job. Above that, the first person to accept is captain and others join until the roster is full.
			</Text>
			<View style={styles.dayRow}>
				{Array.from({ length: TEAM_SIZE_MAX }, (_, i) => i + 1).map(n => (
					<Chip key={n} selected={teamSize === n} onPress={() => setTeamSize(n)} compact>
						{String(n)}
					</Chip>
				))}
			</View>

			<Text variant='titleMedium' style={styles.sectionLabel}>Repeat on</Text>
			<View style={styles.dayRow}>
				{DAY_CODES.map(code => (
					<Chip
						key={code}
						selected={repeatDays.includes(code)}
						onPress={() => toggleDay(code)}
						compact
					>
						{code}
					</Chip>
				))}
			</View>

			<Text variant='titleMedium' style={styles.sectionLabel}>Location</Text>
			<Text style={{ marginBottom: 8 }}>
				{location ? `Selected: ${location.lat.toFixed(5)}, ${location.lng.toFixed(5)}` : 'Tap the map to set where this job is'}
			</Text>
			<Map
				pins={location ? [{ lat: location.lat, lng: location.lng, title: 'Selected location' }] : []}
				center={location ? [location.lat, location.lng] : CHICAGO_CENTER}
				zoom={location ? 14 : CHICAGO_ZOOM}
				onLocationPress={(lat, lng) => setLocation({ lat, lng })}
				style={{ height: 220, marginBottom: 10 }}
			/>

			<TextInput
				testID="tour-price"
				style={styles.textInput}
				label='Listed price USD (optional; 0 = volunteer)'
				value={priceDollars}
				onChangeText={setPriceDollars}
				keyboardType='numeric'
			/>
			<PriceNote />
			<View style={[styles.row, { alignItems: 'center' }]}>
				<Text variant='titleMedium' style={{ marginRight: 12 }}>
					{isPublic ? 'Public (visible on the map)' : 'Private (only you)'}
				</Text>
				<Switch value={isPublic} onValueChange={setIsPublic} />
			</View>
			<Button
				mode='contained'
				onPress={onCreate}
				style={styles.createButton}
			>
				Create Listing
			</Button>
			{error && <HelperText type='error' visible>{error.message}</HelperText>}
		</ScrollView>
	);
};

export default ListingCreate;
