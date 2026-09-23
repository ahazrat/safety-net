/** Light, minimal, security-minded. Navy accent, sharp borders, high-contrast text. */

export const color = {
	background: '#f4f6f8',
	surface: '#ffffff',
	text: '#12161c',
	textMuted: '#3d4754',
	navy: '#1b3a4b',
	onNavy: '#ffffff',
	border: '#c5ced6',
	line: '#e2e8ee',
}

export const space = {
	xs: 4,
	sm: 8,
	md: 16,
	lg: 24,
	xl: 32,
}

export const radius = {
	sharp: 2,
	control: 4,
}

export const type = {
	fontFamily: 'Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, sans-serif',
	display: { fontSize: 32, lineHeight: 38, fontWeight: '700' },
	title: { fontSize: 22, lineHeight: 28, fontWeight: '600' },
	body: { fontSize: 16, lineHeight: 24, fontWeight: '400' },
	caption: { fontSize: 13, lineHeight: 18, fontWeight: '500' },
	mono: { fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace', fontSize: 13, lineHeight: 18 },
}

export const layout = {
	pageMaxWidth: 720,
	mapMaxWidth: 1100,
}

export const shadow = {
	card: {
		shadowColor: '#12161c',
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.06,
		shadowRadius: 2,
		elevation: 1,
	},
}
