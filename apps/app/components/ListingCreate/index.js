import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Text, TextInput, Button, HelperText } from 'react-native-paper';

import { createListing } from '@safety-net/shared';

const styles = StyleSheet.create({
	view: {
		height: '100%',
		padding: 20,
	},
	title: {
		textAlign: 'center',
		marginBottom: 10,
	},
	textInput: {
		marginVertical: 10,
	},
	inputView: {
		display: 'flex',
		flexDirection: 'row',
	},
	numInput: {
		margin: 10,
	},
	createButton: {
		marginTop: 20,
	},
});

const ListingCreate = ({ navigation }) => {
	const [title, setTitle] = useState('My new listing');
	const [startYear, setStartYear] = useState(2021);
	const [startMonth, setStartMonth] = useState(12);
	const [startDay, setStartDay] = useState(1);
	const [endYear, setEndYear] = useState(2022);
	const [endMonth, setEndMonth] = useState(3);
	const [endDay, setEndDay] = useState(1);
	const [startHour, setStartHour] = useState(8);
	const [startMinute, setStartMinute] = useState(30);
	const [endHour, setEndHour] = useState(4);
	const [endMinute, setEndMinute] = useState(30);
	const [repeatDays, setRepeatDays] = useState('MWF');
	const [latitude, setLatitude] = useState(0);
	const [longitude, setLongitude] = useState(0);
	const [error, setError] = useState(null);

	const numInput = (text, value, onChange, width='20%') => (
		<View style={[styles.numInput, { width: width }]}>
			<TextInput
				label={text}
				value={String(value)}
				onChangeText={onChange}
				keyboardType='numeric'
				returnKeyType='next'
			/>
		</View>
	);

	const createListing = () => {
		const newListing = {
			title: title,
			dateRange: {
				start: {
					year: Number(startYear),
					month: Number(startMonth),
					day: Number(startDay),
				},
				end: {
					year: Number(endYear),
					month: Number(endMonth),
					day: Number(endDay),
				},
			},
			timeSchedule: [
				{
					start: {
						hour: Number(startHour),
						minute: Number(startMinute),
					},
					end: {
						hour: Number(endHour),
						minute: Number(endMinute),
					},
					repeat: {
						daysOfWeek: repeatDays,
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
				lat: Number(latitude),
				lng: Number(longitude),
			},
		};
		setError(null);
		createListing(newListing)
			.then(() => navigation.navigate('Listings'))
			.catch(setError);
	};

	return (
		<View style={styles.view}>
			<Text variant='headlineMedium' style={styles.title}>Create Listing</Text>
			<TextInput
				style={styles.textInput}
				label='Title'
				value={title}
				onChangeText={setTitle}
			/>
			<Text variant='titleMedium'>Start</Text>
			<View style={styles.inputView}>
				{numInput('Year', startYear, setStartYear)}
				{numInput('Month', startMonth, setStartMonth)}
				{numInput('Day', startDay, setStartDay)}
				{numInput('Hour', startHour, setStartHour)}
				{numInput('Minute', startMinute, setStartMinute)}
			</View>
			<Text variant='titleMedium'>End</Text>
			<View style={styles.inputView}>
				{numInput('Year', endYear, setEndYear)}
				{numInput('Month', endMonth, setEndMonth)}
				{numInput('Day', endDay, setEndDay)}
				{numInput('Hour', endHour, setEndHour)}
				{numInput('Minute', endMinute, setEndMinute)}
			</View>
			<Text variant='titleMedium'>Repeat Days of Week</Text>
			<TextInput
				style={styles.textInput}
				value={repeatDays}
				onChangeText={setRepeatDays}
			/>
			<Text variant='titleMedium'>Location</Text>
			<View style={styles.inputView}>
				{numInput('Latitude', latitude, setLatitude, '40%')}
				{numInput('Longitude', longitude, setLongitude, '40%')}
			</View>
			<Button
				mode='contained'
				onPress={createListing}
				style={styles.createButton}
			>
				Create Listing
			</Button>
			{error && <HelperText type='error' visible>{error.message}</HelperText>}
		</View>
	);
};

export default ListingCreate;
