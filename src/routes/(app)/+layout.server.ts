import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals, url }) => {
	if (!locals.session) {
		redirect(303, `/login?redirect=${encodeURIComponent(url.pathname)}`);
	}

	return {
		user: locals.user,
		session: locals.session
	};
};
