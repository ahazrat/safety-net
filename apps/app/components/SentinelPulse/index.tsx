import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, AccessibilityInfo, Platform } from 'react-native';
import { IconButton } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Svg, { Circle } from 'react-native-svg';
import Animated, {
	useSharedValue,
	useAnimatedStyle,
	withTiming,
	withSequence,
	withDelay,
	Easing,
} from 'react-native-reanimated';

import { playSentinelPing } from './sound';
import useSentinelSound from './useSentinelSound';

export type SentinelStatus = 'confirmed' | 'pending' | 'alert';

const COLORS: Record<SentinelStatus, string> = {
	// Green/amber pair distinct from the map's crime-report red, which
	// `alert` reuses on purpose: one color language for "danger" everywhere.
	confirmed: '#2ecc71',
	pending: '#f0ad4e',
	alert: '#c0392b',
};

const ICONS: Record<SentinelStatus, React.ComponentProps<typeof MaterialCommunityIcons>['name']> = {
	confirmed: 'shield-check',
	pending: 'shield-sync-outline',
	alert: 'shield-alert',
};

type SentinelPulseProps = {
	status: SentinelStatus;
	size?: number;
	label?: string;
	/** Overrides the persisted mute preference for this instance. */
	sound?: boolean;
};

/**
 * A one-shot radar-ping confirmation: the shield holds still while a sweep
 * arc rotates once and two rings expand outward and fade, optionally with a
 * short synthesized tone. Replays whenever `status` changes (including on
 * mount), so drop it in at the moment something becomes true rather than
 * treating it as a persistent indicator.
 */
export default function SentinelPulse({ status, size = 64, label, sound }: SentinelPulseProps) {
	const [soundEnabled] = useSentinelSound();
	const color = COLORS[status] || COLORS.confirmed;
	const icon = ICONS[status] || ICONS.confirmed;

	const shieldScale = useSharedValue(0.7);
	const sweepRotation = useSharedValue(0);
	const ring1Scale = useSharedValue(0.3);
	const ring1Opacity = useSharedValue(0);
	const ring2Scale = useSharedValue(0.3);
	const ring2Opacity = useSharedValue(0);

	useEffect(() => {
		shieldScale.value = withSequence(
			withTiming(1.15, { duration: 180, easing: Easing.out(Easing.quad) }),
			withTiming(1, { duration: 140, easing: Easing.inOut(Easing.quad) })
		);
		sweepRotation.value = 0;
		sweepRotation.value = withTiming(360, { duration: 700, easing: Easing.out(Easing.cubic) });

		ring1Scale.value = 0.3;
		ring1Opacity.value = 0.6;
		ring1Scale.value = withTiming(1, { duration: 650, easing: Easing.out(Easing.quad) });
		ring1Opacity.value = withTiming(0, { duration: 650, easing: Easing.out(Easing.quad) });

		ring2Scale.value = 0.3;
		ring2Opacity.value = 0;
		ring2Scale.value = withDelay(150, withTiming(1, { duration: 650, easing: Easing.out(Easing.quad) }));
		ring2Opacity.value = withDelay(
			150,
			withSequence(withTiming(0.4, { duration: 1 }), withTiming(0, { duration: 650, easing: Easing.out(Easing.quad) }))
		);

		const soundOn = sound === undefined ? soundEnabled : sound;
		if (soundOn) playSentinelPing(status);

		AccessibilityInfo.announceForAccessibility?.(label || `Status: ${status}`);
		// Sound preference intentionally excluded: replaying on a mute toggle
		// (rather than a genuine status change) would be surprising.
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [status]);

	const shieldStyle = useAnimatedStyle(() => ({
		transform: [{ scale: shieldScale.value }],
	}));
	const sweepStyle = useAnimatedStyle(() => ({
		transform: [{ rotate: `${sweepRotation.value}deg` }],
	}));
	// Rings are a fixed-radius circle scaled/faded via the wrapping View's
	// transform rather than animating the SVG circle's own `r`/`opacity`
	// attributes — react-native-svg's web renderer doesn't reliably accept
	// reanimated's `useAnimatedProps` on SVG elements (it emits an invalid
	// `transform` attribute), while View-level transforms work everywhere.
	const ring1Style = useAnimatedStyle(() => ({
		opacity: ring1Opacity.value,
		transform: [{ scale: ring1Scale.value }],
	}));
	const ring2Style = useAnimatedStyle(() => ({
		opacity: ring2Opacity.value,
		transform: [{ scale: ring2Scale.value }],
	}));

	const center = size / 2;
	const ring = (
		<Svg width={size} height={size}>
			<Circle cx={center} cy={center} r={center - 1} stroke={color} strokeWidth={2} fill="none" />
		</Svg>
	);

	return (
		<View
			style={[styles.container, { width: size, height: size }]}
			accessibilityRole="image"
			accessibilityLabel={label || `Status: ${status}`}
		>
			<Animated.View style={[StyleSheet.absoluteFill, styles.center, ring1Style]}>{ring}</Animated.View>
			<Animated.View style={[StyleSheet.absoluteFill, styles.center, ring2Style]}>{ring}</Animated.View>
			<Animated.View style={[StyleSheet.absoluteFill, styles.center, sweepStyle]}>
				<Svg width={size} height={size}>
					<Circle
						cx={center}
						cy={center}
						r={center - 3}
						stroke={color}
						strokeWidth={2}
						strokeOpacity={0.55}
						strokeDasharray={`${(Math.PI * (size - 6)) / 4} ${Math.PI * (size - 6)}`}
						fill="none"
					/>
				</Svg>
			</Animated.View>
			<Animated.View style={[styles.center, shieldStyle]}>
				<MaterialCommunityIcons name={icon} size={size * 0.5} color={color} />
			</Animated.View>
		</View>
	);
}

/** A small mute/unmute control to place near the first pulse a user sees. */
export function SentinelMuteToggle() {
	const [enabled, setEnabled] = useSentinelSound();
	return (
		<IconButton
			icon={enabled ? 'volume-high' : 'volume-off'}
			size={20}
			onPress={() => setEnabled(!enabled)}
			accessibilityLabel={enabled ? 'Mute confirmation sounds' : 'Unmute confirmation sounds'}
		/>
	);
}

const styles = StyleSheet.create({
	container: {
		alignItems: 'center',
		justifyContent: 'center',
	},
	center: {
		alignItems: 'center',
		justifyContent: 'center',
	},
});
