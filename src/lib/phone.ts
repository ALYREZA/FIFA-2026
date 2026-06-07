/** Normalize Iranian mobile input to Bale format: 989XXXXXXXXX */
export function normalizeIranPhone(input: string): string | null {
	const digits = input.replace(/\D/g, '');

	if (digits.startsWith('98') && digits.length === 12) {
		return digits;
	}

	if (digits.startsWith('0') && digits.length === 11) {
		return `98${digits.slice(1)}`;
	}

	if (digits.length === 10 && digits.startsWith('9')) {
		return `98${digits}`;
	}

	return null;
}

export function isValidBalePhone(phone: string): boolean {
	return /^989\d{9}$/.test(phone);
}

export function formatPhoneDisplay(phone: string): string {
	if (phone.startsWith('98') && phone.length === 12) {
		return `0${phone.slice(2)}`;
	}

	return phone;
}
