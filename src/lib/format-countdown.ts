import { getLocale } from '$lib/paraglide/runtime';
import { coerceDate } from '$lib/format-datetime';

type CountdownUnit = Intl.RelativeTimeFormatUnit;

const UNITS: { unit: CountdownUnit; ms: number }[] = [
	{ unit: 'day', ms: 86_400_000 },
	{ unit: 'hour', ms: 3_600_000 },
	{ unit: 'minute', ms: 60_000 },
	{ unit: 'second', ms: 1_000 }
];

export function formatCountdown(
	target: Date | string | number,
	now: Date = new Date(),
	locale: string = getLocale()
): string {
	const kickoff = coerceDate(target);
	const diff = kickoff.getTime() - now.getTime();
	const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto', style: 'long' });

	if (diff <= 0) {
		return rtf.format(0, 'second');
	}

	for (const { unit, ms } of UNITS) {
		const value = Math.floor(diff / ms);
		if (value >= 1 || unit === 'second') {
			return rtf.format(value, unit);
		}
	}

	return rtf.format(0, 'second');
}

export function countdownTickMs(target: Date | string | number, now: Date = new Date()): number {
	const kickoff = coerceDate(target);
	const diff = kickoff.getTime() - now.getTime();
	if (diff <= 0) return 60_000;
	if (diff < 120_000) return 1_000;
	if (diff < 3_600_000) return 30_000;
	return 60_000;
}
