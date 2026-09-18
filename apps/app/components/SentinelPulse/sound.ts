import { Platform } from 'react-native';

/**
 * Builds a short mono 16-bit PCM WAV as a base64 data URI: a pure tone with
 * a linear fade-out, entirely in-memory (no bundled audio asset). Works as
 * a playable source on both web (<audio>/Web Audio) and native (expo-av).
 */
function toneDataUri(freqHz: number, durationMs: number, sampleRate = 22050): string {
	const numSamples = Math.floor((sampleRate * durationMs) / 1000);
	const bytesPerSample = 2;
	const dataSize = numSamples * bytesPerSample;
	const buffer = new ArrayBuffer(44 + dataSize);
	const view = new DataView(buffer);

	const writeString = (offset: number, str: string) => {
		for (let i = 0; i < str.length; i++) view.setUint8(offset + i, str.charCodeAt(i));
	};

	writeString(0, 'RIFF');
	view.setUint32(4, 36 + dataSize, true);
	writeString(8, 'WAVE');
	writeString(12, 'fmt ');
	view.setUint32(16, 16, true); // fmt chunk size
	view.setUint16(20, 1, true); // PCM
	view.setUint16(22, 1, true); // mono
	view.setUint32(24, sampleRate, true);
	view.setUint32(28, sampleRate * bytesPerSample, true); // byte rate
	view.setUint16(32, bytesPerSample, true); // block align
	view.setUint16(34, 16, true); // bits per sample
	writeString(36, 'data');
	view.setUint32(40, dataSize, true);

	for (let i = 0; i < numSamples; i++) {
		const t = i / sampleRate;
		const fadeOut = 1 - i / numSamples; // linear decay to silence
		const sample = Math.sin(2 * Math.PI * freqHz * t) * fadeOut * 0.3;
		view.setInt16(44 + i * bytesPerSample, sample * 0x7fff, true);
	}

	let binary = '';
	const bytes = new Uint8Array(buffer);
	for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
	const base64 = typeof btoa === 'function' ? btoa(binary) : Buffer.from(binary, 'binary').toString('base64');
	return `data:audio/wav;base64,${base64}`;
}

// A quick two-note "sonar ping" per status: higher/brighter for a good
// confirmation, lower/flatter the less certain the state is.
const PING_NOTES: Record<'confirmed' | 'pending' | 'alert', number> = {
	confirmed: 880,
	pending: 660,
	alert: 440,
};

export function playSentinelPing(status: 'confirmed' | 'pending' | 'alert'): void {
	const freq = PING_NOTES[status] || PING_NOTES.confirmed;

	if (Platform.OS === 'web') {
		try {
			const AudioContextCtor = (window as any).AudioContext || (window as any).webkitAudioContext;
			if (!AudioContextCtor) return;
			const ctx: AudioContext = new AudioContextCtor();
			const oscillator = ctx.createOscillator();
			const gain = ctx.createGain();
			oscillator.frequency.value = freq;
			oscillator.type = 'sine';
			gain.gain.setValueAtTime(0.25, ctx.currentTime);
			gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.35);
			oscillator.connect(gain);
			gain.connect(ctx.destination);
			oscillator.start();
			oscillator.stop(ctx.currentTime + 0.35);
			oscillator.onended = () => ctx.close();
		} catch (e) {
			// Autoplay can be blocked before any user gesture; a missed ping
			// is harmless, so fail silently rather than surface an error.
		}
		return;
	}

	// Native: synthesize the same tone as a WAV data URI and play it once.
	import('expo-av')
		.then(({ Audio }) => Audio.Sound.createAsync({ uri: toneDataUri(freq, 350) }, { shouldPlay: true }))
		.then(({ sound }) => {
			sound.setOnPlaybackStatusUpdate((status: any) => {
				if (status.didJustFinish) sound.unloadAsync();
			});
		})
		.catch(() => {
			// Same reasoning as the web branch: a missed ping is not worth surfacing.
		});
}
