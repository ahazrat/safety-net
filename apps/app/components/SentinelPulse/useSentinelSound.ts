import { useCallback, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'sentinelPulse.soundEnabled';

/** Sound defaults on; the choice to mute persists across sessions. */
export default function useSentinelSound(): [boolean, (next: boolean) => void] {
	const [enabled, setEnabled] = useState(true);

	useEffect(() => {
		AsyncStorage.getItem(STORAGE_KEY)
			.then(value => {
				if (value !== null) setEnabled(value === 'true');
			})
			.catch(() => {});
	}, []);

	const update = useCallback((next: boolean) => {
		setEnabled(next);
		AsyncStorage.setItem(STORAGE_KEY, String(next)).catch(() => {});
	}, []);

	return [enabled, update];
}
