import React, { useContext, useEffect, useState } from 'react'
import { Platform, Pressable, View } from 'react-native'
import { Button, Text } from 'react-native-paper'
import { useNavigation } from '@react-navigation/native'
import { AuthUserContext } from '@safety-net/shared'
import { BLOCK_WATCH, exampleNightlyCents } from '../../tour/blockWatch'
import { clearTourDismiss, demoQueryOn, dismissTour, tourDismissed } from '../../tour/dismiss'

const NIGHTLY = (exampleNightlyCents() / 100).toFixed(0)

export const TOUR_STEPS = [
	{
		title: 'Hire a neighbor',
		body: 'Private contracts. A public map. This tour is an example, not a live job.',
	},
	{
		route: 'Map',
		target: 'tour-map',
		demo: true,
		title: 'Map',
		body: 'Jobs and risk show here. The gold pins are an example on one Bridgeport block. They are not live listings.',
	},
	{
		route: 'Map',
		target: 'tour-map',
		demo: true,
		title: 'Block walk — twice a night',
		body: `${BLOCK_WATCH.houseCount} neighbors on ${BLOCK_WATCH.street} in ${BLOCK_WATCH.neighborhood} hire one walker. The walker goes twice a night. About $5 a house, listed USD. Example total $${NIGHTLY}. Off-platform. No Stripe. Not a live market rate.`,
	},
	{
		route: 'ListingCreate',
		target: 'tour-listing-type',
		fallbackTarget: 'tour-create-gate',
		title: 'Listing type',
		body: 'Neighborhood Watch is the type for a block walk. The title stays a human label. Sign in to set it.',
	},
	{
		route: 'ListingCreate',
		target: 'tour-price',
		fallbackTarget: 'tour-create-gate',
		title: 'Listed price',
		body: 'Example: about $5 per house, listed USD. Off-platform. No Stripe.',
	},
	{
		route: 'Listings',
		target: 'tour-listings',
		title: 'Badges',
		body: 'Admin-granted badges show on a listing and on Jobs so you can see who you hired.',
	},
	{
		route: 'Messages',
		target: 'tour-messages',
		signedInOnly: true,
		title: 'Messages',
		body: 'Message the person you hired from the job. Sign in to open messages.',
	},
]

function measure(testId) {
	if (Platform.OS !== 'web' || typeof document === 'undefined' || !testId) return null
	const node = document.querySelector(`[data-testid="${testId}"]`)
	if (!node || !node.getBoundingClientRect) return null
	const rect = node.getBoundingClientRect()
	if (rect.width < 2 || rect.height < 2) return null
	return { x: rect.left, y: rect.top, width: rect.width, height: rect.height }
}

export default function Tour({ open, step, onStep, onClose }) {
	const navigation = useNavigation()
	const authUser = useContext(AuthUserContext)
	const current = TOUR_STEPS[step] || TOUR_STEPS[0]
	const [rect, setRect] = useState(null)
	const [hovered, setHovered] = useState(false)
	const [pinned, setPinned] = useState(true)

	useEffect(() => {
		if (!open) return
		if (current.route && !(current.signedInOnly && !authUser)) {
			navigation.navigate(current.route)
		}
	}, [open, step])

	useEffect(() => {
		setPinned(true)
		setHovered(false)
	}, [step])

	useEffect(() => {
		if (!open || Platform.OS !== 'web') return
		const ids = [current.target, current.fallbackTarget, 'tour-spotlight'].filter(Boolean)
		const hit = (event) => {
			const el = event.target && event.target.closest && event.target.closest('[data-testid]')
			if (!el) return false
			return ids.indexOf(el.getAttribute('data-testid')) !== -1
		}
		let lastTap = 0
		const onOver = (event) => { if (hit(event)) setHovered(true) }
		const onOut = (event) => { if (hit(event)) setHovered(false) }
		const onTap = (event) => {
			if (!hit(event)) return
			const now = Date.now()
			if (now - lastTap < 400) return
			lastTap = now
			setPinned(value => !value)
		}
		document.addEventListener('mouseover', onOver)
		document.addEventListener('mouseout', onOut)
		document.addEventListener('click', onTap)
		document.addEventListener('touchend', onTap)
		return () => {
			document.removeEventListener('mouseover', onOver)
			document.removeEventListener('mouseout', onOut)
			document.removeEventListener('click', onTap)
			document.removeEventListener('touchend', onTap)
		}
	}, [open, step, current.target, current.fallbackTarget])

	useEffect(() => {
		if (!open || Platform.OS !== 'web') {
			setRect(null)
			return
		}
		let alive = true
		const tick = () => {
			if (!alive) return
			const primary = measure(current.target)
			setRect(primary || measure(current.fallbackTarget))
		}
		tick()
		const timer = setInterval(tick, 400)
		window.addEventListener('resize', tick)
		return () => {
			alive = false
			clearInterval(timer)
			window.removeEventListener('resize', tick)
		}
	}, [open, step, current.target, current.fallbackTarget])

	if (!open) return null

	const last = step >= TOUR_STEPS.length - 1
	const hole = rect
	const balloonTop = hole ? Math.min(hole.y + hole.height + 12, (typeof window !== 'undefined' ? window.innerHeight : 800) - 220) : 72

	const showBalloon = !hole || hovered || pinned
	const hoverProps = Platform.OS === 'web'
		? {
			onHoverIn: () => setHovered(true),
			onHoverOut: () => setHovered(false),
			onMouseEnter: () => setHovered(true),
			onMouseLeave: () => setHovered(false),
		}
		: {}

	return (
		<View
			pointerEvents="box-none"
			style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 50 }}
		>
			{hole ? (
				<Pressable
					testID="tour-spotlight"
					onPress={() => {}}
					{...hoverProps}
					style={{
						position: 'absolute',
						left: hole.x - 6,
						top: hole.y - 6,
						width: hole.width + 12,
						height: hole.height + 12,
						borderRadius: 8,
						borderWidth: 2,
						borderColor: hovered ? '#f5c518' : '#ffffff',
						shadowColor: '#000',
						shadowOpacity: 0.55,
						shadowRadius: 12,
					}}
				/>
			) : null}
			<View
				pointerEvents="none"
				style={{
					position: 'absolute',
					top: 0, left: 0, right: 0, bottom: 0,
					backgroundColor: hole ? 'transparent' : 'rgba(0,0,0,0.45)',
				}}
			/>
			{hole && Platform.OS === 'web' ? (
				<View
					pointerEvents="none"
					style={{
						position: 'absolute',
						left: hole.x - 6,
						top: hole.y - 6,
						width: hole.width + 12,
						height: hole.height + 12,
						borderRadius: 8,
						// Large shadow dims everything outside the hole.
						boxShadow: '0 0 0 9999px rgba(0,0,0,0.55)',
					}}
				/>
			) : null}
			{showBalloon ? <View
				testID="tour-balloon"
				style={{
					position: 'absolute',
					left: 16,
					right: 16,
					top: balloonTop,
					backgroundColor: '#fffef6',
					borderRadius: 12,
					padding: 14,
					maxWidth: 420,
					borderWidth: 1,
					borderColor: hovered ? '#f5c518' : '#e6d48a',
				}}
			>
				<Text variant="titleMedium">{current.title}</Text>
				<Text style={{ marginTop: 6, marginBottom: 12 }}>{current.body}</Text>
				<Text style={{ opacity: 0.6, marginBottom: 8 }}>
					{step + 1} / {TOUR_STEPS.length} · hover or tap the highlight
					{hovered ? ' · hover' : ''}{pinned ? ' · tapped open' : ''}
				</Text>
				<View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
					<Button compact disabled={step === 0} onPress={() => onStep(step - 1)}>Back</Button>
					<Button compact mode="contained" onPress={() => last ? onClose(true) : onStep(step + 1)}>
						{last ? 'Done' : 'Next'}
					</Button>
					<Button compact onPress={() => onClose(true)}>Skip</Button>
				</View>
			</View> : null}
		</View>
	)
}

export function useTourGate() {
	const [open, setOpen] = useState(false)
	const [step, setStep] = useState(0)
	const [queryDemo, setQueryDemo] = useState(false)

	useEffect(() => {
		let alive = true
		const fromQuery = demoQueryOn()
		setQueryDemo(fromQuery)
		if (fromQuery) {
			clearTourDismiss().then(() => {
				if (!alive) return
				setStep(1)
				setOpen(true)
			})
			return () => { alive = false }
		}
		tourDismissed().then(dismissed => {
			if (!alive || dismissed) return
			setOpen(true)
		})
		return () => { alive = false }
	}, [])

	const close = async (persist) => {
		if (persist) await dismissTour()
		setOpen(false)
	}

	const replayTour = async () => {
		await clearTourDismiss()
		setStep(0)
		setOpen(true)
	}

	const pinsOn = queryDemo || (open && !!TOUR_STEPS[step]?.demo)

	return { open, step, setStep, close, replayTour, pinsOn }
}
