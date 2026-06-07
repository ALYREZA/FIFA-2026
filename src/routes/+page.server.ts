import { redirect } from '@sveltejs/kit';
import { getDb } from '$lib/server/db';
import { seedTournamentIfNeeded } from '$lib/server/forecast/seed';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, platform }) => {
	if (locals.session) {
		redirect(303, '/dashboard');
	}

	const db = getDb(platform!.env.DB);
	await seedTournamentIfNeeded(db);

	return {};
};
