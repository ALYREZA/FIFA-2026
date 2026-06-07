export type TelegramWebAppUser = {
	id: number;
	first_name: string;
	last_name?: string;
	username?: string;
	language_code?: string;
	is_premium?: boolean;
	photo_url?: string;
};

export type ValidatedTelegramInitData = {
	user: TelegramWebAppUser;
	authDate: number;
	queryId?: string;
};

function timingSafeEqual(a: string, b: string): boolean {
	if (a.length !== b.length) return false;
	let result = 0;
	for (let i = 0; i < a.length; i++) {
		result |= a.charCodeAt(i) ^ b.charCodeAt(i);
	}
	return result === 0;
}

function bufferToHex(buffer: ArrayBuffer): string {
	return [...new Uint8Array(buffer)].map((byte) => byte.toString(16).padStart(2, '0')).join('');
}

async function hmacSha256(key: BufferSource, data: string): Promise<ArrayBuffer> {
	const cryptoKey = await crypto.subtle.importKey(
		'raw',
		key,
		{ name: 'HMAC', hash: 'SHA-256' },
		false,
		['sign']
	);
	return crypto.subtle.sign('HMAC', cryptoKey, new TextEncoder().encode(data));
}

export async function validateTelegramInitData(
	initData: string,
	botToken: string,
	options?: { maxAgeSeconds?: number }
): Promise<ValidatedTelegramInitData> {
	const params = new URLSearchParams(initData);
	const hash = params.get('hash');
	if (!hash) {
		throw new Error('Missing hash');
	}

	const entries: string[] = [];
	params.forEach((value, key) => {
		if (key !== 'hash') {
			entries.push(`${key}=${value}`);
		}
	});
	entries.sort();
	const dataCheckString = entries.join('\n');

	const secretKey = await hmacSha256(new TextEncoder().encode('WebAppData'), botToken);
	const computedHash = bufferToHex(await hmacSha256(secretKey, dataCheckString));

	if (!timingSafeEqual(computedHash, hash)) {
		throw new Error('Invalid init data signature');
	}

	const authDate = Number(params.get('auth_date'));
	const maxAge = options?.maxAgeSeconds ?? 3600;
	if (!authDate || Date.now() / 1000 - authDate > maxAge) {
		throw new Error('Init data expired');
	}

	const userRaw = params.get('user');
	if (!userRaw) {
		throw new Error('Missing user');
	}

	const user = JSON.parse(userRaw) as TelegramWebAppUser;
	if (!user.id || !user.first_name) {
		throw new Error('Invalid user payload');
	}

	return {
		user,
		authDate,
		queryId: params.get('query_id') ?? undefined
	};
}
