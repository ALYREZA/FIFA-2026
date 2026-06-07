import { betterAuth } from 'better-auth/minimal';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { phoneNumber } from 'better-auth/plugins';
import { sveltekitCookies } from 'better-auth/svelte-kit';
import { env } from '$env/dynamic/private';
import { getRequestEvent } from '$app/server';
import { getDb } from '$lib/server/db';
import { sendBaleOtp } from '$lib/server/bale/safir';
import { isValidBalePhone } from '$lib/server/phone';

const authConfig = ({
	baseURL: env.ORIGIN,
	secret: env.BETTER_AUTH_SECRET,
	emailAndPassword: { enabled: false },
	plugins: [
		phoneNumber({
			otpLength: 6,
			expiresIn: 300,
			allowedAttempts: 3,
			phoneNumberValidator: (phone) => isValidBalePhone(phone),
			signUpOnVerification: {
				getTempEmail: (phone) => `${phone}@bale.local`,
				getTempName: (phone) => phone
			},
			sendOTP: async ({ phoneNumber: phone, code }) => {
				await sendBaleOtp(phone, Number(code));
			}
		}),
		sveltekitCookies(getRequestEvent)
	]
}) satisfies Omit<Parameters<typeof betterAuth>[0], 'database'>;

export const createAuth = (d1: D1Database) =>
	betterAuth({
		...authConfig,
		database: drizzleAdapter(getDb(d1), { provider: 'sqlite' })
	});

/**
 * DO NOT USE!
 *
 * This instance is used by the `better-auth` CLI for schema generation ONLY.
 * To access `auth` at runtime, use `event.locals.auth`.
 */
export const auth = createAuth(null!);
