import { MD3LightTheme } from 'react-native-paper'
import { color, radius, type } from './tokens'

const family = { fontFamily: type.fontFamily }

function withFamily(scale) {
	const next = {}
	for (const key of Object.keys(scale)) {
		next[key] = { ...scale[key], ...family }
	}
	return next
}

export const paperTheme = {
	...MD3LightTheme,
	roundness: radius.sharp,
	fonts: withFamily(MD3LightTheme.fonts),
	colors: {
		...MD3LightTheme.colors,
		primary: color.navy,
		onPrimary: color.onNavy,
		primaryContainer: '#d5e2ea',
		onPrimaryContainer: color.navy,
		background: color.background,
		surface: color.surface,
		surfaceVariant: color.line,
		onSurface: color.text,
		onSurfaceVariant: color.textMuted,
		outline: color.border,
		elevation: {
			...MD3LightTheme.colors.elevation,
			level1: color.surface,
			level2: color.surface,
		},
	},
}

export function ensureWebFont() {
	if (typeof document === 'undefined') return
	if (document.getElementById('safetynet-inter')) return
	const link = document.createElement('link')
	link.id = 'safetynet-inter'
	link.rel = 'stylesheet'
	link.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap'
	document.head.appendChild(link)
	document.body.style.fontFamily = type.fontFamily
	document.body.style.backgroundColor = color.background
	document.body.style.color = color.text
}
