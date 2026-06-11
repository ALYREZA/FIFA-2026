const SAFIR_BASE = 'https://safir.bale.ai/api/v2';

type BaleError = {
	type?: number;
	code?: number;
	message?: string;
	error?: string;
	error_description?: string;
};

export class BaleOtpError extends Error {
	constructor(
		message: string,
		public readonly code: string
	) {
		super(message);
		this.name = 'BaleOtpError';
	}
}

let cachedToken: { accessToken: string; expiresAt: number } | null = null;

async function getAccessToken(
	workerEnv: Pick<Cloudflare.Env, 'BALE_CLIENT_ID' | 'BALE_CLIENT_SECRET'>
): Promise<string> {
	if (cachedToken && Date.now() < cachedToken.expiresAt - 60_000) {
		return cachedToken.accessToken;
	}

	const clientId = workerEnv.BALE_CLIENT_ID;
	const clientSecret = workerEnv.BALE_CLIENT_SECRET;

	if (!clientId || !clientSecret) {
		throw new BaleOtpError('Bale credentials are not configured', 'config_missing');
	}

	const body = new URLSearchParams({
		grant_type: 'client_credentials',
		client_id: clientId,
		client_secret: clientSecret,
		scope: 'read'
	});

	const response = await fetch(`${SAFIR_BASE}/auth/token`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
		body
	});

	if (!response.ok) {
		const error = (await response.json().catch(() => ({}))) as BaleError;
		throw new BaleOtpError(
			error.error_description ?? error.message ?? 'Bale authentication failed',
			error.error ?? 'auth_failed'
		);
	}

	const data = (await response.json()) as {
		access_token: string;
		expires_in: number;
	};

	cachedToken = {
		accessToken: data.access_token,
		expiresAt: Date.now() + data.expires_in * 1000
	};

	return data.access_token;
}

function mapBaleError(error: BaleError, status: number): BaleOtpError {
	if (status === 404 && error.code === 17) {
		return new BaleOtpError('This phone number does not have a Bale account', 'no_bale_account');
	}

	if (error.code === 18) {
		return new BaleOtpError('Too many OTP requests. Try again later.', 'rate_limit');
	}

	if (status === 402 || error.code === 20) {
		return new BaleOtpError('OTP service balance is insufficient', 'payment_required');
	}

	if (error.code === 8) {
		return new BaleOtpError('Invalid phone number format', 'invalid_phone');
	}

	return new BaleOtpError(error.message ?? 'Failed to send OTP via Bale', 'send_failed');
}

export async function sendBaleOtp(
	phone: string,
	otp: number,
	workerEnv: Pick<Cloudflare.Env, 'BALE_CLIENT_ID' | 'BALE_CLIENT_SECRET'>
): Promise<void> {
	const token = await getAccessToken(workerEnv);

	const response = await fetch(`${SAFIR_BASE}/send_otp`, {
		method: 'POST',
		headers: {
			Authorization: `Bearer ${token}`,
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({ phone, otp })
	});

	if (!response.ok) {
		const error = (await response.json().catch(() => ({}))) as BaleError;
		throw mapBaleError(error, response.status);
	}
}
