import { Platform } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'

export const TOUR_DISMISS_KEY = 'safetynet.tour.dismissed'

function webStore() {
	return typeof localStorage !== 'undefined' ? localStorage : null
}

export async function tourDismissed() {
	try {
		if (Platform.OS === 'web') {
			const store = webStore()
			return !!store && store.getItem(TOUR_DISMISS_KEY) === '1'
		}
		return (await AsyncStorage.getItem(TOUR_DISMISS_KEY)) === '1'
	} catch {
		return false
	}
}

export async function dismissTour() {
	if (Platform.OS === 'web') {
		const store = webStore()
		if (store) store.setItem(TOUR_DISMISS_KEY, '1')
		return
	}
	await AsyncStorage.setItem(TOUR_DISMISS_KEY, '1')
}

export async function clearTourDismiss() {
	if (Platform.OS === 'web') {
		const store = webStore()
		if (store) store.removeItem(TOUR_DISMISS_KEY)
		return
	}
	await AsyncStorage.removeItem(TOUR_DISMISS_KEY)
}

export function demoQueryOn() {
	if (typeof window === 'undefined' || !window.location) return false
	return new URLSearchParams(window.location.search).get('demo') === 'block-watch'
}
