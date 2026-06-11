import { getDb } from '$lib/server/db';
import { seedTournamentIfNeeded } from '$lib/server/forecast/seed';
import { getLeaderboard } from '$lib/server/forecast/scoring-service';
import {
	getActiveTournament,
	getTournamentMatches,
	getTournamentTeams
} from '$lib/server/forecast/tournament';
import { getUserMatchPredictions } from '$lib/server/forecast/predictions';
import { attachStadium } from '$lib/server/forecast/stadiums';
import { userScores } from '$lib/server/db/forecast.schema';
import { and, eq } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, platform }) => {
	const db = getDb(platform!.env.DB);
	await seedTournamentIfNeeded(db);

	const tournament = await getActiveTournament(db);
	if (!tournament) return { tournament: null };

	const userId = locals.user!.id;
	const [teams, matches, predictions, leaderboard] = await Promise.all([
		getTournamentTeams(db, tournament.id),
		getTournamentMatches(db, tournament.id),
		getUserMatchPredictions(db, userId, tournament.id),
		getLeaderboard(db, tournament.id, 5)
	]);

	const [myScore] = await db
		.select()
		.from(userScores)
		.where(and(eq(userScores.userId, userId), eq(userScores.tournamentId, tournament.id)))
		.limit(1);

	const upcoming = matches
		.filter((m) => m.status === 'scheduled')
		.sort((a, b) => a.kickoffAt.getTime() - b.kickoffAt.getTime())
		.slice(0, 5);

	const teamMap = Object.fromEntries(teams.map((t) => [t.id, t]));

	return {
		tournament,
		myScore: myScore ?? null,
		predictionCount: predictions.length,
		totalMatches: matches.length,
		upcoming: upcoming.map((m) =>
			attachStadium({
				...m,
				homeTeam: m.homeTeamId ? teamMap[m.homeTeamId] : null,
				awayTeam: m.awayTeamId ? teamMap[m.awayTeamId] : null
			})
		),
		leaderboard
	};
};
