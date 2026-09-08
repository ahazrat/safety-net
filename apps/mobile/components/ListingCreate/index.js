import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, Button } from 'react-native';
// import { SNCalendar } from '../Calendar';

import { createNewDoc } from '@safety-net/shared';

const styles = StyleSheet.create({
	view: {
		backgroundColor: 'white',
		height: '100%',
		padding: 20,
	},
	title: {
		textAlign: 'center',
		fontSize: 30,
		fontWeight: 'bold',
		marginBottom: 10,
	},
	textInput: {
		margin: 10,
		padding: 10,
		borderWidth: 1
	},
	inputView: {
		display: 'flex',
		flexDirection: 'row',
	},
	numInput: {
		margin: 10,
		padding: 10,
		borderWidth: 1,
	},
	createButton: {
		marginTop: 20,
	},
});

const ListingCreate = () => {
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

	const numInput = (text, value, onChange, width='20%') => (
		<View style={{ width: width }}>
			<Text>{text}</Text>
			<TextInput
				style={styles.numInput}
				value={value}
				onChangeText={onChange}
				returnKeyType='next'
			/>
		</View>
	);

	const createListing = () => {
		const newListing = {
			title: title,
			dateRange: {
				start: {
					year: startYear,
					month: startMonth,
					day: startDay,
				},
				end: {
					year: endYear,
					month: endMonth,
					day: endDay,
				},
			},
			timeSchedule: [
				{
					start: {
						hour: startHour,
						minute: startMinute,
					},
					end: {
						hour: endHour,
						minute: endMinute,
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
		};
		console.log(newListing)
		createNewDoc('listings', newListing);
	};

	return (
		<View style={styles.view}>
			<Text style={styles.title}>Create Listing</Text>
			<Text>Title</Text>
			<TextInput
				style={styles.textInput}
				value={title}
				onChangeText={setTitle}
			/>
			<Text>Start</Text>
			<View style={styles.inputView}>
				{numInput('Year', startYear, setStartYear)}
				{numInput('Month', startMonth, setStartMonth)}
				{numInput('Day', startDay, setStartDay)}
				{numInput('Hour', startHour, setStartHour)}
				{numInput('Minute', startMinute, setStartMinute)}
			</View>
			<Text>End</Text>
			<View style={styles.inputView}>
				{numInput('Year', endYear, setEndYear)}
				{numInput('Month', endMonth, setEndMonth)}
				{numInput('Day', endDay, setEndDay)}
				{numInput('Hour', endHour, setEndHour)}
				{numInput('Minute', endMinute, setEndMinute)}
			</View>
			<Text>Repeat Days of Week</Text>
			<TextInput
				style={styles.textInput}
				value={repeatDays}
				onChangeText={setRepeatDays}
			/>
			<Text>Location</Text>
			<View style={styles.inputView}>
				{numInput('Latitude', latitude, setLatitude, '40%')}
				{numInput('Longitude', longitude, setLongitude, '40%')}
			</View>
			<View style={styles.createButton}>
				<Button
					title='Create Listing'
					onPress={createListing}
				/>
			</View>
		</View>
	);
};

export default ListingCreate;
