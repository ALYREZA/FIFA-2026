import { redirect } from '@sveltejs/kit';
import { isAdmin } from '$lib/server/admin';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals, url }) => {
	if (!locals.session) {
		redirect(303, `/login?redirect=${encodeURIComponent(url.pathname)}`);
	}

	if (!locals.user?.username) {
		redirect(303, `/login?redirect=${encodeURIComponent(url.pathname)}`);
	}

	return {
		user: locals.user,
		session: locals.session,
		isAdmin: isAdmin(locals.user?.phoneNumber)
	};
};
