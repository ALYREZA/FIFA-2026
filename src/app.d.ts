import type { Session } from 'better-auth';
import { createAuth } from '$lib/server/auth';

type AppUser = {
	id: string;
	name: string;
	email: string;
	emailVerified: boolean;
	image?: string | null;
	phoneNumber?: string | null;
	phoneNumberVerified?: boolean | null;
	username?: string | null;
	createdAt: Date;
	updatedAt: Date;
};

// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		interface Platform {
			env: Env;
			ctx: ExecutionContext;
			caches: CacheStorage;
			cf?: IncomingRequestCfProperties
		}

		interface Locals {
			user?: AppUser;
			session?: Session;
			auth: ReturnType<typeof createAuth>
		}

		// interface Error {}
		// interface PageData {}
		// interface PageState {}
	}
}

export {};
