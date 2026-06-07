import { fail, redirect } from '@sveltejs/kit';
import type { Pathname } from '$app/types';
import { getDb } from '$lib/server/db';
import { setUsername } from '$lib/server/user';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, url }) => {
	if (locals.session && locals.user?.username) {
		const redirectTo = (url.searchParams.get('redirect') ?? '/dashboard') as Pathname;
		redirect(303, redirectTo);
	}

	return {
		needsUsername: Boolean(locals.session && !locals.user?.username)
	};
};

export const actions: Actions = {
	setUsername: async ({ request, locals, platform, url }) => {
		if (!locals.user) {
			return fail(401, { usernameError: 'not_authenticated' });
		}

		const form = await request.formData();
		const username = form.get('username')?.toString() ?? '';
		const db = getDb(platform!.env.DB);
		const result = await setUsername(db, locals.user.id, username);

		if (result.error) {
			return fail(400, { usernameError: result.error.code ?? 'invalid_format' });
		}

		const redirectTo = (url.searchParams.get('redirect') ?? '/dashboard') as Pathname;
		redirect(303, redirectTo);
	}
};
