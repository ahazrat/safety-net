import React from 'react';
import { Platform, View } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';

type Props = {
	label: string;
	value: Date;
	mode: 'date' | 'time';
	onChange: (date: Date) => void;
};

const pad = (n: number) => String(n).padStart(2, '0');
const toDateInputValue = (date: Date) => `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
const toTimeInputValue = (date: Date) => `${pad(date.getHours())}:${pad(date.getMinutes())}`;

/**
 * A labeled date or time field. `@react-native-community/datetimepicker`
 * has no web implementation (it renders nothing there), so web gets a
 * native HTML <input type="date"|"time"> instead; iOS/Android use the real
 * community picker. Both report back a full Date via `onChange`.
 */
export default function DateTimeField({ label, value, mode, onChange }: Props) {
	const theme = useTheme();

	if (Platform.OS === 'web') {
		const inputValue = mode === 'date' ? toDateInputValue(value) : toTimeInputValue(value);
		return (
			<View style={{ marginVertical: 8, flex: 1 }}>
				<Text variant="labelMedium" style={{ marginBottom: 4, color: theme.colors.onSurfaceVariant }}>
					{label}
				</Text>
				{/* @ts-ignore - react-native-web passes an unrecognized element straight through to the DOM */}
				<input
					type={mode}
					value={inputValue}
					onChange={(e: any) => {
						const next = new Date(value.getTime());
						if (mode === 'date') {
							const [y, m, d] = e.target.value.split('-').map(Number);
							if (!y || !m || !d) return;
							next.setFullYear(y, m - 1, d);
						} else {
							const [h, min] = e.target.value.split(':').map(Number);
							if (Number.isNaN(h) || Number.isNaN(min)) return;
							next.setHours(h, min);
						}
						onChange(next);
					}}
					style={{
						padding: 12,
						borderRadius: 4,
						border: `1px solid ${theme.colors.outline}`,
						backgroundColor: theme.colors.surfaceVariant,
						color: theme.colors.onSurfaceVariant,
						fontSize: 16,
						fontFamily: 'inherit',
						width: '100%',
						boxSizing: 'border-box',
					}}
				/>
			</View>
		);
	}

	return (
		<View style={{ marginVertical: 8, flex: 1 }}>
			<Text variant="labelMedium" style={{ marginBottom: 4, color: theme.colors.onSurfaceVariant }}>
				{label}
			</Text>
			<DateTimePicker
				value={value}
				mode={mode}
				display="default"
				onChange={(_event, selected) => {
					if (selected) onChange(selected);
				}}
			/>
		</View>
	);
}
