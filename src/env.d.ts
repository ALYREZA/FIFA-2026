/**
 * Worker secrets and runtime env vars (set via wrangler secret put / .dev.vars locally).
 * Kept separate from worker-configuration.d.ts so `wrangler types --check` stays stable in CI.
 */
declare namespace Cloudflare {
	interface Env {
		ORIGIN: string;
		BETTER_AUTH_SECRET: string;
		BALE_CLIENT_ID: string;
		BALE_CLIENT_SECRET: string;
		ADMIN_PHONE_NUMBERS: string;
		TELEGRAM_BOT_TOKEN: string;
		DEV_OTP_CODE?: string;
	}
}
