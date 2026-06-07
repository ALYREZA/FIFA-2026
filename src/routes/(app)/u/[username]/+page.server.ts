import { error } from '@sveltejs/kit';
import { getDb } from '$lib/server/db';
import { getPublicUserProfile } from '$lib/server/forecast/public-profile';
import { seedTournamentIfNeeded } from '$lib/server/forecast/seed';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, locals, platform }) => {
	const db = getDb(platform!.env.DB);
	await seedTournamentIfNeeded(db);

	const profile = await getPublicUserProfile(db, params.username);
	if (!profile) {
		error(404, 'User not found');
	}

	return {
		...profile,
		viewerUsername: locals.user?.username ?? null
	};
};
