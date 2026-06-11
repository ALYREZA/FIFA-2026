import { getRequestEvent } from '$app/server';

export function getWorkerEnv(): Cloudflare.Env {
	const event = getRequestEvent();
	const env = event.platform?.env;
	if (!env) {
		throw new Error('Worker env is not available — run with wrangler (pnpm preview)');
	}
	return env;
}
