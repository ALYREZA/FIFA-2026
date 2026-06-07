import { getDb } from '$lib/server/db';
import { seedTournamentIfNeeded } from '$lib/server/forecast/seed';
import { getLeaderboard } from '$lib/server/forecast/scoring-service';
import { getActiveTournament } from '$lib/server/forecast/tournament';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ platform }) => {
	const db = getDb(platform!.env.DB);
	await seedTournamentIfNeeded(db);

	const tournament = await getActiveTournament(db);
	if (!tournament) return { tournament: null, leaderboard: [] };

	const leaderboard = await getLeaderboard(db, tournament.id);

	return { tournament, leaderboard };
};
