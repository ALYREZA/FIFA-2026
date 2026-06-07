import { getDb } from '$lib/server/db';
import { seedTournamentIfNeeded } from '$lib/server/forecast/seed';
import { getActiveTournament } from '$lib/server/forecast/tournament';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ platform }) => {
	const db = getDb(platform!.env.DB);
	await seedTournamentIfNeeded(db);

	const tournament = await getActiveTournament(db);

	return {
		tournament
	};
};
