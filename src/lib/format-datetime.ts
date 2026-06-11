import { getLocale } from '$lib/paraglide/runtime';

export function coerceDate(value: Date | string | number): Date {
	if (value instanceof Date) return value;
	return new Date(value);
}

export function formatKickoffAt(
	value: Date | string | number,
	locale: string = getLocale()
): string {
	const date = coerceDate(value);
	return new Intl.DateTimeFormat(locale, {
		dateStyle: 'medium',
		timeStyle: 'short'
	}).format(date);
}
