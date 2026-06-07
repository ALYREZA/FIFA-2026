import { error, redirect } from '@sveltejs/kit';
import { isAdmin } from '$lib/server/admin';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals, url }) => {
	if (!locals.session) {
		redirect(303, `/login?redirect=${encodeURIComponent(url.pathname)}`);
	}

	if (!isAdmin(locals.user?.phoneNumber)) {
		error(403, 'Admin access required');
	}

	return { isAdmin: true };
};
