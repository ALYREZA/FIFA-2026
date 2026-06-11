import { env } from '$env/dynamic/private';

const OTP_PATTERN = /^\d{6}$/;

function isLocalOrigin(origin: string): boolean {
	try {
		const { hostname } = new URL(origin);
		return hostname === 'localhost' || hostname === '127.0.0.1';
	} catch {
		return false;
	}
}

/** Dev-only static OTP when `DEV_OTP_CODE` is set and `ORIGIN` is local. */
export function getDevOtpCode(): string | null {
	const code = env.DEV_OTP_CODE?.trim();
	if (!code) return null;

	if (!isLocalOrigin(env.ORIGIN ?? '')) {
		console.warn('[auth] DEV_OTP_CODE is set but ignored because ORIGIN is not local');
		return null;
	}

	if (!OTP_PATTERN.test(code)) {
		console.warn('[auth] DEV_OTP_CODE must be exactly 6 digits — ignoring');
		return null;
	}

	return code;
}

