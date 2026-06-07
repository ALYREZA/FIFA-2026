import { env } from '$env/dynamic/private';

export function getAdminPhoneNumbers(): string[] {
	const raw = env.ADMIN_PHONE_NUMBERS ?? '';
	return raw
		.split(',')
		.map((p) => p.trim())
		.filter(Boolean);
}

export function isAdmin(phoneNumber: string | null | undefined): boolean {
	if (!phoneNumber) return false;
	const admins = getAdminPhoneNumbers();
	if (admins.length === 0) return false;
	return admins.includes(phoneNumber);
}
