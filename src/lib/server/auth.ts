import { betterAuth } from 'better-auth/minimal';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { phoneNumber } from 'better-auth/plugins';
import { sveltekitCookies } from 'better-auth/svelte-kit';
import { getRequestEvent } from '$app/server';
import { getDb } from '$lib/server/db';
import { telegramMiniApp } from '$lib/server/auth/telegram-miniapp';
import { getDevOtpCode } from '$lib/server/auth/dev-otp';
import { sendBaleOtp } from '$lib/server/bale/safir';
import { isValidBalePhone } from '$lib/server/phone';

function resolveBaseUrl(workerEnv: Cloudflare.Env): string {
	const configured = workerEnv.ORIGIN?.replace(/\/$/, '');
	if (configured) return configured;

	try {
		const { origin, hostname } = getRequestEvent().url;
		if (hostname === 'localhost' || hostname === '127.0.0.1') {
			console.warn(`[auth] ORIGIN not set — using request origin ${origin}`);
			return origin;
		}
	} catch {
		// CLI / non-request context
	}

	return 'http://localhost:4173';
}

function resolveSecret(workerEnv: Cloudflare.Env): string {
	const secret = workerEnv.BETTER_AUTH_SECRET?.trim();
	if (secret && secret.length >= 32) return secret;

	const origin = workerEnv.ORIGIN ?? '';
	const isLocal = origin.includes('localhost') || origin.includes('127.0.0.1') || !origin;

	if (isLocal) {
		console.warn('[auth] BETTER_AUTH_SECRET missing — using local dev fallback');
		return 'local-dev-better-auth-secret-32chars';
	}

	throw new Error('BETTER_AUTH_SECRET must be set (32+ characters)');
}

function buildPhoneNumberPlugin(workerEnv: Cloudflare.Env) {
	const devOtp = getDevOtpCode(workerEnv);

	return phoneNumber({
		otpLength: 6,
		expiresIn: 300,
		allowedAttempts: 3,
		phoneNumberValidator: (phone) => isValidBalePhone(phone),
		signUpOnVerification: {
			getTempEmail: (phone) => `${phone}@bale.local`,
			getTempName: (phone) => phone
		},
		...(devOtp
			? {
					verifyOTP: async ({ code }) => code === devOtp
				}
			: {}),
		sendOTP: async ({ phoneNumber: phone, code }, ctx) => {
			if (devOtp) {
				if (ctx) {
					const stored = await ctx.context.internalAdapter.findVerificationValue(phone);
					if (stored) {
						await ctx.context.internalAdapter.updateVerificationValue(stored.id, {
							value: `${devOtp}:0`
						});
					}
				}

				console.info(`[dev-otp] Login code for ${phone}: ${devOtp}`);
				return;
			}

			await sendBaleOtp(phone, Number(code), workerEnv);
		}
	});
}

export const createAuth = (workerEnv: Cloudflare.Env) =>
	betterAuth({
		baseURL: resolveBaseUrl(workerEnv),
		secret: resolveSecret(workerEnv),
		emailAndPassword: { enabled: false },
		user: {
			additionalFields: {
				username: {
					type: 'string',
					required: false,
					unique: true,
					input: false
				}
			}
		},
		plugins: [
			telegramMiniApp(),
			buildPhoneNumberPlugin(workerEnv),
			sveltekitCookies(getRequestEvent)
		],
		database: drizzleAdapter(getDb(workerEnv.DB), { provider: 'sqlite' })
	});

/**
 * DO NOT USE!
 *
 * This instance is used by the `better-auth` CLI for schema generation ONLY.
 * To access `auth` at runtime, use `event.locals.auth`.
 */
export const auth = createAuth({
	ORIGIN: 'http://localhost:4173',
	BETTER_AUTH_SECRET: 'cli-placeholder-secret-at-least-32-characters',
	BALE_CLIENT_ID: '',
	BALE_CLIENT_SECRET: '',
	TELEGRAM_BOT_TOKEN: '',
	ADMIN_PHONE_NUMBERS: '',
	DB: null!,
	ASSETS: null!
} as Cloudflare.Env);
