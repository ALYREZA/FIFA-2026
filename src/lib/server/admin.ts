import { getWorkerEnv } from '$lib/server/worker-env';

export function getAdminPhoneNumbers(workerEnv?: Cloudflare.Env): string[] {
	const raw = (workerEnv ?? getWorkerEnv()).ADMIN_PHONE_NUMBERS ?? '';
	return raw
		.split(',')
		.map((p) => p.trim())
		.filter(Boolean);
}

export function isAdmin(phoneNumber: string | null | undefined, workerEnv?: Cloudflare.Env): boolean {
	if (!phoneNumber) return false;
	const admins = getAdminPhoneNumbers(workerEnv);
	if (admins.length === 0) return false;
	return admins.includes(phoneNumber);
}
